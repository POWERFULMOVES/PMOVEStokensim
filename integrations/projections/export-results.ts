/**
 * Export Validation Results
 *
 * Exports simulation results to CSV format for analysis in spreadsheets,
 * DoX integration, and data visualization tools.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ValidationReport, SimulationResults } from './projection-validator';

/**
 * Export validation report to CSV
 */
export function exportValidationReportCSV(
  report: ValidationReport,
  outputPath: string
): void {
  const headers = [
    'Model Name',
    'Projected Revenue',
    'Actual Revenue',
    'Revenue Variance (%)',
    'Projected ROI (%)',
    'Actual ROI (%)',
    'ROI Variance (%)',
    'Projected Break-Even (months)',
    'Actual Break-Even (months)',
    'Break-Even Variance (%)',
    'Success Achieved',
    'Confidence Level',
    'Revenue Growth Pattern',
    'Profitability Trend',
    'Token Economy Impact',
    'Market Scenario',
    'Risk Factors',
    'Recommendations',
  ];

  const row = [
    report.modelName,
    report.projections.revenue,
    report.actual.revenue,
    report.variance.revenueVariance.toFixed(2),
    (report.projections.roi * 100).toFixed(2),
    report.actual.roi.toFixed(2),
    report.variance.roiVariance.toFixed(2),
    report.projections.breakEvenMonths.toFixed(1),
    report.actual.breakEvenMonths?.toFixed(1) || 'N/A',
    report.variance.breakEvenVariance?.toFixed(2) || 'N/A',
    report.riskAssessment.achievedSuccessProbability ? 'Yes' : 'No',
    report.riskAssessment.confidenceLevel,
    report.analysis.revenueGrowthPattern,
    report.analysis.profitabilityTrend,
    report.analysis.tokenEconomyImpact || 'N/A',
    report.analysis.marketScenario,
    report.riskAssessment.riskFactors.join('; '),
    report.riskAssessment.mitigationRecommendations.join('; '),
  ];

  const csv = [headers.join(','), row.join(',')].join('\n');

  fs.writeFileSync(outputPath, csv, 'utf-8');
}

/**
 * Export weekly simulation data to CSV
 */
export function exportWeeklyDataCSV(
  modelName: string,
  results: SimulationResults,
  outputPath: string
): void {
  const headers = [
    'Week',
    'Weekly Revenue',
    'Weekly Profit',
    'Cumulative Revenue',
    'Cumulative Profit',
  ];

  const rows = results.weeklyRevenue.map((revenue, index) => [
    index + 1,
    revenue.toFixed(2),
    results.weeklyProfit[index].toFixed(2),
    results.cumulativeRevenue[index].toFixed(2),
    results.cumulativeProfit[index].toFixed(2),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  fs.writeFileSync(outputPath, csv, 'utf-8');
}

/**
 * Export comprehensive comparison CSV
 */
export function exportComparisonCSV(
  reports: ValidationReport[],
  outputPath: string
): void {
  const headers = [
    'Model Name',
    'Score',
    'Projected Revenue',
    'Actual Revenue',
    'Revenue Variance (%)',
    'Projected ROI (%)',
    'Actual ROI (%)',
    'ROI Variance (%)',
    'Projected Break-Even',
    'Actual Break-Even',
    'Success Achieved',
    'Confidence',
    'Growth Pattern',
    'Profitability',
    'Market Scenario',
  ];

  const rows = reports.map(report => [
    report.modelName,
    '', // Score will be calculated separately
    report.projections.revenue,
    report.actual.revenue,
    report.variance.revenueVariance.toFixed(2),
    (report.projections.roi * 100).toFixed(2),
    report.actual.roi.toFixed(2),
    report.variance.roiVariance.toFixed(2),
    report.projections.breakEvenMonths.toFixed(1),
    report.actual.breakEvenMonths?.toFixed(1) || 'N/A',
    report.riskAssessment.achievedSuccessProbability ? 'Yes' : 'No',
    report.riskAssessment.confidenceLevel,
    report.analysis.revenueGrowthPattern,
    report.analysis.profitabilityTrend,
    report.analysis.marketScenario,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  fs.writeFileSync(outputPath, csv, 'utf-8');
}

/**
 * Export all validation results to directory
 */
export function exportAllResults(
  reports: ValidationReport[],
  weeklyDataMap: Map<string, SimulationResults>,
  outputDir: string
): void {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Export individual reports
  reports.forEach(report => {
    const filename = report.modelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const reportPath = path.join(outputDir, `${filename}-report.csv`);
    exportValidationReportCSV(report, reportPath);

    console.log(`Exported: ${reportPath}`);
  });

  // Export weekly data
  weeklyDataMap.forEach((results, modelName) => {
    const filename = modelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const weeklyPath = path.join(outputDir, `${filename}-weekly.csv`);
    exportWeeklyDataCSV(modelName, results, weeklyPath);

    console.log(`Exported: ${weeklyPath}`);
  });

  // Export comparison
  const comparisonPath = path.join(outputDir, 'model-comparison.csv');
  exportComparisonCSV(reports, comparisonPath);

  console.log(`Exported: ${comparisonPath}`);

  // Export summary JSON
  const summary = {
    exportDate: new Date().toISOString(),
    totalModels: reports.length,
    reports: reports.map(r => ({
      modelName: r.modelName,
      achievedSuccess: r.riskAssessment.achievedSuccessProbability,
      confidenceLevel: r.riskAssessment.confidenceLevel,
      actualROI: r.actual.roi,
      revenueVariance: r.variance.revenueVariance,
    })),
  };

  const summaryPath = path.join(outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');

  console.log(`Exported: ${summaryPath}`);
  console.log(`\n✅ All results exported to: ${outputDir}`);
}

/**
 * Generate markdown report
 */
export function generateMarkdownReport(
  reports: ValidationReport[],
  ranking: { name: string; score: number }[],
  outputPath: string
): void {
  const lines: string[] = [];

  lines.push('# PMOVES Projection Validation Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Executive Summary');
  lines.push('');
  lines.push(`Validated **${reports.length}** business projection models against 5-year (260-week) simulations.`);
  lines.push('');

  const successful = reports.filter(r => r.riskAssessment.achievedSuccessProbability);
  lines.push(`- ✅ **${successful.length}** models achieved success targets`);

  const highConf = reports.filter(r => r.riskAssessment.confidenceLevel === 'high');
  lines.push(`- 🎯 **${highConf.length}** models with HIGH confidence`);

  const positiveToken = reports.filter(r => r.analysis.tokenEconomyImpact === 'positive');
  lines.push(`- 🪙 **${positiveToken.length}** models with positive token impact`);

  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Rankings');
  lines.push('');
  lines.push('| Rank | Model | Score | Status |');
  lines.push('|------|-------|-------|--------|');

  ranking.forEach((rank, index) => {
    const report = reports.find(r => r.modelName === rank.name);
    const status = report?.riskAssessment.achievedSuccessProbability ? '✅ Success' : '⚠️ Review';
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
    lines.push(`| ${medal} ${index + 1} | ${rank.name} | ${rank.score.toFixed(1)} | ${status} |`);
  });

  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Detailed Results');
  lines.push('');

  reports.forEach(report => {
    lines.push(`### ${report.modelName}`);
    lines.push('');

    lines.push('**Projections vs Actual:**');
    lines.push('');
    lines.push('| Metric | Projected | Actual | Variance |');
    lines.push('|--------|-----------|--------|----------|');
    lines.push(`| Revenue | $${report.projections.revenue.toLocaleString()} | $${report.actual.revenue.toLocaleString()} | ${report.variance.revenueVariance.toFixed(1)}% |`);
    lines.push(`| ROI | ${(report.projections.roi * 100).toFixed(0)}% | ${report.actual.roi.toFixed(0)}% | ${report.variance.roiVariance.toFixed(1)}% |`);
    lines.push(`| Break-Even | ${report.projections.breakEvenMonths.toFixed(1)} mo | ${report.actual.breakEvenMonths?.toFixed(1) || 'N/A'} mo | ${report.variance.breakEvenVariance?.toFixed(1) || 'N/A'}% |`);
    lines.push('');

    lines.push('**Risk Assessment:**');
    lines.push('');
    lines.push(`- Success Achieved: ${report.riskAssessment.achievedSuccessProbability ? '✅ Yes' : '❌ No'}`);
    lines.push(`- Confidence Level: **${report.riskAssessment.confidenceLevel.toUpperCase()}**`);
    lines.push('');

    if (report.riskAssessment.riskFactors.length > 0) {
      lines.push('**Risk Factors:**');
      report.riskAssessment.riskFactors.forEach(factor => {
        lines.push(`- ⚠️ ${factor}`);
      });
      lines.push('');
    }

    if (report.riskAssessment.mitigationRecommendations.length > 0) {
      lines.push('**Recommendations:**');
      report.riskAssessment.mitigationRecommendations.forEach(rec => {
        lines.push(`- 💡 ${rec}`);
      });
      lines.push('');
    }

    lines.push('**Analysis:**');
    lines.push('');
    lines.push(`- Revenue Growth: **${report.analysis.revenueGrowthPattern}**`);
    lines.push(`- Profitability: **${report.analysis.profitabilityTrend}**`);
    lines.push(`- Market Scenario: **${report.analysis.marketScenario}**`);
    if (report.analysis.tokenEconomyImpact) {
      lines.push(`- Token Impact: **${report.analysis.tokenEconomyImpact}**`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  const markdown = lines.join('\n');
  fs.writeFileSync(outputPath, markdown, 'utf-8');
}
