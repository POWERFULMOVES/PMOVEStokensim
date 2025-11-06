# PMOVES-Firefly-iii Integration Analysis
## Comprehensive Integration Guide for PMOVEStokensim

**Date:** November 6, 2025  
**Project:** PMOVES Economic Simulation + PMOVES-Firefly-iii  
**Status:** Exploration Complete - Integration Ready

---

## Executive Summary

PMOVES-Firefly-iii is a powerful, self-hosted personal finance manager that can serve as an excellent **data source and validation platform** for PMOVEStokensim economic simulations. This document provides a complete technical analysis of integration opportunities.

### Key Integration Value Propositions

| Aspect | Benefit |
|--------|---------|
| **Real Data Validation** | Validate simulation assumptions against actual household financial data |
| **Data Collection** | Collect transaction patterns, spending behavior, and income sources |
| **Budget Analysis** | Compare simulated budgets with actual user budgeting patterns |
| **Wealth Tracking** | Monitor wealth accumulation and distribution across user groups |
| **Export Capabilities** | CSV export of all financial data for post-analysis |
| **Multi-User Support** | Test cooperative/group economics with built-in user groups |
| **Webhook Notifications** | Real-time transaction monitoring for live validation |

---

## Part 1: PMOVES-Firefly-iii Project Overview

### 1.1 Project Identity

**PMOVES-Firefly-iii** is a fork of the open-source [Firefly III](https://github.com/firefly-iii/firefly-iii) personal finance manager:

- **Type:** Self-hosted Personal Finance Manager (Laravel/PHP)
- **Architecture:** REST API-based with double-entry bookkeeping
- **License:** GNU AGPL-3.0 (open-source, copyleft)
- **Framework:** Laravel 12, PHP 8.4
- **Database:** Relational (MySQL/PostgreSQL-compatible)
- **Deployment:** Docker containers (GHCR published)

### 1.2 PMOVES Customizations

The PMOVES fork focuses on integration infrastructure:

```yaml
Customizations:
  - Docker network: pmoves-net (external network support)
  - GHCR Publishing: ghcr.io/POWERFULMOVES/pmoves-firefly-iii:main
  - Compose file: docker-compose.pmoves-net.yml
  - Status: Minimal changes (upstream compatibility preserved)
  - Integration level: "Connect and extend" philosophy
```

---

## Part 2: Financial Data Capabilities

### 2.1 Transaction Types Supported (7 Types)

```
DEPOSIT           → Income/revenue (e.g., salary, gifts)
WITHDRAWAL        → Expenses (e.g., groceries, utilities)
TRANSFER          → Internal transfers between user accounts
OPENING_BALANCE   → Initial account setup
RECONCILIATION    → Account reconciliation entries
LIABILITY_CREDIT  → Credit/loan adjustments
INVALID           → Error transactions (for correction)
```

### 2.2 Account Structures (14 Account Types)

**Asset Accounts (Spending/Savings)**
- Checking accounts
- Savings accounts
- Cash accounts

**Categorization Accounts**
- Expense accounts (where spending is tracked)
- Revenue accounts (where income is tracked)

**Specialized Accounts**
- Credit cards
- Liabilities (debt, loans, mortgages)
- Beneficiary accounts (third parties)
- Special accounts (initial balance, reconciliation, imports)

### 2.3 Core Financial Entities Tracked

#### Transactions
```
Per transaction:
  - Amount (decimal 32,12 precision)
  - Date with timezone
  - Source account (name, IBAN, type)
  - Destination account (name, IBAN, type)
  - Description, notes, tags
  - Category, budget, bill assignment
  - Running balance before/after
  - Reconciliation status
  - Native amount (for multi-currency)
  - Foreign currency amount & exchange rate
  
Metadata fields:
  - SEPA details (country, batch ID, etc.)
  - Multiple date types (interest, book, process, due, payment)
  - External references, import hashes
  - Recurrence tracking
```

#### Budgets
```
Per budget:
  - Name, active status
  - Budget limits with:
    * Amount (decimal precision)
    * Date range (start/end)
    * Repeat frequency (monthly, yearly, etc.)
    * Multiple limits per budget
  - Auto-budget rules
  - Category association
```

#### Savings Goals (Piggy Banks)
```
Per piggy bank:
  - Target amount and current amount
  - Start date and target date
  - Account association (many-to-many)
  - Currency support
  - Event history (deposits/withdrawals)
  - Repetition tracking (multi-year goals)
```

#### Bills & Recurring Transactions
```
Bills (subscriptions):
  - Name, amount range (min/max)
  - Pattern matching for auto-categorization
  - Repeat frequency and skip count
  - Active/inactive toggle
  - Multi-currency support

Recurrences:
  - Template title and description
  - First date and repeat-until date
  - Multiple transaction templates per recurrence
  - Rule application configuration
```

### 2.4 Multi-User & Group Support (Cooperative Economics)

```
User Groups Feature:
  ├── User Group (named, with title)
  ├── Group Memberships
  │   ├── Owner role (full control)
  │   ├── Full role (read/write)
  │   └── Read-only role (view only)
  ├── Invited Users (formal invitation system)
  └── Group-scoped data:
      ├── Accounts
      ├── Transactions
      ├── Budgets, Categories, Bills
      ├── Piggy Banks (via accounts)
      ├── Rules, Tags, Recurring transactions
      └── Webhooks
```

This structure enables:
- Household-level financial tracking (multiple user accounts)
- Cooperative group financial management
- Role-based access control
- Shared expense tracking

### 2.5 Data Precision & Currency Support

```
Amount Storage:
  Type: decimal(32,12)
  Precision: 32 total digits, 12 decimal places
  Supports: All world currencies with full precision
  
Currency Handling:
  - Primary currency (app-level)
  - Native amount tracking (for conversion)
  - Exchange rate history storage
  - Decimal precision preserved in API
```

---

## Part 3: API Capabilities & Data Access

### 3.1 REST API Structure

**Base URL:** `/api/v1/`  
**Authentication:** Personal access tokens  
**Response Format:** JSON (with relationship inclusion support)  
**Pagination:** Standard Laravel with configurable page size

### 3.2 Comprehensive API Endpoints

#### A. Autocomplete Endpoints
```
GET /v1/autocomplete/accounts
GET /v1/autocomplete/budgets
GET /v1/autocomplete/categories
GET /v1/autocomplete/currencies
GET /v1/autocomplete/piggy-banks
GET /v1/autocomplete/recurring
GET /v1/autocomplete/rules
GET /v1/autocomplete/tags
GET /v1/autocomplete/transactions
GET /v1/autocomplete/transaction-types
```

#### B. Data Export (CSV Format)
```
GET /v1/data/export/accounts
GET /v1/data/export/bills
GET /v1/data/export/budgets
GET /v1/data/export/categories
GET /v1/data/export/piggy-banks
GET /v1/data/export/recurring
GET /v1/data/export/rules
GET /v1/data/export/tags
GET /v1/data/export/transactions?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&accounts[]=1
```

#### C. CRUD Operations for All Models
```
Core Models (Full CRUD):
  /v1/accounts
  /v1/bills
  /v1/budgets
  /v1/budget-limits
  /v1/categories
  /v1/piggy-banks
  /v1/transactions
  /v1/tags
  /v1/recurring-transactions
  /v1/rules
  /v1/attachments (with file upload)

Additional Models:
  /v1/available-budgets
  /v1/currency-exchange-rates
  /v1/object-groups
  /v1/user-groups (read/update)
```

#### D. Analytics & Insights
```
Charts:
  /v1/chart/balance/balance?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/chart/account/overview?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/chart/budget/overview?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/chart/category/overview?start=YYYY-MM-DD&end=YYYY-MM-DD

Expense Insights:
  /v1/insight/expense/total?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/expense/account?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/expense/budget?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/expense/category?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/expense/tag?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/expense/bill?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/expense/with-without-budget
  /v1/insight/expense/with-without-category
  /v1/insight/expense/with-without-tag
  /v1/insight/expense/period-by-period

Income Insights:
  /v1/insight/income/total?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/income/account?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/income/category?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/income/tag?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/income/period-by-period

Transfer Insights:
  /v1/insight/transfer/account?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/transfer/category?start=YYYY-MM-DD&end=YYYY-MM-DD
  /v1/insight/transfer/tag?start=YYYY-MM-DD&end=YYYY-MM-DD

Search:
  /v1/search/accounts?query=text
  /v1/search/transactions?query=text

Summary:
  /v1/summary/basic
```

#### E. Webhook System (Real-time Integration)
```
Trigger Types:
  STORE_TRANSACTION (100)    → New transaction created
  UPDATE_TRANSACTION (110)   → Transaction updated
  DESTROY_TRANSACTION (120)  → Transaction deleted
  STORE_BUDGET (200)         → Budget created
  UPDATE_BUDGET (210)        → Budget updated
  DESTROY_BUDGET (220)       → Budget deleted
  STORE_UPDATE_BUDGET_LIMIT (230) → Budget limit modified
  ANY (50)                   → Catch-all trigger

Features:
  - Custom webhook URLs
  - Secret key validation
  - Active/inactive toggle
  - Attempt history tracking
  - Message history
  - Delivery/response tracking
  - Test submission capability
```

#### F. Bulk Operations
```
POST /v1/data/bulk/transactions
  → Update multiple transactions at once
```

#### G. System Endpoints
```
GET  /v1/system/about          → System information
GET  /v1/system/configuration  → Configuration details
GET  /v1/system/cron           → Cron status
GET  /v1/system/user           → User list
GET  /v1/user/preferences      → User preferences
```

### 3.3 CSV Export Format Example

**Transaction Export Columns:**
```
user_id, group_id, journal_id, created_at, updated_at, group_title, type,
currency_code, amount, foreign_currency_code, foreign_amount,
primary_currency_code, pc_amount, pc_foreign_amount,
description, date,
source_name, source_iban, source_type,
destination_name, destination_iban, destination_type,
reconciled, category, budget, bill, tags, notes,
[SEPA fields], [Date fields], [Reference fields], [Recurrence fields]
```

---

## Part 4: Database Schema & Data Models

### 4.1 Core Tables (52+ migrations)

```
users                    → User authentication & profile
user_groups              → Cooperative/group definitions
accounts                 → Asset/expense/revenue accounts
account_balances         → Account balance history
account_meta             → Account additional fields

transactions             → Individual transaction legs (double-entry)
transaction_journals     → Grouped transactions (original entry)
transaction_groups       → Grouped transaction groups
transaction_currency     → Currency definitions
transaction_journal_meta → Transaction metadata

budgets                  → Budget definitions
budget_limits            → Budget amount limits with dates
available_budgets        → Available budget totals

categories               → Expense/income categories
bills                    → Recurring bills/subscriptions
piggy_banks              → Savings goals
piggy_bank_events        → Piggy bank transaction history
piggy_bank_repetitions   → Multi-year piggy bank goals

tags                     → Custom transaction tags
rules                    → Transaction categorization rules
rule_groups              → Rule grouping
recurrences              → Recurring transaction templates
recurrence_transactions  → Individual recurrence components
recurrence_meta          → Recurrence configuration

notes                    → Transaction notes (polymorphic)
locations                → Geographic data (polymorphic)
attachments              → File attachments (polymorphic)

webhooks                 → Webhook definitions
webhook_messages         → Webhook deliveries
webhook_attempts         → Webhook retry attempts
webhook_responses        → Webhook response details
webhook_deliveries       → Delivery tracking

audit_log_entries        → Transaction change history
period_statistics        → Periodic aggregated statistics

currencies               → Currency definitions
exchange_rates           → Exchange rate history
```

### 4.2 Relationships Summary

```
User
  ├── has many Accounts
  ├── has many TransactionJournals
  ├── has many Budgets
  ├── has many Categories
  ├── has many Tags
  ├── has many Rules
  ├── has many Bills
  ├── has many Recurrences
  ├── has many UserGroups (through GroupMembership)
  └── has many Webhooks

UserGroup
  ├── has many Accounts
  ├── has many TransactionJournals
  ├── has many TransactionGroups
  ├── has many Budgets
  ├── has many Categories
  ├── has many Bills
  ├── has many PiggyBanks (through Accounts)
  ├── has many Rules
  ├── has many Recurrences
  ├── has many Tags
  ├── has many GroupMemberships
  ├── has many CurrencyExchangeRates
  └── has many Webhooks

Account
  ├── has many Transactions
  ├── has many AccountBalances
  ├── has many PiggyBanks (many-to-many)
  └── has many Attachments (polymorphic)

TransactionJournal
  ├── has many Transactions (double-entry pairs)
  ├── belongs to TransactionGroup
  ├── belongs to TransactionType
  ├── has many Budgets (many-to-many)
  ├── has many Categories (many-to-many)
  ├── has many Tags (many-to-many)
  ├── has many Notes (polymorphic)
  └── has many Attachments (polymorphic)

Transaction
  ├── belongs to Account
  ├── belongs to TransactionJournal
  ├── has Budgets (through TransactionJournal)
  └── has Categories (through TransactionJournal)
```

---

## Part 5: Integration Opportunities with PMOVEStokensim

### 5.1 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   PMOVES-Firefly-iii                             │
│              (Personal Finance Manager)                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  User-Entered Data:                                       │   │
│  │  - Real transactions (income, expenses)                   │   │
│  │  - Account balances                                       │   │
│  │  - Budget allocations                                     │   │
│  │  - Savings goals                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│  Export/API ◄─────────────┴─────────────────────────────────┐   │
│  - CSV Export              Export APIs                       │   │
│  - REST Endpoints          (Webhooks & Batch)               │   │
│  - Webhooks                                                 │   │
└─────────────────────────────────┬──────────────────────────────┘
                                  │
                    Data Integration Layer
                    (REST API / CSV)
                                  │
                                  ▼
                 ┌────────────────────────────────┐
                 │   PMOVEStokensim               │
                 │   (Economic Simulator)          │
                 │                                │
                 │  ┌──────────────────────────┐ │
                 │  │ Validation Module        │ │
                 │  │                          │ │
                 │  │ 1. Extract spending      │ │
                 │  │    patterns              │ │
                 │  │ 2. Calculate wealth      │ │
                 │  │    distribution          │ │
                 │  │ 3. Validate model       │ │
                 │  │    assumptions          │ │
                 │  │ 4. Compare with real    │ │
                 │  │    data trends          │ │
                 │  └──────────────────────────┘ │
                 │                                │
                 │  ┌──────────────────────────┐ │
                 │  │ Simulation Engines       │ │
                 │  │                          │ │
                 │  │ - Traditional Economy    │ │
                 │  │ - Token-Based Economy    │ │
                 │  │ - Group Buying Savings   │ │
                 │  │ - Local Production       │ │
                 │  │ - GroToken Rewards       │ │
                 │  └──────────────────────────┘ │
                 └────────────┬───────────────────┘
                              │
                    Validation Results
                              │
                              ▼
                 ┌────────────────────────────────┐
                 │ Output Reports                 │
                 │                                │
                 │ - Model validation report      │
                 │ - Gini coefficient comparison  │
                 │ - Poverty rate analysis        │
                 │ - Wealth distribution charts   │
                 │ - Savings potential analysis   │
                 └────────────────────────────────┘
```

### 5.2 Integration Points by Use Case

#### Use Case 1: Spending Pattern Validation

**Objective:** Validate simulation spending assumptions against real user data

```
Data Flow:
1. Extract from Firefly-iii:
   - Monthly spending by category
   - Budget allocations vs actual
   - Recurring expenses (bills)
   - Savings rates

2. PMOVEStokensim processing:
   - Parse spending data
   - Aggregate by household/group
   - Compare with simulation parameters
   - Identify discrepancies

3. Output:
   - Spending pattern report
   - Budget adherence statistics
   - Savings opportunity identification

API Endpoints Used:
  GET /v1/insight/expense/category?start=YYYY-MM-DD&end=YYYY-MM-DD
  GET /v1/data/export/transactions?...
  GET /v1/insight/expense/total?...
```

**Example Integration Code:**
```python
import requests
from datetime import datetime, timedelta

class FireflyiiDataCollector:
    def __init__(self, base_url, api_token):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {api_token}'}
    
    def get_spending_by_category(self, start_date, end_date):
        """Fetch spending breakdown by category"""
        url = f"{self.base_url}/api/v1/insight/expense/category"
        params = {
            'start': start_date.isoformat(),
            'end': end_date.isoformat()
        }
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def get_budget_vs_actual(self, start_date, end_date):
        """Fetch budget allocations vs actual spending"""
        url = f"{self.base_url}/api/v1/insight/expense/budget"
        params = {
            'start': start_date.isoformat(),
            'end': end_date.isoformat()
        }
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()
    
    def validate_simulation_parameters(self, spending_data):
        """Compare real data with simulation assumptions"""
        # Extract key metrics
        total_spending = sum(cat['sum'] for cat in spending_data)
        categories = {cat['name']: float(cat['sum']) for cat in spending_data}
        
        # Compare with simulation
        simulation_spending = {
            'food': 600,
            'housing': 1200,
            'utilities': 150,
            'transportation': 300,
            'healthcare': 200,
            'entertainment': 100,
            'other': 150
        }
        
        discrepancies = {}
        for cat, sim_amount in simulation_spending.items():
            actual = categories.get(cat.title(), 0)
            variance = ((actual - sim_amount) / sim_amount * 100) if sim_amount else 0
            discrepancies[cat] = {
                'simulated': sim_amount,
                'actual': actual,
                'variance_percent': variance
            }
        
        return {
            'total_discrepancy': abs(sum(v['variance_percent'] for v in discrepancies.values())) / len(discrepancies),
            'categories': discrepancies,
            'validation_status': 'PASS' if all(abs(v['variance_percent']) < 20 for v in discrepancies.values()) else 'REVIEW'
        }
```

#### Use Case 2: Wealth Distribution Analysis

**Objective:** Validate Gini coefficient and wealth distribution assumptions

```
Data Flow:
1. Extract from Firefly-iii (User Groups):
   - Account balances for multiple users
   - Historical balance snapshots
   - Asset account totals
   - Net worth calculations

2. PMOVEStokensim processing:
   - Calculate actual Gini coefficient
   - Compare log-normal distribution fit
   - Analyze wealth gap
   - Calculate bottom 20% share

3. Output:
   - Gini coefficient comparison chart
   - Wealth distribution histogram
   - Inequality metrics report

API Endpoints Used:
  GET /v1/user-groups
  GET /v1/accounts?user_group_id={id}
  GET /v1/chart/account/overview?...
  GET /v1/summary/basic
```

**Example Integration Code:**
```python
import numpy as np
from scipy.stats import lognorm

class WealthDistributionAnalyzer:
    def __init__(self, firefly_client):
        self.client = firefly_client
    
    def get_user_group_wealth(self, user_group_id):
        """Extract net worth for all users in a group"""
        # Get all accounts for the group
        accounts = self.client.get(
            f"/api/v1/accounts",
            params={'user_group_id': user_group_id}
        ).json()['data']
        
        wealth_by_user = {}
        for account in accounts:
            user_id = account['attributes']['user_id']
            balance = float(account['attributes']['virtual_balance'])
            
            if user_id not in wealth_by_user:
                wealth_by_user[user_id] = 0
            wealth_by_user[user_id] += balance
        
        return list(wealth_by_user.values())
    
    def calculate_gini(self, wealth_array):
        """Calculate Gini coefficient from wealth distribution"""
        sorted_wealth = np.sort(wealth_array)
        n = len(sorted_wealth)
        
        # Gini = (2 * sum(i * w_i)) / (n * sum(w_i)) - (n + 1) / n
        numerator = sum((2 * (i + 1) - n - 1) * w for i, w in enumerate(sorted_wealth))
        denominator = n * np.sum(sorted_wealth)
        
        gini = numerator / denominator if denominator > 0 else 0
        return max(0, min(1, gini))  # Clamp to [0, 1]
    
    def validate_distribution(self, wealth_array):
        """Check if distribution fits log-normal model"""
        log_wealth = np.log(np.array(wealth_array) + 1)  # +1 to handle zero wealth
        
        # Fit to log-normal
        mu, sigma = lognorm.fit(wealth_array)
        
        # Calculate KS test
        from scipy.stats import kstest
        statistic, p_value = kstest(log_wealth, 'norm', 
                                   args=(np.mean(log_wealth), np.std(log_wealth)))
        
        return {
            'mu': mu,
            'sigma': sigma,
            'ks_statistic': statistic,
            'ks_p_value': p_value,
            'fits_lognormal': p_value > 0.05
        }
    
    def analyze_wealth_gap(self, wealth_array):
        """Calculate top 20% vs bottom 20% ratio"""
        sorted_wealth = np.sort(wealth_array)
        n = len(sorted_wealth)
        
        # Split into quintiles
        idx_20 = int(n * 0.2)
        idx_80 = int(n * 0.8)
        
        bottom_20_mean = np.mean(sorted_wealth[:idx_20])
        top_20_mean = np.mean(sorted_wealth[idx_80:])
        
        gap_ratio = top_20_mean / bottom_20_mean if bottom_20_mean > 0 else float('inf')
        
        return {
            'top_20_percent_average': top_20_mean,
            'bottom_20_percent_average': bottom_20_mean,
            'wealth_gap_ratio': gap_ratio,
            'bottom_20_percent_share': np.sum(sorted_wealth[:idx_20]) / np.sum(sorted_wealth)
        }
```

#### Use Case 3: Savings Mechanism Validation

**Objective:** Validate group buying and local production savings assumptions

```
Data Flow:
1. Extract from Firefly-iii:
   - Piggy bank goals and progress
   - Spending by category (food, housing)
   - Budget limits vs actual
   - Individual vs household patterns

2. PMOVEStokensim processing:
   - Calculate potential savings
   - Compare with actual accumulation
   - Validate 15% group buying assumption
   - Validate 25% local production assumption

3. Output:
   - Savings potential analysis
   - Group buying effectiveness
   - Local production feasibility

API Endpoints Used:
  GET /v1/piggy-banks
  GET /v1/data/export/piggy-banks
  GET /v1/insight/expense/category?...
```

**Example Integration Code:**
```python
class SavingsMechanismValidator:
    def __init__(self, firefly_client, simulator):
        self.client = firefly_client
        self.simulator = simulator
    
    def get_savings_progress(self):
        """Extract piggy bank progress"""
        piggy_banks = self.client.get("/api/v1/piggy-banks").json()['data']
        
        progress = {}
        for pb in piggy_banks:
            attrs = pb['attributes']
            progress[attrs['name']] = {
                'target_amount': float(attrs['target_amount']),
                'current_amount': float(attrs['current_amount']),
                'progress_percent': (float(attrs['current_amount']) / 
                                   float(attrs['target_amount']) * 100),
                'start_date': attrs['start_date'],
                'target_date': attrs['target_date']
            }
        
        return progress
    
    def analyze_group_buying_potential(self, spending_data):
        """Calculate potential savings from group buying"""
        # Group buying typically provides 10-20% savings
        # 15% is conservative estimate
        
        group_buying_savings_rate = 0.15
        
        categories_with_group_potential = {
            'Groceries': 0.15,
            'Food & Dining': 0.15,
            'Medical Expenses': 0.10,
            'Household Supplies': 0.15
        }
        
        potential_savings = {}
        total_potential = 0
        
        for category, spending in spending_data.items():
            if category in categories_with_group_potential:
                savings_rate = categories_with_group_potential[category]
                savings = spending * savings_rate
                potential_savings[category] = savings
                total_potential += savings
        
        return {
            'total_monthly_potential_savings': total_potential,
            'annual_potential_savings': total_potential * 12,
            'by_category': potential_savings,
            'assumption_rate': group_buying_savings_rate
        }
    
    def analyze_local_production(self, food_spending):
        """Calculate local production savings"""
        # Supply chain markup typically 20-40%
        # 25% is reasonable estimate
        
        local_production_savings_rate = 0.25
        
        # Only applicable to fresh produce, dairy, meat
        food_categories_affected = {
            'Groceries': 0.70,  # 70% of grocery spending is eligible
            'Farmers Market': 1.0
        }
        
        eligible_spending = 0
        for cat, portion in food_categories_affected.items():
            if cat in food_spending:
                eligible_spending += food_spending[cat] * portion
        
        potential_savings = eligible_spending * local_production_savings_rate
        
        return {
            'eligible_spending': eligible_spending,
            'potential_monthly_savings': potential_savings,
            'annual_potential_savings': potential_savings * 12,
            'assumption_rate': local_production_savings_rate
        }
    
    def compare_with_simulation(self, actual_data, simulated_data):
        """Compare actual savings with simulation expectations"""
        return {
            'actual_savings_rate': actual_data.get('savings_rate', 0),
            'simulated_savings_rate': simulated_data.get('savings_rate', 0),
            'difference': (actual_data.get('savings_rate', 0) - 
                         simulated_data.get('savings_rate', 0)),
            'validation_status': 'PASS' if abs(
                actual_data.get('savings_rate', 0) - 
                simulated_data.get('savings_rate', 0)) < 0.05 else 'REVIEW'
        }
```

#### Use Case 4: GroToken Reward System Validation

**Objective:** Validate token distribution and wealth impact

```
Data Flow:
1. Simulate token distribution:
   - Gaussian distribution (μ=0.5, σ=0.2) tokens/week
   - $2.00 per token value
   - Target 20% of population participation

2. Extract from Firefly-iii:
   - Account balance changes
   - Deposit transactions (token distributions)
   - Wealth distribution before/after

3. PMOVEStokensim processing:
   - Compare simulated income with actual
   - Calculate distribution impact
   - Validate participation assumptions

4. Output:
   - Token distribution effectiveness
   - Wealth impact analysis
   - Participation rate validation
```

**Example Integration Code:**
```python
class GroTokenValidator:
    def __init__(self, firefly_client):
        self.client = firefly_client
    
    def extract_token_deposits(self, start_date, end_date, token_tag='grotoken'):
        """Extract token-related transactions"""
        # Search for transactions tagged with token designation
        transactions = self.client.get(
            "/api/v1/transactions",
            params={
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        ).json()['data']
        
        token_transactions = [
            t for t in transactions 
            if token_tag in t['attributes'].get('tags', [])
        ]
        
        # Group by user and aggregate
        deposits_by_user = {}
        for tx in token_transactions:
            user_id = tx['attributes'].get('user_id')
            amount = float(tx['attributes']['amount'])
            
            if user_id not in deposits_by_user:
                deposits_by_user[user_id] = []
            deposits_by_user[user_id].append({
                'date': tx['attributes']['date'],
                'amount': amount,
                'description': tx['attributes']['description']
            })
        
        return deposits_by_user
    
    def validate_distribution_pattern(self, deposits_by_user):
        """Check if distribution matches expected pattern"""
        import numpy as np
        from scipy.stats import norm
        
        # Extract all deposit amounts (in dollars)
        all_amounts = []
        for user_deposits in deposits_by_user.values():
            for deposit in user_deposits:
                # Assuming token value is $2
                all_amounts.append(deposit['amount'] / 2.0)
        
        # Expected: Gaussian(0.5 tokens, 0.2 sigma)
        expected_mean = 0.5
        expected_sigma = 0.2
        
        actual_mean = np.mean(all_amounts) if all_amounts else 0
        actual_sigma = np.std(all_amounts) if len(all_amounts) > 1 else 0
        
        # KS test
        ks_stat, p_value = norm.kstest(all_amounts, expected_mean, expected_sigma)
        
        return {
            'expected_distribution': {
                'mean': expected_mean,
                'sigma': expected_sigma,
                'type': 'Gaussian'
            },
            'actual_distribution': {
                'mean': actual_mean,
                'sigma': actual_sigma,
                'sample_size': len(all_amounts)
            },
            'ks_test': {
                'statistic': ks_stat,
                'p_value': p_value,
                'fits_expected': p_value > 0.05
            },
            'mean_difference': abs(actual_mean - expected_mean),
            'validation_status': 'PASS' if p_value > 0.05 else 'REVIEW'
        }
    
    def calculate_wealth_impact(self, deposits_by_user, before_wealth, after_wealth):
        """Analyze token impact on wealth distribution"""
        import numpy as np
        
        total_tokens_distributed = sum(
            sum(d['amount'] / 2.0 for d in deposits) 
            for deposits in deposits_by_user.values()
        )
        
        participation_rate = len(deposits_by_user) / len(before_wealth)
        
        # Calculate Gini change
        before_gini = self.calculate_gini(before_wealth)
        after_gini = self.calculate_gini(after_wealth)
        
        return {
            'total_tokens_distributed': total_tokens_distributed,
            'participation_rate': participation_rate,
            'participants': len(deposits_by_user),
            'total_population': len(before_wealth),
            'wealth_inequality_change': {
                'before_gini': before_gini,
                'after_gini': after_gini,
                'gini_reduction': before_gini - after_gini,
                'reduction_percent': ((before_gini - after_gini) / before_gini * 100) if before_gini > 0 else 0
            }
        }
```

#### Use Case 5: Real-Time Monitoring via Webhooks

**Objective:** Real-time transaction monitoring and instant validation

```
Webhook Configuration:
  Triggers: STORE_TRANSACTION, UPDATE_TRANSACTION, DESTROY_TRANSACTION
  URL: http://pmoves-simulator:5000/api/firefly-webhook
  Secret: [shared secret for validation]
  Response: JSON

Data Flow:
1. User creates transaction in Firefly-iii
2. Firefly-iii sends webhook POST with transaction details
3. PMOVEStokensim receives and processes
4. Updates real-time validation metrics
5. Returns confirmation

Webhook Payload:
{
  "data": {
    "type": "transactions",
    "id": "123",
    "attributes": {
      "created_at": "2025-11-06T12:00:00Z",
      "updated_at": "2025-11-06T12:00:00Z",
      "user_id": 1,
      "description": "Grocery shopping",
      "date": "2025-11-06",
      "amount": 125.50,
      "currency_code": "USD",
      ...
    }
  }
}

Webhook Receiver Example:
```

```python
from flask import request, jsonify
import hmac
import hashlib

class WebhookReceiver:
    def __init__(self, secret, simulator):
        self.secret = secret
        self.simulator = simulator
    
    def verify_webhook(self, payload, signature):
        """Verify webhook signature"""
        expected_sig = hmac.new(
            self.secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_sig)
    
    def handle_transaction_webhook(self, request):
        """Handle incoming transaction webhook"""
        payload = request.get_data(as_text=True)
        signature = request.headers.get('X-Firefly-Signature', '')
        
        if not self.verify_webhook(payload, signature):
            return jsonify({'error': 'Invalid signature'}), 401
        
        data = request.get_json()
        
        # Extract transaction details
        transaction = data.get('data', {})
        amount = float(transaction['attributes']['amount'])
        category = transaction['attributes'].get('category', 'unknown')
        date = transaction['attributes']['date']
        
        # Update real-time metrics
        self.simulator.update_real_time_metrics({
            'amount': amount,
            'category': category,
            'date': date,
            'source': 'firefly-webhook'
        })
        
        return jsonify({
            'status': 'processed',
            'transaction_id': transaction['id']
        }), 200
```

---

## Part 6: Implementation Roadmap

### Phase 1: Basic Integration (Weeks 1-2)

**Objective:** Establish data connectivity

```
Tasks:
1. Set up Firefly-iii instance with pmoves-net Docker network
2. Create API token and test connectivity
3. Build data collector module (REST API client)
4. Implement CSV export parsing
5. Create data validation tests

Deliverables:
- Firefly-iii running on pmoves-net
- PMOVEStokensim can authenticate and fetch data
- Unit tests for data collection
```

### Phase 2: Spending Pattern Validation (Weeks 3-4)

**Objective:** Validate simulation spending assumptions

```
Tasks:
1. Extract spending by category from Firefly-iii
2. Compare with simulation parameters
3. Build category mapping (Firefly categories -> Simulation categories)
4. Generate variance reports
5. Identify parameter adjustments needed

Deliverables:
- Spending pattern validation report
- Category mapping configuration
- Parameter adjustment recommendations
```

### Phase 3: Wealth Distribution Analysis (Weeks 5-6)

**Objective:** Validate inequality metrics

```
Tasks:
1. Extract user group wealth data
2. Calculate actual Gini coefficient
3. Compare with simulation assumptions
4. Analyze distribution fit (log-normal)
5. Create comparison visualizations

Deliverables:
- Wealth distribution analysis report
- Gini coefficient comparison charts
- Distribution fitting validation
```

### Phase 4: Savings Mechanism Validation (Weeks 7-8)

**Objective:** Validate group buying and local production assumptions

```
Tasks:
1. Extract piggy bank data
2. Calculate actual savings rates
3. Validate 15% group buying assumption
4. Validate 25% local production assumption
5. Model alternative scenarios

Deliverables:
- Savings analysis report
- Assumption validation matrices
- Sensitivity analysis
```

### Phase 5: Real-Time Integration (Weeks 9-10)

**Objective:** Implement webhook integration

```
Tasks:
1. Set up webhook endpoints in PMOVEStokensim
2. Implement webhook verification
3. Update real-time metrics on transactions
4. Build transaction history tracking
5. Create real-time dashboard

Deliverables:
- Webhook endpoints functional
- Real-time metric updates
- Transaction history archive
- Real-time validation dashboard
```

### Phase 6: Comprehensive Reporting (Weeks 11-12)

**Objective:** Build validation reporting system

```
Tasks:
1. Create standardized report templates
2. Build comparison visualizations
3. Generate automated reports
4. Implement report scheduling
5. Create executive summary dashboard

Deliverables:
- Validation report templates
- Automated weekly/monthly reports
- Dashboard with key metrics
- Executive summary generation
```

---

## Part 7: Technical Requirements & Setup

### 7.1 Requirements

**For PMOVES-Firefly-iii:**
- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM minimum
- 10GB disk space

**For PMOVEStokensim Integration:**
- Python 3.9+
- requests library
- numpy, scipy (for statistical analysis)
- pandas (for data processing)
- flask (for webhook endpoints)

### 7.2 Docker Network Setup

```bash
# Create shared network
docker network create pmoves-net

# Run Firefly-iii on pmoves-net
docker compose -f docker-compose.pmoves-net.yml up -d

# Verify connectivity
docker network inspect pmoves-net
```

### 7.3 API Authentication

```
1. Access Firefly-iii UI (http://localhost:8080)
2. Navigate to: Settings → OAuth → Personal Access Tokens
3. Create new token with name "PMOVEStokensim"
4. Copy token and store securely
5. Configure in PMOVEStokensim:
   
   FIREFLY_API_TOKEN=xxx
   FIREFLY_BASE_URL=http://firefly:8080
```

### 7.4 Configuration Example

```python
# config/firefly_integration.py

FIREFLY_CONFIG = {
    'base_url': 'http://firefly:8080',
    'api_token': os.environ.get('FIREFLY_API_TOKEN'),
    'api_version': 'v1',
    'timeout': 30,
    'retry_count': 3,
    'webhook_secret': os.environ.get('FIREFLY_WEBHOOK_SECRET'),
    'webhook_port': 5001,
}

DATA_EXTRACTION = {
    'batch_size': 100,
    'date_range_days': 30,
    'update_frequency_hours': 24,
    'real_time_processing': True,
}

VALIDATION_CONFIG = {
    'spending_variance_threshold': 0.20,  # 20%
    'gini_comparison_tolerance': 0.05,    # 0.05 points
    'distribution_fit_p_value': 0.05,
    'savings_assumption_tolerance': 0.10,  # 10%
}
```

---

## Part 8: Data Quality & Privacy Considerations

### 8.1 Data Privacy

```
Privacy Controls:
1. Personal Access Tokens (not passwords)
2. HTTPS-only communication
3. No data persistence in simulation logs
4. User consent for data analysis
5. GDPR compliance mechanisms

Best Practices:
- Use separate Firefly-iii instances per deployment
- Rotate API tokens regularly
- Encrypt tokens in configuration files
- Audit webhook deliveries
- Implement data retention policies
```

### 8.2 Data Quality Assurance

```
Validation Checks:
1. Duplicate transaction detection
2. Missing category identification
3. Amount precision validation
4. Date range consistency
5. Account balance reconciliation
6. Currency conversion accuracy

Quality Metrics:
- Data completeness (percentage of fields populated)
- Category assignment accuracy
- Transaction timestamp accuracy
- Account balance convergence
- Exchange rate validity
```

### 8.3 Error Handling

```
Error Scenarios:
1. API connectivity loss
   → Cache recent data, retry with exponential backoff
2. Invalid API token
   → Log error, alert administrator
3. Rate limiting
   → Implement request queuing
4. Data inconsistencies
   → Flag for manual review
5. Webhook delivery failure
   → Retry with dead letter queue

Recovery Strategy:
- Automatic reconnection with circuit breaker pattern
- Data reconciliation on connection restoration
- Manual verification triggers for critical data
```

---

## Part 9: Metrics & KPIs to Track

### 9.1 Data Validation Metrics

```
Spending Patterns:
  ├── Category variance (actual vs simulated)
  ├── Budget adherence rate
  ├── Recurring expense accuracy
  └── Savings rate match

Wealth Distribution:
  ├── Gini coefficient comparison
  ├── Wealth gap ratio validation
  ├── Log-normal distribution fit (KS test)
  ├── Bottom 20% share accuracy
  └── Poverty rate prediction accuracy

Savings Mechanisms:
  ├── Group buying effectiveness
  ├── Local production feasibility
  ├── Piggy bank goal achievement
  ├── Savings accumulation rate
  └── Interest rate impact
```

### 9.2 System Performance Metrics

```
API Performance:
  ├── Response time (ms)
  ├── Request success rate (%)
  ├── Rate limit headroom (%)
  ├── Webhook delivery success rate
  └── Data latency (minutes)

Data Quality:
  ├── Completeness (% of required fields)
  ├── Accuracy (validation test pass rate)
  ├── Consistency (data reconciliation pass rate)
  ├── Timeliness (data age in days)
  └── Uniqueness (duplicate transaction rate)
```

---

## Part 10: Advanced Integration Scenarios

### 10.1 Multi-Instance Aggregation

**Scenario:** Compare simulations across multiple Firefly-iii instances

```
Architecture:
  Firefly-iii #1 ─┐
  Firefly-iii #2 ─┼─→ PMOVEStokensim (Aggregator)
  Firefly-iii #3 ─┘      ↓
                    Comparative Analysis
                    Consensus Validation
                    Aggregate Reporting

Use Case:
- Validate simulation with data from multiple regions
- Test scenario consistency across populations
- Identify regional variations
```

### 10.2 Continuous Integration Testing

**Scenario:** Automated validation in CI/CD pipeline

```
Pipeline:
1. Extract latest Firefly-iii data
2. Run PMOVEStokensim validation suite
3. Compare with baseline metrics
4. Generate validation report
5. Trigger alerts on deviations

CI Integration:
  - GitHub Actions for automated runs
  - Pass/fail gates for parameter changes
  - Slack notifications for validation failures
  - Historical trend tracking
```

### 10.3 Machine Learning Enhancements

**Scenario:** Use ML to predict optimal parameters

```
Models to Build:
1. Category prediction (unsupervised)
   - Auto-categorize untagged transactions
   - Identify spending patterns
   
2. Anomaly detection
   - Flag unusual transactions
   - Detect category misclassifications
   
3. Parameter optimization
   - Find optimal savings percentages
   - Predict distribution parameters
   
4. Forecasting
   - Predict future spending
   - Forecast wealth distribution
```

---

## Part 11: Success Criteria & Acceptance

### 11.1 Integration Success Metrics

```
Phase 1 (Connectivity):
  ✓ Successfully authenticate to Firefly-iii API
  ✓ Retrieve at least 100 transactions
  ✓ Parse all major transaction fields
  ✓ No critical errors in data collection

Phase 2 (Validation):
  ✓ Spending variance < 20%
  ✓ Category mappings > 90% accurate
  ✓ Budget variance < 15%
  ✓ Identified parameter adjustment needs

Phase 3 (Analysis):
  ✓ Gini coefficient calculation matches reference
  ✓ Distribution fit p-value > 0.05
  ✓ Generated validation report
  ✓ Visualizations are clear and accurate

Phase 4 (Real-time):
  ✓ Webhooks successfully received
  ✓ Real-time metrics updated within 1 minute
  ✓ No transaction loss
  ✓ Signature verification working
```

### 11.2 Production Readiness

```
Code Quality:
  ✓ Unit test coverage > 80%
  ✓ Integration tests passing
  ✓ Error handling comprehensive
  ✓ Code review completed
  ✓ Documentation complete

Performance:
  ✓ API response time < 2 seconds
  ✓ Webhook processing < 1 second
  ✓ Batch operations < 30 seconds
  ✓ Memory usage stable
  ✓ No memory leaks

Security:
  ✓ API tokens encrypted at rest
  ✓ HTTPS enforced
  ✓ Webhook signatures verified
  ✓ Input validation complete
  ✓ SQL injection protection
  ✓ Rate limiting implemented

Monitoring:
  ✓ Error logging configured
  ✓ Performance metrics tracked
  ✓ Alerts configured
  ✓ Health check endpoint
  ✓ Backup/restore tested
```

---

## Part 12: Troubleshooting Guide

### Common Integration Issues

**Issue: Cannot connect to Firefly-iii API**
```
Debug Steps:
1. Verify URL: curl http://firefly:8080/api/v1/system/about
2. Check API token: curl -H "Authorization: Bearer TOKEN" http://firefly:8080/api/v1/accounts
3. Verify network: docker network inspect pmoves-net
4. Check firewall: nmap -p 8080 firefly
Solution: Ensure firefly container is running and accessible on pmoves-net
```

**Issue: API Token Expired**
```
Debug Steps:
1. Check token creation date in Firefly-iii UI
2. Verify token hasn't been revoked
3. Test with new token creation
Solution: Generate new personal access token
```

**Issue: Webhook Delivery Failing**
```
Debug Steps:
1. Check PMOVEStokensim webhook endpoint is running
2. Verify webhook URL is accessible from Firefly-iii
3. Check webhook secret is matching
4. Review Firefly-iii webhook attempt logs
Solution: Ensure endpoint is publicly accessible or use ngrok for tunneling
```

**Issue: Data Discrepancies**
```
Debug Steps:
1. Compare Firefly-iii UI totals with API responses
2. Check for duplicate transactions
3. Verify date range filters
4. Confirm currency conversion
Solution: Run data validation tests and reconciliation
```

---

## Part 13: Conclusion & Recommendations

### 13.1 Key Findings

**PMOVES-Firefly-iii is an Excellent Integration Partner Because:**

1. **Comprehensive Financial Data**
   - Double-entry bookkeeping for accuracy
   - Rich metadata support
   - Multi-currency capability
   - Full transaction history

2. **Flexible API**
   - 50+ endpoints covering all data types
   - Multiple data export formats
   - Webhook integration for real-time updates
   - Pagination and filtering support

3. **Cooperative Economics Support**
   - Built-in user group functionality
   - Role-based access control
   - Group-scoped data organization
   - Multi-user transaction tracking

4. **Data Quality**
   - Decimal precision (32,12) for financial accuracy
   - Reconciliation capabilities
   - Audit logging
   - Validation mechanisms

5. **Integration-Ready**
   - Docker containerization
   - PMOVES network integration
   - Open-source (AGPL license)
   - Active development

### 13.2 Recommended Integration Approach

**Immediate (Phase 1-2, Weeks 1-4):**
1. Deploy Firefly-iii on pmoves-net
2. Develop data collection module
3. Validate spending patterns
4. Establish baseline metrics

**Short-term (Phase 3-4, Weeks 5-8):**
1. Implement wealth distribution analysis
2. Validate inequality metrics
3. Analyze savings mechanisms
4. Create validation reports

**Medium-term (Phase 5-6, Weeks 9-12):**
1. Implement webhook integration
2. Build real-time monitoring
3. Create automated reporting
4. Establish continuous validation

**Long-term (Post-Phase 6):**
1. ML-based parameter optimization
2. Multi-instance aggregation
3. CI/CD integration
4. Advanced scenario analysis

### 13.3 Expected Outcomes

With full integration, PMOVEStokensim will be able to:

1. **Validate Models**
   - Confirm Gini coefficient assumptions
   - Validate wealth distribution parameters
   - Test savings mechanism effectiveness
   - Verify income/expense patterns

2. **Improve Accuracy**
   - Real-world spending patterns
   - Actual savings behavior
   - Regional/demographic variations
   - Economic condition impacts

3. **Enable Scenarios**
   - Test group buying economics
   - Model local production benefits
   - Simulate token distribution effects
   - Compare cooperative vs traditional

4. **Generate Insights**
   - Optimal savings percentages
   - Realistic wealth distribution
   - Feasibility analysis
   - Policy recommendations

---

## Appendix A: API Reference Quick Links

**Full API Documentation:** https://api-docs.firefly-iii.org/

**Key Endpoints:**
- https://github.com/firefly-iii/firefly-iii/tree/main/routes
- https://github.com/firefly-iii/firefly-iii/tree/main/app/Api/V1/Controllers

**Database Schema:**
- https://github.com/firefly-iii/firefly-iii/tree/main/database/migrations

**Community Resources:**
- Gitter Chat: https://gitter.im/firefly-iii/firefly-iii
- Wiki: https://github.com/firefly-iii/help/wiki
- Documentation: https://docs.firefly-iii.org/

---

## Appendix B: Example Configuration Files

### B.1 Environment Configuration
```bash
# .env.firefly-integration
FIREFLY_BASE_URL=http://firefly:8080
FIREFLY_API_TOKEN=your-personal-access-token
FIREFLY_WEBHOOK_SECRET=your-webhook-secret

# PMOVEStokensim Integration
PMOVES_SIMULATION_ID=sim-001
PMOVES_WEBHOOK_PORT=5001
PMOVES_WEBHOOK_PATH=/api/firefly-webhook

# Data Collection
DATA_COLLECTION_ENABLED=true
DATA_COLLECTION_FREQUENCY_HOURS=24
REAL_TIME_PROCESSING=true
```

### B.2 Docker Compose Override
```yaml
version: '3.9'

services:
  firefly:
    image: ghcr.io/POWERFULMOVES/pmoves-firefly-iii:main
    networks:
      - pmoves-net
    environment:
      - TRUSTED_PROXIES=**
      - TZ=UTC
    ports:
      - "8080:8080"
    volumes:
      - firefly_data:/var/www/html/storage/upload

  pmoves-simulator:
    build: .
    networks:
      - pmoves-net
    environment:
      - FIREFLY_BASE_URL=http://firefly:8080
      - FIREFLY_API_TOKEN=${FIREFLY_API_TOKEN}
    ports:
      - "5000:5000"
      - "5001:5001"
    depends_on:
      - firefly

networks:
  pmoves-net:
    external: true

volumes:
  firefly_data:
```

---

**Document Version:** 1.0  
**Last Updated:** November 6, 2025  
**Status:** Complete & Ready for Implementation  

