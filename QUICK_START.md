# Quick Start Guide

Get up and running with PMOVES Token Economy Simulator in 5 minutes.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

**Optional:**
- **Firefly-iii** instance for real data calibration

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/POWERFULMOVES/PMOVEStokensim.git
cd PMOVEStokensim
```

### Step 2: Install Dependencies

```bash
cd integrations
npm install
```

This will install all required packages (~200MB, takes 1-2 minutes).

---

## Running Your First Simulation

### Option 1: Quick Validation (Recommended)

Validates 1 business model across 260 weeks (5 years):

```bash
npm run validate:quick
```

**Expected output:**
```
🚀 PMOVES Quick Validation
Running 5-year simulation for AI-Enhanced Local Service model...

================================================================================
VALIDATION REPORT: AI-Enhanced Local Service Business
================================================================================

📊 PROJECTIONS vs ACTUAL
Revenue:
  Projected: $94,277
  Actual:    $385,988
  Variance:  +309.4%

ROI:
  Projected: 1366%
  Actual:    7594%
  Variance:  +455.9%

✅ Quick validation complete.
```

**Time:** ~60 seconds

### Option 2: Full Validation Suite

Validates all 5 business models (1,300 weeks total):

```bash
npm run validate:all
```

**Time:** ~5-6 minutes

**View detailed results:**
```bash
cat ../TEST_RESULTS_PHASE3.md
```

---

## Understanding the Results

### Validation Report Structure

Each validation report contains:

1. **Projections vs Actual** - Revenue, ROI, Break-Even comparison
2. **Risk Assessment** - Success probability, confidence level
3. **Analysis** - Growth pattern, profitability trend, token impact
4. **Recommendations** - Actions to improve performance

### Key Metrics

| Metric | What It Means |
|--------|---------------|
| **Revenue Variance** | How much actual revenue differs from projections |
| **ROI Variance** | Return on investment accuracy |
| **Break-Even Variance** | How close actual break-even is to projected |
| **Confidence Level** | HIGH/MEDIUM/LOW based on variance |

### Example Interpretation

```
Revenue Variance: +309.4%
```
✅ **Good News!** Actual revenue is 3x higher than projected.

```
Break-Even Variance: +61.0%
```
⚠️ **Caution:** Taking 61% longer to break even than expected.

```
Confidence Level: LOW
```
❌ **Action Needed:** High variance requires parameter calibration.

---

## Calibrating with Real Data

If you have a Firefly-iii instance with financial data:

### Step 1: Get API Token

1. Log in to your Firefly-iii instance
2. Go to **Options → Profile → OAuth**
3. Create a **Personal Access Token**
4. Copy the token

### Step 2: Set Environment Variable

```bash
export FIREFLY_API_TOKEN="your-token-here"
export FIREFLY_URL="http://localhost:8080"  # Optional, defaults to localhost
```

### Step 3: Run Calibration

```bash
npx ts-node --project tsconfig.run.json firefly/run-integration.ts
```

**This will:**
1. Fetch 90 days of transaction data
2. Transform into weekly spending
3. Run baseline simulation
4. Calibrate parameters
5. Generate reports

**Time:** ~2-3 minutes

### Step 4: View Calibration Results

```bash
cat output/firefly-calibration/CALIBRATION_REPORT.md
```

**Reports generated:**
- `CALIBRATION_REPORT.md` - Comprehensive analysis
- `category-comparison.csv` - Category-level variance
- `parameter-adjustments.csv` - Parameter changes
- `weekly-comparison.csv` - Week-by-week data

---

## Common Commands

### Running Tests

```bash
# All tests
npm test

# Specific module
npm test event-bus
npm test contracts
npm test projections
```

### Checking TypeScript

```bash
# Type check
npx tsc --noEmit

# Build
npm run build
```

### Viewing Documentation

```bash
# Project structure
cat FOLDER_STRUCTURE.md

# Full user guide
cat USER_GUIDE.md

# API reference
cat API_REFERENCE.md

# Documentation index
cat DOCUMENTATION_INDEX.md
```

---

## Next Steps

### For Users

1. **Read the User Guide** - [USER_GUIDE.md](USER_GUIDE.md)
2. **Explore Example Results** - See `TEST_RESULTS_PHASE3.md`
3. **Try Firefly Integration** - Calibrate with your data
4. **Customize Models** - Edit scenario configs

### For Developers

1. **Read Technical Guide** - [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)
2. **Study API Reference** - [API_REFERENCE.md](API_REFERENCE.md)
3. **Explore Source Code** - Start with `integrations/projections/`
4. **Run Tests** - `npm test`

---

## Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Make sure you're in the right directory
cd integrations

# Check TypeScript version
npx tsc --version  # Should be 5.0+
```

### Issue: No output from validation

**Solution:**
```bash
# Run with verbose logging
npx ts-node --project tsconfig.run.json projections/run-validation.ts --quick
```

### Issue: Firefly-iii connection failed

**Solutions:**
1. Check Firefly-iii is running: `curl http://localhost:8080/api/v1/about`
2. Verify API token is set: `echo $FIREFLY_API_TOKEN`
3. Check network connectivity

### Issue: Out of memory

**Solution:**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run validate:all
```

---

## Quick Reference Card

### Essential Commands

```bash
# Install
npm install

# Quick test (1 model, 60 sec)
npm run validate:quick

# Full test (5 models, 5-6 min)
npm run validate:all

# Calibrate with real data (2-3 min)
export FIREFLY_API_TOKEN="token"
npx ts-node --project tsconfig.run.json firefly/run-integration.ts

# Run tests
npm test

# View results
cat ../TEST_RESULTS_PHASE3.md
cat output/firefly-calibration/CALIBRATION_REPORT.md
```

### File Locations

| What | Where |
|------|-------|
| Test Results | `TEST_RESULTS_PHASE3.md` |
| Calibration Reports | `output/firefly-calibration/` |
| Source Code | `integrations/` |
| Documentation | `*.md` files in root |
| Tests | `integrations/**/__tests__/` |

---

## Getting Help

- **Documentation Index:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- **User Guide:** [USER_GUIDE.md](USER_GUIDE.md)
- **Technical Guide:** [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)
- **GitHub Issues:** [Report a problem](https://github.com/POWERFULMOVES/PMOVEStokensim/issues)

---

## What's Next?

You now have PMOVES running! Here are some ideas:

### Beginner
- Run full validation suite
- View and interpret test results
- Explore different business models

### Intermediate
- Set up Firefly-iii integration
- Calibrate models with real data
- Customize scenario parameters

### Advanced
- Modify contract models
- Add new projection scenarios
- Contribute to the project

---

<p align="center">
  <a href="README.md">← Back to README</a> •
  <a href="USER_GUIDE.md">User Guide →</a>
</p>

<p align="center">
  <strong>Ready to dive deeper?</strong><br>
  Check out the <a href="USER_GUIDE.md">complete User Guide</a> or <a href="TECHNICAL_GUIDE.md">Technical Guide</a>
</p>
