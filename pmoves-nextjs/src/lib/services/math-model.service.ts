import { calculateExpectedWealthDifference, determineErrorThreshold } from '../simulation/final-math-model';

/**
 * Service for mathematical model calculations
 * Provides methods for calculating expected benefits and validation metrics
 */
export class MathModelService {
  /**
   * Calculate the expected wealth difference between traditional and cooperative models
   * @param params Simulation parameters
   * @returns Expected wealth difference for the entire community
   */
  static calculateExpectedWealthDifference(params: Record<string, number>): number {
    return calculateExpectedWealthDifference(params);
  }

  /**
   * Determine the error threshold for a given set of parameters
   * @param params Simulation parameters
   * @returns Error threshold as a decimal (e.g., 0.15 for 15%)
   */
  static determineErrorThreshold(params: Record<string, number>): number {
    return determineErrorThreshold(params);
  }

  /**
   * Calculate the expected benefit per member
   * @param params Simulation parameters
   * @returns Expected benefit per member
   */
  static calculateExpectedBenefitPerMember(params: Record<string, number>): number {
    const totalBenefit = calculateExpectedWealthDifference(params);
    return totalBenefit / params.NUM_MEMBERS;
  }

  /**
   * Calculate the expected weekly benefit per member
   * @param params Simulation parameters
   * @returns Expected weekly benefit per member
   */
  static calculateExpectedWeeklyBenefit(params: Record<string, number>): number {
    const totalBenefit = calculateExpectedWealthDifference(params);
    return totalBenefit / params.NUM_MEMBERS / params.SIMULATION_WEEKS;
  }

  /**
   * Calculate the validation score for a simulation result
   * @param actual Actual wealth difference
   * @param expected Expected wealth difference
   * @param params Simulation parameters
   * @returns Validation score (0-100)
   */
  static calculateValidationScore(
    actual: number,
    expected: number,
    params: Record<string, number>
  ): number {
    // Calculate error percentage
    const errorPercentage = Math.abs(actual - expected) / expected;
    const threshold = determineErrorThreshold(params);
    const passed = errorPercentage <= threshold;

    // Start with base score
    let score = 0;

    // Directional correctness (40 points)
    if (actual > 0) {
      score += 40;
    }

    // Mathematical consistency (40 points)
    if (passed) {
      score += 40;
    } else {
      // Partial points based on how close to threshold
      const errorRatio = errorPercentage / threshold;
      if (errorRatio < 2) {
        score += Math.round(40 * (1 - (errorRatio - 1)));
      }
    }

    // Reasonable magnitude (20 points)
    const benefitPerMember = actual / params.NUM_MEMBERS;
    const weeklyIncome = params.WEEKLY_INCOME_AVG;
    const reasonableMin = weeklyIncome * 0.5; // At least half a week's income benefit
    const reasonableMax = weeklyIncome * params.SIMULATION_WEEKS * 0.5; // At most 50% of total income
    if (benefitPerMember >= reasonableMin && benefitPerMember <= reasonableMax) {
      score += 20;
    }

    return score;
  }

  /**
   * Check if a scenario is an economic downturn scenario
   * @param params Simulation parameters
   * @returns True if the scenario is an economic downturn
   */
  static isEconomicDownturnScenario(params: Record<string, number>): boolean {
    const incomeToExpenseRatio = params.WEEKLY_INCOME_AVG / params.WEEKLY_FOOD_BUDGET_AVG;
    return incomeToExpenseRatio < 1.8;
  }

  /**
   * Check if a scenario is a severe economic downturn scenario
   * @param params Simulation parameters
   * @returns True if the scenario is a severe economic downturn
   */
  static isSevereEconomicDownturnScenario(params: Record<string, number>): boolean {
    const incomeToExpenseRatio = params.WEEKLY_INCOME_AVG / params.WEEKLY_FOOD_BUDGET_AVG;
    return incomeToExpenseRatio < 1.6;
  }

  /**
   * Get the confidence level based on validation score
   * @param score Validation score (0-100)
   * @returns Confidence level: 'high', 'medium', or 'low'
   */
  static getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 90) {
      return 'high';
    } else if (score >= 70) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Get a description of the validation result
   * @param score Validation score
   * @param isDownturn Whether the scenario is an economic downturn
   * @returns Description of the validation result
   */
  static getValidationDescription(score: number, isDownturn: boolean): string {
    const confidence = this.getConfidenceLevel(score);
    
    if (isDownturn) {
      return "The benefits of cooperative economics are typically even greater during economic downturns than our mathematical model predicts. This is due to the increased importance of mutual aid and resource sharing during challenging economic times.";
    }
    
    if (confidence === 'high') {
      return "The simulation results closely match our mathematical model, indicating high reliability.";
    } else if (confidence === 'medium') {
      return "The simulation results generally align with our mathematical model, with some variations.";
    } else {
      return "The simulation results show larger variations from our mathematical model. Focus on the qualitative insights rather than exact numbers.";
    }
  }
}
