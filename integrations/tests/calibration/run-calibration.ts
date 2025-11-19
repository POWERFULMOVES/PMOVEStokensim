
import { ProjectionValidator } from '../../projections/projection-validator';
import { CalibrationEngine } from '../../projections/calibration-engine';
import { AI_ENHANCED_LOCAL_SERVICE } from '../../projections/scenario-configs';
import { TransformedData } from '../../firefly/data-transformer';

async function runCalibration() {
  console.log('🚀 Starting Calibration Run (Mocked Data)...');

  const validator = new ProjectionValidator();
  const calibrator = new CalibrationEngine();
  const model = AI_ENHANCED_LOCAL_SERVICE;

  // 1. Run Baseline Simulation
  console.log('\n🔬 Running baseline simulation...');
  const baselineResults = await validator.runSimulation(model, 52);
  console.log(`   ✅ Baseline Revenue (Year 1): $${baselineResults.cumulativeRevenue[51].toLocaleString()}`);

  // 2. Create Mock "Actual" Data (Simulating a scenario where actual spending is higher)
  // We'll simulate that actual spending is $200/week/person instead of the model's assumption
  const mockActualData: TransformedData = {
    periodStart: new Date(),
    periodEnd: new Date(),
    weeklySpending: Array(52).fill(0).map((_, i) => ({
      week: i + 1,
      startDate: new Date(),
      endDate: new Date(),
      totalSpending: 200 * 100, // $200 * 100 participants
      transactionCount: 500,
      participantCount: 100,
      byCategory: {
        groceries: 100 * 100,
        prepared_food: 50 * 100,
        dining: 50 * 100
      }
    })),
    participation: {
      totalParticipants: 100,
      activeParticipants: 100,
      participationRate: 1.0, // Higher than default 0.75
      averageSpendingPerParticipant: 200,
      spendingDistribution: {
        p25: 150,
        p50: 200,
        p75: 250,
        p95: 300
      }
    },
    categoryDistribution: {
      groceries: 50,
      prepared_food: 25,
      dining: 25
    },
    totalSpending: 200 * 100 * 52
  };

  // 3. Calibrate Model
  console.log('\n🎯 Calibrating model...');
  const calibration = await calibrator.calibrate(
    model.name,
    mockActualData,
    baselineResults,
    100 // Total population
  );

  // 4. Run Calibrated Simulation
  console.log('\n🔧 Running calibrated simulation...');
  const calibratedModel = calibrator.applyCalibration(model, calibration);
  const calibratedResults = await validator.runSimulation(calibratedModel, 52);
  
  console.log(`   ✅ Calibrated Revenue (Year 1): $${calibratedResults.cumulativeRevenue[51].toLocaleString()}`);

  // 5. Compare
  const baselineRev = baselineResults.cumulativeRevenue[51];
  const calibratedRev = calibratedResults.cumulativeRevenue[51];
  const diff = calibratedRev - baselineRev;
  const percentDiff = (diff / baselineRev) * 100;

  console.log('\n📊 Comparison:');
  console.log(`   Baseline:   $${baselineRev.toLocaleString()}`);
  console.log(`   Calibrated: $${calibratedRev.toLocaleString()}`);
  console.log(`   Difference: ${diff > 0 ? '+' : ''}$${diff.toLocaleString()} (${percentDiff.toFixed(1)}%)`);

  console.log('\n✅ Calibration Run Complete.');
}

runCalibration().catch(console.error);
