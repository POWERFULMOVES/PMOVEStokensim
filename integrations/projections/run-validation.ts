/**
 * Projection Validation Runner
 *
 * Executes 5-year simulations for all projection models and generates
 * comprehensive validation reports.
 */

import { ProjectionValidator } from './projection-validator';
import {
  BASELINE_MODELS,
  ALL_MODELS,
  AI_ENHANCED_LOCAL_SERVICE,
  AI_SERVICE_BULL_MARKET,
  TOKEN_PRE_ORDER_BEAR_MARKET,
  MARKET_SCENARIOS,
} from './scenario-configs';

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 */
function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Print validation report
 */
function printReport(report: any): void {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`VALIDATION REPORT: ${report.modelName}`);
  console.log('='.repeat(80));

  console.log('\n📊 PROJECTIONS vs ACTUAL');
  console.log('-'.repeat(80));

  console.log('\nRevenue:');
  console.log(`  Projected: ${formatCurrency(report.projections.revenue)}`);
  console.log(`  Actual:    ${formatCurrency(report.actual.revenue)}`);
  console.log(`  Variance:  ${formatPercent(report.variance.revenueVariance)}`);

  console.log('\nROI:');
  console.log(`  Projected: ${formatPercent(report.projections.roi * 100, 0)}`);
  console.log(`  Actual:    ${formatPercent(report.actual.roi, 0)}`);
  console.log(`  Variance:  ${formatPercent(report.variance.roiVariance)}`);

  console.log('\nBreak-Even:');
  console.log(`  Projected: ${report.projections.breakEvenMonths.toFixed(1)} months`);
  console.log(`  Actual:    ${report.actual.breakEvenMonths?.toFixed(1) || 'Not achieved'} months`);
  if (report.variance.breakEvenVariance !== null) {
    console.log(`  Variance:  ${formatPercent(report.variance.breakEvenVariance)}`);
  }

  console.log('\n⚠️  RISK ASSESSMENT');
  console.log('-'.repeat(80));

  console.log(`\nSuccess Achieved: ${report.riskAssessment.achievedSuccessProbability ? '✅ YES' : '❌ NO'}`);
  console.log(`Confidence Level: ${report.riskAssessment.confidenceLevel.toUpperCase()}`);

  if (report.riskAssessment.riskFactors.length > 0) {
    console.log('\nRisk Factors:');
    report.riskAssessment.riskFactors.forEach((factor: string) => {
      console.log(`  ⚠️  ${factor}`);
    });
  }

  if (report.riskAssessment.mitigationRecommendations.length > 0) {
    console.log('\nMitigation Recommendations:');
    report.riskAssessment.mitigationRecommendations.forEach((rec: string) => {
      console.log(`  💡 ${rec}`);
    });
  }

  console.log('\n📈 ANALYSIS');
  console.log('-'.repeat(80));

  console.log(`\nRevenue Growth:    ${report.analysis.revenueGrowthPattern.toUpperCase()}`);
  console.log(`Profitability:     ${report.analysis.profitabilityTrend.toUpperCase()}`);
  console.log(`Market Scenario:   ${report.analysis.marketScenario.toUpperCase()}`);

  if (report.analysis.tokenEconomyImpact) {
    console.log(`Token Impact:      ${report.analysis.tokenEconomyImpact.toUpperCase()}`);
  }

  console.log('='.repeat(80) + '\n');
}

/**
 * Run all validations
 */
async function runAllValidations(): Promise<void> {
  console.log('\n🚀 PMOVES Projection Validation Suite');
  console.log('Running 5-year (260-week) simulations for all business models...\n');

  const validator = new ProjectionValidator();

  // Validate baseline models
  console.log('📋 Validating Baseline Models...\n');

  const baselineReports = [];

  for (const model of BASELINE_MODELS) {
    console.log(`Running simulation for: ${model.name}...`);
    const report = await validator.validate(model);
    baselineReports.push(report);
    printReport(report);
  }

  // Validate market scenario variants
  console.log('\n📋 Validating Market Scenario Variants...\n');

  console.log(`Running simulation for: ${AI_SERVICE_BULL_MARKET.name}...`);
  const bullReport = await validator.validate(AI_SERVICE_BULL_MARKET);
  printReport(bullReport);

  console.log(`Running simulation for: ${TOKEN_PRE_ORDER_BEAR_MARKET.name}...`);
  const bearReport = await validator.validate(TOKEN_PRE_ORDER_BEAR_MARKET);
  printReport(bearReport);

  // Compare all models
  console.log('\n📊 MULTI-SCENARIO COMPARISON');
  console.log('='.repeat(80));

  const comparison = await validator.compareModels(ALL_MODELS);

  console.log('\n🏆 RANKINGS (by score):');
  console.log('-'.repeat(80));

  comparison.ranking.forEach((rank, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
    console.log(`${medal} ${index + 1}. ${rank.name.padEnd(50)} Score: ${rank.score.toFixed(1)}/100`);
  });

  console.log('\n💡 RECOMMENDATIONS:');
  console.log('-'.repeat(80));

  comparison.recommendations.forEach(rec => {
    console.log(`\n${rec}`);
  });

  // Market scenario analysis
  console.log('\n\n📈 MARKET SCENARIO IMPACT ANALYSIS');
  console.log('='.repeat(80));

  Object.entries(MARKET_SCENARIOS).forEach(([_key, scenario]) => {
    console.log(`\n${scenario.name} (${formatPercent(scenario.probability * 100, 0)} probability):`);
    console.log(`  ROI Multiplier:      ${scenario.roiMultiplier}x`);
    console.log(`  Success Rate Change: ${scenario.successRateIncrease > 0 ? '+' : ''}${formatPercent(scenario.successRateIncrease * 100, 0)}`);
    console.log(`  Growth Acceleration: ${scenario.growthAcceleration}x`);
  });

  // Executive summary
  console.log('\n\n📋 EXECUTIVE SUMMARY');
  console.log('='.repeat(80));

  const bestModel = comparison.ranking[0];
  const bestReport = comparison.models.find(r => r.modelName === bestModel.name);

  console.log(`\n✅ RECOMMENDED MODEL: ${bestModel.name}`);
  console.log(`   Overall Score: ${bestModel.score.toFixed(1)}/100`);

  if (bestReport) {
    console.log(`   Expected ROI: ${formatPercent(bestReport.actual.roi, 0)}`);
    console.log(`   Expected Revenue (Year 5): ${formatCurrency(bestReport.actual.revenue)}`);
    console.log(`   Break-Even: ${bestReport.actual.breakEvenMonths?.toFixed(1) || 'N/A'} months`);
    console.log(`   Confidence: ${bestReport.riskAssessment.confidenceLevel.toUpperCase()}`);
  }

  console.log('\n📊 KEY FINDINGS:');

  const highConfidence = comparison.models.filter(
    r => r.riskAssessment.confidenceLevel === 'high'
  );

  console.log(`   • ${highConfidence.length} models achieved HIGH confidence`);

  const achievedTarget = comparison.models.filter(
    r => r.riskAssessment.achievedSuccessProbability
  );

  console.log(`   • ${achievedTarget.length}/${comparison.models.length} models met success targets`);

  const positiveToken = comparison.models.filter(
    r => r.analysis.tokenEconomyImpact === 'positive'
  );

  console.log(`   • ${positiveToken.length} models showed positive token economy impact`);

  const improving = comparison.models.filter(
    r => r.analysis.profitabilityTrend === 'improving'
  );

  console.log(`   • ${improving.length} models showed improving profitability trends`);

  console.log('\n⚠️  RISK FACTORS ACROSS ALL MODELS:');

  const allRiskFactors = new Set<string>();
  comparison.models.forEach(r => {
    r.riskAssessment.riskFactors.forEach(factor => allRiskFactors.add(factor));
  });

  allRiskFactors.forEach(factor => {
    const count = comparison.models.filter(r =>
      r.riskAssessment.riskFactors.includes(factor)
    ).length;
    console.log(`   • ${factor} (${count} models affected)`);
  });

  console.log('\n✅ VALIDATION COMPLETE');
  console.log('='.repeat(80));
  console.log('\nAll projection models have been validated against 5-year simulations.');
  console.log('Review the detailed reports above for variance analysis and recommendations.\n');
}

/**
 * Run quick validation (single model)
 */
async function runQuickValidation(): Promise<void> {
  console.log('\n🚀 PMOVES Quick Validation');
  console.log('Running 5-year simulation for AI-Enhanced Local Service model...\n');

  const validator = new ProjectionValidator();
  const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

  printReport(report);

  console.log('✅ Quick validation complete.\n');
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const quick = args.includes('--quick') || args.includes('-q');

  if (quick) {
    runQuickValidation().catch(console.error);
  } else {
    runAllValidations().catch(console.error);
  }
}

export { runAllValidations, runQuickValidation };
