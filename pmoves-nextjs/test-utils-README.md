# PMOVES Token Simulator Test Utilities

This directory contains utilities for testing and analyzing the PMOVES Token Simulator.

## Running Tests

### Using PowerShell Scripts

The easiest way to run tests is using the PowerShell scripts:

```powershell
# Run tests and analyze results
.\run-tests.ps1

# Run tests and apply recommended changes
.\apply-recommendations.ps1
```

### Using npm Scripts

You can also use the npm scripts defined in package.json:

```powershell
# Run tests and analyze results
npm run test:simulation

# Run tests and apply recommended changes
npm run test:simulation:apply

# Generate a report of applied changes
npm run test:simulation:report
```

## Test Analysis

The test utilities include a comprehensive analysis system that:

1. Runs all preset scenarios and compares the results to mathematical expectations
2. Calculates error rates and identifies patterns in the results
3. Analyzes which parameters have the strongest correlation with errors
4. Provides recommendations for improving the mathematical model
5. Tracks test results over time to monitor improvements

### Test History

Test results are saved in the `test-history` directory, which includes:

- `test-history.json`: A record of all test runs, including pass rates and error percentages
- `model-adjustments.json`: A record of all adjustments made to the mathematical model
- `applied-changes.md`: A report of changes applied during the last run of `apply-recommendations.ps1`

### Understanding Test Results

The test output includes several sections:

1. **Test Summary**: Overall pass/fail results for each preset scenario
2. **Error Distribution**: Distribution of error percentages across scenarios
3. **Parameter Sensitivity Analysis**: Analysis of which parameters have the strongest correlation with errors
4. **Scenario Analysis**: Detailed analysis of the highest and lowest error scenarios
5. **Economic Stress Analysis**: Special analysis of economic downturn scenarios
6. **Recommendations**: Specific recommendations for improving the mathematical model

### Validation Metrics

Each scenario is evaluated using multiple validation metrics:

1. **Mathematical Consistency**: Whether the actual wealth difference matches the expected difference within a threshold
2. **Directional Correctness**: Whether the cooperative model outperforms the traditional model
3. **Inequality Reduction**: Whether the cooperative model reduces inequality
4. **Reasonable Magnitude**: Whether the benefit per member is within a reasonable range
5. **Economic Theory Consistency**: Whether the results align with economic theory

## Improving the Model

The test analysis system can automatically apply recommended changes to the mathematical model. To do this:

1. Run `.\apply-recommendations.ps1` or `npm run test:simulation:apply`
2. Review the changes in the `test-history/applied-changes.md` file
3. Run the tests again to verify that the changes improved the results

## Adding New Tests

To add a new test scenario:

1. Add a new preset to `src/lib/presets.ts`
2. Run the tests to see how the new scenario performs
3. Adjust the mathematical model if necessary to improve the results
