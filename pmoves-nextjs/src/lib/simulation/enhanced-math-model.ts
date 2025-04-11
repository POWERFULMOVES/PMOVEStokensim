/**
 * Enhanced mathematical model for the PMOVES Token Simulator
 * This model incorporates additional refinements based on test results
 */

/**
 * Calculate the expected wealth difference between traditional and cooperative models
 * @param params Simulation parameters
 * @returns Expected wealth difference for the entire community
 */
export function calculateExpectedWealthDifference(params: any): number {
  // Base savings rate with diminishing returns
  const rawSavingsRate = params.GROUP_BUY_SAVINGS_PERCENT + params.LOCAL_PRODUCTION_SAVINGS_PERCENT;
  const baseSavingsRate = rawSavingsRate * (1 - rawSavingsRate * 0.2); // Diminishing returns
  
  // Calculate adjustment factors with enhanced values
  const sizeFactor = calculateSizeFactor(params.NUM_MEMBERS);
  const participationFactor = calculateParticipationFactor(params.PERCENT_SPEND_INTERNAL_AVG);
  const stressFactor = calculateStressFactor(params.WEEKLY_INCOME_AVG, params.WEEKLY_FOOD_BUDGET_AVG);
  const inequalityFactor = calculateInequalityFactor(params.INITIAL_WEALTH_SIGMA_LOG);
  
  // Calculate interaction factor for non-linear relationships
  const interactionFactor = calculateSizeParticipationInteraction(
    params.NUM_MEMBERS, 
    params.PERCENT_SPEND_INTERNAL_AVG
  );
  
  // Combined adjustment with progressive dampening
  const rawAdjustment = sizeFactor * participationFactor * stressFactor * inequalityFactor;
  
  // Apply progressive dampening to prevent extreme values
  let combinedAdjustment;
  if (rawAdjustment <= 2.0) {
    combinedAdjustment = rawAdjustment;
  } else if (rawAdjustment <= 2.5) {
    combinedAdjustment = 2.0 + (rawAdjustment - 2.0) * 0.8;
  } else {
    combinedAdjustment = 2.4 + (rawAdjustment - 2.5) * 0.6;
  }
  
  // Apply the interaction factor
  const finalAdjustment = combinedAdjustment * interactionFactor;
  
  // Adjusted savings rate
  const adjustedSavingsRate = baseSavingsRate * finalAdjustment;
  
  // Weekly benefit calculation
  const internalSpendingSavings = params.WEEKLY_FOOD_BUDGET_AVG * params.PERCENT_SPEND_INTERNAL_AVG * adjustedSavingsRate;
  const grotokenValue = params.GROTOKEN_REWARD_PER_WEEK_AVG * params.GROTOKEN_USD_VALUE;
  const coopFee = params.WEEKLY_COOP_FEE_B || 1;
  const netWeeklyBenefit = internalSpendingSavings + grotokenValue - coopFee;
  
  // Expected wealth difference per member after simulation
  const expectedWealthDiff = netWeeklyBenefit * params.SIMULATION_WEEKS;
  
  // Total expected wealth difference
  return expectedWealthDiff * params.NUM_MEMBERS;
}

/**
 * Calculate the size factor based on community size
 * Further reduced factors for tiny and large communities
 */
function calculateSizeFactor(numMembers: number): number {
  // Non-linear relationship with diminishing returns
  if (numMembers <= 20) {
    return 0.85; // Tiny communities: Very limited economies of scale
  } else if (numMembers <= 50) {
    return 1.0; // Small communities: Baseline
  } else if (numMembers <= 200) {
    return 1.05; // Medium communities: Moderate economies of scale
  } else if (numMembers <= 500) {
    return 1.08; // Large communities: Diminishing returns start
  } else {
    return 1.05; // Very large communities: Significant coordination costs
  }
}

/**
 * Calculate the participation factor based on internal spending
 * Refined with three tiers and diminishing returns at high levels
 */
function calculateParticipationFactor(internalSpendingPercent: number): number {
  if (internalSpendingPercent < 0.3) {
    // Dampened effect at low participation levels
    return 1 + (internalSpendingPercent * 0.25);
  } else if (internalSpendingPercent < 0.6) {
    // Moderate effect at medium participation levels
    return 1 + (internalSpendingPercent * 0.4);
  } else {
    // Stronger effect at high participation levels with slight diminishing returns
    return 1 + (internalSpendingPercent * 0.45);
  }
}

/**
 * Calculate the stress factor based on income-to-expense ratio
 * Kept the same as the improved model as it performed well
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
 * Kept the same as the original model
 */
function calculateInequalityFactor(wealthSigmaLog: number): number {
  if (wealthSigmaLog > 1.4) {
    return 1.45; // Extreme inequality
  } else if (wealthSigmaLog > 1.1) {
    return 1.3; // High inequality
  } else if (wealthSigmaLog > 0.8) {
    return 1.15; // Moderate inequality
  } else {
    return 1.0; // Low inequality
  }
}

/**
 * Calculate interaction factor for non-linear relationships
 * New function to capture complex interactions between parameters
 */
function calculateSizeParticipationInteraction(numMembers: number, internalSpendingPercent: number): number {
  // Small communities benefit more from high internal spending
  if (numMembers <= 50 && internalSpendingPercent >= 0.6) {
    return 1.1;
  }
  
  // Large communities benefit less from low internal spending
  if (numMembers >= 200 && internalSpendingPercent <= 0.4) {
    return 0.9;
  }
  
  return 1.0;
}

/**
 * Determine the error threshold for a given set of parameters
 * Kept the same as the improved model as it performed well
 */
export function determineErrorThreshold(params: any): number {
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
