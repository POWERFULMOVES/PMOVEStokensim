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
  console.log('New transactions:', event.data.transactions);

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
