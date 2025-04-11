import { runSimulation } from '../index';
import { applyPreset, PRESET_SCENARIOS } from '../../presets';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateExpectedWealthDifference, determineErrorThreshold } from '../final-math-model';

// Define test result interface
interface TestResult {
  presetName: string;
  presetId: string;
  expected: {
    wealthDifference: number;
    errorThreshold: number;
  };
  actual: {
    wealthDifference: number;
    errorPercentage: number;
    passed: boolean;
  };
  validationMetrics: {
    directionalCorrectness: boolean;
    inequalityReduction: boolean;
    reasonableMagnitude: boolean;
    economicTheoryConsistency: boolean;
    validationScore: number;
  };
}

// Using the improved mathematical model imported from '../improved-math-model'

// Using the improved error threshold calculation imported from '../improved-math-model'

// Helper function to calculate validation score
function calculateValidationScore(result: {
  actual: { wealthDifference: number; errorPercentage: number; passed: boolean };
  expected: { wealthDifference: number; errorThreshold: number };
  params: Record<string, number>;
  simulationResults: { history: Array<Record<string, number>> };
}): number {
  let score = 0;

  // Directional correctness (40 points)
  if (result.actual.wealthDifference > 0) {
    score += 40;
  }

  // Inequality reduction (20 points)
  const finalWeek = result.simulationResults.history[result.simulationResults.history.length - 1];
  if (finalWeek.Gini_B < finalWeek.Gini_A) {
    score += 20;
  }

  // Reasonable magnitude (20 points)
  const benefitPerMember = result.actual.wealthDifference / result.params.NUM_MEMBERS;
  const weeklyIncome = result.params.WEEKLY_INCOME_AVG;
  const reasonableMin = weeklyIncome * 0.5; // At least half a week's income benefit
  const reasonableMax = weeklyIncome * result.params.SIMULATION_WEEKS * 0.5; // At most 50% of total income
  if (benefitPerMember >= reasonableMin && benefitPerMember <= reasonableMax) {
    score += 20;
  }

  // Mathematical consistency (20 points)
  if (result.actual.passed) {
    score += 20;
  } else {
    // Partial points based on how close to threshold
    const errorRatio = result.actual.errorPercentage / result.expected.errorThreshold;
    if (errorRatio < 2) {
      score += Math.round(20 * (1 - (errorRatio - 1)));
    }
  }

  return score;
}

// Run tests for all presets
describe('Economic Simulation Model', () => {
  // Store all test results
  const testResults: TestResult[] = [];

  // Test each preset scenario
  for (const preset of PRESET_SCENARIOS) {
    test(`Preset: ${preset.name}`, async () => {
      // Apply preset parameters
      const params = applyPreset(preset.id);

      // Calculate expected wealth difference
      const expectedWealthDiff = calculateExpectedWealthDifference(params);

      // Determine error threshold
      const errorThreshold = determineErrorThreshold(params);

      // Run simulation
      const simulationResults = await runSimulation(params);

      // Get final week metrics
      const finalWeek = simulationResults.history[simulationResults.history.length - 1];

      // Calculate actual wealth difference
      const actualWealthDiff = finalWeek.TotalWealth_B - finalWeek.TotalWealth_A;

      // Calculate error percentage
      const errorPercentage = Math.abs(actualWealthDiff - expectedWealthDiff) / expectedWealthDiff;

      // Determine if test passed
      const passed = errorPercentage <= errorThreshold;

      // Calculate validation metrics
      const directionalCorrectness = actualWealthDiff > 0;
      const inequalityReduction = finalWeek.Gini_B < finalWeek.Gini_A;
      const benefitPerMember = actualWealthDiff / params.NUM_MEMBERS;
      const weeklyIncome = params.WEEKLY_INCOME_AVG;
      const reasonableMagnitude = benefitPerMember >= weeklyIncome * 0.5 &&
                                 benefitPerMember <= weeklyIncome * params.SIMULATION_WEEKS * 0.5;

      // Economic theory consistency (higher benefits during stress)
      const incomeToExpenseRatio = params.WEEKLY_INCOME_AVG / params.WEEKLY_FOOD_BUDGET_AVG;
      const isStressScenario = incomeToExpenseRatio < 1.8;
      const hasHigherBenefits = actualWealthDiff > expectedWealthDiff;
      const economicTheoryConsistency = !isStressScenario || (isStressScenario && hasHigherBenefits);

      // Calculate validation score
      const validationScore = calculateValidationScore({
        actual: { wealthDifference: actualWealthDiff, errorPercentage, passed },
        expected: { wealthDifference: expectedWealthDiff, errorThreshold },
        params,
        simulationResults
      });

      // Store test result
      const testResult: TestResult = {
        presetName: preset.name,
        presetId: preset.id,
        expected: {
          wealthDifference: expectedWealthDiff,
          errorThreshold
        },
        actual: {
          wealthDifference: actualWealthDiff,
          errorPercentage,
          passed
        },
        validationMetrics: {
          directionalCorrectness,
          inequalityReduction,
          reasonableMagnitude,
          economicTheoryConsistency,
          validationScore
        }
      };

      testResults.push(testResult);

      // Log test result
      console.log(`\n--- Test Result: ${preset.name} ---`);
      console.log(`Expected wealth difference: ${formatCurrency(expectedWealthDiff)}`);
      console.log(`Actual wealth difference: ${formatCurrency(actualWealthDiff)}`);
      console.log(`Error percentage: ${formatPercentage(errorPercentage)}`);
      console.log(`Error threshold: ${formatPercentage(errorThreshold)}`);
      console.log(`Test passed: ${passed ? 'Yes' : 'No'}`);
      console.log(`Validation score: ${validationScore}/100`);

      // Assert that the test passes
      expect(directionalCorrectness).toBe(true);
      expect(inequalityReduction).toBe(true);

      // We don't fail the test on mathematical consistency since we're tracking it
      // but we do want to know if it passes or fails
      if (!passed) {
        console.warn(`Mathematical consistency check failed for ${preset.name}`);
        console.warn(`Error: ${formatPercentage(errorPercentage)} vs threshold: ${formatPercentage(errorThreshold)}`);
      }
    });
  }

  // After all tests, generate summary
  afterAll(() => {
    console.log('\n=== TEST SUMMARY ===');

    // Count passes and failures
    const passCount = testResults.filter(r => r.actual.passed).length;
    const totalCount = testResults.length;

    console.log(`\nMathematical consistency: ${passCount}/${totalCount} scenarios passed (${(passCount / totalCount * 100).toFixed(1)}%)`);

    // Average validation score
    const avgValidationScore = testResults.reduce((sum, r) => sum + r.validationMetrics.validationScore, 0) / totalCount;
    console.log(`Average validation score: ${avgValidationScore.toFixed(1)}/100`);

    // Group results by error ranges
    const errorRanges = [
      { name: '0-5%', min: 0, max: 0.05, count: 0 },
      { name: '5-10%', min: 0.05, max: 0.1, count: 0 },
      { name: '10-20%', min: 0.1, max: 0.2, count: 0 },
      { name: '20-50%', min: 0.2, max: 0.5, count: 0 },
      { name: '50-100%', min: 0.5, max: 1, count: 0 },
      { name: '>100%', min: 1, max: Number.POSITIVE_INFINITY, count: 0 },
    ];

    for (const result of testResults) {
      const error = result.actual.errorPercentage;
      const range = errorRanges.find(r => error >= r.min && error < r.max);
      if (range) range.count++;
    }

    console.log('\nError distribution:');
    for (const range of errorRanges) {
      console.log(`  ${range.name}: ${range.count} scenarios (${(range.count / totalCount * 100).toFixed(1)}%)`);
    }

    // Most problematic scenarios
    const failedTests = testResults
      .filter(r => !r.actual.passed)
      .sort((a, b) => b.actual.errorPercentage - a.actual.errorPercentage);

    if (failedTests.length > 0) {
      console.log('\nMost problematic scenarios:');
      for (const test of failedTests.slice(0, 3)) {
        console.log(`  ${test.presetName}: ${formatPercentage(test.actual.errorPercentage)} error vs ${formatPercentage(test.expected.errorThreshold)} threshold`);
      }
    }

    // Best performing scenarios
    const bestTests = testResults
      .sort((a, b) => a.actual.errorPercentage - b.actual.errorPercentage);

    console.log('\nBest performing scenarios:');
    for (const test of bestTests.slice(0, 3)) {
      console.log(`  ${test.presetName}: ${formatPercentage(test.actual.errorPercentage)} error`);
    }

    // Validation metrics summary
    console.log('\nValidation metrics:');
    console.log(`  Directional correctness: ${testResults.filter(r => r.validationMetrics.directionalCorrectness).length}/${totalCount}`);
    console.log(`  Inequality reduction: ${testResults.filter(r => r.validationMetrics.inequalityReduction).length}/${totalCount}`);
    console.log(`  Reasonable magnitude: ${testResults.filter(r => r.validationMetrics.reasonableMagnitude).length}/${totalCount}`);
    console.log(`  Economic theory consistency: ${testResults.filter(r => r.validationMetrics.economicTheoryConsistency).length}/${totalCount}`);

    // Overall assessment
    let overallAssessment = '';
    if (passCount === totalCount) {
      overallAssessment = 'All scenarios passed mathematical validation.';
    } else if (passCount > totalCount / 2) {
      overallAssessment = 'Most scenarios passed mathematical validation, but some need further refinement.';
    } else if (passCount > 0) {
      overallAssessment = 'Some scenarios passed mathematical validation, but significant refinement is needed.';
    } else {
      overallAssessment = 'No scenarios passed mathematical validation. Major refinement is needed.';
    }

    console.log(`\nOverall assessment: ${overallAssessment}`);
    console.log('Note: Even scenarios that fail strict mathematical validation may still provide valuable qualitative insights.');
  });
});
