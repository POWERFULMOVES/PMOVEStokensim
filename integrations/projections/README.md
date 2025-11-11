# PMOVES Projection Validation

Validation framework for business projection models against 5-year simulation runs.

## Overview

This module validates business projection models from `Projections/5-Year Business Projections_ AI + Tokenomics Model.md` by running detailed 260-week (5-year) simulations and comparing projected vs actual performance metrics.

## Models Validated

### 1. AI-Enhanced Local Service Business

**Investment**: $5,000
**Projected Year 5 Revenue**: $94,277
**Projected ROI**: 1,366%
**Break-even**: 3.3 months
**Success Probability**: 75%

High-performing AI-enabled service delivery model with strong community adoption and token rewards.

### 2. Sustainable Energy AI Consulting

**Investment**: $4,000
**Projected Year 5 Revenue**: $63,020
**Projected ROI**: 818%
**Break-even**: 4.4 months
**Success Probability**: 60%

Specialized consulting on energy efficiency using AI analytics with token incentives for savings.

### 3. Community Token Pre-Order System

**Investment**: $3,000
**Projected Year 5 Revenue**: $33,084
**Projected ROI**: 350%
**Break-even**: 6.9 months
**Success Probability**: 40%

Local community currency for pre-ordering goods and services with network effect challenges.

### Market Scenario Variants

- **Bull Market Scenario**: AI-Enhanced model with +50% ROI, +20% success rate
- **Bear Market Scenario**: Token Pre-Order with -40% ROI, -25% success rate

## Usage

### Run Validations

```bash
# All models (5-10 minutes)
npm run validate:projections

# Quick validation (1-2 minutes)
npm run validate:quick
```

### Programmatic Usage

```typescript
import {
  ProjectionValidator,
  AI_ENHANCED_LOCAL_SERVICE,
  ENERGY_CONSULTING,
  TOKEN_PRE_ORDER,
} from './projections';

const validator = new ProjectionValidator();

// Validate single model
const report = await validator.validate(AI_ENHANCED_LOCAL_SERVICE);

console.log('Validation Report:', report);
console.log('Actual ROI:', report.actual.roi);
console.log('Variance:', report.variance.roiVariance);

// Compare all models
const comparison = await validator.compareModels([
  AI_ENHANCED_LOCAL_SERVICE,
  ENERGY_CONSULTING,
  TOKEN_PRE_ORDER,
]);

console.log('Rankings:', comparison.ranking);
console.log('Recommendations:', comparison.recommendations);
```

### Custom Models

```typescript
import { ProjectionModel, ProjectionValidator } from './projections';

const customModel: ProjectionModel = {
  name: 'My Business Model',
  description: 'Description here',

  // Financial projections
  initialInvestment: 10000,
  projectedYear5Revenue: 150000,
  projectedRiskAdjustedROI: 10.0, // 1,000%
  projectedBreakEvenMonths: 6,
  successProbability: 0.65,

  // Simulation parameters
  populationSize: 300,
  participationRate: 0.55,
  weeklyRevenuePerParticipant: 0.75,
  growthRatePerWeek: 0.015,

  // Token economy (optional)
  tokenDistributionRate: 0.40,
  groupBuyingSavings: 0.15,
  stakingParticipation: 0.30,
};

const validator = new ProjectionValidator();
const report = await validator.validate(customModel);
```

## Validation Metrics

### Revenue Analysis

- **Projected Revenue**: Target revenue at year 5
- **Actual Revenue**: Simulated revenue after 260 weeks
- **Revenue Variance**: Percentage difference between projected and actual

### ROI Analysis

- **Projected ROI**: Risk-adjusted return on investment target
- **Actual ROI**: Simulated net profit / initial investment * 100
- **ROI Variance**: Percentage difference between projected and actual

### Break-Even Analysis

- **Projected Break-Even**: Expected time to profitability (months)
- **Actual Break-Even**: Simulated time to profitability (months)
- **Break-Even Variance**: Percentage difference in timing

### Risk Assessment

- **Success Achievement**: Did model meet targets within tolerance?
- **Confidence Level**: High, Medium, or Low based on variance
- **Risk Factors**: Identified challenges (e.g., low participation, revenue decline)
- **Mitigation Recommendations**: Strategies to address risk factors

### Growth Analysis

- **Revenue Growth Pattern**: Linear, Exponential, Plateau, or Declining
- **Profitability Trend**: Improving, Stable, or Declining
- **Token Economy Impact**: Positive, Neutral, or Negative (if applicable)
- **Market Scenario**: Bull, Normal, or Bear based on performance

## Export Options

### CSV Export

```typescript
import { exportAllResults, exportWeeklyDataCSV } from './projections';

// Export all results
exportAllResults(reports, weeklyDataMap, './output');

// Files generated:
// - model-name-report.csv (summary)
// - model-name-weekly.csv (260 weeks of data)
// - model-comparison.csv (side-by-side)
// - summary.json (JSON format)
```

### Markdown Report

```typescript
import { generateMarkdownReport } from './projections';

generateMarkdownReport(reports, ranking, './output/report.md');
```

## Market Scenarios

Four market scenarios are modeled:

| Scenario | Probability | ROI Impact | Success Rate Impact |
|----------|-------------|------------|---------------------|
| **Bull Market + High AI Adoption** | 25% | +50% | +20% |
| **Normal Growth** | 50% | 0% | 0% |
| **Economic Downturn** | 20% | -40% | -25% |
| **Crypto Winter + AI Skepticism** | 5% | -60% | -35% |

## Success Factors

### AI-Based Models

- 68% of small businesses already using AI
- 82% of AI adopters increased workforce
- 45% annual growth rates typical
- 3-5 month break-even periods

### Token-Based Models

- 53% failure rate since 2021
- 200+ active participants needed for success
- 30% participation threshold for network effects
- High regulatory risk

## Architecture

```
projections/
├── projection-validator.ts    # Core validation logic
├── scenario-configs.ts         # Projection model definitions
├── run-validation.ts           # CLI runner
├── export-results.ts           # CSV/JSON export utilities
├── index.ts                    # Public API
├── __tests__/
│   └── projection-validator.test.ts
└── README.md
```

## Testing

```bash
# Run projection tests
npm test projections/

# Watch mode
npm run test:watch -- projections/
```

## Integration with Other Modules

### Contract Models

Projection validator uses `ContractCoordinator` to run simulations with all 5 contract models:
- GroToken distribution
- FoodUSD spending
- GroupPurchase savings
- GroVault staking
- CoopGovernor voting

### Firefly-iii

Validation results can be compared against real-world financial data from Firefly-iii for further validation.

### PMOVES-DoX

Export CSV files can be uploaded to DoX for:
- AI-powered insights
- Multi-scenario CHR clustering
- Interactive dashboard generation
- Natural language queries

## Example Output

```
🚀 PMOVES Projection Validation Suite
Running 5-year (260-week) simulations for all business models...

================================================================================
VALIDATION REPORT: AI-Enhanced Local Service Business
================================================================================

📊 PROJECTIONS vs ACTUAL
--------------------------------------------------------------------------------

Revenue:
  Projected: $94,277
  Actual:    $87,450
  Variance:  -7.2%

ROI:
  Projected: 1366%
  Actual:    1249%
  Variance:  -8.6%

Break-Even:
  Projected: 3.3 months
  Actual:    3.8 months
  Variance:  +15.2%

⚠️  RISK ASSESSMENT
--------------------------------------------------------------------------------

Success Achieved: ✅ YES
Confidence Level: HIGH

⚠️  Revenue decline in final weeks

Mitigation Recommendations:
  💡 Implement retention strategies and market expansion

📈 ANALYSIS
--------------------------------------------------------------------------------

Revenue Growth:    EXPONENTIAL
Profitability:     IMPROVING
Market Scenario:   NORMAL
Token Impact:      POSITIVE
================================================================================
```

## License

MIT

## Support

For questions and issues, see the main PMOVES repository.
