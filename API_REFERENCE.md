# PMOVES API Reference

Complete API documentation for the PMOVES Token Economy Simulator.

---

## Table of Contents

1. [Phase 1: Event Bus](#phase-1-event-bus)
2. [Phase 2: Contract Models](#phase-2-contract-models)
3. [Phase 3: Projection Validation](#phase-3-projection-validation)
4. [Phase 4: Firefly Integration](#phase-4-firefly-integration)
5. [Type Definitions](#type-definitions)
6. [Utility Functions](#utility-functions)

---

## Phase 1: Event Bus

### EventBus

Core pub/sub event system with schema validation and retry logic.

#### Constructor

```typescript
constructor(config?: Partial<EventBusConfig>)
```

**Parameters:**
- `config` - Optional configuration object

**EventBusConfig:**
```typescript
interface EventBusConfig {
  validateSchemas: boolean;    // Enable schema validation (default: true)
  maxRetries: number;          // Max retry attempts (default: 3)
  retryDelay: number;          // Base retry delay in ms (default: 1000)
  enableMetrics: boolean;      // Track metrics (default: true)
}
```

**Example:**
```typescript
import { EventBus } from './event-bus';

const eventBus = new EventBus({
  validateSchemas: true,
  maxRetries: 3,
  retryDelay: 1000,
  enableMetrics: true,
});
```

#### Methods

##### initialize()

Initialize event bus and load schemas.

```typescript
async initialize(projectRoot: string): Promise<void>
```

**Parameters:**
- `projectRoot` - Path to project root directory containing schemas

**Example:**
```typescript
await eventBus.initialize('/path/to/PMOVEStokensim');
```

##### publish()

Publish an event to subscribers.

```typescript
async publish<T>(
  topic: string,
  data: T,
  source: string,
  metadata?: Record<string, any>
): Promise<void>
```

**Parameters:**
- `topic` - Event topic (e.g., 'finance.transactions.ingested.v1')
- `data` - Event payload
- `source` - Source component name
- `metadata` - Optional metadata

**Example:**
```typescript
await eventBus.publish(
  'finance.transactions.ingested.v1',
  {
    namespace: 'grotoken',
    transactions: [...],
    ingested_at: new Date().toISOString(),
  },
  'grotoken-distribution'
);
```

##### subscribe()

Subscribe to events on a topic.

```typescript
subscribe<T>(topic: string, handler: EventHandler<T>): () => void
```

**Parameters:**
- `topic` - Event topic to subscribe to
- `handler` - Async function to handle events

**Returns:** Unsubscribe function

**Example:**
```typescript
const unsubscribe = eventBus.subscribe(
  'finance.transactions.ingested.v1',
  async (event) => {
    console.log('Received transaction:', event.data);
  }
);

// Later: unsubscribe()
```

##### subscribeAll()

Subscribe to all events (global handler).

```typescript
subscribeAll(handler: EventHandler): () => void
```

**Parameters:**
- `handler` - Function to handle all events

**Returns:** Unsubscribe function

**Example:**
```typescript
const unsubscribe = eventBus.subscribeAll(async (event) => {
  console.log(`[${event.topic}]`, event.data);
});
```

##### getMetrics()

Get event bus metrics.

```typescript
getMetrics(): Record<string, number>
```

**Returns:** Object with metric counts

**Example:**
```typescript
const metrics = eventBus.getMetrics();
console.log(metrics);
// {
//   'published.total': 150,
//   'published.finance.transactions.ingested.v1': 75,
//   'handled.finance.transactions.ingested.v1': 75,
//   'errors.finance.transactions.ingested.v1': 0
// }
```

##### shutdown()

Gracefully shutdown event bus.

```typescript
async shutdown(): Promise<void>
```

**Example:**
```typescript
await eventBus.shutdown();
```

---

## Phase 2: Contract Models

### ContractCoordinator

Unified orchestration of all 5 contract models.

#### Constructor

```typescript
constructor(
  config?: ContractCoordinatorConfig,
  eventBus?: EventBus
)
```

**Parameters:**
- `config` - Optional configuration for all models
- `eventBus` - Optional event bus for integration

**ContractCoordinatorConfig:**
```typescript
interface ContractCoordinatorConfig {
  groToken?: Partial<GroTokenConfig>;
  foodUSD?: Partial<FoodUSDConfig>;
  groupPurchase?: Partial<GroupPurchaseConfig>;
  groVault?: Partial<GroVaultConfig>;
  governance?: Partial<GovernanceConfig>;
}
```

**Example:**
```typescript
import { ContractCoordinator } from './contracts';

const coordinator = new ContractCoordinator({
  groToken: {
    tokenValue: 2.0,
    distributionMean: 0.5,
  },
  foodUSD: {
    weeklyBudget: 150,
  },
});
```

#### Methods

##### initialize()

Initialize population and starting state.

```typescript
initialize(population: PopulationConfig): void
```

**Parameters:**
- `population.addresses` - Array of Ethereum addresses
- `population.initialWealth` - Array of initial wealth values

**Example:**
```typescript
import { ethers } from 'ethers';

const addresses = Array.from({ length: 500 }, () =>
  ethers.Wallet.createRandom().address
);

coordinator.initialize({
  addresses,
  initialWealth: new Array(500).fill(0),
});
```

##### processWeek()

Process a week of simulation.

```typescript
async processWeek(
  week: number,
  householdBudgets: Map<string, { foodBudget: number; totalIncome: number }>
): Promise<void>
```

**Parameters:**
- `week` - Week number (1-260)
- `householdBudgets` - Map of address to budget data

**Example:**
```typescript
const budgets = new Map();
for (const address of addresses) {
  budgets.set(address, {
    foodBudget: 150,
    totalIncome: 1000,
  });
}

await coordinator.processWeek(1, budgets);
```

##### getComprehensiveStats()

Get statistics for all contracts.

```typescript
getComprehensiveStats(): {
  groToken: GroTokenStatistics;
  foodUSD: FoodUSDStatistics;
  groupPurchase: GroupPurchaseStatistics;
  staking: StakingStatistics;
  governance: GovernanceStatistics;
  summary: {
    totalValueLocked: number;
    totalSavingsGenerated: number;
    participationRate: number;
    governanceEngagement: number;
  };
}
```

**Example:**
```typescript
const stats = coordinator.getComprehensiveStats();

console.log(`Total Value Locked: $${stats.summary.totalValueLocked}`);
console.log(`Total Savings: $${stats.summary.totalSavingsGenerated}`);
console.log(`Participation: ${stats.summary.participationRate * 100}%`);
```

##### calculateWealthImpact()

Calculate wealth impact for a participant.

```typescript
calculateWealthImpact(address: string): {
  groTokenValue: number;
  stakingValue: number;
  groupBuyingSavings: number;
  totalImpact: number;
  breakdown: {
    tokens: TokenWealthImpact;
    staking: StakingWealthAccumulation;
    savings: ParticipantSavings;
  };
}
```

**Example:**
```typescript
const impact = coordinator.calculateWealthImpact(address);

console.log(`Total Impact: $${impact.totalImpact}`);
console.log(`  - Tokens: $${impact.groTokenValue}`);
console.log(`  - Staking: $${impact.stakingValue}`);
console.log(`  - Savings: $${impact.groupBuyingSavings}`);
```

---

### GroTokenDistribution

Token distribution model with Gaussian distribution.

#### Constructor

```typescript
constructor(config?: Partial<GroTokenConfig>)
```

**GroTokenConfig:**
```typescript
interface GroTokenConfig {
  distributionMean: number;          // Mean tokens per week (default: 0.5)
  distributionStd: number;           // Standard deviation (default: 0.2)
  tokenValue: number;                // USD value per token (default: 2.0)
  participationRate: number;         // % receiving tokens (default: 0.20)
  minTokensPerDistribution: number;  // Minimum tokens (default: 0.1)
  maxTokensPerDistribution: number;  // Maximum tokens (default: 2.0)
  totalSupply: number;               // Max supply (default: 1,000,000)
  treasuryAddress: string;           // Treasury address
}
```

**Example:**
```typescript
import { GroTokenDistribution } from './contracts';

const groToken = new GroTokenDistribution({
  distributionMean: 0.5,
  distributionStd: 0.2,
  tokenValue: 2.0,
  participationRate: 0.20,
});
```

#### Methods

##### initializeHolders()

Initialize token holders.

```typescript
initializeHolders(addresses: string[]): void
```

##### distributeWeekly()

Distribute tokens for a week.

```typescript
distributeWeekly(week: number): DistributionEvent[]
```

**Returns:** Array of distribution events

**Example:**
```typescript
const events = groToken.distributeWeekly(1);

events.forEach(event => {
  console.log(`${event.recipient}: ${event.amount} GRO ($${event.dollarValue})`);
});
```

##### getStatistics()

Get token distribution statistics.

```typescript
getStatistics(): {
  totalHolders: number;
  activeParticipants: number;
  totalDistributed: number;
  totalValue: number;
  averageBalance: number;
  medianBalance: number;
  topHolders: Array<{ address: string; balance: number }>;
}
```

##### calculateWealthImpact()

Calculate wealth impact for an address.

```typescript
calculateWealthImpact(address: string): {
  balance: number;
  totalReceived: number;
  dollarValue: number;
  percentOfSupply: number;
}
```

---

### FoodUSDModel

Food spending tracker (stablecoin model).

#### Constructor

```typescript
constructor(config?: Partial<FoodUSDConfig>)
```

**FoodUSDConfig:**
```typescript
interface FoodUSDConfig {
  weeklyBudget: number;              // Weekly budget per participant
  categoryDistribution: {
    groceries: number;               // % for groceries (default: 0.6)
    prepared_food: number;           // % for prepared food (default: 0.25)
    dining: number;                  // % for dining (default: 0.15)
  };
}
```

**Example:**
```typescript
import { FoodUSDModel } from './contracts';

const foodUSD = new FoodUSDModel({
  weeklyBudget: 150,
  categoryDistribution: {
    groceries: 0.6,
    prepared_food: 0.25,
    dining: 0.15,
  },
});
```

#### Methods

##### initializeHolders()

Initialize FoodUSD account holders.

```typescript
initializeHolders(addresses: string[]): void
```

##### fundAccount()

Fund an account with FoodUSD.

```typescript
fundAccount(address: string, amount: number): void
```

##### processWeeklySpending()

Process weekly food spending.

```typescript
processWeeklySpending(
  week: number,
  address: string,
  spending: {
    groceries: number;
    prepared_food: number;
    dining: number;
  }
): void
```

**Example:**
```typescript
foodUSD.processWeeklySpending(1, address, {
  groceries: 90,      // 60% of $150
  prepared_food: 37.5, // 25% of $150
  dining: 22.5,       // 15% of $150
});
```

##### getStatistics()

Get spending statistics.

```typescript
getStatistics(): {
  totalSpent: number;
  totalTransactions: number;
  averageSpendingPerWeek: number;
  categoryBreakdown: {
    groceries: number;
    prepared_food: number;
    dining: number;
  };
  topSpenders: Array<{ address: string; totalSpent: number }>;
}
```

---

### GroupPurchaseModel

Cooperative bulk purchasing with 15% savings.

#### Constructor

```typescript
constructor(
  foodUSD: FoodUSDModel,
  config?: Partial<GroupPurchaseConfig>
)
```

**GroupPurchaseConfig:**
```typescript
interface GroupPurchaseConfig {
  savingsRate: number;               // Savings % (default: 0.15)
  minParticipants: number;           // Min participants (default: 5)
  orderDurationWeeks: number;        // Order duration (default: 1)
}
```

#### Methods

##### createOrder()

Create a group purchase order.

```typescript
createOrder(
  week: number,
  creator: string,
  supplier: string,
  targetAmount: number,
  category: string
): number
```

**Returns:** Order ID

**Example:**
```typescript
const orderId = groupPurchase.createOrder(
  1,                    // week
  creatorAddress,
  '0xSUPPLIER',
  500,                  // $500 target
  'groceries'
);
```

##### contribute()

Contribute to a group order.

```typescript
contribute(
  week: number,
  orderId: number,
  contributor: string,
  amount: number
): boolean
```

**Returns:** Success status

**Example:**
```typescript
const success = groupPurchase.contribute(1, orderId, address, 50);
```

##### getStatistics()

Get group purchase statistics.

```typescript
getStatistics(): {
  totalOrders: number;
  completedOrders: number;
  totalVolume: number;
  totalSaved: number;
  averageSavingsPerOrder: number;
  participationRate: number;
}
```

---

### GroVaultModel

Token staking with time locks and APY.

#### Constructor

```typescript
constructor(
  groToken: GroTokenDistribution,
  config?: Partial<GroVaultConfig>
)
```

**GroVaultConfig:**
```typescript
interface GroVaultConfig {
  baseAPY: number;                   // Base APY (default: 0.10)
  maxAPY: number;                    // Max APY (default: 0.50)
  minLockDurationYears: number;      // Min lock (default: 1)
  maxLockDurationYears: number;      // Max lock (default: 4)
}
```

#### Methods

##### createLock()

Create a staking lock.

```typescript
createLock(
  week: number,
  address: string,
  amount: number,
  durationYears: number
): boolean
```

**Example:**
```typescript
const success = groVault.createLock(
  1,              // week
  address,
  100,            // 100 GRO tokens
  2               // 2-year lock
);
```

##### accrueInterest()

Accrue interest for all locks.

```typescript
accrueInterest(week: number): void
```

##### getStatistics()

Get staking statistics.

```typescript
getStatistics(): {
  totalLocked: number;
  totalLockedValue: number;
  averageAPY: number;
  totalInterestAccrued: number;
  activeLocks: number;
  participationRate: number;
}
```

---

### CoopGovernorModel

Quadratic voting governance.

#### Constructor

```typescript
constructor(
  groVault: GroVaultModel,
  config?: Partial<GovernanceConfig>
)
```

**GovernanceConfig:**
```typescript
interface GovernanceConfig {
  proposalThreshold: number;         // Min tokens to propose (default: 10)
  votingPeriodWeeks: number;         // Voting period (default: 2)
  quorumPercentage: number;          // Quorum % (default: 0.20)
  quadraticVoting: boolean;          // Use quadratic (default: true)
}
```

#### Methods

##### createProposal()

Create a governance proposal.

```typescript
createProposal(
  week: number,
  proposer: string,
  description: string,
  category?: string
): number
```

**Returns:** Proposal ID

**Example:**
```typescript
const proposalId = governance.createProposal(
  1,
  address,
  'Increase group purchase savings to 18%',
  'treasury'
);
```

##### castVote()

Vote on a proposal.

```typescript
castVote(
  week: number,
  proposalId: number,
  voter: string,
  votes: number,
  support: boolean
): boolean
```

**Example:**
```typescript
const success = governance.castVote(
  2,              // week
  proposalId,
  voterAddress,
  25,             // votes (sqrt of staked tokens)
  true            // support
);
```

##### getStatistics()

Get governance statistics.

```typescript
getStatistics(): {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  averageParticipationRate: number;
  totalVotesCast: number;
}
```

---

## Phase 3: Projection Validation

### ProjectionValidator

Validate 5-year business projections against simulations.

#### Constructor

```typescript
constructor(config?: Partial<ValidatorConfig>)
```

**ValidatorConfig:**
```typescript
interface ValidatorConfig {
  simulationWeeks: number;           // Simulation duration (default: 260)
  successThresholds: {
    roiPercentage: number;           // ROI threshold (default: 0.80)
    revenuePercentage: number;       // Revenue threshold (default: 0.80)
    breakEvenMultiplier: number;     // Break-even multiplier (default: 1.25)
  };
}
```

**Example:**
```typescript
import { ProjectionValidator } from './projections';

const validator = new ProjectionValidator({
  simulationWeeks: 260,
  successThresholds: {
    roiPercentage: 0.80,
    revenuePercentage: 0.80,
    breakEvenMultiplier: 1.25,
  },
});
```

#### Methods

##### validate()

Validate a projection model.

```typescript
async validate(model: ProjectionModel): Promise<ValidationReport>
```

**Parameters:**
- `model` - Projection model to validate

**Returns:** Validation report

**Example:**
```typescript
import { AI_ENHANCED_LOCAL_SERVICE } from './projections/scenario-configs';

const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

console.log(`Model: ${report.model}`);
console.log(`Revenue Variance: ${report.variance.revenueVariance.toFixed(1)}%`);
console.log(`ROI: ${report.actual.roi}%`);
console.log(`Break-Even: ${report.actual.breakEvenMonths} months`);
console.log(`Risk Level: ${report.riskAssessment.riskLevel}`);
```

##### compareModels()

Compare multiple models.

```typescript
async compareModels(models: ProjectionModel[]): Promise<ModelComparison>
```

**Example:**
```typescript
import { BASELINE_MODELS } from './projections/scenario-configs';

const comparison = await validator.compareModels(BASELINE_MODELS);

console.log('Model Rankings:');
comparison.rankings.forEach((rank, index) => {
  console.log(`${index + 1}. ${rank.name} (Score: ${rank.score})`);
});
```

---

### ProjectionModel

Business projection model interface.

```typescript
interface ProjectionModel {
  name: string;
  description: string;

  // Financial projections
  initialInvestment: number;
  projectedYear5Revenue: number;
  projectedRiskAdjustedROI: number;  // Decimal (13.66 = 1366%)
  projectedBreakEvenMonths: number;
  successProbability: number;

  // Simulation parameters
  populationSize: number;
  participationRate: number;

  // Revenue modeling
  weeklyRevenuePerParticipant: number;
  growthRatePerWeek: number;

  // Token economy
  tokenDistributionRate: number;
  groupBuyingSavings: number;
  stakingParticipation: number;
}
```

**Example:**
```typescript
const MY_MODEL: ProjectionModel = {
  name: 'My Custom Food Co-op',
  description: 'Custom cooperative model',

  initialInvestment: 5000,
  projectedYear5Revenue: 100000,
  projectedRiskAdjustedROI: 15.0,  // 1500%
  projectedBreakEvenMonths: 4.0,
  successProbability: 0.70,

  populationSize: 600,
  participationRate: 0.65,

  weeklyRevenuePerParticipant: 0.60,
  growthRatePerWeek: 0.0115,

  tokenDistributionRate: 0.55,
  groupBuyingSavings: 0.15,
  stakingParticipation: 0.35,
};
```

---

### ValidationReport

Validation report structure.

```typescript
interface ValidationReport {
  model: string;

  actual: {
    revenue: number;
    profit: number;
    roi: number;                     // Percentage (7594 = 7594%)
    breakEvenWeek: number;
    breakEvenMonths: number;
    breakEvenAchieved: boolean;
  };

  variance: {
    revenueVariance: number;         // Percentage
    roiVariance: number;             // Percentage
    breakEvenVariance: number;       // Percentage
  };

  riskAssessment: {
    successAchieved: boolean;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    failureReason?: string;
  };

  analysis: {
    revenueGrowth: 'LINEAR' | 'EXPONENTIAL' | 'DECLINING';
    profitability: 'IMPROVING' | 'STABLE' | 'DECLINING';
    marketScenario: 'BULL' | 'NORMAL' | 'BEAR' | 'CRYPTO_WINTER';
    tokenImpact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  };

  weeklyData: Array<{
    week: number;
    revenue: number;
    profit: number;
    roi: number;
  }>;

  insights: string[];
}
```

---

## Phase 4: Firefly Integration

### FireflyClient

HTTP client for Firefly-iii API.

#### Constructor

```typescript
constructor(config: Partial<FireflyConfig>)
```

**FireflyConfig:**
```typescript
interface FireflyConfig {
  baseUrl: string;                   // Firefly URL (default: 'http://localhost:8080')
  apiToken: string;                  // API token (required)
  apiVersion: string;                // API version (default: 'v1')
  timeout: number;                   // Timeout in ms (default: 30000)
  retryCount: number;                // Retry attempts (default: 3)
}
```

**Example:**
```typescript
import { FireflyClient } from './firefly';

const client = new FireflyClient({
  baseUrl: 'http://localhost:8080',
  apiToken: process.env.FIREFLY_API_TOKEN || '',
  timeout: 30000,
  retryCount: 3,
});
```

#### Methods

##### testConnection()

Test connection to Firefly-iii.

```typescript
async testConnection(): Promise<boolean>
```

**Example:**
```typescript
const connected = await client.testConnection();
if (connected) {
  console.log('✅ Connected to Firefly-iii');
} else {
  console.error('❌ Connection failed');
}
```

##### getTransactions()

Get transactions for a date range.

```typescript
async getTransactions(
  startDate: Date,
  endDate: Date
): Promise<Transaction[]>
```

**Example:**
```typescript
const transactions = await client.getTransactions(
  new Date('2024-01-01'),
  new Date('2024-03-31')
);

console.log(`Fetched ${transactions.length} transactions`);
```

##### getSpendingByCategory()

Get spending breakdown by category.

```typescript
async getSpendingByCategory(
  startDate: Date,
  endDate: Date
): Promise<CategorySpending[]>
```

**Example:**
```typescript
const spending = await client.getSpendingByCategory(
  new Date('2024-01-01'),
  new Date('2024-03-31')
);

spending.forEach(cat => {
  console.log(`${cat.category}: $${cat.amount} (${cat.count} transactions)`);
});
```

---

### FireflyDataTransformer

Transform Firefly data into simulation format.

#### Constructor

```typescript
constructor(customMappings?: CategoryMapping[])
```

**CategoryMapping:**
```typescript
interface CategoryMapping {
  fireflyCategory: string;
  foodUSDCategory: string;
  description: string;
}
```

**Example:**
```typescript
import { FireflyDataTransformer } from './firefly';

const customMappings: CategoryMapping[] = [
  {
    fireflyCategory: 'Whole Foods',
    foodUSDCategory: 'groceries',
    description: 'Map Whole Foods to groceries',
  },
];

const transformer = new FireflyDataTransformer(customMappings);
```

#### Methods

##### transform()

Transform transactions into simulation data.

```typescript
transform(
  transactions: Transaction[],
  totalPopulation: number
): TransformedData
```

**Returns:**
```typescript
interface TransformedData {
  weeklySpending: WeeklySpending[];
  participation: ParticipationMetrics;
  categoryDistribution: Record<string, number>;
  totalSpending: number;
}
```

**Example:**
```typescript
const transformed = transformer.transform(transactions, 500);

console.log(`Total Spending: $${transformed.totalSpending}`);
console.log(`Active Participants: ${transformed.participation.activeParticipants}`);
console.log(`Participation Rate: ${transformed.participation.participationRate * 100}%`);
```

---

### CalibrationEngine

Calibrate projection parameters using real data.

#### Constructor

```typescript
constructor()
```

#### Methods

##### calibrate()

Calibrate model parameters.

```typescript
async calibrate(
  modelName: string,
  actualData: TransformedData,
  simulatedResults: SimulationResults,
  totalPopulation: number
): Promise<CalibrationReport>
```

**Returns:**
```typescript
interface CalibrationReport {
  modelName: string;

  overallAccuracy: {
    confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    confidenceScore: number;         // 0-100
    averageVariance: number;         // Percentage
    dataQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  };

  parameterAdjustments: ParameterAdjustment[];
  categoryComparison: CategoryComparison[];
  recommendations: string[];
}
```

**Example:**
```typescript
import { CalibrationEngine } from './projections';

const calibrator = new CalibrationEngine();

const report = await calibrator.calibrate(
  'AI-Enhanced Local Service',
  actualData,
  simulatedResults,
  500
);

console.log(`Confidence: ${report.overallAccuracy.confidenceLevel}`);
console.log(`Score: ${report.overallAccuracy.confidenceScore}/100`);
```

---

### FireflyIntegration

Complete Firefly-iii integration pipeline.

#### Constructor

```typescript
constructor(config: IntegrationConfig)
```

**IntegrationConfig:**
```typescript
interface IntegrationConfig {
  firefly: {
    baseUrl: string;
    apiToken: string;
  };
  analysis: {
    startDate: Date;
    endDate: Date;
    totalPopulation: number;
  };
  output: {
    directory: string;
    generateCSV: boolean;
    generateMarkdown: boolean;
  };
}
```

**Example:**
```typescript
import { FireflyIntegration } from './firefly';

const integration = new FireflyIntegration({
  firefly: {
    baseUrl: 'http://localhost:8080',
    apiToken: process.env.FIREFLY_API_TOKEN || '',
  },
  analysis: {
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
    endDate: new Date(),
    totalPopulation: 500,
  },
  output: {
    directory: './output/firefly-calibration',
    generateCSV: true,
    generateMarkdown: true,
  },
});
```

#### Methods

##### run()

Run complete integration pipeline.

```typescript
async run(model: ProjectionModel): Promise<IntegrationResult>
```

**Returns:**
```typescript
interface IntegrationResult {
  baseline: {
    model: ProjectionModel;
    results: ValidationReport;
  };
  calibrated: {
    model: ProjectionModel;
    calibration: CalibrationReport;
    results: ValidationReport;
  };
  comparison: {
    revenueImprovement: number;
    roiChange: number;
    breakEvenChange: number;
  };
}
```

**Example:**
```typescript
import { AI_ENHANCED_LOCAL_SERVICE } from './projections/scenario-configs';

const result = await integration.run(AI_ENHANCED_LOCAL_SERVICE);

console.log('Baseline ROI:', result.baseline.results.actual.roi);
console.log('Calibrated ROI:', result.calibrated.results.actual.roi);
console.log('Improvement:', result.comparison.roiChange);
```

---

## Type Definitions

### Common Types

#### EventEnvelope

```typescript
interface EventEnvelope<T = any> {
  id: string;                        // Unique event ID
  topic: string;                     // Event topic
  timestamp: string;                 // ISO 8601 timestamp
  source: string;                    // Source component
  data: T;                           // Event payload
  metadata?: Record<string, any>;    // Optional metadata
}
```

#### PopulationConfig

```typescript
interface PopulationConfig {
  addresses: string[];               // Ethereum addresses
  initialWealth: number[];           // Initial wealth per address
}
```

#### WeeklySimulationData

```typescript
interface WeeklySimulationData {
  week: number;
  groTokenDistribution: GroTokenExportData;
  foodUSDSpending: FoodUSDExportData;
  groupPurchases: GroupPurchaseExportData;
  staking: StakingExportData;
  governance: GovernanceExportData;
}
```

---

## Utility Functions

### Export Functions

Located in `integrations/projections/export-results.ts`

#### exportValidationReport()

Export validation report to Markdown.

```typescript
function exportValidationReport(
  report: ValidationReport,
  outputPath: string
): void
```

**Example:**
```typescript
import { exportValidationReport } from './projections/export-results';

exportValidationReport(
  report,
  './output/validation-report.md'
);
```

#### exportComparisonCSV()

Export model comparison to CSV.

```typescript
function exportComparisonCSV(
  reports: ValidationReport[],
  outputPath: string,
  ranking?: Array<{ name: string; score: number }>
): void
```

**Example:**
```typescript
import { exportComparisonCSV } from './projections/export-results';

exportComparisonCSV(
  reports,
  './output/model-comparison.csv',
  rankings
);
```

#### exportWeeklyProgressionCSV()

Export weekly progression to CSV.

```typescript
function exportWeeklyProgressionCSV(
  report: ValidationReport,
  outputPath: string
): void
```

**Example:**
```typescript
import { exportWeeklyProgressionCSV } from './projections/export-results';

exportWeeklyProgressionCSV(
  report,
  './output/weekly-progression.csv'
);
```

---

## Usage Examples

### Complete Validation Workflow

```typescript
import { ProjectionValidator } from './projections';
import { AI_ENHANCED_LOCAL_SERVICE } from './projections/scenario-configs';
import { exportValidationReport, exportWeeklyProgressionCSV } from './projections/export-results';

async function runValidation() {
  // 1. Create validator
  const validator = new ProjectionValidator();

  // 2. Run validation
  const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

  // 3. Log results
  console.log(`Model: ${report.model}`);
  console.log(`Revenue: $${report.actual.revenue.toLocaleString()}`);
  console.log(`ROI: ${report.actual.roi}%`);
  console.log(`Break-Even: ${report.actual.breakEvenMonths} months`);
  console.log(`Risk: ${report.riskAssessment.riskLevel}`);

  // 4. Export reports
  exportValidationReport(report, './output/validation-report.md');
  exportWeeklyProgressionCSV(report, './output/weekly-progression.csv');

  return report;
}

runValidation().catch(console.error);
```

### Firefly Integration Workflow

```typescript
import { FireflyIntegration } from './firefly';
import { AI_ENHANCED_LOCAL_SERVICE } from './projections/scenario-configs';

async function runCalibration() {
  // 1. Create integration
  const integration = new FireflyIntegration({
    firefly: {
      baseUrl: process.env.FIREFLY_URL || 'http://localhost:8080',
      apiToken: process.env.FIREFLY_API_TOKEN || '',
    },
    analysis: {
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      totalPopulation: 500,
    },
    output: {
      directory: './output/firefly-calibration',
      generateCSV: true,
      generateMarkdown: true,
    },
  });

  // 2. Run integration
  const result = await integration.run(AI_ENHANCED_LOCAL_SERVICE);

  // 3. Log results
  const cal = result.calibrated.calibration;

  console.log('📊 CALIBRATION SUMMARY');
  console.log('='.repeat(80));
  console.log();
  console.log('Overall Accuracy:');
  console.log(`  Confidence Level: ${cal.overallAccuracy.confidenceLevel}`);
  console.log(`  Confidence Score: ${cal.overallAccuracy.confidenceScore.toFixed(1)}/100`);
  console.log();
  console.log('Recommendations:');
  cal.recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec}`);
  });

  return result;
}

runCalibration().catch(console.error);
```

### Custom Contract Simulation

```typescript
import { ContractCoordinator } from './contracts';
import { ethers } from 'ethers';

async function runCustomSimulation() {
  // 1. Create coordinator
  const coordinator = new ContractCoordinator({
    groToken: {
      tokenValue: 2.5,  // Custom token value
      participationRate: 0.30,
    },
    foodUSD: {
      weeklyBudget: 175,
    },
  });

  // 2. Initialize population
  const addresses = Array.from({ length: 300 }, () =>
    ethers.Wallet.createRandom().address
  );

  coordinator.initialize({
    addresses,
    initialWealth: new Array(300).fill(0),
  });

  // 3. Run simulation
  for (let week = 1; week <= 52; week++) {  // 1 year
    const budgets = new Map();

    for (const address of addresses) {
      budgets.set(address, {
        foodBudget: 175,
        totalIncome: 1200,
      });
    }

    await coordinator.processWeek(week, budgets);
  }

  // 4. Get statistics
  const stats = coordinator.getComprehensiveStats();

  console.log('Year 1 Summary:');
  console.log(`Total Value Locked: $${stats.summary.totalValueLocked.toLocaleString()}`);
  console.log(`Total Savings: $${stats.summary.totalSavingsGenerated.toLocaleString()}`);
  console.log(`Participation: ${(stats.summary.participationRate * 100).toFixed(1)}%`);

  return stats;
}

runCustomSimulation().catch(console.error);
```

---

## Error Handling

### Common Errors

#### Firefly Connection Error

```typescript
try {
  const connected = await client.testConnection();
} catch (error) {
  console.error('Failed to connect to Firefly-iii:', error.message);
  // Check: Is Firefly-iii running? Is API token valid?
}
```

#### Schema Validation Error

```typescript
try {
  await eventBus.publish('invalid.topic', invalidData, 'source');
} catch (error) {
  console.error('Schema validation failed:', error.message);
  // Check: Does event match schema? Is topic valid?
}
```

#### Validation Error

```typescript
try {
  const report = await validator.validate(model);
} catch (error) {
  console.error('Validation failed:', error.message);
  // Check: Are model parameters valid? Is population size > 0?
}
```

---

## Additional Resources

### Documentation

- **[User Guide](USER_GUIDE.md)** - Complete usage guide
- **[Technical Guide](TECHNICAL_GUIDE.md)** - Architecture details
- **[Folder Structure](FOLDER_STRUCTURE.md)** - Project organization
- **[Quick Start](QUICK_START.md)** - 5-minute setup

### Phase READMEs

- **[Event Bus](integrations/event-bus/README.md)** - Phase 1 documentation
- **[Contracts](integrations/contracts/README.md)** - Phase 2 documentation
- **[Projections](integrations/projections/README.md)** - Phase 3 documentation
- **[Firefly](integrations/firefly/README.md)** - Phase 4 documentation

---

<p align="center">
  <a href="README.md">Main README</a> •
  <a href="QUICK_START.md">Quick Start</a> •
  <a href="USER_GUIDE.md">User Guide</a> •
  <a href="TECHNICAL_GUIDE.md">Technical Guide</a>
</p>

<p align="center">
  <strong>PMOVES API Reference</strong><br>
  Last updated: 2025-11-15
</p>
