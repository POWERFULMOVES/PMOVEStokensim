# PMOVES Folder Structure

Complete guide to the PMOVES Token Economy Simulator project organization.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Root Directory](#root-directory)
3. [Integrations Module](#integrations-module)
4. [Phase-Specific Directories](#phase-specific-directories)
5. [Documentation Files](#documentation-files)
6. [Configuration Files](#configuration-files)
7. [Output Directories](#output-directories)
8. [Navigation Guide](#navigation-guide)

---

## Project Overview

PMOVES is organized into a modular structure with four progressive phases:

```
PMOVEStokensim/
├── integrations/           # Main source code (Phases 1-4)
├── contracts/             # Event schemas & samples
├── output/                # Generated reports (created on first run)
├── Projections/           # Business projection documents
├── *.md                   # Documentation files
└── Configuration files    # package.json, tsconfig.json, etc.
```

**Key Principle:** Each phase is self-contained with its own README, tests, and exports.

---

## Root Directory

### Top-Level Structure

```
PMOVEStokensim/
├── integrations/                    # Main TypeScript implementation
├── contracts/                       # Event contracts & schemas
├── Projections/                     # Business projection analysis
├── pmoves-nextjs/                   # Next.js web UI (optional)
├── output/                          # Generated reports (gitignored)
│
├── README.md                        # Main GitHub landing page
├── QUICK_START.md                   # 5-minute getting started guide
├── USER_GUIDE.md                    # Complete user documentation
├── TECHNICAL_GUIDE.md               # Architecture & development
├── API_REFERENCE.md                 # Complete API documentation
├── FOLDER_STRUCTURE.md              # This file
├── DOCUMENTATION_INDEX.md           # Master documentation index
│
├── TEST_RESULTS_PHASE3.md           # Latest validation results
├── CHANGELOG_PHASE3_FIXES.md        # Bug fix changelog
├── PROJECT_STATUS.md                # Overall project status
├── PHASE4_IMPLEMENTATION.md         # Phase 4 implementation summary
├── PHASE4_PLAN.md                   # Phase 4 architecture plan
│
└── [Historical Docs]                # Legacy analysis documents
```

### Key Root Files

#### Documentation (Current)

| File | Purpose | Audience |
|------|---------|----------|
| **README.md** | Main GitHub page, project overview | All users |
| **QUICK_START.md** | 5-minute setup guide | New users |
| **USER_GUIDE.md** | Complete usage documentation | End users, analysts |
| **TECHNICAL_GUIDE.md** | Architecture & implementation | Developers, architects |
| **API_REFERENCE.md** | API documentation | Developers |
| **FOLDER_STRUCTURE.md** | Project organization (this file) | All users |
| **DOCUMENTATION_INDEX.md** | Master index with cross-links | All users |

#### Results & Reports

| File | Purpose | Last Updated |
|------|---------|--------------|
| **TEST_RESULTS_PHASE3.md** | Full validation suite results (5 models) | 2025-11-13 |
| **CHANGELOG_PHASE3_FIXES.md** | Bug fixes (6 issues resolved) | 2025-11-13 |
| **PROJECT_STATUS.md** | Overall project status | 2025-11-12 |

#### Implementation Documentation

| File | Purpose |
|------|---------|
| **PHASE4_IMPLEMENTATION.md** | Phase 4 implementation summary |
| **PHASE4_PLAN.md** | Phase 4 architecture & planning |

#### Historical Documentation

| File | Purpose | Status |
|------|---------|--------|
| INTEGRATION_ARCHITECTURE.md | Initial architecture design | Historical |
| FIREFLY_III_INTEGRATION_ANALYSIS.md | Firefly integration analysis | Historical |
| ECONOMIC_MODEL_VALIDATION_REPORT.md | Early validation results | Superseded by TEST_RESULTS_PHASE3.md |
| IMPLEMENTATION_PLAN.md | Original implementation plan | Historical |
| PMOVES_DOX_ANALYSIS.md | DoX integration analysis | Historical |

---

## Integrations Module

The `integrations/` directory contains all Phase 1-4 source code.

### Structure

```
integrations/
├── event-bus/              # Phase 1: Pub/sub messaging
├── contracts/              # Phase 2: Token economy models
├── projections/            # Phase 3: Validation framework
├── firefly/                # Phase 4: Real data integration
├── dox/                    # Future: DoX integration
│
├── index.ts                # Main module exports
├── integration-coordinator.ts  # Cross-phase coordinator
├── example-usage.ts        # Usage examples
│
├── package.json            # Dependencies & scripts
├── package-lock.json       # Locked dependency versions
├── tsconfig.json           # TypeScript configuration
├── tsconfig.run.json       # Runtime TypeScript config
│
└── README.md               # Integrations overview
```

### Key Files

#### Main Exports

```typescript
// integrations/index.ts
export { EventBus } from './event-bus';
export { ContractCoordinator } from './contracts';
export { ProjectionValidator } from './projections';
export { FireflyIntegration } from './firefly';
```

#### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "validate:quick": "Quick validation (1 model)",
    "validate:all": "Full validation (5 models)",
    "validate:compare": "Compare models with ranking",
    "firefly:calibrate": "Run Firefly-iii calibration",
    "build": "tsc",
    "lint": "eslint ."
  }
}
```

---

## Phase-Specific Directories

### Phase 1: Event Bus

```
integrations/event-bus/
├── event-bus.ts              # Core pub/sub implementation (295 lines)
├── schema-validator.ts       # JSON schema validation
├── index.ts                  # Module exports
├── README.md                 # Phase 1 documentation
│
└── __tests__/
    └── event-bus.test.ts     # Unit tests (100% coverage)
```

**Purpose:** Decoupled event-driven communication between contracts

**Key Components:**
- `EventBus` - Pub/sub event system with retry logic
- `SchemaValidator` - Validates events against JSON schemas

**Event Topics:**
- `finance.transactions.ingested.v1`
- `contracts.initialized.v1`

### Phase 2: Contract Models

```
integrations/contracts/
├── contract-coordinator.ts   # Unified orchestration (410 lines)
├── grotoken-model.ts         # Token distribution
├── foodusd-model.ts          # Food spending tracker
├── grouppurchase-model.ts    # Cooperative purchasing
├── grovault-model.ts         # Token staking
├── coopgovernor-model.ts     # Quadratic voting governance
│
├── contract-listeners.ts     # Event listeners
├── example-contract-simulation.ts  # Usage example
├── index.ts                  # Module exports
├── README.md                 # Phase 2 documentation
│
└── __tests__/
    ├── contract-coordinator.test.ts
    ├── grotoken-model.test.ts
    ├── foodusd-model.test.ts
    ├── grouppurchase-model.test.ts
    ├── grovault-model.test.ts
    └── coopgovernor-model.test.ts
```

**Purpose:** Simulate 5 smart contract models for token economy

**5 Contract Models:**

1. **GroTokenDistribution** (`grotoken-model.ts`)
   - Token distribution to participants
   - Gaussian distribution (Box-Muller transform)
   - $2 per token value

2. **FoodUSDModel** (`foodusd-model.ts`)
   - Food spending tracker (stablecoin)
   - Category breakdown (groceries, dining, etc.)
   - Weekly budget allocation

3. **GroupPurchaseModel** (`grouppurchase-model.ts`)
   - Cooperative bulk purchasing
   - 15% savings mechanism
   - Order creation & contribution

4. **GroVaultModel** (`grovault-model.ts`)
   - Token staking with time locks
   - APY: 10-50% based on duration
   - Voting power calculation

5. **CoopGovernorModel** (`coopgovernor-model.ts`)
   - Quadratic voting governance
   - Proposal creation & voting
   - Participation tracking

**ContractCoordinator:**
- Orchestrates all 5 models
- Processes weekly simulation steps
- Provides unified API

### Phase 3: Projection Validation

```
integrations/projections/
├── projection-validator.ts   # Core validation engine (465 lines)
├── scenario-configs.ts       # Business models (228 lines)
├── calibration-engine.ts     # Parameter calibration (391 lines)
├── export-results.ts         # Report generation
├── run-validation.ts         # CLI runner
│
├── index.ts                  # Module exports
├── README.md                 # Phase 3 documentation
│
└── __tests__/
    └── projection-validator.test.ts
```

**Purpose:** Validate 5-year business projections against simulations

**Key Components:**

1. **ProjectionValidator** (`projection-validator.ts`)
   - 260-week simulation engine
   - Variance analysis
   - Risk assessment
   - Report generation

2. **Scenario Configurations** (`scenario-configs.ts`)
   - **Baseline Models:**
     - AI-Enhanced Local Service (1366% ROI, 75% success)
     - Sustainable Energy AI (818% ROI, 60% success)
     - Community Token Pre-Order (350% ROI, 40% success)

   - **Market Variants:**
     - Bull Market (+50% ROI, +20% success rate)
     - Bear Market (-40% ROI, -25% success rate)

3. **CalibrationEngine** (`calibration-engine.ts`)
   - Calibrates 4 key parameters
   - Confidence scoring (HIGH/MEDIUM/LOW)
   - Recommendation generation

4. **Export Results** (`export-results.ts`)
   - Markdown report generation
   - CSV exports (3 files)
   - RFC 4180 compliant escaping

**Output:**
- `TEST_RESULTS_PHASE3.md` - Full validation report
- `model-comparison.csv` - Model rankings
- `weekly-progression.csv` - Week-by-week data

### Phase 4: Firefly Integration

```
integrations/firefly/
├── firefly-integration.ts    # Pipeline coordinator (449 lines)
├── firefly-client.ts         # HTTP API client
├── data-transformer.ts       # Category mapping (413 lines)
├── calibration-engine.ts     # Moved to projections/ (shared)
├── run-integration.ts        # CLI runner (114 lines)
│
├── index.ts                  # Module exports
└── README.md                 # Phase 4 documentation
```

**Purpose:** Calibrate projections using real Firefly-iii spending data

**Key Components:**

1. **FireflyClient** (`firefly-client.ts`)
   - HTTP client for Firefly-iii API
   - Transaction fetching
   - Category spending analysis
   - Connection testing

2. **FireflyDataTransformer** (`data-transformer.ts`)
   - Category mapping (Firefly → FoodUSD)
   - Weekly aggregation
   - Participation metrics calculation
   - Spending distribution analysis

3. **FireflyIntegration** (`firefly-integration.ts`)
   - Complete integration pipeline
   - Baseline vs calibrated comparison
   - 4-report generation

**Category Mappings:**

| Firefly Category | FoodUSD Category |
|------------------|------------------|
| Groceries, Supermarket | groceries |
| Restaurants | dining |
| Fast Food | prepared_food |
| Takeaway, Delivery | food_delivery |
| Farmers Market | farmers_market |

**Output Reports:**
1. `CALIBRATION_REPORT.md` - Comprehensive markdown
2. `category-comparison.csv` - Category-level variance
3. `parameter-adjustments.csv` - Parameter changes
4. `weekly-comparison.csv` - Week-by-week comparison

### Future: DoX Integration

```
integrations/dox/
└── dox-client.ts             # DoX API client (future)
```

**Purpose:** Future integration with PMOVES DoX system

---

## Contracts Directory

Event contracts and schemas for event bus validation.

### Structure

```
contracts/
├── schemas/                  # JSON schemas by namespace
│   ├── agentzero/           # Agent Zero events
│   ├── analysis/            # Analysis events
│   ├── archon/              # Archon crawler events
│   ├── common/              # Common envelope schema
│   ├── content/             # Content publication events
│   ├── finance/             # Finance events (used in Phase 2)
│   ├── gen/                 # Generation events
│   ├── geometry/            # Geometry events
│   ├── health/              # Health metrics events
│   ├── ingest/              # Ingestion events
│   ├── kb/                  # Knowledge base events
│   └── persona/             # Persona events
│
├── samples/                 # Sample event payloads
│   ├── content.published.v1.sample.json
│   ├── finance.monthly.summary.v1.sample.json
│   └── health.weekly.summary.v1.sample.json
│
└── topics.json              # Event topic registry
```

**Purpose:** Define event contracts for pub/sub messaging

**Key Schemas:**

#### Finance Events (Used in Phase 2)

```json
// finance/transactions.ingested.v1.schema.json
{
  "type": "object",
  "properties": {
    "namespace": { "type": "string" },
    "transactions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "amount": { "type": "number" },
          "category": { "type": "string" },
          "date": { "type": "string" },
          "description": { "type": "string" }
        }
      }
    },
    "ingested_at": { "type": "string" }
  },
  "required": ["namespace", "transactions", "ingested_at"]
}
```

---

## Projections Directory

Business projection analysis documents.

### Structure

```
Projections/
├── 5-Year Business Projections_ AI + Tokenomics Model.md
├── Community Wealth Building Through Diverse Resident.md
├── Containerized Micro Business Model_ Docker-Like Sc.md
└── Docker-Style Scalable Community Business Container.md
```

**Purpose:** Business analysis documents that informed projection models

**Content:**
- 5-year revenue projections
- ROI calculations
- Market analysis
- Token economy design
- Success probability estimates

**How Used:**
These documents were analyzed to create the 3 baseline projection models in `integrations/projections/scenario-configs.ts`.

---

## Output Directories

Generated reports and data files.

### Structure

```
output/                           # Created on first run (gitignored)
├── validation/                   # Validation reports
│   ├── model-comparison.csv
│   ├── weekly-progression-{model}.csv
│   └── validation-report-{model}.md
│
├── firefly-calibration/          # Firefly integration reports
│   ├── CALIBRATION_REPORT.md
│   ├── category-comparison.csv
│   ├── parameter-adjustments.csv
│   └── weekly-comparison.csv
│
└── [Custom output directories]   # User-defined
```

**File Types:**

#### Markdown Reports
- Comprehensive summaries
- Parameter adjustments
- Risk assessments
- Recommendations

#### CSV Exports
- Model comparisons
- Weekly progressions
- Category breakdowns
- Parameter changes

**Access:**
All output files are generated programmatically and should not be edited manually.

---

## Documentation Files

### Current Documentation (2025-11-15)

| File | Lines | Purpose |
|------|-------|---------|
| **README.md** | 394 | Main GitHub landing page |
| **QUICK_START.md** | ~400 | 5-minute setup guide |
| **USER_GUIDE.md** | ~600 | Complete user documentation |
| **TECHNICAL_GUIDE.md** | ~900 | Architecture & development |
| **API_REFERENCE.md** | TBD | API documentation |
| **FOLDER_STRUCTURE.md** | This file | Project organization |
| **DOCUMENTATION_INDEX.md** | ~376 | Master index |

### Phase-Specific READMEs

| File | Purpose |
|------|---------|
| `integrations/README.md` | Integrations overview |
| `integrations/event-bus/README.md` | Phase 1 documentation |
| `integrations/contracts/README.md` | Phase 2 documentation |
| `integrations/projections/README.md` | Phase 3 documentation |
| `integrations/firefly/README.md` | Phase 4 documentation |

### Cross-Links

All documentation files use markdown links for easy navigation:

```markdown
[Link Text](FILE.md)
[Link to Section](FILE.md#section-anchor)
```

**Example Navigation:**
1. Start with [README.md](README.md) - Project overview
2. Try [QUICK_START.md](QUICK_START.md) - Get running in 5 minutes
3. Read [USER_GUIDE.md](USER_GUIDE.md) - Complete usage guide
4. Explore [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) - Architecture deep dive
5. Reference [API_REFERENCE.md](API_REFERENCE.md) - API details

---

## Configuration Files

### TypeScript Configuration

#### integrations/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./",
    "declaration": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
```

**Purpose:** Main TypeScript compilation settings

#### integrations/tsconfig.run.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true
  }
}
```

**Purpose:** Runtime execution with `ts-node`

### Package Configuration

#### integrations/package.json

```json
{
  "name": "pmoves-integrations",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "validate:quick": "...",
    "validate:all": "...",
    "firefly:calibrate": "..."
  },
  "dependencies": {
    "ethers": "^6.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "typescript": "^5.0",
    "jest": "^29.x",
    "ts-jest": "^29.x",
    "@types/node": "^18.x"
  }
}
```

**Key Dependencies:**
- **ethers** - Ethereum utilities (address generation)
- **axios** - HTTP client for Firefly-iii
- **typescript** - Type-safe development
- **jest** - Testing framework

---

## Navigation Guide

### By User Type

#### New Users
1. Start: [README.md](README.md)
2. Setup: [QUICK_START.md](QUICK_START.md)
3. Run: `npm run validate:quick`
4. Explore: [USER_GUIDE.md](USER_GUIDE.md)

#### Developers
1. Architecture: [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)
2. Structure: [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) (this file)
3. API: [API_REFERENCE.md](API_REFERENCE.md)
4. Source: `integrations/` directory

#### Business Analysts
1. Overview: [README.md](README.md)
2. Usage: [USER_GUIDE.md](USER_GUIDE.md)
3. Results: [TEST_RESULTS_PHASE3.md](TEST_RESULTS_PHASE3.md)
4. Models: `integrations/projections/scenario-configs.ts`

### By Task

#### Run Validation
1. Quick: `npm run validate:quick`
2. Full: `npm run validate:all`
3. Compare: `npm run validate:compare`
4. Results: `../TEST_RESULTS_PHASE3.md`

#### Firefly Integration
1. Setup: [USER_GUIDE.md § Firefly-iii Integration](USER_GUIDE.md#firefly-iii-integration)
2. Run: `npm run firefly:calibrate`
3. Reports: `output/firefly-calibration/`
4. API: `integrations/firefly/`

#### Customize Models
1. Models: `integrations/projections/scenario-configs.ts`
2. Add: Create new `ProjectionModel`
3. Validate: `validator.validate(MY_MODEL)`
4. Export: `export const MY_MODEL = { ... }`

#### Add Contract
1. Template: `integrations/contracts/grotoken-model.ts`
2. Create: New TypeScript class extending base
3. Test: `__tests__/my-model.test.ts`
4. Integrate: Add to `ContractCoordinator`

### By Phase

#### Phase 1: Event Bus
- **README:** `integrations/event-bus/README.md`
- **Source:** `integrations/event-bus/`
- **Tests:** `integrations/event-bus/__tests__/`
- **Schemas:** `contracts/schemas/`

#### Phase 2: Contracts
- **README:** `integrations/contracts/README.md`
- **Source:** `integrations/contracts/`
- **Tests:** `integrations/contracts/__tests__/`
- **Models:** 5 contract model files

#### Phase 3: Projections
- **README:** `integrations/projections/README.md`
- **Source:** `integrations/projections/`
- **Tests:** `integrations/projections/__tests__/`
- **Results:** `TEST_RESULTS_PHASE3.md`

#### Phase 4: Firefly
- **README:** `integrations/firefly/README.md`
- **Source:** `integrations/firefly/`
- **Reports:** `output/firefly-calibration/`
- **Plan:** `PHASE4_PLAN.md`, `PHASE4_IMPLEMENTATION.md`

---

## File Size Reference

### Source Code

| File | Lines | Complexity |
|------|-------|------------|
| `projection-validator.ts` | 465 | High |
| `firefly-integration.ts` | 449 | High |
| `data-transformer.ts` | 413 | Medium |
| `contract-coordinator.ts` | 410 | High |
| `calibration-engine.ts` | 391 | High |
| `event-bus.ts` | 295 | Medium |
| `scenario-configs.ts` | 228 | Low |

### Documentation

| File | Lines | Audience |
|------|-------|----------|
| `TECHNICAL_GUIDE.md` | ~900 | Developers |
| `USER_GUIDE.md` | ~600 | End users |
| `QUICK_START.md` | ~400 | New users |
| `README.md` | 394 | All users |
| `DOCUMENTATION_INDEX.md` | 376 | All users |

### Test Files

| File | Tests | Coverage |
|------|-------|----------|
| `event-bus.test.ts` | 15+ | 100% |
| `contract-coordinator.test.ts` | 10+ | 95% |
| `projection-validator.test.ts` | 8+ | 90% |

---

## Quick Reference

### Common File Locations

| What | Where |
|------|-------|
| **Main README** | `README.md` |
| **User Guide** | `USER_GUIDE.md` |
| **Tech Guide** | `TECHNICAL_GUIDE.md` |
| **Latest Results** | `TEST_RESULTS_PHASE3.md` |
| **Bug Fixes** | `CHANGELOG_PHASE3_FIXES.md` |
| **Event Bus** | `integrations/event-bus/` |
| **Contracts** | `integrations/contracts/` |
| **Projections** | `integrations/projections/` |
| **Firefly** | `integrations/firefly/` |
| **Schemas** | `contracts/schemas/` |
| **Tests** | `integrations/*/__ tests__/` |
| **Output** | `output/` (created on first run) |

### Finding Specific Code

| Looking For | File |
|-------------|------|
| Token distribution | `integrations/contracts/grotoken-model.ts` |
| Food spending | `integrations/contracts/foodusd-model.ts` |
| Group purchases | `integrations/contracts/grouppurchase-model.ts` |
| Staking | `integrations/contracts/grovault-model.ts` |
| Governance | `integrations/contracts/coopgovernor-model.ts` |
| Validation logic | `integrations/projections/projection-validator.ts` |
| Business models | `integrations/projections/scenario-configs.ts` |
| Firefly client | `integrations/firefly/firefly-client.ts` |
| Category mapping | `integrations/firefly/data-transformer.ts` |
| Calibration | `integrations/projections/calibration-engine.ts` |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-15 | Initial comprehensive documentation |
| 0.9.0 | 2025-11-13 | Phase 4 complete |
| 0.8.0 | 2025-11-13 | Phase 3 bug fixes |
| 0.7.0 | 2025-11-12 | Phase 3 complete |

---

<p align="center">
  <a href="README.md">Main README</a> •
  <a href="QUICK_START.md">Quick Start</a> •
  <a href="USER_GUIDE.md">User Guide</a> •
  <a href="TECHNICAL_GUIDE.md">Technical Guide</a>
</p>

<p align="center">
  <strong>PMOVES Folder Structure Guide</strong><br>
  Last updated: 2025-11-15
</p>
