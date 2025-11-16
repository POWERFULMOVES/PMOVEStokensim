/**
 * Firefly-iii Integration Runner
 *
 * Example script showing how to run the Firefly-iii integration
 * to calibrate PMOVES projections with real financial data
 */

import 'dotenv/config'; // Load environment variables from .env file
import FireflyIntegration from './firefly-integration';
import { AI_ENHANCED_LOCAL_SERVICE } from '../projections/scenario-configs';

/**
 * Main integration execution
 */
async function runIntegration(): Promise<void> {
  // Configuration
  const config = {
    firefly: {
      baseUrl: process.env.FIREFLY_URL || 'http://localhost:8080',
      apiToken: process.env.FIREFLY_API_TOKEN || '',
    },
    analysis: {
      // Analyze last 3 months
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      totalPopulation: parseInt(process.env.TOTAL_POPULATION || '500', 10),
    },
    output: {
      directory: './output/firefly-calibration',
      generateCSV: true,
      generateMarkdown: true,
    },
  };

  // Validate API token
  if (!config.firefly.apiToken) {
    console.error('❌ Error: FIREFLY_API_TOKEN environment variable not set');
    console.error('');
    console.error('Setup options:');
    console.error('');
    console.error('Option 1: Create .env file (recommended)');
    console.error('  1. Copy .env.example to .env: cp .env.example .env');
    console.error('  2. Edit .env and set FIREFLY_API_TOKEN=your_token');
    console.error('  3. Run: npm run firefly:calibrate');
    console.error('');
    console.error('Option 2: Export environment variable');
    console.error('  export FIREFLY_API_TOKEN=your_token');
    console.error('  npm run firefly:calibrate');
    console.error('');
    console.error('Option 3: Inline with command');
    console.error('  FIREFLY_API_TOKEN=your_token npm run firefly:calibrate');
    console.error('');
    console.error('To get your Firefly-iii API token:');
    console.error('  1. Log in to your Firefly-iii instance');
    console.error('  2. Go to Options > Profile > OAuth');
    console.error('  3. Create a new Personal Access Token');
    console.error('  4. Copy the token and use it as FIREFLY_API_TOKEN');
    process.exit(1);
  }

  try {
    // Create integration instance
    const integration = new FireflyIntegration(config);

    // Run integration with AI-Enhanced Local Service model
    console.log(
      'Using model: AI-Enhanced Local Service Business'
    );
    console.log(
      `Firefly URL: ${config.firefly.baseUrl}`
    );
    console.log(
      `Analysis period: ${config.analysis.startDate.toISOString().split('T')[0]} to ${config.analysis.endDate.toISOString().split('T')[0]}`
    );
    console.log(
      `Total population: ${config.analysis.totalPopulation}`
    );

    const result = await integration.run(AI_ENHANCED_LOCAL_SERVICE);

    // Print summary
    console.log('');
    console.log('📊 CALIBRATION SUMMARY');
    console.log('='.repeat(80));
    console.log('');

    const cal = result.calibrated.calibration;

    console.log('Overall Accuracy:');
    console.log(
      `  Confidence Level: ${cal.overallAccuracy.confidenceLevel.toUpperCase()}`
    );
    console.log(
      `  Confidence Score: ${cal.overallAccuracy.confidenceScore.toFixed(1)}/100`
    );
    console.log(
      `  Average Variance: ${cal.overallAccuracy.averageVariance.toFixed(1)}%`
    );
    console.log('');

    console.log('Top Parameter Adjustments:');
    cal.parameterAdjustments
      .filter((adj) => Math.abs(adj.adjustmentPercent) > 5)
      .forEach((adj) => {
        const sign = adj.adjustmentPercent > 0 ? '+' : '';
        console.log(
          `  ${adj.parameter}: ${adj.baseline} → ${adj.calibrated} (${sign}${adj.adjustmentPercent.toFixed(1)}%)`
        );
      });

    console.log('');
    console.log('Category Performance:');
    cal.categoryComparison.slice(0, 5).forEach((comp) => {
      const sign = comp.variancePercent > 0 ? '+' : '';
      console.log(
        `  ${comp.category}: ${sign}${comp.variancePercent.toFixed(1)}% variance`
      );
    });

    console.log('');
    console.log('Recommendations:');
    cal.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });

    console.log('');
    console.log(`✅ Reports saved to: ${config.output.directory}`);
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Integration failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runIntegration().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { runIntegration };
