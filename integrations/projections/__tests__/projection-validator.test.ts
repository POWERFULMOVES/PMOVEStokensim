/**
 * Projection Validator Tests
 */

import { ProjectionValidator, ProjectionModel } from '../projection-validator';
import {
  AI_ENHANCED_LOCAL_SERVICE,
  ENERGY_CONSULTING,
  TOKEN_PRE_ORDER,
} from '../scenario-configs';

describe('ProjectionValidator', () => {
  let validator: ProjectionValidator;

  beforeEach(() => {
    validator = new ProjectionValidator();
  });

  describe('simulation execution', () => {
    it('should run 5-year simulation successfully', async () => {
      const testModel: ProjectionModel = {
        name: 'Test Model',
        description: 'Simple test model',
        initialInvestment: 1000,
        projectedYear5Revenue: 10000,
        projectedRiskAdjustedROI: 5.0,
        projectedBreakEvenMonths: 6,
        successProbability: 0.70,
        populationSize: 100,
        participationRate: 0.50,
        weeklyRevenuePerParticipant: 0.5,
        growthRatePerWeek: 0.01,
      };

      const results = await validator.runSimulation(testModel, 52); // 1 year test

      expect(results.totalWeeks).toBe(52);
      expect(results.finalRevenue).toBeGreaterThan(0);
      expect(results.totalCosts).toBeGreaterThan(0);
      expect(results.netProfit).toBeDefined();
      expect(results.actualROI).toBeDefined();
      expect(results.weeklyRevenue.length).toBe(52);
      expect(results.cumulativeRevenue.length).toBe(52);
    });

    it('should track break-even point', async () => {
      const testModel: ProjectionModel = {
        name: 'Test Model',
        description: 'Test break-even',
        initialInvestment: 1000,
        projectedYear5Revenue: 50000,
        projectedRiskAdjustedROI: 10.0,
        projectedBreakEvenMonths: 3,
        successProbability: 0.80,
        populationSize: 200,
        participationRate: 0.60,
        weeklyRevenuePerParticipant: 1.0,
        growthRatePerWeek: 0.02,
      };

      const results = await validator.runSimulation(testModel, 52);

      expect(results.breakEvenWeek).toBeDefined();
      expect(results.breakEvenWeek).toBeGreaterThan(0);
      expect(results.breakEvenWeek).toBeLessThan(52);
    });

    it('should include token metrics', async () => {
      const results = await validator.runSimulation(AI_ENHANCED_LOCAL_SERVICE, 52);

      expect(results.tokenMetrics).toBeDefined();
      expect(results.tokenMetrics?.totalDistributed).toBeGreaterThanOrEqual(0);
      expect(results.tokenMetrics?.totalValue).toBeGreaterThanOrEqual(0);
      expect(results.tokenMetrics?.activeParticipants).toBeGreaterThanOrEqual(0);
    });
  });

  describe('validation reports', () => {
    it('should generate validation report for AI service model', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      expect(report.modelName).toBe(AI_ENHANCED_LOCAL_SERVICE.name);
      expect(report.projections).toBeDefined();
      expect(report.actual).toBeDefined();
      expect(report.variance).toBeDefined();
      expect(report.riskAssessment).toBeDefined();
      expect(report.analysis).toBeDefined();
    });

    it('should calculate variance correctly', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      expect(report.variance.revenueVariance).toBeDefined();
      expect(report.variance.roiVariance).toBeDefined();
      expect(typeof report.variance.revenueVariance).toBe('number');
      expect(typeof report.variance.roiVariance).toBe('number');
    });

    it('should assess confidence level', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      expect(report.riskAssessment.confidenceLevel).toMatch(/^(high|medium|low)$/);
    });

    it('should identify risk factors', async () => {
      const report = await validator.validate(TOKEN_PRE_ORDER);

      expect(Array.isArray(report.riskAssessment.riskFactors)).toBe(true);
      expect(Array.isArray(report.riskAssessment.mitigationRecommendations)).toBe(true);

      // Token model with lower participation should have risk factors
      if (TOKEN_PRE_ORDER.participationRate < 0.5) {
        expect(report.riskAssessment.riskFactors.length).toBeGreaterThan(0);
      }
    });

    it('should analyze growth pattern', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      expect(report.analysis.revenueGrowthPattern).toMatch(
        /^(linear|exponential|plateau|declining)$/
      );
    });

    it('should analyze profitability trend', async () => {
      const report = await validator.validate(ENERGY_CONSULTING);

      expect(report.analysis.profitabilityTrend).toMatch(
        /^(improving|stable|declining)$/
      );
    });

    it('should determine market scenario', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      expect(report.analysis.marketScenario).toMatch(/^(bull|normal|bear)$/);
    });
  });

  describe('model comparison', () => {
    it('should compare multiple models', async () => {
      const models = [AI_ENHANCED_LOCAL_SERVICE, ENERGY_CONSULTING];

      const comparison = await validator.compareModels(models);

      expect(comparison.models.length).toBe(2);
      expect(comparison.ranking.length).toBe(2);
      expect(comparison.recommendations.length).toBeGreaterThan(0);
    });

    it('should rank models by score', async () => {
      const models = [
        AI_ENHANCED_LOCAL_SERVICE,
        ENERGY_CONSULTING,
        TOKEN_PRE_ORDER,
      ];

      const comparison = await validator.compareModels(models);

      // Rankings should be sorted by score
      for (let i = 1; i < comparison.ranking.length; i++) {
        expect(comparison.ranking[i - 1].score).toBeGreaterThanOrEqual(
          comparison.ranking[i].score
        );
      }
    });

    it('should generate meaningful recommendations', async () => {
      const models = [AI_ENHANCED_LOCAL_SERVICE, TOKEN_PRE_ORDER];

      const comparison = await validator.compareModels(models);

      // Should recommend the best model
      expect(comparison.recommendations[0]).toContain('Primary recommendation:');

      // Should mention model name
      const bestModel = comparison.ranking[0].name;
      expect(comparison.recommendations[0]).toContain(bestModel);
    });

    it('should identify high confidence models', async () => {
      const models = [
        AI_ENHANCED_LOCAL_SERVICE,
        ENERGY_CONSULTING,
        TOKEN_PRE_ORDER,
      ];

      const comparison = await validator.compareModels(models);

      const highConfidenceRec = comparison.recommendations.find(r =>
        r.includes('High confidence')
      );

      // If there are any high confidence models, should mention them
      const highConfidenceCount = comparison.models.filter(
        m => m.riskAssessment.confidenceLevel === 'high'
      ).length;

      if (highConfidenceCount > 0) {
        expect(highConfidenceRec).toBeDefined();
      }
    });
  });

  describe('token economy impact', () => {
    it('should detect positive token impact', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      if (report.analysis.tokenEconomyImpact) {
        expect(report.analysis.tokenEconomyImpact).toMatch(/^(positive|neutral|negative)$/);
      }
    });

    it('should track token distribution in simulation', async () => {
      const results = await validator.runSimulation(AI_ENHANCED_LOCAL_SERVICE, 52);

      expect(results.tokenMetrics).toBeDefined();

      if (AI_ENHANCED_LOCAL_SERVICE.tokenDistributionRate && AI_ENHANCED_LOCAL_SERVICE.tokenDistributionRate > 0) {
        expect(results.tokenMetrics?.totalDistributed).toBeGreaterThan(0);
      }
    });
  });

  describe('break-even analysis', () => {
    it('should calculate break-even correctly', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      if (report.actual.breakEvenMonths) {
        // Break-even should be positive
        expect(report.actual.breakEvenMonths).toBeGreaterThan(0);

        // Should be within reasonable range (5 years = 60 months)
        expect(report.actual.breakEvenMonths).toBeLessThan(60);
      }
    });

    it('should compare break-even vs projection', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      expect(report.projections.breakEvenMonths).toBe(
        AI_ENHANCED_LOCAL_SERVICE.projectedBreakEvenMonths
      );

      if (report.actual.breakEvenMonths && report.variance.breakEvenVariance !== null) {
        const calculatedVariance =
          ((report.actual.breakEvenMonths - report.projections.breakEvenMonths) /
            report.projections.breakEvenMonths) * 100;

        expect(report.variance.breakEvenVariance).toBeCloseTo(calculatedVariance, 1);
      }
    });
  });

  describe('success criteria', () => {
    it('should evaluate success achievement', async () => {
      const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

      expect(typeof report.riskAssessment.achievedSuccessProbability).toBe('boolean');
    });

    it('should consider ROI in success evaluation', async () => {
      const highROIModel: ProjectionModel = {
        ...AI_ENHANCED_LOCAL_SERVICE,
        projectedRiskAdjustedROI: 1.0, // Very low target (100%)
      };

      const report = await validator.validate(highROIModel);

      // With such a low target, should achieve success
      expect(report.riskAssessment.achievedSuccessProbability).toBe(true);
    });

    it('should provide recommendations for unsuccessful models', async () => {
      const report = await validator.validate(TOKEN_PRE_ORDER);

      if (!report.riskAssessment.achievedSuccessProbability) {
        expect(report.riskAssessment.mitigationRecommendations.length).toBeGreaterThan(0);
      }
    });
  });
});
