/**
 * Utility functions for exporting simulation data in various formats
 */

import { SimulationResults } from '@/lib/simulation/types';

/**
 * Convert simulation results to CSV format
 */
export function exportToCSV(
  data: any[],
  filename: string,
  headers?: string[]
): void {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    csvHeaders.join(','), // Header row
    ...data.map(row =>
      csvHeaders.map(header => {
        const value = row[header];
        // Handle arrays, objects, and special values
        if (Array.isArray(value)) {
          return `"${JSON.stringify(value)}"`;
        } else if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'object') {
          return `"${JSON.stringify(value)}"`;
        } else if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Download file
  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export simulation history to CSV
 */
export function exportSimulationHistoryToCSV(
  history: any[],
  scenarioName: string = 'simulation'
): void {
  const filename = `${scenarioName}_history_${getTimestamp()}.csv`;

  // Flatten nested objects for CSV
  const flattenedData = history.map(week => {
    const flat: any = { ...week };

    // Flatten wealth quintiles arrays
    if (Array.isArray(week.WealthQuintiles_A)) {
      week.WealthQuintiles_A.forEach((val: number, idx: number) => {
        flat[`WealthQuintile_A_Q${idx + 1}`] = val;
      });
      delete flat.WealthQuintiles_A;
    }

    if (Array.isArray(week.WealthQuintiles_B)) {
      week.WealthQuintiles_B.forEach((val: number, idx: number) => {
        flat[`WealthQuintile_B_Q${idx + 1}`] = val;
      });
      delete flat.WealthQuintiles_B;
    }

    return flat;
  });

  exportToCSV(flattenedData, filename);
}

/**
 * Export final member data to CSV
 */
export function exportMemberDataToCSV(
  members: any[],
  scenarioName: string = 'simulation'
): void {
  const filename = `${scenarioName}_members_${getTimestamp()}.csv`;
  exportToCSV(members, filename);
}

/**
 * Export key events to CSV
 */
export function exportKeyEventsToCSV(
  events: any[],
  scenarioName: string = 'simulation'
): void {
  const filename = `${scenarioName}_events_${getTimestamp()}.csv`;
  exportToCSV(events, filename);
}

/**
 * Export complete simulation results to JSON
 */
export function exportToJSON(
  data: any,
  filename: string
): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Export complete simulation results bundle
 */
export function exportSimulationBundle(
  results: SimulationResults,
  scenarioName: string = 'simulation'
): void {
  const filename = `${scenarioName}_complete_${getTimestamp()}.json`;
  exportToJSON(results, filename);
}

/**
 * Export comparison results to CSV
 */
export function exportComparisonToCSV(
  history: any[],
  scenarioName: string = 'comparison'
): void {
  const filename = `${scenarioName}_${getTimestamp()}.csv`;

  // Extract comparison metrics for each week
  const comparisonData = history.map(week => ({
    Week: week.Week,
    Year: week.Year,
    Quarter: week.Quarter,

    // Wealth comparison
    AvgWealth_A: week.AvgWealth_A,
    AvgWealth_B: week.AvgWealth_B,
    WealthDifference: week.AvgWealth_B - week.AvgWealth_A,
    WealthGainPercent: ((week.AvgWealth_B - week.AvgWealth_A) / week.AvgWealth_A * 100).toFixed(2),

    // Inequality comparison
    Gini_A: week.Gini_A,
    Gini_B: week.Gini_B,
    GiniImprovement: week.Gini_A - week.Gini_B,

    // Poverty comparison
    PovertyRate_A: week.PovertyRate_A,
    PovertyRate_B: week.PovertyRate_B,
    PovertyReduction: ((week.PovertyRate_A - week.PovertyRate_B) * 100).toFixed(2),

    // Wealth gap
    WealthGap_A: week.WealthGap_A,
    WealthGap_B: week.WealthGap_B,

    // Community metrics
    LocalEconomyStrength: week.LocalEconomyStrength,
    CommunityResilience: week.CommunityResilience,
    WealthMobility: week.WealthMobility,
  }));

  exportToCSV(comparisonData, filename);
}

/**
 * Export specific metrics over time to CSV
 */
export function exportMetricsToCSV(
  history: any[],
  metrics: string[],
  filename: string
): void {
  const metricsData = history.map(week => {
    const row: any = { Week: week.Week };
    metrics.forEach(metric => {
      row[metric] = week[metric];
    });
    return row;
  });

  exportToCSV(metricsData, `${filename}_${getTimestamp()}.csv`);
}

/**
 * Export wealth distribution data for analysis
 */
export function exportWealthDistributionToCSV(
  members: any[],
  scenarioName: string = 'wealth_distribution'
): void {
  const filename = `${scenarioName}_${getTimestamp()}.csv`;

  // Sort by wealth for percentile analysis
  const sortedA = [...members].sort((a, b) => a.Wealth_A - b.Wealth_A);
  const sortedB = [...members].sort((a, b) => a.Wealth_B - b.Wealth_B);

  const distributionData = members.map((member, idx) => ({
    ID: member.ID,
    Income: member.Income,
    Budget: member.Budget,
    Wealth_A: member.Wealth_A,
    Wealth_A_Percentile: (sortedA.findIndex(m => m.ID === member.ID) / members.length * 100).toFixed(2),
    Wealth_B: member.Wealth_B,
    Wealth_B_Percentile: (sortedB.findIndex(m => m.ID === member.ID) / members.length * 100).toFixed(2),
    WealthGain: member.Wealth_B - member.Wealth_A,
    WealthGainPercent: ((member.Wealth_B - member.Wealth_A) / member.Wealth_A * 100).toFixed(2),
    FoodUSD_B: member.FoodUSD_B,
    GroToken_B: member.GroToken_B,
    GroTokenValue: (member.GroToken_B * 2).toFixed(2), // Assuming $2 per token
  }));

  exportToCSV(distributionData, filename);
}

/**
 * Export chart data for external visualization tools
 */
export function exportChartData(
  data: any[],
  chartName: string,
  xAxis: string,
  yAxes: string[]
): void {
  const filename = `chart_${chartName}_${getTimestamp()}.csv`;

  const chartData = data.map(point => {
    const row: any = { [xAxis]: point[xAxis] };
    yAxes.forEach(yAxis => {
      row[yAxis] = point[yAxis];
    });
    return row;
  });

  exportToCSV(chartData, filename);
}

/**
 * Export summary statistics
 */
export function exportSummaryStatistics(
  results: SimulationResults,
  scenarioName: string = 'summary'
): void {
  const filename = `${scenarioName}_statistics_${getTimestamp()}.csv`;

  if (!results.history || results.history.length === 0) {
    console.error('No history data available');
    return;
  }

  const firstWeek = results.history[0];
  const lastWeek = results.history[results.history.length - 1];

  const statistics = [
    {
      Metric: 'Simulation Duration',
      Value: `${results.history.length} weeks (${(results.history.length / 52).toFixed(1)} years)`,
      Category: 'General'
    },
    {
      Metric: 'Number of Members',
      Value: results.final_members?.length || 'N/A',
      Category: 'General'
    },

    // Initial values
    { Metric: 'Initial Avg Wealth A', Value: firstWeek.AvgWealth_A?.toFixed(2), Category: 'Initial' },
    { Metric: 'Initial Avg Wealth B', Value: firstWeek.AvgWealth_B?.toFixed(2), Category: 'Initial' },
    { Metric: 'Initial Gini A', Value: firstWeek.Gini_A?.toFixed(4), Category: 'Initial' },
    { Metric: 'Initial Gini B', Value: firstWeek.Gini_B?.toFixed(4), Category: 'Initial' },

    // Final values
    { Metric: 'Final Avg Wealth A', Value: lastWeek.AvgWealth_A?.toFixed(2), Category: 'Final' },
    { Metric: 'Final Avg Wealth B', Value: lastWeek.AvgWealth_B?.toFixed(2), Category: 'Final' },
    { Metric: 'Final Gini A', Value: lastWeek.Gini_A?.toFixed(4), Category: 'Final' },
    { Metric: 'Final Gini B', Value: lastWeek.Gini_B?.toFixed(4), Category: 'Final' },

    // Changes
    {
      Metric: 'Wealth Growth A',
      Value: `${((lastWeek.AvgWealth_A - firstWeek.AvgWealth_A) / firstWeek.AvgWealth_A * 100).toFixed(2)}%`,
      Category: 'Change'
    },
    {
      Metric: 'Wealth Growth B',
      Value: `${((lastWeek.AvgWealth_B - firstWeek.AvgWealth_B) / firstWeek.AvgWealth_B * 100).toFixed(2)}%`,
      Category: 'Change'
    },
    {
      Metric: 'Cooperative Advantage',
      Value: `${((lastWeek.AvgWealth_B - lastWeek.AvgWealth_A) / lastWeek.AvgWealth_A * 100).toFixed(2)}%`,
      Category: 'Change'
    },
    {
      Metric: 'Gini Improvement A',
      Value: `${((firstWeek.Gini_A - lastWeek.Gini_A) / firstWeek.Gini_A * 100).toFixed(2)}%`,
      Category: 'Change'
    },
    {
      Metric: 'Gini Improvement B',
      Value: `${((firstWeek.Gini_B - lastWeek.Gini_B) / firstWeek.Gini_B * 100).toFixed(2)}%`,
      Category: 'Change'
    },

    // Key events
    {
      Metric: 'Key Events Count',
      Value: results.key_events?.length || 0,
      Category: 'Events'
    },
  ];

  exportToCSV(statistics, filename);
}

/**
 * Generate timestamp for filenames
 */
function getTimestamp(): string {
  const now = new Date();
  return now.toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .split('.')[0];
}

/**
 * Download file helper
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all simulation data in a zip-like structure
 * (Creates multiple files)
 */
export function exportCompleteSimulation(
  results: SimulationResults,
  scenarioName: string = 'simulation'
): void {
  // Export all components
  setTimeout(() => exportSimulationHistoryToCSV(results.history, scenarioName), 0);
  setTimeout(() => exportMemberDataToCSV(results.final_members, scenarioName), 100);
  setTimeout(() => exportKeyEventsToCSV(results.key_events || [], scenarioName), 200);
  setTimeout(() => exportSummaryStatistics(results, scenarioName), 300);
  setTimeout(() => exportWealthDistributionToCSV(results.final_members, scenarioName), 400);
  setTimeout(() => exportSimulationBundle(results, scenarioName), 500);

  console.log('Exporting complete simulation data... (6 files will download)');
}
