/**
 * Example Usage of PMOVES Integrations
 * This file demonstrates how to use all integration components
 */

import { IntegrationCoordinator } from './integration-coordinator';
import path from 'path';

async function main() {
  console.log('=== PMOVES Integrations Example ===\n');

  // 1. Create Integration Coordinator
  console.log('1. Creating Integration Coordinator...');

  const coordinator = new IntegrationCoordinator({
    projectRoot: path.join(__dirname, '..'),

    eventBus: {
      validateSchemas: true,
      maxRetries: 3,
    },

    firefly: {
      baseUrl: process.env.FIREFLY_BASE_URL || 'http://firefly:8080',
      apiToken: process.env.FIREFLY_API_TOKEN || '',
      apiVersion: 'v1',
      timeout: 30000,
      retryCount: 3,
    },

    dox: {
      baseUrl: process.env.DOX_BASE_URL || 'http://dox:8000',
      timeout: 120000,
      retryCount: 3,
    },

    // Uncomment when contracts are deployed
    // contracts: {
    //   network: {
    //     name: 'localhost',
    //     rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545',
    //     pollingInterval: 5000,
    //   },
    //   contracts: [
    //     {
    //       name: 'GroToken',
    //       address: process.env.GROTOKEN_ADDRESS || '',
    //       abi: require('../contracts/solidity/artifacts/GroToken.json').abi,
    //       events: ['Transfer'],
    //     },
    //     {
    //       name: 'GroupPurchase',
    //       address: process.env.GROUPPURCHASE_ADDRESS || '',
    //       abi: require('../contracts/solidity/artifacts/GroupPurchase.json').abi,
    //       events: ['OrderCreated', 'ContributionReceived', 'OrderExecuted'],
    //     },
    //   ],
    // },
  });

  // 2. Initialize
  console.log('2. Initializing integrations...');
  await coordinator.initialize();

  // 3. Subscribe to Events
  console.log('\n3. Setting up event subscriptions...');

  const eventBus = coordinator.getEventBus();

  // Subscribe to finance transactions
  const unsubscribeTransactions = eventBus.subscribe(
    'finance.transactions.ingested.v1',
    async (event) => {
      console.log(
        `\n[Event] Received transactions from ${event.source}:`,
        event.data.transactions.length,
        'transactions'
      );
    }
  );

  // Subscribe to monthly summaries
  const unsubscribeSummaries = eventBus.subscribe(
    'finance.monthly.summary.v1',
    async (event) => {
      console.log(`\n[Event] Monthly summary for ${event.data.month}:`);
      console.log('  Income:', event.data.totals.income);
      console.log('  Spend:', event.data.totals.spend);
      console.log('  Savings:', event.data.totals.savings);
    }
  );

  // 4. Publish Sample Events
  console.log('\n4. Publishing sample events...');

  await eventBus.publish(
    'finance.transactions.ingested.v1',
    {
      namespace: 'example',
      transactions: [
        {
          id: 'tx1',
          amount: 50.0,
          category: 'food',
          date: new Date().toISOString(),
          description: 'Grocery shopping',
          source: 'checking',
          destination: 'grocery_store',
        },
      ],
      ingested_at: new Date().toISOString(),
    },
    'example-app'
  );

  await eventBus.publish(
    'finance.monthly.summary.v1',
    {
      namespace: 'example',
      month: '2025-11',
      currency: 'USD',
      totals: {
        income: 5000,
        spend: 3200,
        savings: 1800,
      },
      by_category: [
        {
          category: 'food',
          spend: 800,
          budget: 1000,
          variance: -200,
        },
        {
          category: 'housing',
          spend: 1200,
          budget: 1200,
          variance: 0,
        },
      ],
    },
    'example-app'
  );

  // 5. Validate Simulation (if Firefly-iii is available)
  console.log('\n5. Validating simulation...');

  try {
    const validation = await coordinator.validateSimulation({
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
      spendingByCategory: {
        food: 800,
        housing: 1200,
        transportation: 300,
        utilities: 150,
      },
      totalSavings: 500,
    });

    console.log('Validation Results:');
    console.log('  Status:', validation.validationStatus);
    console.log('  Spending Variance:', (validation.spendingVariance * 100).toFixed(2), '%');
    console.log('  Savings Variance:', (validation.savingsVariance * 100).toFixed(2), '%');
    console.log('  Recommendations:', validation.recommendations);
  } catch (error) {
    console.log('Validation skipped (Firefly-iii not available)');
  }

  // 6. Analyze with DoX (if DoX is available)
  console.log('\n6. Analyzing simulation results with DoX...');

  try {
    const csvData = `week,gini,poverty_rate,avg_wealth,median_wealth
1,0.45,0.20,5000,4200
2,0.43,0.18,5200,4400
3,0.42,0.17,5350,4550
4,0.41,0.16,5500,4700
5,0.40,0.15,5650,4850`;

    const analysis = await coordinator.analyzeSimulationResults(
      csvData,
      'Example Baseline Scenario'
    );

    console.log('DoX Analysis Results:');
    console.log('  Document ID:', analysis.documentId);
    console.log('  Dashboard URL:', analysis.dashboardUrl);
    console.log('  Insights:', analysis.insights);
  } catch (error) {
    console.log('DoX analysis skipped (DoX not available)');
  }

  // 7. Compare Scenarios (if DoX is available)
  console.log('\n7. Comparing multiple scenarios...');

  try {
    const baselineCSV = `week,gini,poverty_rate
1,0.45,0.20
2,0.44,0.19
3,0.43,0.18`;

    const tokenCSV = `week,gini,poverty_rate
1,0.45,0.20
2,0.42,0.17
3,0.39,0.15`;

    const comparison = await coordinator.compareScenarios([
      { name: 'Baseline', csvData: baselineCSV },
      { name: 'With GroToken', csvData: tokenCSV },
    ]);

    console.log('Scenario Comparison:');
    console.log('  Dashboard:', comparison.dashboardUrl);
    console.log('  Comparison:', comparison.comparison);
    console.log('  Recommendations:', comparison.recommendations);
  } catch (error) {
    console.log('Scenario comparison skipped (DoX not available)');
  }

  // 8. Display Metrics
  console.log('\n8. Event Bus Metrics:');
  const metrics = coordinator.getMetrics();

  for (const [key, value] of Object.entries(metrics)) {
    console.log(`  ${key}: ${value}`);
  }

  // 9. Access Individual Clients
  console.log('\n9. Testing individual clients...');

  const firefly = coordinator.getFireflyClient();
  if (firefly) {
    try {
      const connected = await firefly.testConnection();
      console.log('  Firefly-iii:', connected ? 'Connected' : 'Not connected');
    } catch (error) {
      console.log('  Firefly-iii: Not available');
    }
  }

  const dox = coordinator.getDoXClient();
  if (dox) {
    try {
      const connected = await dox.testConnection();
      console.log('  DoX:', connected ? 'Connected' : 'Not connected');
    } catch (error) {
      console.log('  DoX: Not available');
    }
  }

  // 10. Cleanup
  console.log('\n10. Cleaning up...');

  unsubscribeTransactions();
  unsubscribeSummaries();

  await coordinator.shutdown();

  console.log('\n=== Example Complete ===');
}

// Run example
if (require.main === module) {
  main()
    .then(() => {
      console.log('\nExample completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nExample failed:', error);
      process.exit(1);
    });
}

export default main;
