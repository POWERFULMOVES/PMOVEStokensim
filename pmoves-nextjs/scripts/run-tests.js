// Script to run simulation tests and analyze results
let testAllPresets;

try {
  // Import the test utilities
  const testUtils = require('../dist/lib/simulation/test-utils');
  testAllPresets = testUtils.testAllPresets;
} catch (error) {
  console.error('Error loading modules. Make sure you have run "npm run build" or "tsc" first.');
  console.error(error);
  process.exit(1);
}

async function runTests() {
  console.log('Running simulation tests and analysis...');

  try {
    const results = await testAllPresets();

    // The test results and analysis are already logged by the testAllPresets function

    // Exit with appropriate code based on pass rate
    const passCount = results.results.filter(r =>
      r.verification?.isWithinErrorRange
    ).length;
    const totalCount = results.results.length;
    const passRate = passCount / totalCount;

    console.log(`\nTest pass rate: ${(passRate * 100).toFixed(1)}%`);

    // Exit with non-zero code if pass rate is below threshold
    if (passRate < 0.5) {
      console.log('Pass rate is below 50%. Exiting with error code.');
      process.exit(1);
    }

    console.log('Tests completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

runTests();
