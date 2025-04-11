import { SimulationParams, SimMember, WeeklyMetrics, KeyEvent, NarrativeSummary } from './types';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/formatters';

// Default simulation parameters
export const DEFAULT_PARAMS: SimulationParams = {
  NUM_MEMBERS: 50,
  SIMULATION_WEEKS: 52 * 3,
  INITIAL_WEALTH_MEAN_LOG: Math.log(1000),
  INITIAL_WEALTH_SIGMA_LOG: 0.6,
  WEEKLY_FOOD_BUDGET_AVG: 75.0,
  WEEKLY_FOOD_BUDGET_STDDEV: 15.0,
  MIN_WEEKLY_BUDGET: 20.0,
  WEEKLY_INCOME_AVG: 150.0,
  WEEKLY_INCOME_STDDEV: 40.0,
  MIN_WEEKLY_INCOME: 0.0,
  GROUP_BUY_SAVINGS_PERCENT: 0.15,
  LOCAL_PRODUCTION_SAVINGS_PERCENT: 0.25,
  PERCENT_SPEND_INTERNAL_AVG: 0.60,
  PERCENT_SPEND_INTERNAL_STDDEV: 0.20,
  GROTOKEN_REWARD_PER_WEEK_AVG: 0.5,
  GROTOKEN_REWARD_STDDEV: 0.2,
  GROTOKEN_USD_VALUE: 2.0,
  WEEKLY_COOP_FEE_B: 1.0,
};

// Helper function to calculate Gini coefficient
export function calculateGini(wealth_distribution: number[]): number {
  const wealth_non_negative = wealth_distribution.map(w => Math.max(0, w));
  const wealth = [...wealth_non_negative].sort((a, b) => a - b);
  const n = wealth.length;

  if (n === 0) return 0.0;

  const index = Array.from({ length: n }, (_, i) => i + 1);
  const denominator = n * wealth.reduce((sum, val) => sum + val, 0);

  if (denominator === 0) return 0.0;

  return wealth.reduce((sum, val, i) => sum + (2 * index[i] - n - 1) * val, 0) / denominator;
}

// Helper function to generate random normal distribution
export function randomNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

// Helper function to generate random lognormal distribution
export function randomLogNormal(meanLog: number, sigmaLog: number): number {
  return Math.exp(randomNormal(meanLog, sigmaLog));
}

// Helper function to calculate percentile
export function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;

  const sorted = [...arr].sort((a, b) => a - b);
  const position = (sorted.length - 1) * p / 100;
  const base = Math.floor(position);
  const rest = position - base;

  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}

// Helper function to calculate mean
export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

// Helper function to calculate median
export function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Helper function to calculate standard deviation
export function stdDev(arr: number[]): number {
  if (arr.length === 0) return 0;
  const avg = mean(arr);
  return Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length);
}

// Generate narrative summary
export function generateNarrativeSummary(history: WeeklyMetrics[], events: KeyEvent[]): NarrativeSummary {
  if (!history || history.length === 0) {
    return {
      title: "Error",
      overview: "No simulation history data available.",
      key_findings: {
        wealth_impact: { summary: "", details: "" },
        equality_measures: { summary: "", gini: "", details: "" },
        community_health: { poverty: "", resilience: "", details: "", sustainability: "" }
      },
      phase_analysis: [],
      key_events: ["No data available"],
      conclusion: "No simulation data to generate conclusion."
    };
  }

  const first_period = history[0];
  const last_period = history[history.length - 1];
  const mid_period_index = Math.floor(history.length / 2);
  const mid_period = mid_period_index < history.length ? history[mid_period_index] : last_period;

  const wealth_change = first_period.TotalWealth_B !== 0
    ? (last_period.TotalWealth_B - first_period.TotalWealth_B) / first_period.TotalWealth_B
    : 0;
  const inequality_change = last_period.Gini_B - first_period.Gini_B;
  const poverty_trend = last_period.PovertyRate_B < first_period.PovertyRate_B ? 'decreased' : 'increased or stayed same';

  const narrative: NarrativeSummary = {
    title: "Economic System Evolution Analysis",
    overview: `Over ${history.length} weeks, the community's economic system under Scenario B (Cooperative) showed notable changes compared to Scenario A (Existing).`,
    key_findings: {
      wealth_impact: {
        summary: `Total wealth in Scenario B ${wealth_change > 0 ? 'grew' : 'declined'} by ${formatPercentage(Math.abs(wealth_change))} compared to its start.`,
        details: `Average wealth in B finished at ${formatCurrency(last_period.AvgWealth_B)}, compared to ${formatCurrency(last_period.AvgWealth_A)} in A. The wealth distribution in B became ${inequality_change > 0 ? 'more' : 'less'} unequal over time.`
      },
      equality_measures: {
        summary: `Wealth inequality in B ${inequality_change < 0 ? 'decreased' : 'increased'} by ${formatPercentage(Math.abs(inequality_change))} (absolute Gini change).`,
        gini: `Gini coefficient in B moved from ${formatNumber(first_period.Gini_B, 3, 3)} to ${formatNumber(last_period.Gini_B, 3, 3)} (vs ${formatNumber(last_period.Gini_A, 3, 3)} in A).`,
        details: `The poorest 20% share of total wealth in B changed from ${formatPercentage(first_period.Bottom20PctShare || 0)} to ${formatPercentage(last_period.Bottom20PctShare || 0)}. The wealth gap (Top 20% / Bottom 20%) finished at ${formatNumber(last_period.WealthGap_B, 1, 1)}x in B (vs ${formatNumber(last_period.WealthGap_A, 1, 1)}x in A).`
      },
      community_health: {
        poverty: `Poverty rate in B ${poverty_trend}, finishing at ${formatPercentage(last_period.PovertyRate_B)} (vs ${formatPercentage(last_period.PovertyRate_A)} in A).`,
        resilience: `Community resilience index in B finished at: ${formatNumber(last_period.CommunityResilience, 2, 2)}`,
        details: `Economic health indicators suggest Scenario B fostered ${(last_period.CommunityResilience || 0) > (first_period.CommunityResilience || 0) ? 'improvement' : 'challenges'} in resilience.`,
        sustainability: `Economic sustainability score in B: ${formatNumber(last_period.SustainabilityScore, 2, 2)}`
      }
    },
    phase_analysis: analyzeEconomicPhases(history),
    key_events: events ? events.map(e => e.description) : ["No significant key events detected."],
    conclusion: generateConclusion(history)
  };

  return narrative;
}

// Analyze economic phases
function analyzeEconomicPhases(history: WeeklyMetrics[]): Array<{
  period: string;
  type: string;
  characteristics: string;
  metrics: {
    avg_wealth: string;
    poverty_rate: string;
    gini: string;
  };
}> {
  if (history.length < 9) return [];

  const phase_length = Math.floor(history.length / 3);
  const phases_data = [
    history.slice(0, phase_length),
    history.slice(phase_length, 2 * phase_length),
    history.slice(2 * phase_length)
  ];

  const phase_periods = [
    `Weeks 1-${phase_length}`,
    `Weeks ${phase_length + 1}-${2 * phase_length}`,
    `Weeks ${2 * phase_length + 1}-${history.length}`
  ];

  const phase_names = ["Initial Phase", "Development Phase", "Maturity Phase"];
  const analyzed_phases: Array<any> = [];

  for (let i = 0; i < phases_data.length; i++) {
    const phase_data = phases_data[i];
    if (!phase_data.length) continue;

    const start_metrics = phase_data[0];
    const end_metrics = phase_data[phase_data.length - 1];
    const start_total_wealth = start_metrics.TotalWealth_B || 0;
    const end_total_wealth = end_metrics.TotalWealth_B || 0;
    const wealth_growth = start_total_wealth > 1e-6
      ? (end_total_wealth - start_total_wealth) / start_total_wealth
      : 0;

    let phase_char = "";
    if (i === 0) {
      phase_char = Math.abs(wealth_growth) < 0.05
        ? "Adaptation"
        : wealth_growth > 0.1
          ? "Rapid Growth"
          : "Steady Growth";
    } else if (i === 1) {
      phase_char = wealth_growth < analyzed_phases[0].raw_growth
        ? "Consolidation"
        : wealth_growth > analyzed_phases[0].raw_growth
          ? "Acceleration"
          : "Stabilization";
    } else {
      phase_char = Math.abs(wealth_growth) < 0.03
        ? "Maturity"
        : wealth_growth > 0
          ? "Continued Growth"
          : "Contraction";
    }

    analyzed_phases.push({
      period: phase_periods[i],
      type: phase_names[i],
      raw_growth: wealth_growth,
      characteristics: `${phase_char} (Wealth Change: ${(wealth_growth * 100).toFixed(1)}%)`,
      metrics: {
        avg_wealth: formatCurrency(end_metrics.AvgWealth_B || 0),
        poverty_rate: formatPercentage(end_metrics.PovertyRate_B || 0),
        gini: formatNumber(end_metrics.Gini_B || 0, 3, 3)
      }
    });
  }

  // Remove raw_growth property from the final output
  return analyzed_phases.map(({ raw_growth, ...rest }) => rest);
}

// Generate conclusion
function generateConclusion(history: WeeklyMetrics[]): string {
  if (!history || history.length === 0) {
    return "No simulation data to generate conclusion.";
  }

  const first_period = history[0];
  const last_period = history[history.length - 1];

  const wealth_change_B = first_period.TotalWealth_B > 1e-6
    ? (last_period.TotalWealth_B - first_period.TotalWealth_B) / first_period.TotalWealth_B
    : 0;

  const inequality_change_B = last_period.Gini_B - first_period.Gini_B;
  const poverty_change_B = last_period.PovertyRate_B - first_period.PovertyRate_B;
  const resilience_change_B = (last_period.CommunityResilience || 0) - (first_period.CommunityResilience || 0);
  const final_wealth_diff = last_period.TotalWealth_B - last_period.TotalWealth_A;
  const final_gini_diff = last_period.Gini_B - last_period.Gini_A;

  const economic_success = wealth_change_B > 0.1 && poverty_change_B < 0
    ? "successful"
    : wealth_change_B >= 0 && poverty_change_B <= 0
      ? "moderately successful"
      : "challenging";

  const equity_outcome = inequality_change_B < -0.02
    ? "more equitable"
    : inequality_change_B < 0
      ? "slightly more equitable"
      : inequality_change_B > 0.02
        ? "less equitable"
        : "equity neutral";

  const resilience_outcome = resilience_change_B > 0.05
    ? "more resilient"
    : resilience_change_B < -0.05
      ? "less resilient"
      : "resilience neutral";

  let conclusion = `The simulation suggests a ${economic_success} outcome for the Cooperative Model (Scenario B) over ${history.length} weeks. Compared to its starting point, the community became ${equity_outcome} and potentially ${resilience_outcome}. `;

  if (final_wealth_diff > 0) {
    conclusion += `Crucially, Scenario B ended with ${formatCurrency(final_wealth_diff)} more total wealth than Scenario A (Existing System). `;
  } else {
    conclusion += `However, Scenario B ended with ${formatCurrency(Math.abs(final_wealth_diff))} less total wealth than Scenario A. `;
  }

  if (final_gini_diff < -0.01) {
    conclusion += `Scenario B also demonstrated lower final inequality (Gini diff: ${formatNumber(final_gini_diff, 3, 3)}). `;
  } else if (final_gini_diff > 0.01) {
    conclusion += `However, Scenario B showed higher final inequality (Gini diff: ${formatNumber(final_gini_diff, 3, 3)}). `;
  } else {
    conclusion += "Final inequality levels were similar between scenarios. ";
  }

  conclusion += "These results highlight the potential benefits (or drawbacks) of the cooperative model under the simulated parameters, particularly regarding wealth retention and distribution.";

  return conclusion;
}
