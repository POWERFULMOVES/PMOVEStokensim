/**
 * Integration Coordinator
 * Orchestrates all integrations: Event Bus, Contracts, Firefly-iii, and DoX
 */

import { EventBus } from './event-bus/event-bus';
import { FireflyClient, FireflyConfig } from './firefly/firefly-client';
import { DoXClient, DoXConfig } from './dox/dox-client';
import { ContractEventListener, ContractConfig, NetworkConfig } from './contracts/contract-listeners';
import path from 'path';

export interface IntegrationConfig {
  projectRoot: string;
  eventBus: {
    validateSchemas: boolean;
    maxRetries: number;
  };
  firefly?: Partial<FireflyConfig>;
  dox?: Partial<DoXConfig>;
  contracts?: {
    network: NetworkConfig;
    contracts: ContractConfig[];
  };
}

export class IntegrationCoordinator {
  private eventBus: EventBus;
  private fireflyClient?: FireflyClient;
  private doxClient?: DoXClient;
  private contractListener?: ContractEventListener;
  private config: IntegrationConfig;
  private isInitialized: boolean = false;

  constructor(config: IntegrationConfig) {
    this.config = config;

    // Initialize Event Bus
    this.eventBus = new EventBus({
      validateSchemas: config.eventBus.validateSchemas,
      maxRetries: config.eventBus.maxRetries,
      enableMetrics: true,
    });

    // Initialize Firefly client if configured
    if (config.firefly) {
      this.fireflyClient = new FireflyClient(config.firefly);
    }

    // Initialize DoX client if configured
    if (config.dox) {
      this.doxClient = new DoXClient(config.dox);
    }

    // Initialize Contract listener if configured
    if (config.contracts) {
      this.contractListener = new ContractEventListener(
        this.eventBus,
        config.contracts.network
      );

      // Add all contracts
      config.contracts.contracts.forEach((contractConfig) => {
        this.contractListener!.addContract(contractConfig);
      });
    }

    console.log('[IntegrationCoordinator] Created');
  }

  /**
   * Initialize all integrations
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('[IntegrationCoordinator] Already initialized');
      return;
    }

    console.log('[IntegrationCoordinator] Initializing...');

    // Initialize Event Bus with schemas
    await this.eventBus.initialize(this.config.projectRoot);

    // Test connections
    if (this.fireflyClient) {
      const fireflyConnected = await this.fireflyClient.testConnection();
      if (!fireflyConnected) {
        console.warn('[IntegrationCoordinator] Firefly-iii connection failed');
      }
    }

    if (this.doxClient) {
      const doxConnected = await this.doxClient.testConnection();
      if (!doxConnected) {
        console.warn('[IntegrationCoordinator] DoX connection failed');
      }
    }

    // Set up event handlers
    this.setupEventHandlers();

    this.isInitialized = true;
    console.log('[IntegrationCoordinator] Initialized successfully');
  }

  /**
   * Set up event handlers for cross-system integration
   */
  private setupEventHandlers(): void {
    // Handle finance transactions - send to DoX for analysis
    this.eventBus.subscribe(
      'finance.transactions.ingested.v1',
      async (event) => {
        console.log(
          `[IntegrationCoordinator] Received finance transactions from ${event.source}`
        );

        // Optionally upload to DoX for analysis
        if (this.doxClient && this.config.dox) {
          // Could aggregate transactions and periodically upload CSV to DoX
        }
      }
    );

    // Handle monthly summaries - generate reports
    this.eventBus.subscribe('finance.monthly.summary.v1', async (event) => {
      console.log(
        `[IntegrationCoordinator] Received monthly summary for ${event.data.month}`
      );

      // Generate analysis report
      if (this.doxClient) {
        // Could generate insights using DoX Q&A
      }
    });

    // Global error handler
    this.eventBus.on('event:failed', ({ event, error }) => {
      console.error(
        `[IntegrationCoordinator] Event ${event.id} failed permanently:`,
        error
      );
    });
  }

  /**
   * Validate simulation against Firefly-iii data
   */
  async validateSimulation(
    simulationData: {
      startDate: Date;
      endDate: Date;
      spendingByCategory: Record<string, number>;
      totalSavings: number;
    }
  ): Promise<{
    spendingVariance: number;
    savingsVariance: number;
    validationStatus: 'PASS' | 'REVIEW' | 'FAIL';
    recommendations: string[];
  }> {
    if (!this.fireflyClient) {
      throw new Error('Firefly-iii not configured');
    }

    // Get actual data from Firefly
    const actualSpending = await this.fireflyClient.getSpendingByCategory(
      simulationData.startDate,
      simulationData.endDate
    );

    const actualSavings = await this.fireflyClient.getSavingsProgress();

    // Calculate variances
    let totalVariance = 0;
    let categoryCount = 0;

    const actualSpendingMap = actualSpending.reduce(
      (map, item) => {
        map[item.category.toLowerCase()] = item.amount;
        return map;
      },
      {} as Record<string, number>
    );

    for (const [category, simulatedAmount] of Object.entries(
      simulationData.spendingByCategory
    )) {
      const actualAmount = actualSpendingMap[category.toLowerCase()] || 0;

      if (simulatedAmount > 0) {
        const variance =
          Math.abs(actualAmount - simulatedAmount) / simulatedAmount;
        totalVariance += variance;
        categoryCount++;
      }
    }

    const spendingVariance = categoryCount > 0 ? totalVariance / categoryCount : 0;

    const savingsVariance =
      Math.abs(actualSavings.totalSavings - simulationData.totalSavings) /
      Math.max(simulationData.totalSavings, 1);

    // Determine validation status
    let validationStatus: 'PASS' | 'REVIEW' | 'FAIL' = 'PASS';
    const recommendations: string[] = [];

    if (spendingVariance > 0.3) {
      validationStatus = 'FAIL';
      recommendations.push(
        `Spending variance too high: ${(spendingVariance * 100).toFixed(1)}%`
      );
    } else if (spendingVariance > 0.2) {
      validationStatus = 'REVIEW';
      recommendations.push(
        `Spending variance above threshold: ${(spendingVariance * 100).toFixed(1)}%`
      );
    }

    if (savingsVariance > 0.2) {
      recommendations.push(
        `Savings variance: ${(savingsVariance * 100).toFixed(1)}%`
      );
    }

    return {
      spendingVariance,
      savingsVariance,
      validationStatus,
      recommendations,
    };
  }

  /**
   * Analyze simulation results with DoX
   */
  async analyzeSimulationResults(csvData: string, title: string): Promise<{
    documentId: string;
    dashboardUrl: string;
    insights: string;
  }> {
    if (!this.doxClient) {
      throw new Error('DoX not configured');
    }

    // Upload CSV to DoX
    const upload = await this.doxClient.upload(
      Buffer.from(csvData),
      `${title}.csv`,
      'csv'
    );

    // Generate dashboard
    const dashboard = await this.doxClient.generateDashboard({
      documentIds: [upload.id],
      title,
      metrics: ['gini', 'poverty_rate', 'wealth_distribution'],
    });

    // Ask for insights
    const qaResponse = await this.doxClient.ask(
      upload.id,
      'What are the key insights from this economic simulation?'
    );

    return {
      documentId: upload.id,
      dashboardUrl: dashboard.url,
      insights: qaResponse.answer,
    };
  }

  /**
   * Compare multiple simulation scenarios
   */
  async compareScenarios(
    scenarios: Array<{ name: string; csvData: string }>
  ): Promise<{
    dashboardUrl: string;
    comparison: string;
    recommendations: string;
  }> {
    if (!this.doxClient) {
      throw new Error('DoX not configured');
    }

    // Upload all scenarios
    const uploads = await Promise.all(
      scenarios.map((scenario) =>
        this.doxClient!.upload(
          Buffer.from(scenario.csvData),
          `${scenario.name}.csv`,
          'csv'
        )
      )
    );

    const documentIds = uploads.map((u) => u.id);

    // Run CHR clustering
    const clustering = await this.doxClient.runCHR({
      documentIds,
      kMeans: Math.min(scenarios.length, 5),
      iterations: 100,
    });

    // Generate comparison dashboard
    const dashboard = await this.doxClient.generateDashboard({
      clusteringResult: clustering,
      title: 'Multi-Scenario Comparison',
      metrics: ['gini', 'poverty_rate', 'wealth_distribution'],
    });

    // Get comparison insights
    const comparison = await this.doxClient.ask(
      documentIds,
      'Compare these scenarios and identify the best performing one in terms of wealth equality and poverty reduction.'
    );

    // Get recommendations
    const recommendations = await this.doxClient.ask(
      documentIds,
      'What are the key recommendations based on these simulation results?'
    );

    return {
      dashboardUrl: dashboard.url,
      comparison: comparison.answer,
      recommendations: recommendations.answer,
    };
  }

  /**
   * Get Event Bus metrics
   */
  getMetrics(): Record<string, number> {
    return this.eventBus.getMetrics();
  }

  /**
   * Get Event Bus instance
   */
  getEventBus(): EventBus {
    return this.eventBus;
  }

  /**
   * Get Firefly client
   */
  getFireflyClient(): FireflyClient | undefined {
    return this.fireflyClient;
  }

  /**
   * Get DoX client
   */
  getDoXClient(): DoXClient | undefined {
    return this.doxClient;
  }

  /**
   * Get Contract listener
   */
  getContractListener(): ContractEventListener | undefined {
    return this.contractListener;
  }

  /**
   * Shutdown all integrations
   */
  async shutdown(): Promise<void> {
    console.log('[IntegrationCoordinator] Shutting down...');

    if (this.contractListener) {
      await this.contractListener.stop();
    }

    await this.eventBus.shutdown();

    this.isInitialized = false;
    console.log('[IntegrationCoordinator] Shutdown complete');
  }
}

export default IntegrationCoordinator;
