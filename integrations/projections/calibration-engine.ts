import { TransformedData } from '../firefly/data-transformer';
import { ProjectionModel, SimulationResults } from './projection-validator';

export interface CalibrationResult {
  parameter: string;
  baseline: number;
  calibrated: number;
  adjustment: number;
  adjustmentPercent: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface CategoryComparison {
  category: string;
  actual: number;
  simulated: number;
  variance: number;
  variancePercent: number;
}

export interface CalibrationReport {
  modelName: string;
  calibrationDate: Date;
  dataSource: {
    periodStart: Date;
    periodEnd: Date;
    weeksAnalyzed: number;
    totalTransactions: number;
  };
  overallAccuracy: {
    totalVariance: number;
    averageVariance: number;
    confidenceScore: number; // 0-100
    confidenceLevel: 'high' | 'medium' | 'low';
  };
  parameterAdjustments: CalibrationResult[];
  categoryComparison: CategoryComparison[];
  recommendations: string[];
}

export class CalibrationEngine {
  /**
   * Calculate confidence level based on variance
   */
  private getConfidenceLevel(variance: number): 'high' | 'medium' | 'low' {
    const absVariance = Math.abs(variance);
    if (absVariance <= 10) return 'high';
    if (absVariance <= 25) return 'medium';
    return 'low';
  }

  /**
   * Compare actual spending with simulated spending
   */
  compareSpending(
    actual: TransformedData,
    simulated: SimulationResults,
    weeks: number
  ): CategoryComparison[] {
    // Aggregate actual spending by category over the period
    const actualByCategory: Record<string, number> = {};
    actual.weeklySpending.slice(0, weeks).forEach((week) => {
      Object.entries(week.byCategory).forEach(([category, amount]) => {
        if (!actualByCategory[category]) {
          actualByCategory[category] = 0;
        }
        actualByCategory[category] += amount;
      });
    });

    // For simulated data, we need to calculate category-level spending
    // Since we don't have category breakdown in SimulationResults,
    // we'll use the model's category distribution
    const simulatedTotal = simulated.weeklyRevenue
      .slice(0, weeks)
      .reduce((sum, rev) => sum + rev, 0);

    // Get category distribution from actual data
    const totalActual = Object.values(actualByCategory).reduce(
      (sum, amount) => sum + amount,
      0
    );

    const comparisons: CategoryComparison[] = [];

    Object.entries(actualByCategory).forEach(([category, actualAmount]) => {
      // Simulate proportional spending
      const actualPercent = totalActual > 0 ? actualAmount / totalActual : 0;
      const simulatedAmount = simulatedTotal * actualPercent;

      const variance = actualAmount - simulatedAmount;
      const variancePercent = simulatedAmount > 0
        ? (variance / simulatedAmount) * 100
        : 0;

      comparisons.push({
        category,
        actual: actualAmount,
        simulated: simulatedAmount,
        variance,
        variancePercent,
      });
    });

    return comparisons.sort((a, b) => b.actual - a.actual);
  }

  /**
   * Calibrate weekly budget parameter
   */
  calibrateWeeklyBudget(actual: TransformedData): CalibrationResult {
    const weeks = actual.weeklySpending.length;
    const totalSpending = actual.totalSpending;
    const activeParticipants = actual.participation.activeParticipants;

    const averageWeeklySpending = weeks > 0 ? totalSpending / weeks : 0;
    const perParticipantPerWeek = activeParticipants > 0
      ? averageWeeklySpending / activeParticipants
      : 0;

    const baseline = 150; // Current baseline assumption
    const calibrated = Math.round(perParticipantPerWeek * 100) / 100;
    const adjustment = calibrated - baseline;
    const adjustmentPercent = baseline > 0 ? (adjustment / baseline) * 100 : 0;

    const confidence = this.getConfidenceLevel(adjustmentPercent);

    return {
      parameter: 'weeklyFoodBudget',
      baseline,
      calibrated,
      adjustment,
      adjustmentPercent,
      confidence,
      reasoning: `Based on ${weeks} weeks of actual spending data with ${activeParticipants} active participants. Average: $${perParticipantPerWeek.toFixed(2)}/week`,
    };
  }

  /**
   * Calibrate participation rate
   */
  calibrateParticipationRate(
    actual: TransformedData,
    totalPopulation: number
  ): CalibrationResult {
    const baseline = 0.75; // 75% baseline assumption
    const calibrated = actual.participation.participationRate;
    const adjustment = calibrated - baseline;
    const adjustmentPercent = baseline > 0 ? (adjustment / baseline) * 100 : 0;

    const confidence = this.getConfidenceLevel(adjustmentPercent);

    return {
      parameter: 'participationRate',
      baseline,
      calibrated,
      adjustment,
      adjustmentPercent,
      confidence,
      reasoning: `Actual participation: ${actual.participation.activeParticipants} of ${totalPopulation} (${(calibrated * 100).toFixed(1)}%)`,
    };
  }

  /**
   * Calibrate category distribution
   */
  calibrateCategoryDistribution(
    actual: TransformedData
  ): CalibrationResult[] {
    // Baseline assumptions (from scenario configs)
    const baseline = {
      groceries: 60,
      prepared_food: 25,
      dining: 0,
      farmers_market: 15,
      food_delivery: 0,
    };

    const calibrations: CalibrationResult[] = [];

    Object.entries(actual.categoryDistribution).forEach(
      ([category, calibratedPercent]) => {
        const baselinePercent = baseline[category as keyof typeof baseline] || 0;
        const adjustment = calibratedPercent - baselinePercent;
        const adjustmentPercent = baselinePercent > 0
          ? (adjustment / baselinePercent) * 100
          : 0;

        const confidence = this.getConfidenceLevel(adjustmentPercent);

        calibrations.push({
          parameter: `categoryDistribution.${category}`,
          baseline: baselinePercent,
          calibrated: Math.round(calibratedPercent * 10) / 10,
          adjustment: Math.round(adjustment * 10) / 10,
          adjustmentPercent,
          confidence,
          reasoning: `Actual ${category} spending: ${calibratedPercent.toFixed(1)}% of total food budget`,
        });
      }
    );

    return calibrations.sort((a, b) => b.calibrated - a.calibrated);
  }

  /**
   * Validate GroupPurchase savings assumption
   */
  validateGroupPurchaseSavings(
    actual: TransformedData
  ): CalibrationResult {
    // This is harder to validate without actual group purchase data
    // We'll use spending volatility as a proxy
    // Lower volatility suggests group purchasing is smoothing costs

    const weeklyTotals = actual.weeklySpending.map((w) => w.totalSpending);
    const mean = weeklyTotals.reduce((sum, val) => sum + val, 0) / weeklyTotals.length;

    const variance = weeklyTotals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / weeklyTotals.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;

    // Lower CV suggests more consistent pricing (potentially from group purchasing)
    // CV < 0.2 = stable (15% savings plausible)
    // CV 0.2-0.4 = moderate (10% savings)
    // CV > 0.4 = volatile (5% savings)

    const baseline = 0.15; // 15% baseline
    let calibrated = baseline;
    let reasoning = '';

    if (coefficientOfVariation < 0.2) {
      calibrated = 0.15;
      reasoning = `Low spending volatility (CV: ${coefficientOfVariation.toFixed(2)}) suggests stable pricing consistent with 15% group savings`;
    } else if (coefficientOfVariation < 0.4) {
      calibrated = 0.10;
      reasoning = `Moderate spending volatility (CV: ${coefficientOfVariation.toFixed(2)}) suggests 10% group savings more realistic`;
    } else {
      calibrated = 0.05;
      reasoning = `High spending volatility (CV: ${coefficientOfVariation.toFixed(2)}) suggests only 5% group savings achievable`;
    }

    const adjustment = calibrated - baseline;
    const adjustmentPercent = baseline > 0 ? (adjustment / baseline) * 100 : 0;

    return {
      parameter: 'groupPurchaseSavingsRate',
      baseline,
      calibrated,
      adjustment,
      adjustmentPercent,
      confidence: this.getConfidenceLevel(Math.abs(adjustmentPercent)),
      reasoning,
    };
  }

  /**
   * Generate comprehensive calibration report
   */
  async calibrate(
    modelName: string,
    actualData: TransformedData,
    simulatedResults: SimulationResults,
    totalPopulation: number = 500
  ): Promise<CalibrationReport> {
    console.log(`\n[CalibrationEngine] Calibrating model: ${modelName}`);
    console.log(
      `[CalibrationEngine] Analyzing ${actualData.weeklySpending.length} weeks of data`
    );

    const weeks = Math.min(
      actualData.weeklySpending.length,
      simulatedResults.weeklyRevenue.length
    );

    // Parameter calibrations
    const parameterAdjustments: CalibrationResult[] = [];

    // 1. Weekly budget
    parameterAdjustments.push(this.calibrateWeeklyBudget(actualData));

    // 2. Participation rate
    parameterAdjustments.push(
      this.calibrateParticipationRate(actualData, totalPopulation)
    );

    // 3. Category distribution
    parameterAdjustments.push(...this.calibrateCategoryDistribution(actualData));

    // 4. Group purchase savings
    parameterAdjustments.push(this.validateGroupPurchaseSavings(actualData));

    // Category comparison
    const categoryComparison = this.compareSpending(
      actualData,
      simulatedResults,
      weeks
    );

    // Calculate overall accuracy
    const variances = categoryComparison.map((c) => Math.abs(c.variancePercent));
    const averageVariance = variances.length > 0
      ? variances.reduce((sum, v) => sum + v, 0) / variances.length
      : 0;

    const totalVariance = categoryComparison.reduce(
      (sum, c) => sum + Math.abs(c.variance),
      0
    );

    // Confidence score (0-100): higher is better, based on average variance
    const confidenceScore = Math.max(0, Math.min(100, 100 - averageVariance * 2));
    const confidenceLevel = this.getConfidenceLevel(averageVariance);

    // Generate recommendations
    const recommendations: string[] = [];

    parameterAdjustments.forEach((adj) => {
      if (Math.abs(adj.adjustmentPercent) > 10) {
        recommendations.push(
          `Adjust ${adj.parameter} from ${adj.baseline} to ${adj.calibrated} (${adj.adjustmentPercent > 0 ? '+' : ''}${adj.adjustmentPercent.toFixed(1)}%)`
        );
      }
    });

    if (confidenceLevel === 'low') {
      recommendations.push(
        'Low confidence in projections - consider gathering more data or adjusting model assumptions'
      );
    }

    categoryComparison.forEach((comp) => {
      if (Math.abs(comp.variancePercent) > 25) {
        recommendations.push(
          `${comp.category}: Large variance detected (${comp.variancePercent.toFixed(1)}%) - investigate spending patterns`
        );
      }
    });

    const report: CalibrationReport = {
      modelName,
      calibrationDate: new Date(),
      dataSource: {
        periodStart: actualData.periodStart,
        periodEnd: actualData.periodEnd,
        weeksAnalyzed: weeks,
        totalTransactions: actualData.weeklySpending.reduce(
          (sum, w) => sum + w.transactionCount,
          0
        ),
      },
      overallAccuracy: {
        totalVariance,
        averageVariance,
        confidenceScore,
        confidenceLevel,
      },
      parameterAdjustments,
      categoryComparison,
      recommendations,
    };

    console.log(`[CalibrationEngine] Calibration complete:`);
    console.log(
      `  - Confidence: ${confidenceLevel.toUpperCase()} (${confidenceScore.toFixed(1)}/100)`
    );
    console.log(`  - Average variance: ${averageVariance.toFixed(1)}%`);
    console.log(`  - Parameters adjusted: ${parameterAdjustments.length}`);
    console.log(`  - Recommendations: ${recommendations.length}`);

    return report;
  }

  /**
   * Apply calibration to a projection model
   *
   * Applies calibrated parameters to the model:
   * - weeklyFoodBudget → weeklyRevenuePerParticipant (revenue per participant)
   * - participationRate → participationRate (% of population participating)
   * - groupPurchaseSavingsRate → groupBuyingSavings (% savings from group purchases)
   * - categoryDistribution.* → Not applied to model (informational only, used by
   *   FoodUSDModel internally during simulation)
   *
   * @param model - Original projection model
   * @param calibration - Calibration report with parameter adjustments
   * @returns Calibrated model with updated parameters
   */
  applyCalibration(
    model: ProjectionModel,
    calibration: CalibrationReport
  ): ProjectionModel {
    const calibratedModel = { ...model };

    calibration.parameterAdjustments.forEach((adj) => {
      if (adj.parameter === 'weeklyFoodBudget') {
        // Update weekly revenue per participant (spending = revenue in this model)
        calibratedModel.weeklyRevenuePerParticipant = adj.calibrated;
        console.log(
          `[CalibrationEngine] Updating weekly budget: $${adj.baseline} → $${adj.calibrated}`
        );
      } else if (adj.parameter === 'participationRate') {
        calibratedModel.participationRate = adj.calibrated;
        console.log(
          `[CalibrationEngine] Updating participation: ${(adj.baseline * 100).toFixed(0)}% → ${(adj.calibrated * 100).toFixed(0)}%`
        );
      } else if (adj.parameter.startsWith('categoryDistribution')) {
        // Category distributions are informational only
        // They are used internally by FoodUSDModel during simulation
        // but not stored in ProjectionModel
        console.log(
          `[CalibrationEngine] Category adjustment (informational): ${adj.parameter} = ${(adj.calibrated * 100).toFixed(1)}%`
        );
      } else if (adj.parameter === 'groupPurchaseSavingsRate') {
        // Update group buying savings percentage
        calibratedModel.groupBuyingSavings = adj.calibrated;
        console.log(
          `[CalibrationEngine] Group savings rate: ${(adj.baseline * 100).toFixed(0)}% → ${(adj.calibrated * 100).toFixed(0)}%`
        );
      }
    });

    return calibratedModel;
  }
}

export default CalibrationEngine;
