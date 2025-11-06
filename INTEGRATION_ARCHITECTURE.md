# PMOVEStokensim Integration Architecture

**Version:** 1.0
**Date:** 2025-11-06
**Status:** Design Phase

---

## Executive Summary

This document outlines the integration architecture for connecting three PMOVES repositories to create a comprehensive cooperative economics analysis platform:

1. **PMOVEStokensim** - Economic simulation engine
2. **PMOVES-Firefly-iii** - Real-world financial data tracking
3. **PMOVES-DoX** - Advanced data analysis tools (pending access)

**Goal:** Enable real-world validation of simulation models using actual cooperative member data, enhanced visualizations, and advanced analytics.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Current Capabilities](#2-current-capabilities)
3. [Integration Architecture](#3-integration-architecture)
4. [Data Flow](#4-data-flow)
5. [API Integration](#5-api-integration)
6. [Enhanced Visualizations](#6-enhanced-visualizations)
7. [Implementation Phases](#7-implementation-phases)
8. [Technical Requirements](#8-technical-requirements)
9. [Security & Privacy](#9-security--privacy)
10. [Success Metrics](#10-success-metrics)

---

## 1. System Overview

### 1.1 Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PMOVES Ecosystem                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐       ┌──────────────┐      ┌──────────┐ │
│  │  PMOVESToken │◄─────►│ Firefly-iii  │◄────►│ DoX      │ │
│  │  Simulator   │       │ (Real Data)  │      │ Analytics│ │
│  └──────────────┘       └──────────────┘      └──────────┘ │
│        │                       │                     │       │
│        │                       │                     │       │
│        ▼                       ▼                     ▼       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Unified Analysis Dashboard                   │  │
│  │  - Simulation vs Reality Comparison                  │  │
│  │  - Validation Metrics                                │  │
│  │  │  - Advanced Visualizations                         │  │
│  │  - Predictive Models                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 System Components

#### **PMOVEStokensim**
- **Purpose:** Economic simulation and scenario modeling
- **Technology:** Python backend (Flask), Next.js frontend (React/TypeScript)
- **Capabilities:**
  - Dual-scenario comparison (Traditional vs Cooperative)
  - 20+ economic metrics calculation
  - Wealth distribution modeling
  - Inequality analysis (Gini coefficient, wealth gap)
  - GroToken community currency simulation
  - **NEW:** Data export (CSV, JSON)
  - **NEW:** Export button components

#### **PMOVES-Firefly-iii**
- **Purpose:** Real-world financial data tracking
- **Technology:** Laravel/PHP, MySQL, REST API
- **Capabilities:**
  - Personal/household finance management
  - 100+ REST API endpoints
  - Double-entry bookkeeping
  - Budget tracking, savings goals
  - Multi-user/group support
  - Webhook system for real-time updates
  - Data export capabilities

#### **PMOVES-DoX** (Pending Access)
- **Purpose:** Advanced data analysis and visualization
- **Technology:** TBD (likely Python/Jupyter)
- **Anticipated Capabilities:**
  - Statistical analysis
  - Machine learning models
  - Advanced visualizations
  - Data transformation pipelines

---

## 2. Current Capabilities

### 2.1 PMOVEStokensim - Current State

**✅ Implemented:**
- Economic simulation engine (156 weeks default)
- 20+ economic metrics
- Recharts-based visualizations
  - Line charts (wealth, Gini, poverty)
  - Bar charts (quintile distribution)
  - Radar charts (dashboard indicators)
- Parameter sensitivity analysis
- Narrative generation
- **NEW:** Complete data export suite
  - CSV export for history, members, events
  - JSON export for complete simulation
  - Summary statistics export
  - Wealth distribution analysis export
- **NEW:** Export UI components
  - Dropdown menu with multiple export options
  - Single-click CSV/JSON exports
  - "Export All" batch download

**❌ Missing:**
- Advanced chart types (heatmaps, violin plots, sankey diagrams)
- Multi-scenario comparison (can only compare A vs B in single run)
- Real data import
- Interactive filtering/drill-down
- PDF report generation

### 2.2 Firefly-iii - Current State

**✅ Available:**
- 100+ REST API endpoints
- Transaction data (7 types)
- Account management (14 types)
- Budget tracking
- Savings goals (piggy banks)
- Recurring transactions (bills)
- Multi-user/group support
- Webhook system
- CSV export

**Integration Potential:**
- API authentication via Personal Access Token
- Real-time data via webhooks
- Bulk data export for analysis
- Group-level data for cooperative analysis

---

## 3. Integration Architecture

### 3.1 Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Data Collection & Input                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Firefly-iii (Real Data)          PMOVEStokensim (Params)   │
│  ├─ Transactions                  ├─ Simulation Config      │
│  ├─ Budgets                       ├─ Member Count           │
│  ├─ Accounts                      └─ Economic Parameters    │
│  ├─ Bills/Recurring                                          │
│  └─ Savings Goals                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Processing & Analysis                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Integration Service (NEW)                                   │
│  ├─ Data Transformation                                      │
│  │  ├─ Firefly → Simulation Format                          │
│  │  ├─ Simulation → Analysis Format                         │
│  │  └─ Standardized Metrics                                 │
│  │                                                            │
│  ├─ Validation Engine                                        │
│  │  ├─ Compare Simulated vs Actual                          │
│  │  ├─ Calculate Deviations                                 │
│  │  └─ Confidence Intervals                                 │
│  │                                                            │
│  └─ DoX Analytics (When Available)                           │
│     ├─ Statistical Analysis                                  │
│     ├─ Predictive Models                                     │
│     └─ Advanced Visualizations                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Visualization & Reporting                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Unified Dashboard (Enhanced PMOVEStokensim Frontend)       │
│  ├─ Simulation Results                                       │
│  ├─ Real Data Comparison                                     │
│  ├─ Validation Metrics                                       │
│  ├─ Advanced Charts (NEW)                                    │
│  │  ├─ Heatmaps (parameter sensitivity)                     │
│  │  ├─ Violin Plots (wealth distribution)                   │
│  │  ├─ Waterfall Charts (wealth flow)                       │
│  │  ├─ Sankey Diagrams (economic flows)                     │
│  │  └─ Scatter Plots (correlations)                         │
│  ├─ Interactive Features (NEW)                               │
│  │  ├─ Time-series filtering                                │
│  │  ├─ Multi-scenario overlay                               │
│  │  └─ Drill-down analysis                                  │
│  └─ Export & Reporting                                       │
│     ├─ CSV/JSON exports ✅                                   │
│     ├─ PDF reports (TODO)                                    │
│     └─ Share links (TODO)                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Integration Points

#### **Point A: Firefly → PMOVEStokensim**
**Purpose:** Use real financial data to validate simulation parameters

**Data Flow:**
1. Firefly-iii API → Extract transaction data
2. Calculate actual spending patterns
3. Derive simulation parameters from real data
4. Run simulation with real-world-calibrated parameters

**Example:**
```typescript
// Real data from Firefly
const actualSpending = await fetchFireflyTransactions(userGroup);
const internalSpending = calculateInternalSpending(actualSpending);
const externalSpending = calculateExternalSpending(actualSpending);

// Derive simulation parameters
const params = {
  PERCENT_SPEND_INTERNAL_AVG: internalSpending / totalSpending,
  WEEKLY_FOOD_BUDGET_AVG: calculateAverageBudget(actualSpending),
  WEEKLY_INCOME_AVG: calculateAverageIncome(actualSpending),
  // ... more parameters
};

// Run simulation with real-world parameters
const simulationResults = await runSimulation(params);
```

#### **Point B: PMOVEStokensim → DoX**
**Purpose:** Advanced analysis of simulation results

**Data Flow:**
1. Export simulation results (CSV/JSON) ✅
2. Import into DoX analytics platform
3. Perform statistical analysis
4. Generate advanced visualizations
5. Return insights to PMOVEStokensim dashboard

**Example:**
```python
# In DoX (Python)
import pandas as pd
from pmoves_integration import load_simulation_results

# Load simulation data
sim_data = load_simulation_results('simulation_history_2025-11-06.csv')

# Advanced analysis
correlation_matrix = sim_data.corr()
regression_model = train_wealth_prediction_model(sim_data)
anomalies = detect_anomalies(sim_data)

# Generate visualizations
create_heatmap(correlation_matrix)
create_violin_plot(sim_data['wealth_distribution'])
create_sankey_diagram(sim_data['economic_flows'])

# Export results
export_analysis_results('advanced_analysis_2025-11-06.json')
```

#### **Point C: Firefly ↔ Dashboard (Real-time)**
**Purpose:** Live monitoring of actual cooperative economics

**Data Flow:**
1. Firefly-iii webhooks → Trigger on new transaction
2. Integration service → Process and standardize
3. Dashboard → Update real-time metrics
4. Compare with simulation predictions

**Example:**
```typescript
// Webhook handler
app.post('/api/webhook/firefly', async (req, res) => {
  const event = req.body;

  if (event.trigger === 'STORE_TRANSACTION') {
    const transaction = event.content;

    // Update real-time metrics
    await updateRealTimeMetrics(transaction);

    // Compare with simulation
    const deviation = compareWithSimulation(transaction);

    // Notify if significant deviation
    if (Math.abs(deviation) > 0.20) { // 20% deviation
      notifySignificantDeviation(deviation);
    }
  }

  res.status(200).json({ received: true });
});
```

---

## 4. Data Flow

### 4.1 End-to-End Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Real-World Data Collection (Firefly-iii)                  │
│    ────────────────────────────────────────────              │
│    Cooperative members track actual spending:                │
│    - Food purchases (internal vs external)                   │
│    - Group buying transactions                               │
│    - Local production purchases                              │
│    - GroToken equivalent tracking                            │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. Data Extraction & Transformation                          │
│    ────────────────────────────────────────                  │
│    Integration Service:                                      │
│    - Fetch via Firefly API                                   │
│    - Categorize transactions (internal/external)             │
│    - Calculate weekly summaries                              │
│    - Derive simulation parameters                            │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. Simulation Execution (PMOVEStokensim)                     │
│    ─────────────────────────────────────────                 │
│    Run two parallel simulations:                             │
│    A. With default/theoretical parameters                    │
│    B. With real-world-derived parameters                     │
│    Compare results to validate assumptions                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. Data Export & Analysis Preparation                        │
│    ─────────────────────────────────────────────             │
│    Export simulation results:                                │
│    ✅ CSV: Weekly history, members, events                   │
│    ✅ JSON: Complete simulation bundle                       │
│    ✅ Summary statistics                                     │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. Advanced Analysis (DoX - When Available)                  │
│    ────────────────────────────────────────────              │
│    Perform deep analysis:                                    │
│    - Statistical significance testing                        │
│    - Correlation analysis                                    │
│    - Predictive modeling                                     │
│    - Anomaly detection                                       │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. Validation & Comparison                                   │
│    ──────────────────────────────────────                    │
│    Compare three datasets:                                   │
│    1. Simulated (theoretical parameters)                     │
│    2. Simulated (real parameters)                            │
│    3. Actual (from Firefly-iii)                              │
│                                                               │
│    Calculate validation metrics:                             │
│    - Mean Absolute Error (MAE)                               │
│    - Root Mean Square Error (RMSE)                           │
│    - R² (coefficient of determination)                       │
│    - Directional accuracy                                    │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 7. Visualization & Reporting                                 │
│    ──────────────────────────────────                        │
│    Unified Dashboard displays:                               │
│    - Simulation results                                      │
│    - Real data overlays                                      │
│    - Validation metrics                                      │
│    - Advanced charts                                         │
│    - Actionable insights                                     │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 8. Feedback Loop                                             │
│    ─────────────────                                         │
│    Use insights to:                                          │
│    - Refine simulation parameters                            │
│    - Adjust cooperative strategies                           │
│    - Update savings assumptions                              │
│    - Improve GroToken distribution                           │
│    - Optimize group buying practices                         │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Data Schemas

#### **Firefly-iii Transaction** → **Simulation Member**
```typescript
interface FireflyTransaction {
  id: number;
  date: string;
  amount: string;
  description: string;
  category_name: string; // "Food - Internal" vs "Food - External"
  budget_id: number;
  user: string;
}

// Transform to
interface SimulationMember {
  id: string;
  weekly_food_budget: number;     // Derived from Firefly budget
  weekly_income: number;          // Derived from Firefly income transactions
  propensity_to_spend_internal: number; // Calculated ratio
  grotoken_balance: number;       // Tracked separately or simulated
}
```

#### **Simulation Results** → **Validation Dataset**
```typescript
interface ValidationDataset {
  week: number;

  // Simulated (theoretical)
  sim_theoretical: {
    avg_wealth: number;
    gini: number;
    poverty_rate: number;
    // ... more metrics
  };

  // Simulated (real parameters)
  sim_real_params: {
    avg_wealth: number;
    gini: number;
    poverty_rate: number;
  };

  // Actual (from Firefly)
  actual: {
    avg_wealth: number;
    gini: number;
    poverty_rate: number;
  };

  // Validation metrics
  validation: {
    wealth_error: number;       // |sim - actual|
    wealth_error_pct: number;   // error / actual * 100
    directional_accuracy: boolean; // sim trend matches actual trend
  };
}
```

---

## 5. API Integration

### 5.1 Firefly-iii API Endpoints

**Base URL:** `https://your-firefly-instance.com/api/v1`

**Authentication:** Bearer token (Personal Access Token)

#### **Key Endpoints for Integration:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/transactions` | GET | Fetch all transactions |
| `/api/v1/accounts` | GET | Get account list |
| `/api/v1/budgets` | GET | Get budget data |
| `/api/v1/insight/income/category` | GET | Income analysis |
| `/api/v1/insight/expense/category` | GET | Expense analysis |
| `/api/v1/insight/transfer/category` | GET | Transfer analysis |
| `/api/v1/users` | GET | Get user/group list |
| `/api/v1/webhooks` | POST | Create webhook |

**Example Integration Code:**

```typescript
// Firefly API Client
class FireflyAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async getTransactions(startDate: string, endDate: string): Promise<Transaction[]> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/transactions?start=${startDate}&end=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data.data;
  }

  async getInsightExpenses(startDate: string, endDate: string): Promise<ExpenseInsight> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/insight/expense/category?start=${startDate}&end=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return await response.json();
  }

  async createWebhook(trigger: string, url: string): Promise<Webhook> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/webhooks`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger,
          response: 'TRANSACTIONS',
          delivery: 'JSON',
          url,
          active: true,
        }),
      }
    );

    return await response.json();
  }
}
```

### 5.2 New Integration Service API

**Proposed Endpoints:**

```
POST   /api/integration/firefly/sync          - Sync data from Firefly-iii
GET    /api/integration/firefly/status        - Check sync status
POST   /api/integration/validate              - Validate sim vs real data
GET    /api/integration/validation-metrics    - Get validation results
POST   /api/integration/calibrate             - Auto-calibrate sim parameters
GET    /api/integration/comparison            - Compare sim vs real
POST   /api/integration/export/dox            - Export for DoX analysis
```

**Example Implementation:**

```typescript
// POST /api/integration/firefly/sync
export async function POST(request: Request) {
  const { fireflyUrl, fireflyToken, startDate, endDate } = await request.json();

  try {
    // Initialize Firefly API client
    const firefly = new FireflyAPI(fireflyUrl, fireflyToken);

    // Fetch transactions
    const transactions = await firefly.getTransactions(startDate, endDate);

    // Transform to simulation format
    const members = transformTransactionsToMembers(transactions);

    // Calculate actual metrics
    const actualMetrics = calculateRealWorldMetrics(transactions);

    // Store in database
    await storeRealWorldData(members, actualMetrics);

    return Response.json({
      success: true,
      members: members.length,
      transactions: transactions.length,
      dateRange: { start: startDate, end: endDate },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/integration/validate
export async function POST(request: Request) {
  const { simulationId, realDataId } = await request.json();

  try {
    // Fetch both datasets
    const simData = await getSimulationResults(simulationId);
    const realData = await getRealWorldData(realDataId);

    // Calculate validation metrics
    const validation = {
      wealth: {
        mae: calculateMAE(simData.wealth, realData.wealth),
        rmse: calculateRMSE(simData.wealth, realData.wealth),
        r2: calculateR2(simData.wealth, realData.wealth),
      },
      gini: {
        mae: calculateMAE(simData.gini, realData.gini),
        directional: checkDirectionalAccuracy(simData.gini, realData.gini),
      },
      poverty: {
        mae: calculateMAE(simData.poverty, realData.poverty),
        directional: checkDirectionalAccuracy(simData.poverty, realData.poverty),
      },
      overall: {
        score: calculateOverallValidationScore(),
        confidence: calculateConfidenceLevel(),
      },
    };

    return Response.json({ validation });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 6. Enhanced Visualizations

### 6.1 New Chart Types to Implement

#### **1. Heatmap - Parameter Sensitivity**
**Purpose:** Show which parameters most affect outcomes
**Library:** Recharts + custom or D3.js
**Data:** Sensitivity analysis results

```typescript
<ResponsiveContainer width="100%" height={400}>
  <HeatMap data={sensitivityMatrix}>
    <XAxis dataKey="parameter" />
    <YAxis dataKey="metric" />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
  </HeatMap>
</ResponsiveContainer>
```

#### **2. Violin Plot - Wealth Distribution**
**Purpose:** Show wealth distribution shape over time
**Library:** Plotly or Recharts custom
**Data:** Member-level wealth values

```typescript
<ViolinPlot
  data={memberWealth}
  x="week"
  y="wealth"
  split="scenario"
  palette={{ A: '#8884d8', B: '#82ca9d' }}
/>
```

#### **3. Waterfall Chart - Wealth Flow**
**Purpose:** Show how wealth changes component by component
**Library:** Recharts custom
**Data:** Income, spending, savings, tokens

```typescript
<WaterfallChart data={wealthComponents}>
  <XAxis dataKey="component" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" fill={(entry) => entry.value > 0 ? 'green' : 'red'} />
</WaterfallChart>
```

#### **4. Sankey Diagram - Economic Flows**
**Purpose:** Visualize money flow through the economic system
**Library:** Recharts Sankey or D3.js
**Data:** Transaction flows (income → spending → savings)

```typescript
<Sankey
  data={economicFlows}
  node={{ color: '#8884d8' }}
  link={{ color: '#82ca9d' }}
/>
```

#### **5. Scatter Plot - Correlation Analysis**
**Purpose:** Show relationships between variables
**Library:** Recharts ScatterChart
**Data:** Parameter pairs and outcomes

```typescript
<ScatterChart>
  <CartesianGrid />
  <XAxis dataKey="internal_spending" name="Internal Spending %" />
  <YAxis dataKey="wealth_gain" name="Wealth Gain %" />
  <Scatter data={memberData} fill="#8884d8" />
  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
</ScatterChart>
```

### 6.2 Interactive Features

#### **Time-Series Filtering**
```typescript
const [timeRange, setTimeRange] = useState([0, 156]);

<Slider
  range
  min={0}
  max={156}
  value={timeRange}
  onChange={setTimeRange}
/>

<LineChart data={history.slice(timeRange[0], timeRange[1])}>
  {/* chart content */}
</LineChart>
```

#### **Multi-Scenario Overlay**
```typescript
const [selectedScenarios, setSelectedScenarios] = useState(['sim1', 'sim2', 'real']);

<LineChart>
  {selectedScenarios.includes('sim1') && (
    <Line dataKey="sim1_wealth" stroke="#8884d8" name="Simulation 1" />
  )}
  {selectedScenarios.includes('sim2') && (
    <Line dataKey="sim2_wealth" stroke="#82ca9d" name="Simulation 2" />
  )}
  {selectedScenarios.includes('real') && (
    <Line dataKey="real_wealth" stroke="#ffc658" name="Actual" strokeWidth={3} />
  )}
</LineChart>
```

#### **Drill-Down Analysis**
```typescript
const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

<LineChart onClick={(data) => setSelectedWeek(data.activePayload?.[0]?.payload?.Week)}>
  {/* chart */}
</LineChart>

{selectedWeek && (
  <DetailedWeekView week={selectedWeek} data={history[selectedWeek]} />
)}
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Weeks 1-2) ✅ PARTIALLY COMPLETE

**Goals:**
- ✅ Create data export utilities
- ✅ Add export buttons to UI
- ✅ Document Firefly-iii integration approach
- ⏳ Set up development environment for integration service

**Deliverables:**
- ✅ `/lib/utils/exportUtils.ts` - Complete export utility suite
- ✅ `/components/ExportButtons.tsx` - Export UI components
- ✅ Updated `SimulationResults.tsx` with export dropdown
- ✅ `FIREFLY_III_INTEGRATION_ANALYSIS.md` - Complete integration guide
- ⏳ Integration service skeleton

### Phase 2: Firefly-iii Basic Integration (Weeks 3-4)

**Goals:**
- Connect to Firefly-iii API
- Fetch transaction data
- Transform data to simulation format
- Run calibrated simulations

**Deliverables:**
- `/lib/integration/firefly-client.ts` - Firefly API client
- `/lib/integration/data-transformer.ts` - Data transformation logic
- `/api/integration/firefly/*` - Integration API endpoints
- UI for Firefly connection configuration

**Tasks:**
1. Create Firefly API client class
2. Implement authentication flow
3. Build data fetching functions
4. Create transformation logic (transactions → members)
5. Add Firefly configuration page to UI
6. Test with sample Firefly instance

### Phase 3: Validation Engine (Weeks 5-6)

**Goals:**
- Compare simulated vs actual data
- Calculate validation metrics
- Visualize comparison results

**Deliverables:**
- `/lib/validation/metrics.ts` - Validation metric calculations
- `/lib/validation/comparator.ts` - Comparison logic
- `/components/ValidationComparison.tsx` - Comparison visualizations
- Validation dashboard page

**Tasks:**
1. Implement MAE, RMSE, R² calculations
2. Create directional accuracy checker
3. Build comparison visualization components
4. Add validation results to dashboard
5. Create validation report generator

### Phase 4: Enhanced Visualizations (Weeks 7-8)

**Goals:**
- Add advanced chart types
- Implement interactive features
- Improve visual analytics

**Deliverables:**
- `/components/charts/HeatMap.tsx` - Parameter sensitivity heatmap
- `/components/charts/ViolinPlot.tsx` - Wealth distribution violin
- `/components/charts/WaterfallChart.tsx` - Wealth flow waterfall
- `/components/charts/SankeyDiagram.tsx` - Economic flow sankey
- Interactive filtering and drill-down features

**Tasks:**
1. Research and select chart libraries
2. Implement each chart type
3. Create reusable chart components
4. Add to sensitivity analysis page
5. Add to simulation results page
6. Implement time-series filtering
7. Implement multi-scenario overlay

### Phase 5: DoX Integration (Weeks 9-10)

**Goals:**
- Export data to DoX format
- Import DoX analysis results
- Display advanced analytics

**Deliverables:**
- `/lib/integration/dox-exporter.ts` - DoX export format
- `/lib/integration/dox-importer.ts` - Import DoX results
- `/api/integration/dox/*` - DoX integration endpoints
- Advanced analytics dashboard

**Tasks:**
1. Define DoX data exchange format
2. Create export functions for DoX
3. Create import functions for DoX results
4. Build analytics results viewer
5. Add statistical insights to dashboard

### Phase 6: Real-Time Monitoring (Weeks 11-12)

**Goals:**
- Implement webhook handling
- Create real-time dashboard
- Enable continuous validation

**Deliverables:**
- `/api/webhook/firefly` - Webhook handler
- `/components/RealTimeDashboard.tsx` - Live monitoring UI
- Real-time notification system
- Automated validation reports

**Tasks:**
1. Implement webhook receiver
2. Create real-time data processing pipeline
3. Build live dashboard with WebSockets/Server-Sent Events
4. Add deviation alerting
5. Create automated reporting system

---

## 8. Technical Requirements

### 8.1 Dependencies to Add

```json
{
  "dependencies": {
    "@visx/heatmap": "^3.0.0",
    "@visx/violin": "^3.0.0",
    "plotly.js": "^2.27.0",
    "react-plotly.js": "^2.6.0",
    "d3-sankey": "^0.12.3",
    "d3-shape": "^3.2.0",
    "socket.io-client": "^4.5.0",
    "date-fns": "^2.30.0"
  }
}
```

### 8.2 Environment Variables

```env
# Firefly-iii Configuration
FIREFLY_BASE_URL=https://your-firefly-instance.com
FIREFLY_API_TOKEN=your_personal_access_token_here

# Integration Service
INTEGRATION_DB_URL=postgresql://user:pass@localhost:5432/pmoves_integration
INTEGRATION_SECRET_KEY=your_secret_key_here

# DoX Configuration (when available)
DOX_API_URL=http://dox-instance:8000
DOX_API_KEY=dox_api_key_here

# Webhook Configuration
WEBHOOK_SECRET=webhook_signing_secret
WEBHOOK_URL=https://your-pmoves-instance.com/api/webhook/firefly
```

### 8.3 Database Schema (Integration Service)

```sql
-- Real-world data from Firefly
CREATE TABLE real_data_snapshots (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  firefly_user_id INTEGER,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Validation results
CREATE TABLE validation_results (
  id SERIAL PRIMARY KEY,
  simulation_id INTEGER NOT NULL,
  real_data_id INTEGER NOT NULL,
  validation_metrics JSONB NOT NULL,
  confidence_score DECIMAL(5,4),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Calibration history
CREATE TABLE calibration_history (
  id SERIAL PRIMARY KEY,
  original_params JSONB NOT NULL,
  calibrated_params JSONB NOT NULL,
  improvement_score DECIMAL(5,4),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 9. Security & Privacy

### 9.1 Data Protection

**Principles:**
1. **Encryption at Rest:** All financial data encrypted in database
2. **Encryption in Transit:** HTTPS/TLS for all API calls
3. **Access Control:** Role-based access to sensitive data
4. **Anonymization:** Option to anonymize member IDs in exports
5. **Audit Logging:** Track all data access and modifications

### 9.2 Firefly-iii Access

```typescript
// Secure token storage
const encryptToken = (token: string): string => {
  // Use crypto library to encrypt
  return encrypted;
};

const decryptToken = (encrypted: string): string => {
  // Decrypt for API calls only
  return token;
};

// Never expose tokens in client
// All Firefly calls from server-side only
```

### 9.3 Compliance Considerations

- **GDPR:** Right to data export, deletion, portability
- **Data Retention:** Configurable retention periods
- **Consent Management:** Explicit consent for data sharing
- **Privacy Policy:** Clear documentation of data usage

---

## 10. Success Metrics

### 10.1 Integration Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Data Sync Accuracy** | 99%+ | Firefly transactions successfully imported |
| **API Response Time** | <500ms | Average integration API call time |
| **Validation Accuracy** | R² > 0.7 | Correlation between simulated and actual |
| **User Adoption** | 70%+ | % of users connecting Firefly |
| **Export Usage** | 50%+ | % of simulations exported |

### 10.2 Visualization Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Chart Load Time** | <2s | Time to render complex charts |
| **Interaction Rate** | 40%+ | % of users using interactive features |
| **Export Frequency** | 2+ per user | Average exports per user session |
| **Dashboard Engagement** | 5+ min | Average time on dashboard |

### 10.3 Validation Success Metrics

| Metric | Target | Method |
|--------|--------|--------|
| **Savings Assumption Validation** | MAE < 5% | Compare simulated vs actual savings |
| **Wealth Prediction Accuracy** | RMSE < 10% | Compare predicted vs actual wealth |
| **Gini Prediction Accuracy** | MAE < 0.05 | Compare predicted vs actual inequality |
| **Directional Accuracy** | >80% | % of trends correctly predicted |

---

## 11. Next Steps

### Immediate Actions (This Week)

1. ✅ **Complete Phase 1 Deliverables**
   - ✅ Data export utilities
   - ✅ Export buttons
   - ✅ Integration documentation

2. **Access PMOVES-DoX Repository**
   - Resolve authentication issues
   - Explore DoX capabilities
   - Document integration approach

3. **Set Up Development Environment**
   - Create integration service skeleton
   - Set up test Firefly-iii instance
   - Configure API authentication

### Short-term (Next 2 Weeks)

4. **Begin Phase 2: Firefly Integration**
   - Implement Firefly API client
   - Build data transformation logic
   - Create integration API endpoints

5. **Create Enhanced Visualizations**
   - Research chart libraries
   - Implement heatmap for sensitivity analysis
   - Add violin plot for wealth distribution

### Medium-term (Next Month)

6. **Complete Phase 3: Validation Engine**
   - Implement validation metrics
   - Build comparison visualizations
   - Create validation dashboard

7. **Complete Phase 4: Enhanced Visualizations**
   - Implement all chart types
   - Add interactive features
   - Improve user experience

### Long-term (Next Quarter)

8. **Complete Phases 5-6**
   - DoX integration (pending repository access)
   - Real-time monitoring
   - Automated validation

---

## 12. Questions & Decisions Needed

### Critical Questions

1. **PMOVES-DoX Access:**
   - What is the purpose of PMOVES-DoX?
   - What tools/libraries does it use?
   - How should integration work?

2. **Firefly-iii Deployment:**
   - Will we use a shared Firefly instance or multiple user instances?
   - How do we handle multi-tenant scenarios?
   - What's the network topology (Docker, Kubernetes)?

3. **Data Privacy:**
   - What level of anonymization is required?
   - Can we store real financial data?
   - What are the retention policies?

4. **Visualization Preferences:**
   - Which chart types are highest priority?
   - Any specific visual design requirements?
   - Mobile responsiveness requirements?

---

## Appendices

### Appendix A: Technology Stack

| Component | Technology |
|-----------|-----------|
| **PMOVEStokensim Backend** | Python 3.11, Flask, NumPy, Pandas |
| **PMOVEStokensim Frontend** | Next.js 14, React 18, TypeScript |
| **Firefly-iii** | Laravel 10, PHP 8.2, MySQL 8 |
| **Charts** | Recharts 2.15, Plotly, D3.js |
| **UI Components** | Radix UI, Tailwind CSS |
| **Integration Service** | Node.js/Python, PostgreSQL |
| **DoX** | TBD (likely Python, Jupyter) |

### Appendix B: Related Documentation

- `FIREFLY_III_INTEGRATION_ANALYSIS.md` - Detailed Firefly integration guide
- `FIREFLY_III_QUICK_REFERENCE.md` - Quick API reference
- `ECONOMIC_MODEL_VALIDATION_REPORT.md` - Model validation results
- `VALIDATION_SUMMARY.md` - Validation summary

### Appendix C: Contact & Resources

- **Repository:** https://github.com/POWERFULMOVES/PMOVEStokensim
- **Firefly-iii Docs:** https://docs.firefly-iii.org/
- **Recharts Docs:** https://recharts.org/
- **Next.js Docs:** https://nextjs.org/docs

---

**End of Integration Architecture Document**

**Version:** 1.0
**Last Updated:** 2025-11-06
**Status:** Ready for Phase 2 Implementation
