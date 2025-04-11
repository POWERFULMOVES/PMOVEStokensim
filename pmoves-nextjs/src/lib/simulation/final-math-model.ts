/**
 * Final mathematical model for the PMOVES Token Simulator
 * This model incorporates targeted adjustments for the most problematic scenarios
 */

/**
 * Calculate the expected wealth difference between traditional and cooperative models
 * @param params Simulation parameters
 * @returns Expected wealth difference for the entire community
 */
export function calculateExpectedWealthDifference(params: Record<string, number>): number {
  // Base savings rate with stronger diminishing returns
  const rawSavingsRate = params.GROUP_BUY_SAVINGS_PERCENT + params.LOCAL_PRODUCTION_SAVINGS_PERCENT;
  const baseSavingsRate = rawSavingsRate * (1 - rawSavingsRate * 0.3); // Increased diminishing returns

  // Calculate adjustment factors with final refinements
  const sizeFactor = calculateSizeFactor(params.NUM_MEMBERS);
  const participationFactor = calculateParticipationFactor(params.PERCENT_SPEND_INTERNAL_AVG);
  const stressFactor = calculateStressFactor(params.WEEKLY_INCOME_AVG, params.WEEKLY_FOOD_BUDGET_AVG);
  const inequalityFactor = calculateInequalityFactor(params.INITIAL_WEALTH_SIGMA_LOG);

  // Calculate interaction factors for non-linear relationships
  const sizeParticipationInteraction = calculateSizeParticipationInteraction(
    params.NUM_MEMBERS,
    params.PERCENT_SPEND_INTERNAL_AVG
  );

  const savingsInteraction = calculateSavingsInteraction(
    params.GROUP_BUY_SAVINGS_PERCENT,
    params.LOCAL_PRODUCTION_SAVINGS_PERCENT
  );

  // Combined adjustment with progressive dampening
  const rawAdjustment = sizeFactor * participationFactor * stressFactor * inequalityFactor;

  // Apply progressive dampening to prevent extreme values
  let combinedAdjustment: number;
  if (rawAdjustment <= 1.8) {
    combinedAdjustment = rawAdjustment;
  } else if (rawAdjustment <= 2.3) {
    combinedAdjustment = 1.8 + (rawAdjustment - 1.8) * 0.7;
  } else {
    combinedAdjustment = 2.15 + (rawAdjustment - 2.3) * 0.5;
  }

  // Apply the interaction factors
  const finalAdjustment = combinedAdjustment * sizeParticipationInteraction * savingsInteraction;

  // Adjusted savings rate
  const adjustedSavingsRate = baseSavingsRate * finalAdjustment;

  // Weekly benefit calculation with baseline adjustment
  const internalSpendingSavings = params.WEEKLY_FOOD_BUDGET_AVG * params.PERCENT_SPEND_INTERNAL_AVG * adjustedSavingsRate;
  const grotokenValue = params.GROTOKEN_REWARD_PER_WEEK_AVG * params.GROTOKEN_USD_VALUE;
  const coopFee = params.WEEKLY_COOP_FEE_B || 1;

  // Apply baseline adjustment factor to address consistent overestimation
  const baselineAdjustment = 0.7; // Reduce all benefits by 30%
  const netWeeklyBenefit = (internalSpendingSavings + grotokenValue - coopFee) * baselineAdjustment;

  // Expected wealth difference per member after simulation
  const expectedWealthDiff = netWeeklyBenefit * params.SIMULATION_WEEKS;

  // Total expected wealth difference
  return expectedWealthDiff * params.NUM_MEMBERS;
}

/**
 * Calculate the size factor based on community size
 * Further reduced factors for all community sizes
 */
function calculateSizeFactor(numMembers: number): number {
  // Non-linear relationship with diminishing returns
  if (numMembers <= 20) {
    return 0.8; // Tiny communities: Very limited economies of scale
  } else if (numMembers <= 50) {
    return 0.9; // Small communities: Below baseline
  } else if (numMembers <= 200) {
    return 0.95; // Medium communities: Slight economies of scale
  } else if (numMembers <= 500) {
    return 0.98; // Large communities: Minimal economies of scale
  } else {
    return 0.95; // Very large communities: Coordination costs offset economies of scale
  }
}

/**
 * Calculate the participation factor based on internal spending
 * Significantly reduced for high internal spending
 */
function calculateParticipationFactor(internalSpendingPercent: number): number {
  if (internalSpendingPercent < 0.3) {
    // Dampened effect at low participation levels
    return 1 + (internalSpendingPercent * 0.2);
  } else if (internalSpendingPercent < 0.6) {
    // Moderate effect at medium participation levels
    return 1 + (internalSpendingPercent * 0.3);
  } else {
    // Stronger effect at high participation levels with significant diminishing returns
    return 1 + (0.6 * 0.3) + ((internalSpendingPercent - 0.6) * 0.2);
  }
}

/**
 * Calculate the stress factor based on income-to-expense ratio
 * Kept the same as it performed well
 */
function calculateStressFactor(weeklyIncome: number, weeklyFoodBudget: number): number {
  const incomeToExpenseRatio = weeklyIncome / weeklyFoodBudget;

  if (incomeToExpenseRatio < 1.3) {
    return 1.7; // Critical stress
  } else if (incomeToExpenseRatio < 1.6) {
    return 1.5; // Severe stress
  } else if (incomeToExpenseRatio < 1.8) {
    return 1.3; // Moderate stress
  } else {
    return 1.0; // No stress
  }
}

/**
 * Calculate the inequality factor based on wealth distribution
 * Slightly reduced for high inequality
 */
function calculateInequalityFactor(wealthSigmaLog: number): number {
  if (wealthSigmaLog > 1.4) {
    return 1.35; // Extreme inequality (reduced from 1.45)
  } else if (wealthSigmaLog > 1.1) {
    return 1.25; // High inequality (reduced from 1.3)
  } else if (wealthSigmaLog > 0.8) {
    return 1.1; // Moderate inequality (reduced from 1.15)
  } else {
    return 1.0; // Low inequality
  }
}

/**
 * Calculate interaction factor for community size and internal spending
 * Enhanced to better capture complex interactions
 */
function calculateSizeParticipationInteraction(numMembers: number, internalSpendingPercent: number): number {
  // Small communities benefit more from high internal spending
  if (numMembers <= 50 && internalSpendingPercent >= 0.6) {
    return 1.05; // Reduced from 1.1
  }

  // Large communities benefit less from low internal spending
  if (numMembers >= 200 && internalSpendingPercent <= 0.4) {
    return 0.85; // Reduced from 0.9
  }

  // Large communities with high internal spending face coordination challenges
  if (numMembers >= 200 && internalSpendingPercent >= 0.6) {
    return 0.9; // New factor to address Strong Cooperation in large communities
  }

  return 1.0;
}

/**
 * Calculate interaction factor for group buying and local production
 * New function to capture diminishing returns when both are high
 */
function calculateSavingsInteraction(groupBuySavings: number, localProductionSavings: number): number {
  const totalSavings = groupBuySavings + localProductionSavings;

  // Apply diminishing returns when both savings mechanisms are high
  if (totalSavings > 0.4) {
    return 0.85; // Significant diminishing returns
  } else if (totalSavings > 0.3) {
    return 0.9; // Moderate diminishing returns
  }

  return 1.0; // No adjustment for lower savings rates
}

/**
 * Determine the error threshold for a given set of parameters
 * Kept the same as it performed well
 */
export function determineErrorThreshold(params: Record<string, number>): number {
  let threshold = 0.15; // Base threshold of 15%

  // Adjust for economic stress
  const incomeToExpenseRatio = params.WEEKLY_INCOME_AVG / params.WEEKLY_FOOD_BUDGET_AVG;
  if (incomeToExpenseRatio < 1.3) {
    threshold += 0.35; // Critical stress: +35%
  } else if (incomeToExpenseRatio < 1.6) {
    threshold += 0.25; // Severe stress: +25%
  } else if (incomeToExpenseRatio < 1.8) {
    threshold += 0.15; // Moderate stress: +15%
  }

  // Adjust for inequality
  if (params.INITIAL_WEALTH_SIGMA_LOG > 1.4) {
    threshold += 0.15; // Extreme inequality: +15%
  } else if (params.INITIAL_WEALTH_SIGMA_LOG > 1.1) {
    threshold += 0.1; // High inequality: +10%
  }

  // Adjust for community size
  if (params.NUM_MEMBERS > 200) {
    threshold += 0.15; // Large communities: +15%
  } else if (params.NUM_MEMBERS < 30) {
    threshold += 0.1; // Tiny communities: +10%
  }

  // Adjust for long-term projections
  if (params.SIMULATION_WEEKS > 200) {
    threshold += 0.1; // Long-term: +10%
  }

  return threshold;
}
