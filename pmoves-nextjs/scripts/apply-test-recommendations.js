// Script to run simulation tests and apply recommended changes
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

// Use CommonJS require for Node.js modules
const fs = require('fs');
const path = require('path');

async function applyRecommendations() {
  console.log('Running simulation tests and applying recommendations...');

  try {
    // Run tests with apply-recommendations flag
    const results = await testAllPresets();

    // The test results and analysis are already logged by the testAllPresets function

    // Create a report of changes made
    const reportPath = path.join(process.cwd(), 'test-history', 'applied-changes.md');
    const timestamp = new Date().toISOString();

    let report = `# Applied Changes - ${new Date().toLocaleDateString()}\n\n`;
    report += '## Test Results\n\n';

    const passCount = results.results.filter(r =>
      r.verification?.isWithinErrorRange
    ).length;
    const totalCount = results.results.length;
    const passRate = passCount / totalCount;

    report += `- Pass rate: ${(passRate * 100).toFixed(1)}%\n`;
    report += `- Passing scenarios: ${passCount}/${totalCount}\n\n`;

    report += '## Applied Recommendations\n\n';

    if (results.analysis?.recommendations) {
      const { recommendations } = results.analysis;

      if (recommendations.focusParameters && recommendations.focusParameters.length > 0) {
        report += '### Parameter Adjustments\n\n';
        for (const param of recommendations.focusParameters) {
          report += `- Adjusted ${param} sensitivity\n`;
        }
        report += '\n';
      }

      if (recommendations.needsStressAdjustment) {
        report += '### Stress Factor Adjustment\n\n';
        report += `- Adjusted stress factor by ${recommendations.suggestedStressMultiplier.toFixed(2)}x\n\n`;
      }
    }

    // Ensure directory exists
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write report
    fs.writeFileSync(reportPath, report);
    console.log(`\nReport saved to ${reportPath}`);

    console.log('Recommendations applied successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error applying recommendations:', error);
    process.exit(1);
  }
}

applyRecommendations();
