/**
 * PMOVES Integrations
 * Main entry point for all integration components
 */

// Event Bus
export { EventBus, EventEnvelope, EventHandler, EventBusConfig } from './event-bus/event-bus';
export { SchemaValidator } from './event-bus/schema-validator';

// Firefly-iii Client
export {
  FireflyClient,
  FireflyConfig,
  CategorySpending,
  BudgetAnalysis,
  WealthDistribution,
  Transaction,
  SavingsMetrics,
} from './firefly/firefly-client';

// DoX Client
export {
  DoXClient,
  DoXConfig,
  UploadResponse,
  QAResponse,
  FinancialAnalysis,
  CHRResult,
  DashboardInfo,
} from './dox/dox-client';

// Contract Listeners
export {
  ContractEventListener,
  ContractConfig,
  NetworkConfig,
} from './contracts/contract-listeners';

// Integration Coordinator
export {
  IntegrationCoordinator,
  IntegrationConfig,
} from './integration-coordinator';

// Re-export types
export type {
  EventEnvelope as Event,
  EventHandler as Handler,
} from './event-bus/event-bus';
