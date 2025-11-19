
import { CalibrationEngine } from '../../projections/calibration-engine';
import { ProjectionModel } from '../../projections/projection-validator';
import { TransformedData } from '../../firefly/data-transformer';

describe('CalibrationEngine', () => {
  let engine: CalibrationEngine;
  let mockModel: ProjectionModel;
  let mockData: TransformedData;

  beforeEach(() => {
    engine = new CalibrationEngine();
    
    mockModel = {
      name: 'Test Model',
      description: 'Test Description',
      initialInvestment: 10000,
      projectedYear5Revenue: 100000,
      projectedRiskAdjustedROI: 5.0,
      projectedBreakEvenMonths: 12,
      successProbability: 0.8,
      populationSize: 100,
      participationRate: 0.5,
      weeklyRevenuePerParticipant: 20,
      growthRatePerWeek: 0.01,
      groupBuyingSavings: 0.15,
      tokenDistributionRate: 0.5
    };

    mockData = {
      periodStart: new Date(),
      periodEnd: new Date(),
      weeklySpending: [
        {
          week: 1,
          startDate: new Date(),
          endDate: new Date(),
          totalSpending: 200,
          transactionCount: 8,
          participantCount: 1,
          byCategory: {
            groceries: 100,
            prepared_food: 50,
            dining: 50
          }
        }
      ],
      categoryDistribution: {
        groceries: 0.5,
        prepared_food: 0.25,
        dining: 0.25
      },
      participation: {
        totalParticipants: 100,
        activeParticipants: 1,
        participationRate: 0.01,
        averageSpendingPerParticipant: 200,
        spendingDistribution: {
          p25: 100,
          p50: 200,
          p75: 300,
          p95: 400
        }
      },
      totalSpending: 200
    };
  });

  describe('calibrateWeeklyBudget', () => {
    it('should adjust weekly revenue based on actual spending data', () => {
      const result = engine.calibrateWeeklyBudget(mockData);
      
      // Total weekly spending = 200
      // Active participants = 1
      // Average per participant = 200
      
      expect(result.parameter).toBe('weeklyFoodBudget');
      expect(result.baseline).toBe(150); // Default baseline in engine
      expect(result.calibrated).toBe(200);
      expect(result.adjustment).toBe(50);
    });
  });

  describe('calibrateParticipationRate', () => {
    it('should adjust participation rate based on actual data', () => {
      const totalPopulation = 100;
      const result = engine.calibrateParticipationRate(mockData, totalPopulation);
      
      expect(result.parameter).toBe('participationRate');
      expect(result.baseline).toBe(0.75); // Default baseline in engine
      expect(result.calibrated).toBe(0.01); // From mockData
    });
  });

  describe('applyCalibration', () => {
    it('should return a new model with updated parameters', () => {
      const calibrationReport = {
        modelName: 'Test Model',
        calibrationDate: new Date(),
        dataSource: {
          periodStart: new Date(),
          periodEnd: new Date(),
          weeksAnalyzed: 52,
          totalTransactions: 1000
        },
        overallAccuracy: {
          totalVariance: 0,
          averageVariance: 0,
          confidenceScore: 100,
          confidenceLevel: 'high' as const
        },
        parameterAdjustments: [
          {
            parameter: 'weeklyRevenuePerParticipant', // Note: engine maps 'weeklyFoodBudget' to this
            baseline: 20,
            calibrated: 50,
            adjustment: 30,
            adjustmentPercent: 150,
            confidence: 'high' as const,
            reasoning: 'Test'
          }
        ],
        categoryComparison: [],
        recommendations: []
      };

      // The engine expects 'weeklyFoodBudget' to map to 'weeklyRevenuePerParticipant'
      calibrationReport.parameterAdjustments[0].parameter = 'weeklyFoodBudget';

      const newModel = engine.applyCalibration(mockModel, calibrationReport);
      
      expect(newModel).not.toBe(mockModel);
      expect(newModel.weeklyRevenuePerParticipant).toBe(50);
      expect(newModel.populationSize).toBe(100); // Unchanged
    });
  });
});
