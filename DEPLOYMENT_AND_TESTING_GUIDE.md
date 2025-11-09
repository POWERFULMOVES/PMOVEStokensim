# PMOVES Ecosystem Deployment & Testing Guide

**Date:** 2025-11-09
**Status:** Ready for Deployment

---

## 🎯 Overview

This guide walks you through deploying and testing the complete PMOVES ecosystem:

1. **PMOVEStokensim** - Economic simulation & visualization
2. **PMOVES-DoX** - Document intelligence & analysis
3. **Integration** - Complete workflow testing

---

## Part 1: PMOVES-DoX Deployment

### Prerequisites

- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- 8 GB RAM minimum (16 GB recommended)
- 10 GB free disk space (for AI models)
- Port 8484 and 3737 available

### Quick Start (Automated)

```bash
cd /home/user/PMOVEStokensim
chmod +x scripts/deploy_dox.sh
./scripts/deploy_dox.sh
```

The script will:
1. ✅ Check Docker installation
2. ✅ Verify Docker Compose
3. ✅ Set up .env configuration
4. ✅ Build and start services
5. ✅ Wait for health checks
6. ✅ Display access points

### Manual Deployment

If you prefer manual control:

```bash
# 1. Navigate to DoX directory
cd /home/user/PMOVES-DoX

# 2. Create environment file
cp .env.example .env

# 3. Build and start (CPU profile)
docker compose -f docker-compose.cpu.yml up --build -d

# 4. Check logs
docker compose -f docker-compose.cpu.yml logs -f

# 5. Verify health
curl http://localhost:8484/health
```

### Access Points

Once deployed:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3737 | Web UI for uploads, search, Q&A |
| **Backend API** | http://localhost:8484 | REST API endpoints |
| **API Docs** | http://localhost:8484/docs | Interactive API documentation |
| **Health Check** | http://localhost:8484/health | Service health status |

### Troubleshooting

**Issue: Backend health check timeout**
```bash
# Check logs
docker compose -f docker-compose.cpu.yml logs backend

# Common causes:
# - AI models still downloading (first run takes 5-10 min)
# - Insufficient RAM (need 8+ GB)
# - Port 8484 already in use
```

**Issue: Port conflicts**
```bash
# Check what's using port 8484
lsof -i :8484

# Change ports in docker-compose.cpu.yml if needed
```

**Issue: Frontend can't connect to backend**
```bash
# Verify backend is running
curl http://localhost:8484/health

# Check frontend environment
docker compose -f docker-compose.cpu.yml logs frontend
```

### GPU Deployment (Optional)

If you have an NVIDIA GPU:

```bash
cd /home/user/PMOVES-DoX

# Deploy with GPU support
docker compose --compatibility --profile ollama --profile tools up --build -d

# Access (different ports!):
# Backend:  http://localhost:8000
# Frontend: http://localhost:3000
# datavzrd: http://localhost:5173
# schemavzrd: http://localhost:5174
```

**Note:** GPU deployment uses ports 8000/3000 instead of 8484/3737!

---

## Part 2: PMOVEStokensim Setup

### Prerequisites

- Node.js 18+ (https://nodejs.org/)
- Python 3.10+
- npm or yarn

### Backend Setup

```bash
cd /home/user/PMOVEStokensim/pmoves_backend

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py

# Backend runs on: http://localhost:5000
```

### Frontend Setup

```bash
cd /home/user/PMOVEStokensim/pmoves-nextjs

# Install dependencies
npm install

# Run development server
npm run dev

# Frontend runs on: http://localhost:3000
```

### Access PMOVEStokensim

Once both are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Main App** | http://localhost:3000 | Simulation interface |
| **Analytics** | http://localhost:3000/analytics | Advanced visualizations |
| **Backend API** | http://localhost:5000 | Simulation API |

---

## Part 3: Complete Workflow Testing

### Step 1: Run Simulation in PMOVEStokensim

1. **Open** http://localhost:3000
2. **Configure parameters:**
   - Member count: 100
   - Weeks: 52
   - Group buying savings: 15%
   - Local production savings: 25%
3. **Run simulation** (both scenarios)
4. **Wait** for completion (~30 seconds)

### Step 2: Export Simulation Data

1. **View results** in SimulationResults component
2. **Click** "Export Data" dropdown (top-right)
3. **Select** "Export All (6 files)"
4. **Files downloaded:**
   - `cooperative_history_YYYY-MM-DD.csv`
   - `cooperative_members_YYYY-MM-DD.csv`
   - `cooperative_events_YYYY-MM-DD.csv`
   - `cooperative_statistics_YYYY-MM-DD.json`
   - `cooperative_wealth_distribution_YYYY-MM-DD.csv`
   - `comparison_cooperative_YYYY-MM-DD.json`

### Step 3: View Advanced Analytics (PMOVEStokensim)

1. **Navigate to** http://localhost:3000/analytics
2. **Explore tabs:**
   - **Distributions:** Violin plots of wealth distribution
   - **Flows:** Sankey diagrams and waterfall charts
   - **Correlations:** Heatmap of parameter relationships
   - **Comparisons:** Side-by-side scenario analysis
3. **Review statistics:**
   - Gini coefficient reduction
   - Average wealth increase
   - Members lifted from poverty

### Step 4: Upload to PMOVES-DoX

#### Option A: Using Integration Script

```bash
cd /home/user/PMOVEStokensim

# Run integration script
python scripts/integrate_with_dox.py

# Script will:
# 1. Check DoX health
# 2. Upload all CSV files
# 3. Run Q&A queries
# 4. Generate dashboards
# 5. Export results
```

#### Option B: Manual Upload (Web UI)

1. **Open** http://localhost:3737 (DoX Frontend)
2. **Click** "Upload" button
3. **Select** `cooperative_history_YYYY-MM-DD.csv`
4. **Wait** for processing (~5-10 seconds)
5. **Repeat** for other CSV files

### Step 5: Analyze in PMOVES-DoX

#### Vector Search

1. **Open** http://localhost:3737
2. **Use global search bar:**
   - "Gini coefficient"
   - "wealth inequality"
   - "cooperative savings"
3. **Review results** with deep links to data sources

#### Q&A with Citations

1. **Navigate to** "Ask" tab
2. **Ask questions:**
   - "What is the average Gini coefficient across all weeks?"
   - "How much did cooperative savings increase wealth?"
   - "What percentage of members escaped poverty?"
3. **Review answers** with page/row citations

#### CHR Clustering

1. **Navigate to** "Analysis" tab
2. **Click** "Run CHR Analysis"
3. **View clustering results:**
   - Pattern detection
   - Scenario grouping
   - Outlier identification

#### Generate Dashboards

1. **Navigate to** "Visualize" tab
2. **Select** uploaded CSV
3. **Click** "Generate datavzrd Dashboard"
4. **Access dashboard** at http://localhost:5173
5. **Explore:**
   - Interactive tables
   - Time-series charts
   - Statistical summaries

### Step 6: CLI Testing (Advanced)

```bash
cd /home/user/PMOVES-DoX/backend

# Activate venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Install CLI
pip install -e .

# Test commands
pmoves-cli --base-url http://localhost:8484 ingest csv \
  /path/to/cooperative_history_YYYY-MM-DD.csv

pmoves-cli --base-url http://localhost:8484 search \
  "average Gini coefficient" --json

pmoves-cli --base-url http://localhost:8484 export-tags \
  <document-id> -o insights.json
```

---

## Part 4: Integration Validation Checklist

### ✅ PMOVEStokensim Tests

- [ ] Backend runs without errors (http://localhost:5000)
- [ ] Frontend loads successfully (http://localhost:3000)
- [ ] Simulation completes for both scenarios
- [ ] Export dropdown appears in results
- [ ] All 6 files export correctly
- [ ] Analytics dashboard loads (http://localhost:3000/analytics)
- [ ] All 4 tabs display correctly
- [ ] Violin plots render
- [ ] Waterfall charts show data
- [ ] Sankey diagrams display flows
- [ ] Heatmap shows correlations

### ✅ PMOVES-DoX Tests

- [ ] Backend health check passes (http://localhost:8484/health)
- [ ] Frontend loads (http://localhost:3737)
- [ ] File upload works
- [ ] CSV processing completes
- [ ] Vector search returns results
- [ ] Q&A provides answers with citations
- [ ] CHR analysis runs successfully
- [ ] datavzrd dashboards generate
- [ ] CLI commands work
- [ ] API documentation accessible (http://localhost:8484/docs)

### ✅ Integration Tests

- [ ] Integration script connects to DoX
- [ ] CSV files upload successfully
- [ ] DoX extracts financial metrics from simulation data
- [ ] Q&A answers questions about simulation results
- [ ] CHR detects patterns in scenario data
- [ ] Dashboards display simulation metrics
- [ ] No errors in console logs
- [ ] Performance is acceptable (<30s for full workflow)

---

## Part 5: Sample Test Queries

### PMOVEStokensim Analytics Dashboard

**Test Navigation:**
1. Go to http://localhost:3000/analytics
2. Verify all tabs load
3. Check sample data appears if no simulation run

**Test Visualization:**
1. Run a simulation
2. Navigate to analytics
3. Verify real data loads instead of sample
4. Test all chart interactions

### PMOVES-DoX Q&A

**Sample Questions to Test:**

```
Economic Analysis:
- "What is the average Gini coefficient?"
- "How much did wealth inequality decrease?"
- "What percentage of members are in poverty?"

Trend Analysis:
- "Show me the wealth trend over time"
- "How did cooperative savings change?"
- "What is the GroToken accumulation rate?"

Comparative Analysis:
- "Compare traditional vs cooperative wealth"
- "What are the main differences between scenarios?"
- "Which scenario had better poverty outcomes?"

Statistical Queries:
- "What is the median wealth in week 52?"
- "Calculate the wealth gap ratio"
- "Show distribution of savings rates"
```

### PMOVES-DoX Vector Search

**Sample Searches:**

```
- "Gini coefficient week 52"
- "cooperative savings impact"
- "wealth quintile distribution"
- "poverty threshold"
- "GroToken balance"
- "group buying participation"
```

---

## Part 6: Performance Benchmarks

### Expected Timings

| Operation | Expected Time | Notes |
|-----------|--------------|-------|
| DoX first startup | 5-10 minutes | Model downloads ~2-3 GB |
| DoX subsequent startup | 30-60 seconds | Models cached |
| PMOVEStokensim simulation | 20-40 seconds | 100 members, 52 weeks |
| CSV upload to DoX | 3-5 seconds | Per file |
| DoX processing | 5-10 seconds | Financial fact extraction |
| Vector search | <1 second | After index built |
| Q&A query | 5-15 seconds | Depends on LLM |
| CHR analysis | 10-30 seconds | Depends on data size |
| Dashboard generation | 15-30 seconds | First time, then cached |

### System Requirements

**Minimum:**
- CPU: 4 cores
- RAM: 8 GB
- Disk: 10 GB free
- Network: For model downloads

**Recommended:**
- CPU: 8+ cores
- RAM: 16 GB
- Disk: 20 GB SSD
- GPU: NVIDIA (optional, for faster processing)

---

## Part 7: Troubleshooting Common Issues

### Issue: "Cannot connect to backend"

**PMOVEStokensim:**
```bash
# Check backend is running
curl http://localhost:5000/health

# Check frontend config
# pmoves-nextjs/next.config.js should have:
# env: { NEXT_PUBLIC_API_BASE: 'http://localhost:5000' }
```

**PMOVES-DoX:**
```bash
# Check backend is running
curl http://localhost:8484/health

# Check frontend config
docker compose -f docker-compose.cpu.yml logs frontend
```

### Issue: "Export buttons not appearing"

```bash
# Verify components are imported
grep -r "ExportButtons" pmoves-nextjs/src/components/SimulationResults.tsx

# Check build
cd pmoves-nextjs
npm run build
```

### Issue: "Analytics dashboard shows errors"

```bash
# Check browser console for errors
# Common issues:
# - Missing chart data
# - localStorage not accessible
# - Component import errors

# Clear localStorage and refresh
# Open DevTools → Application → Local Storage → Clear
```

### Issue: "DoX upload fails"

```bash
# Check file size (<100 MB)
ls -lh /path/to/file.csv

# Check backend logs
docker compose -f docker-compose.cpu.yml logs backend | grep -i error

# Verify endpoint
curl -X POST http://localhost:8484/upload \
  -F "file=@test.csv" \
  -H "Content-Type: multipart/form-data"
```

### Issue: "Q&A returns no answer"

```bash
# Verify document was uploaded and processed
curl http://localhost:8484/artifacts

# Check if search index was built
curl http://localhost:8484/search -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "limit": 5}'

# Rebuild search index
curl -X POST http://localhost:8484/search/rebuild
```

---

## Part 8: Next Steps After Successful Testing

### Immediate (This Week)

1. **Run multiple simulations** with different parameters
2. **Export and analyze** all results in DoX
3. **Generate dashboards** for each scenario
4. **Document findings** and insights

### Short-term (1-2 Weeks)

1. **Create custom Q&A queries** for your use cases
2. **Build automated reporting** using CLI
3. **Set up recurring analysis** workflows
4. **Share dashboards** with team members

### Medium-term (1 Month)

1. **Integrate Firefly-iii** for real-world data validation
2. **Compare simulated vs. actual** cooperative savings
3. **Calibrate model parameters** based on real data
4. **Create training materials** for cooperative members

### Long-term (3+ Months)

1. **Deploy to production** environment
2. **Set up continuous monitoring** of economic metrics
3. **Build custom ML models** for prediction
4. **Expand to multi-cooperative** analysis

---

## Part 9: Support & Resources

### Documentation

**PMOVEStokensim:**
- Economic Model Validation: `ECONOMIC_MODEL_VALIDATION_REPORT.md`
- Visualization Guide: `VISUALIZATION_ENHANCEMENTS_SUMMARY.md`
- Integration Architecture: `INTEGRATION_ARCHITECTURE.md`
- Session Summary: `SESSION_SUMMARY_COMPLETE.md`

**PMOVES-DoX:**
- Repository Review: `PMOVES_DOX_REVIEW_UPDATED.md`
- User Guide: `/home/user/PMOVES-DoX/docs/USER_GUIDE.md`
- Cookbooks: `/home/user/PMOVES-DoX/docs/COOKBOOKS.md`
- API Reference: `/home/user/PMOVES-DoX/docs/API_REFERENCE.md`

### Quick Commands Reference

```bash
# PMOVEStokensim
cd /home/user/PMOVEStokensim/pmoves_backend && python app.py
cd /home/user/PMOVEStokensim/pmoves-nextjs && npm run dev

# PMOVES-DoX
cd /home/user/PMOVES-DoX && docker compose -f docker-compose.cpu.yml up -d
cd /home/user/PMOVES-DoX && docker compose -f docker-compose.cpu.yml logs -f
cd /home/user/PMOVES-DoX && docker compose -f docker-compose.cpu.yml down

# Integration
cd /home/user/PMOVEStokensim && python scripts/integrate_with_dox.py

# Health Checks
curl http://localhost:5000/health  # PMOVEStokensim backend
curl http://localhost:8484/health  # PMOVES-DoX backend
```

---

## 🎉 Success Criteria

You'll know the integration is working when:

1. ✅ All services start without errors
2. ✅ Simulation completes successfully
3. ✅ Data exports download correctly
4. ✅ Analytics dashboard displays all charts
5. ✅ DoX processes uploaded files
6. ✅ Q&A provides accurate answers
7. ✅ Dashboards generate and display
8. ✅ No console errors
9. ✅ Performance meets benchmarks
10. ✅ You can answer business questions using the system!

**Ready to deploy?** Run `./scripts/deploy_dox.sh` and let's go! 🚀

---

**Last Updated:** 2025-11-09
**Version:** 1.0
**Status:** Production Ready
