# PMOVES Integrations

Integration layer for the PMOVES ecosystem, connecting:
- **Smart Contracts** (GroToken, FoodUSD, GroupPurchase, CoopGovernor, GroVault)
- **PMOVES-Firefly-iii** (Personal finance data & validation)
- **PMOVES-DoX** (Document intelligence & analytics)
- **PMOVEStokensim** (Economic simulation model)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Event Bus (JSON Schema)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Contract     │  │ Firefly-iii  │  │ PMOVES-DoX   │      │
│  │ Listeners    │  │ API Client   │  │ API Client   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Event Bus
- **JSON Schema Validation**: All events validated against schemas from `contracts/schemas/`
- **Pub/Sub Pattern**: Subscribe to specific topics or all events
- **Error Handling**: Automatic retry with exponential backoff
- **Metrics**: Built-in metrics collection for monitoring

### Contract Models
- **GroToken Distribution**: Gaussian distribution model (μ=0.5, σ=0.2) for weekly token rewards
- **FoodUSD Stablecoin**: 1:1 USD-pegged stablecoin for food spending tracking
- **GroupPurchase**: 15% bulk buying savings mechanism with minimum participant requirements
- **GroVault Staking**: Time-locked staking with quadratic voting power and interest accrual
- **CoopGovernor**: Quadratic voting governance with quorum requirements

### Contract Event Listeners
- **Real-time Events**: Listen to smart contract events via Web3
- **Historical Replay**: Replay past events for data reconstruction
- **Auto-mapping**: Events automatically mapped to appropriate topics
- **Multi-chain Support**: Connect to multiple blockchain networks

### Firefly-iii Integration
- **Data Collection**: Extract spending, savings, and wealth data
- **Validation**: Compare simulation results against real-world data
- **Webhooks**: Real-time transaction processing
- **Analysis**: Budget variance, Gini coefficient, savings rate

### DoX Integration
- **Document Analysis**: Upload and analyze simulation CSVs
- **Q&A**: Natural language queries on simulation data
- **Dashboards**: Auto-generate interactive datavzrd dashboards
- **Multi-scenario**: Compare multiple simulation runs with CHR clustering
- **Insights**: AI-powered insights extraction

## Installation

```bash
cd integrations
npm install
```

## Usage

### Basic Setup

```typescript
import { IntegrationCoordinator } from './integration-coordinator';
import path from 'path';

// Configure integrations
const coordinator = new IntegrationCoordinator({
  projectRoot: path.join(__dirname, '..'),

  eventBus: {
    validateSchemas: true,
    maxRetries: 3,
  },

  firefly: {
    baseUrl: 'http://firefly:8080',
    apiToken: process.env.FIREFLY_API_TOKEN,
    apiVersion: 'v1',
    timeout: 30000,
    retryCount: 3,
  },

  dox: {
    baseUrl: 'http://dox:8000',
    timeout: 120000,
    retryCount: 3,
  },

  contracts: {
    network: {
      name: 'localhost',
      rpcUrl: 'http://localhost:8545',
      pollingInterval: 5000,
    },
    contracts: [
      {
        name: 'GroToken',
        address: '0x...',
        abi: require('../contracts/abi/GroToken.json'),
        events: ['Transfer'],
      },
      {
        name: 'GroupPurchase',
        address: '0x...',
        abi: require('../contracts/abi/GroupPurchase.json'),
        events: ['OrderCreated', 'ContributionReceived', 'OrderExecuted'],
      },
    ],
  },
});

// Initialize
await coordinator.initialize();
```

### Subscribe to Events

```typescript
const eventBus = coordinator.getEventBus();

// Subscribe to finance transactions
eventBus.subscribe('finance.transactions.ingested.v1', async (event) => {
  console.log('New transaction:', {
    externalId: event.data.external_id,
    amount: event.data.amount,
    currency: event.data.currency,
    source: event.data.source,
  });

  // Update simulation model
  // ...
});

// Subscribe to monthly summaries
eventBus.subscribe('finance.monthly.summary.v1', async (event) => {
  console.log('Monthly summary:', event.data);

  // Generate report
  // ...
});

// Subscribe to all events
eventBus.subscribeAll(async (event) => {
  console.log(`Event on topic ${event.topic}:`, event.data);
});
```

### Validate Simulation

```typescript
const validationResult = await coordinator.validateSimulation({
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  spendingByCategory: {
    food: 800,
    housing: 1200,
    transportation: 300,
  },
  totalSavings: 500,
});

console.log('Validation status:', validationResult.validationStatus);
console.log('Spending variance:', validationResult.spendingVariance);
console.log('Recommendations:', validationResult.recommendations);
```

### Analyze Simulation with DoX

```typescript
const csvData = `week,gini,poverty_rate,avg_wealth
1,0.45,0.20,5000
2,0.43,0.18,5200
...`;

const analysis = await coordinator.analyzeSimulationResults(
  csvData,
  'Baseline Scenario'
);

console.log('Dashboard:', analysis.dashboardUrl);
console.log('Insights:', analysis.insights);
```

### Compare Multiple Scenarios

```typescript
const comparison = await coordinator.compareScenarios([
  { name: 'Baseline', csvData: baselineCSV },
  { name: 'With Tokens', csvData: tokenCSV },
  { name: 'Group Buying', csvData: groupBuyingCSV },
]);

console.log('Dashboard:', comparison.dashboardUrl);
console.log('Comparison:', comparison.comparison);
console.log('Recommendations:', comparison.recommendations);
```

### Access Individual Clients

```typescript
// Firefly-iii client
const firefly = coordinator.getFireflyClient();

const spending = await firefly.getSpendingByCategory(
  new Date('2025-01-01'),
  new Date('2025-01-31')
);

const wealth = await firefly.getUserGroupWealth('group-123');

// DoX client
const dox = coordinator.getDoXClient();

const upload = await dox.upload(
  Buffer.from('...'),
  'report.pdf',
  'pdf'
);

const insights = await dox.ask(
  upload.id,
  'What are the key findings?'
);

// Contract listener
const contracts = coordinator.getContractListener();

await contracts.replayHistoricalEvents(
  'GroupPurchase',
  'OrderCreated',
  0,
  'latest'
);
```

## Contract Models

### ContractCoordinator

The `ContractCoordinator` provides unified orchestration for all PMOVES contract models:

```typescript
import { ContractCoordinator } from './contracts/contract-coordinator';

const coordinator = new ContractCoordinator({
  groToken: {
    distributionMean: 0.5,      // 0.5 tokens/week average
    distributionStd: 0.2,        // Standard deviation
    tokenValue: 2.0,             // $2 per token
    participationRate: 0.20,     // 20% participate weekly
  },
  foodUSD: {
    pegValue: 1.0,               // 1:1 USD peg
    foodCategories: ['groceries', 'prepared_food', 'dining'],
  },
  groupPurchase: {
    savingsRate: 0.15,           // 15% bulk buying savings
    minimumParticipants: 5,      // Min 5 participants
  },
  groVault: {
    baseInterestRate: 0.02,      // 2% APR base
    lockBonusMultiplier: 0.5,    // +50% per year locked
  },
  governance: {
    votingPeriodWeeks: 2,        // 2-week voting period
    proposalThreshold: 100,      // Min 100 voting power
  },
});

// Initialize population
coordinator.initialize({
  addresses: ['0xALICE', '0xBOB', '0xCHARLIE'],
  initialWealth: [5000, 6000, 5500],
});

// Process weekly simulation
await coordinator.processWeek(1, new Map([
  ['0xALICE', { foodBudget: 150, totalIncome: 800 }],
  ['0xBOB', { foodBudget: 200, totalIncome: 1000 }],
]));
```

### GroToken Distribution

Gaussian distribution model for weekly token rewards:

```typescript
import { GroTokenDistribution } from './contracts/grotoken-model';

const groToken = new GroTokenDistribution({
  distributionMean: 0.5,       // Mean: 0.5 tokens/week
  distributionStd: 0.2,         // Std dev: 0.2
  tokenValue: 2.0,              // $2 per token
  participationRate: 0.20,      // 20% participate each week
});

groToken.initializeHolders(['0xALICE', '0xBOB']);

// Distribute tokens weekly
const events = groToken.distributeWeekly(1);
console.log(`Distributed to ${events.length} participants`);

// Check balance
const balance = groToken.balanceOf('0xALICE');
console.log(`Alice has ${balance} GRO tokens`);

// Transfer tokens
groToken.transfer('0xALICE', '0xBOB', 1.0);

// Get statistics
const stats = groToken.getStatistics();
console.log(`Total distributed: ${stats.totalDistributed} GRO`);
console.log(`Total value: $${stats.totalValue}`);
```

### FoodUSD Stablecoin

1:1 USD-pegged stablecoin for food spending:

```typescript
import { FoodUSDModel } from './contracts/foodusd-model';

const foodUSD = new FoodUSDModel({
  pegValue: 1.0,
  foodCategories: ['groceries', 'prepared_food', 'dining'],
});

foodUSD.initializeHolders(['0xALICE']);

// Fund account
foodUSD.fundAccount('0xALICE', 150);

// Record spending
foodUSD.recordSpending(1, '0xALICE', 'groceries', 80);
foodUSD.recordSpending(1, '0xALICE', 'dining', 30);

// Or process weekly spending
foodUSD.processWeeklySpending(1, '0xALICE', {
  groceries: 100,
  prepared_food: 30,
  dining: 20,
});

// Get statistics
const stats = foodUSD.getStatistics();
console.log(`Total spent: $${stats.totalSpent}`);
console.log(`Groceries: $${stats.spendingByCategory.groceries}`);
```

### GroupPurchase

15% bulk buying savings mechanism:

```typescript
import { GroupPurchaseModel } from './contracts/grouppurchase-model';

const groupPurchase = new GroupPurchaseModel(foodUSD, {
  savingsRate: 0.15,           // 15% savings
  minimumParticipants: 5,      // Min 5 participants
});

// Create group order
const orderId = groupPurchase.createOrder(
  1,                   // week
  '0xALICE',          // creator
  '0xSUPPLIER',       // supplier
  500,                 // target amount
  'groceries'
);

// Members contribute
groupPurchase.contribute(1, orderId, '0xBOB', 100);
groupPurchase.contribute(1, orderId, '0xCHARLIE', 120);
// ... add more participants (min 5)

// Execute order (automatically applies 15% savings)
const result = groupPurchase.executeOrder(orderId);
console.log(`Saved: $${result.savingsAmount}`);
console.log(`Final cost: $${result.finalCost}`);

// Validate savings assumption
const validation = groupPurchase.validateSavingsAssumption();
console.log(`Actual savings rate: ${validation.actualRate * 100}%`);
```

### GroVault Staking

Time-locked staking with quadratic voting power:

```typescript
import { GroVaultModel } from './contracts/grovault-model';

const groVault = new GroVaultModel(groToken, {
  baseInterestRate: 0.02,      // 2% APR
  lockBonusMultiplier: 0.5,    // +50% per year
  compoundingPeriod: 'weekly',
});

// Create lock (stake tokens)
groVault.createLock(
  1,           // week
  '0xALICE',  // address
  10.0,        // amount (10 GRO)
  2            // duration (2 years)
);

// Get voting power (quadratic formula)
const votingPower = groVault.getVotingPower('0xALICE');
// Formula: sqrt(amount) * (1 + 0.5 * (years - 1))
// = sqrt(10) * (1 + 0.5 * 1) = 3.16 * 1.5 = 4.74

// Accrue interest weekly
for (let week = 2; week <= 52; week++) {
  groVault.accrueInterest(week);
}

// Withdraw after lock expires
groVault.withdraw(105, '0xALICE');  // After 2 years (104 weeks)

// Get wealth accumulation
const wealth = groVault.calculateWealthAccumulation('0xALICE');
console.log(`Locked: ${wealth.locked} GRO`);
console.log(`Interest: ${wealth.interestAccrued} GRO`);
console.log(`Total: ${wealth.totalValue} GRO`);
```

### CoopGovernor

Quadratic voting governance:

```typescript
import { CoopGovernorModel } from './contracts/coopgovernor-model';

const governance = new CoopGovernorModel(groVault, {
  votingPeriodWeeks: 2,
  proposalThreshold: 100,      // Min 100 voting power
  quorumPercentage: 0.1,       // 10% quorum
});

// Create proposal
const proposalId = governance.createProposal(
  1,                           // week
  '0xALICE',                  // proposer
  'Increase food budget allocation',
  'budget'
);

// Cast votes (quadratic cost)
governance.castVote(
  2,              // week
  proposalId,
  '0xBOB',       // voter
  3,              // votes (costs 3^2 = 9 voting power)
  true            // support
);

governance.castVote(2, proposalId, '0xCHARLIE', 2, false);

// Execute proposal after voting period
const result = governance.executeProposal(4, proposalId);
console.log(`Passed: ${result.passed}`);
console.log(`Votes for: ${result.votesFor}`);
console.log(`Votes against: ${result.votesAgainst}`);

// Analyze democratic engagement
const engagement = governance.analyzeDemocraticEngagement();
console.log(`Voter turnout: ${engagement.voterTurnout * 100}%`);
console.log(`Power concentration: ${engagement.concentrationOfPower * 100}%`);
```

### Complete Simulation Example

See `integrations/contracts/example-contract-simulation.ts` for a complete 52-week simulation demonstrating all contracts working together with 100 participants.

```bash
# Run the example
npm run example:contracts
```

## Projection Validation

The projection validation framework validates 5-year business projection models against simulation runs, comparing projected ROI, revenue, and break-even timelines with actual results.

### Business Models

Three baseline projection models are included:

1. **AI-Enhanced Local Service Business** ($5,000 investment)
   - Projected Year 5 Revenue: $94,277
   - Projected ROI: 1,366%
   - Break-even: 3.3 months
   - Success Probability: 75%

2. **Sustainable Energy AI Consulting** ($4,000 investment)
   - Projected Year 5 Revenue: $63,020
   - Projected ROI: 818%
   - Break-even: 4.4 months
   - Success Probability: 60%

3. **Community Token Pre-Order System** ($3,000 investment)
   - Projected Year 5 Revenue: $33,084
   - Projected ROI: 350%
   - Break-even: 6.9 months
   - Success Probability: 40%

### Running Validations

```bash
# Run all projection validations (all 5 models, ~5-10 minutes)
npm run validate:projections

# Quick validation (single model, ~1-2 minutes)
npm run validate:quick
```

### Validation Reports

Each validation generates:

- **Variance Analysis**: Compare projected vs actual revenue, ROI, break-even
- **Risk Assessment**: Success probability, confidence level, risk factors
- **Growth Analysis**: Revenue growth patterns, profitability trends
- **Market Scenarios**: Bull, normal, bear market comparisons
- **Recommendations**: Mitigation strategies and optimizations

### Using the Validator

```typescript
import { ProjectionValidator, AI_ENHANCED_LOCAL_SERVICE } from './projections';

const validator = new ProjectionValidator();

// Validate single model
const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

console.log(`Actual ROI: ${report.actual.roi.toFixed(0)}%`);
console.log(`Variance: ${report.variance.roiVariance.toFixed(1)}%`);
console.log(`Confidence: ${report.riskAssessment.confidenceLevel}`);

// Compare multiple models
const comparison = await validator.compareModels([
  AI_ENHANCED_LOCAL_SERVICE,
  ENERGY_CONSULTING,
  TOKEN_PRE_ORDER,
]);

console.log('Top model:', comparison.ranking[0].name);
console.log('Score:', comparison.ranking[0].score);
```

### Custom Projection Models

Create your own projection models:

```typescript
import { ProjectionModel, ProjectionValidator } from './projections';

const customModel: ProjectionModel = {
  name: 'My Custom Business',
  description: 'Custom business model',
  initialInvestment: 10000,
  projectedYear5Revenue: 150000,
  projectedRiskAdjustedROI: 10.0, // 1,000%
  projectedBreakEvenMonths: 6,
  successProbability: 0.65,

  // Simulation parameters
  populationSize: 300,
  participationRate: 0.55,
  weeklyRevenuePerParticipant: 0.75,
  growthRatePerWeek: 0.015, // 1.5% weekly growth

  // Token economy (optional)
  tokenDistributionRate: 0.40,
  groupBuyingSavings: 0.15,
  stakingParticipation: 0.30,
};

const validator = new ProjectionValidator();
const report = await validator.validate(customModel);
```

### Export Results

Export validation results for analysis:

```typescript
import { exportAllResults, generateMarkdownReport } from './projections';

// Export CSV files and JSON summary
exportAllResults(reports, weeklyDataMap, './output');

// Generate markdown report
generateMarkdownReport(reports, ranking, './output/report.md');
```

Output files:
- `model-name-report.csv` - Validation summary for each model
- `model-name-weekly.csv` - Weekly simulation data (260 weeks)
- `model-comparison.csv` - Side-by-side comparison
- `summary.json` - JSON summary of all results
- `report.md` - Markdown report

## Event Topics

All event topics are defined in `contracts/topics.json`:

### Finance Events
- `finance.transactions.ingested.v1` - Transaction data from contracts or Firefly
- `finance.monthly.summary.v1` - Monthly financial summaries

### AgentZero Events
- `agentzero.task.v1` - Task creation and assignment
- `agentzero.task.status.v1` - Task status updates
- `agentzero.task.result.v1` - Task completion results
- `agentzero.memory.update` - Memory updates
- `agentzero.memory.ack.v1` - Memory acknowledgments

### Content Events
- `content.published.v1` - Content publication notifications
- `content.publish.failed.v1` - Publication failures

### Health Events
- `health.metrics.updated.v1` - Health metrics updates
- `health.weekly.summary.v1` - Weekly health summaries

## Schema Validation

All events are validated against JSON schemas in `contracts/schemas/`:

```typescript
// Example: finance.monthly.summary.v1.schema.json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Finance Monthly Summary v1",
  "type": "object",
  "required": ["namespace", "month", "totals"],
  "properties": {
    "namespace": {"type": "string"},
    "month": {"type": "string", "pattern": "^\\d{4}-\\d{2}$"},
    "totals": {
      "type": "object",
      "required": ["income", "spend"],
      "properties": {
        "income": {"type": "number"},
        "spend": {"type": "number"},
        "savings": {"type": ["number", "null"]}
      }
    }
  }
}
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run build:watch

# Lint
npm run lint

# Format code
npm run format
```

## Metrics

Get integration metrics:

```typescript
const metrics = coordinator.getMetrics();

console.log(metrics);
// {
//   'published.total': 1234,
//   'published.finance.transactions.ingested.v1': 890,
//   'handled.finance.transactions.ingested.v1': 890,
//   'errors.finance.transactions.ingested.v1': 5,
//   ...
// }
```

## Error Handling

The integration layer includes comprehensive error handling:

- **Automatic Retry**: Failed events retry with exponential backoff
- **Circuit Breaker**: Prevent cascading failures
- **Dead Letter Queue**: Events that fail permanently are logged
- **Error Events**: Subscribe to `event:failed` for error monitoring

```typescript
eventBus.on('event:failed', ({ event, error }) => {
  console.error(`Event ${event.id} failed permanently:`, error);

  // Send to monitoring system
  // Log to database
  // Alert administrators
});
```

## Environment Variables

```bash
# Firefly-iii
FIREFLY_API_TOKEN=your-token-here
FIREFLY_BASE_URL=http://firefly:8080

# DoX
DOX_BASE_URL=http://dox:8000

# Smart Contracts
ETHEREUM_RPC_URL=http://localhost:8545
GROTOKEN_ADDRESS=0x...
GROUPPURCHASE_ADDRESS=0x...

# Event Bus
ENABLE_SCHEMA_VALIDATION=true
MAX_EVENT_RETRIES=3
```

## Production Deployment

See [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) for full deployment guide.

### Docker Compose

```yaml
services:
  pmoves-integrations:
    build: ./integrations
    environment:
      - FIREFLY_API_TOKEN=${FIREFLY_API_TOKEN}
      - DOX_BASE_URL=http://dox:8000
      - ETHEREUM_RPC_URL=http://ethereum:8545
    depends_on:
      - firefly
      - dox
    networks:
      - pmoves-net
```

## License

MIT

## Support

For issues and questions, please create an issue in the main PMOVES repository.
