# PMOVES-Firefly-iii Integration Quick Reference

## What is PMOVES-Firefly-iii?

Personal finance manager that tracks:
- **Transactions** (income, expenses, transfers)
- **Accounts** (checking, savings, credit cards, asset tracking)
- **Budgets** (spending limits with categories)
- **Savings Goals** (piggy banks with target tracking)
- **Bills** (recurring subscriptions)
- **Categories** (spending classification)
- **Tags** (custom grouping)
- **User Groups** (multi-user/household support)

## Key Statistics

- **Models:** 50+ Eloquent models
- **Migrations:** 58+ database migrations  
- **API Endpoints:** 100+ REST endpoints
- **Data Precision:** decimal(32,12) for currency
- **Multi-currency:** Full support with exchange rates
- **Webhook Triggers:** 8 event types

## Core Data Tables

```
Users          ↔ User Groups (Cooperative)
                        ↓
            Accounts (14 types)
                ↓
    Transactions (Double-entry)
         ├─ Categories
         ├─ Budgets
         ├─ Bills
         ├─ Tags
         └─ Metadata
```

## Most Useful API Endpoints for PMOVEStokensim

### For Spending Analysis
```
GET /v1/insight/expense/category?start=DATE&end=DATE
GET /v1/insight/expense/total?start=DATE&end=DATE
GET /v1/insight/expense/budget?start=DATE&end=DATE
GET /v1/data/export/transactions?start=DATE&end=DATE
```

### For Wealth Distribution Analysis
```
GET /v1/accounts (list all accounts)
GET /v1/chart/account/overview?start=DATE&end=DATE
GET /v1/summary/basic (account totals)
```

### For Savings Tracking
```
GET /v1/piggy-banks (all savings goals)
GET /v1/data/export/piggy-banks
GET /v1/budgets (spending allocation)
```

### For Real-Time Integration
```
POST /v1/webhooks (subscribe to events)
GET  /v1/webhooks (list active webhooks)
```

## Integration Points

### 1. Spending Pattern Validation
```
Firefly-iii Data          →  Extract spending by category
                          →  Compare vs simulation
                          →  Identify parameter gaps
                          →  Generate variance report
```

### 2. Wealth Distribution Analysis
```
User Group Accounts       →  Extract balance snapshots
                          →  Calculate Gini coefficient
                          →  Test log-normal fit
                          →  Validate inequality metrics
```

### 3. Savings Analysis
```
Piggy Banks              →  Track goal progress
+ Budgets                →  Compare actual vs budgeted
+ Transactions           →  Calculate savings rates
                          →  Validate assumptions
```

### 4. Real-Time Monitoring
```
Transaction Webhook      →  Receive notification
                          →  Process transaction
                          →  Update metrics
                          →  Validate in real-time
```

## Data Export Format (CSV)

**Available Types:**
- accounts
- bills
- budgets
- categories
- piggy-banks
- recurring
- rules
- tags
- transactions (with filtering)

**Example:**
```
GET /v1/data/export/transactions
  ?start_date=2025-01-01
  &end_date=2025-12-31
  &accounts[]=1
  &accounts[]=2
```

## Authentication

```
Personal Access Token Method:

1. Create token in Firefly-iii UI
2. Use in API header:
   Authorization: Bearer {token}

Example:
curl -H "Authorization: Bearer abc123..." \
     http://firefly:8080/api/v1/accounts
```

## Multi-User Cooperative Features

```
User Groups Enable:
  ├── Shared expense tracking
  ├── Role-based access control
  │   ├── Owner (full control)
  │   ├── Full (read/write)
  │   └── Read-only
  ├── Group-scoped budgets
  ├── Shared savings goals
  └── Household-level analytics
```

## Docker Deployment

```bash
# Create shared network
docker network create pmoves-net

# Deploy Firefly-iii
docker compose -f docker-compose.pmoves-net.yml up -d

# Access UI
# http://localhost:8080
```

## Key Validation Use Cases

### 1. Spending Pattern Validation
| Metric | Simulation | Real Data | Variance |
|--------|------------|-----------|----------|
| Food | $600/mo | $580/mo | -3.3% |
| Housing | $1200/mo | $1250/mo | +4.2% |
| Utilities | $150/mo | $140/mo | -6.7% |
| **Total Match** | 90%+ | 85%+ | < 10% |

### 2. Wealth Distribution Metrics
```
Metric              Simulation    Real Data    Status
─────────────────────────────────────────────────────
Gini Coefficient       0.45          0.48       ✓ PASS
Wealth Gap Ratio       8.2:1        7.5:1       ✓ PASS
Bottom 20% Share       3.2%          3.5%       ✓ PASS
Log-Normal Fit         p=0.12        p=0.18     ✓ PASS
```

### 3. Savings Mechanism Validation
```
Mechanism            Expected      Actual      Feasibility
──────────────────────────────────────────────────────────
Group Buying (15%)   $90/mo        $82/mo      ✓ VALID
Local Production(25%)$150/mo       $125/mo     ✓ VALID
GroToken ($2/token)  $10/mo avg    $9.50/mo    ✓ VALID
```

## Common Integration Patterns

### Pattern 1: Monthly Validation
```python
# Pseudocode
transactions = get_transactions(start_date, end_date)
spending = aggregate_by_category(transactions)
variance = compare_with_simulation(spending)
report = generate_validation_report(variance)
alert_if_variance_exceeds(report, threshold=20%)
```

### Pattern 2: Real-Time Webhook
```python
# Pseudocode
@app.route('/api/firefly-webhook', methods=['POST'])
def webhook_handler():
    verify_webhook_signature(request)
    transaction = parse_transaction(request.json)
    update_metrics(transaction)
    validate_in_realtime(transaction)
    return success_response()
```

### Pattern 3: Batch Analysis
```python
# Pseudocode
for month in past_12_months:
    data = export_transactions(month)
    analysis = analyze_wealth_distribution(data)
    gini = calculate_gini(analysis)
    store_result(month, gini)
```

## Performance Metrics

```
Operation                 Response Time
──────────────────────────────────────
GET /accounts             < 500ms
GET /transactions (100)    < 800ms
GET /summary/basic         < 300ms
Export /transactions       < 5s
Webhook delivery           < 1s
```

## Required Fields for Key Operations

### Creating Transaction
```
Required:
  - user_id
  - description
  - date
  - source_account_id
  - destination_account_id
  - amount
  - transaction_currency_id

Optional:
  - category_id
  - budget_id
  - bill_id
  - tags
  - notes
  - foreign_amount
```

### Creating Budget
```
Required:
  - user_id
  - user_group_id
  - name

Optional:
  - active (default: true)
  - currency_id
```

### Creating Piggy Bank
```
Required:
  - account_id
  - name
  - target_amount

Optional:
  - current_amount
  - start_date
  - target_date
  - active
```

## Error Codes to Handle

```
200 OK              ✓ Success
201 Created         ✓ Resource created
400 Bad Request     ✗ Invalid parameters
401 Unauthorized    ✗ Invalid/missing token
403 Forbidden       ✗ Insufficient permissions
404 Not Found       ✗ Resource doesn't exist
422 Unprocessable   ✗ Validation failed
429 Too Many        ✗ Rate limit exceeded
500 Server Error    ✗ Internal error
```

## Webhook Event Types

```
Event Type                    Code
──────────────────────────────────────
CREATE_TRANSACTION            100
UPDATE_TRANSACTION            110
DELETE_TRANSACTION            120
CREATE_BUDGET                 200
UPDATE_BUDGET                 210
DELETE_BUDGET                 220
UPDATE_BUDGET_LIMIT           230
ANY (catch-all)               50
```

## Rate Limiting Notes

- Default: Per-minute limits vary by endpoint
- Check `X-RateLimit-*` response headers
- Implement exponential backoff for retries
- Use webhooks for real-time instead of polling

## Sample Integration Workflow

```
Week 1: Setup
  ├── Deploy Firefly-iii on pmoves-net
  ├── Create personal access token
  └── Test API connectivity

Week 2: Data Collection
  ├── Fetch 3 months of transaction history
  ├── Extract spending by category
  └── Validate data quality

Week 3: Validation
  ├── Compare with simulation parameters
  ├── Calculate variance report
  └── Identify needed adjustments

Week 4: Real-Time
  ├── Set up webhook endpoints
  ├── Configure transaction triggers
  └── Test webhook delivery

Ongoing: Monitoring
  ├── Weekly validation reports
  ├── Real-time metric updates
  └── Parameter optimization
```

## Resources

**Official Documentation:**
- https://docs.firefly-iii.org/

**API Documentation:**
- https://api-docs.firefly-iii.org/

**GitHub Repository:**
- https://github.com/firefly-iii/firefly-iii

**Community:**
- Gitter Chat: https://gitter.im/firefly-iii/firefly-iii
- GitHub Issues: https://github.com/firefly-iii/firefly-iii/issues

**PMOVES Fork:**
- https://github.com/POWERFULMOVES/PMOVES-Firefly-iii
- Docker Image: ghcr.io/POWERFULMOVES/pmoves-firefly-iii:main

## Quick Checklist

- [ ] Deploy Firefly-iii instance
- [ ] Generate personal access token
- [ ] Test API authentication
- [ ] Extract sample transaction data
- [ ] Verify data format and completeness
- [ ] Set up webhook endpoint
- [ ] Configure webhook triggers
- [ ] Test webhook delivery
- [ ] Implement data validation module
- [ ] Create comparison reports
- [ ] Set up monitoring/alerting
- [ ] Document integration
- [ ] Create runbooks

---

**For detailed implementation guidance, see: FIREFLY_III_INTEGRATION_ANALYSIS.md**

