# Documentation Index

Complete index of all PMOVES Token Economy Simulator documentation with cross-references and quick links.

---

## 📖 Documentation Map

```
PMOVES Documentation
├── Getting Started
│   ├── README.md (Main GitHub page)
│   ├── QUICK_START.md (5-minute setup)
│   └── FOLDER_STRUCTURE.md (Project organization)
│
├── User Documentation
│   ├── USER_GUIDE.md (Complete usage guide)
│   └── Phase-specific READMEs (in integrations/)
│
├── Developer Documentation
│   ├── TECHNICAL_GUIDE.md (Architecture & implementation)
│   └── API_REFERENCE.md (Complete API docs)
│
├── Phase Documentation
│   ├── Phase 1: Event Bus
│   ├── Phase 2: Contract Integration
│   ├── Phase 3: Projection Validation
│   └── Phase 4: Firefly Integration
│
└── Project Documentation
    ├── PROJECT_STATUS.md (Current status)
    ├── TEST_RESULTS_PHASE3.md (Validation results)
    ├── CHANGELOG_PHASE3_FIXES.md (Bug fixes)
    └── Implementation docs (Phase-specific)
```

---

## 🚀 Getting Started Documentation

### [README.md](README.md)
**Main GitHub landing page**
- Project overview
- Key features
- Quick start instructions
- Architecture diagram
- Use cases
- Technology stack

**Best for:** First-time visitors, understanding what PMOVES is

### [QUICK_START.md](QUICK_START.md)
**5-minute getting started guide**
- Installation steps
- Running first simulation
- Understanding results
- Common commands
- Troubleshooting

**Best for:** Getting up and running quickly

### [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)
**Project organization**
- Directory layout
- File descriptions
- Module purposes
- Navigation guide

**Best for:** Understanding codebase structure

---

## 👥 User Documentation

### [USER_GUIDE.md](USER_GUIDE.md)
**Complete usage documentation**
- Installation & setup
- Running simulations
- Interpreting results
- Firefly-iii integration
- Customization options
- Best practices

**Best for:** End users, business analysts, project managers

---

## 👨‍💻 Developer Documentation

### [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md)
**Architecture & implementation guide**
- System architecture
- Design patterns
- Component interactions
- Data flow
- Testing strategy
- Development workflow

**Best for:** Developers, architects, contributors

### [API_REFERENCE.md](API_REFERENCE.md)
**Complete API documentation**
- All classes and interfaces
- Method signatures
- Usage examples
- Type definitions

**Best for:** Developers integrating PMOVES

---

## 📚 Phase Documentation

### Phase 1: Event Bus
**File:** [integrations/event-bus/README.md](integrations/event-bus/README.md)

**Topics:**
- Pub/sub architecture
- Event types
- Usage examples
- Testing

**Related docs:**
- Event Bus implementation
- Contract event communication

### Phase 2: Contract Integration
**File:** [integrations/contracts/README.md](integrations/contracts/README.md)

**Topics:**
- 5 smart contract models
- Token distribution
- Group purchasing
- Staking & governance

**Contract Models:**
1. GroToken - Token distribution
2. FoodUSD - Stablecoin for food spending
3. GroupPurchase - 15% savings mechanism
4. GroVault - Staking with voting power
5. CoopGovernor - Quadratic voting governance

**Related docs:**
- Contract model implementations
- Test suites

### Phase 3: Projection Validation
**File:** [integrations/projections/README.md](integrations/projections/README.md)

**Topics:**
- 5-year simulation framework
- Variance analysis
- Risk assessment
- Report generation

**Key files:**
- `projection-validator.ts` - Main validator
- `scenario-configs.ts` - Business models
- `export-results.ts` - Report generation

**Related docs:**
- [TEST_RESULTS_PHASE3.md](TEST_RESULTS_PHASE3.md) - Validation results
- [CHANGELOG_PHASE3_FIXES.md](CHANGELOG_PHASE3_FIXES.md) - Bug fixes

### Phase 4: Firefly Integration
**File:** [integrations/firefly/README.md](integrations/firefly/README.md)

**Topics:**
- Real data integration
- Parameter calibration
- Confidence scoring
- Report generation

**Key files:**
- `firefly-client.ts` - API client
- `data-transformer.ts` - Category mapping
- `calibration-engine.ts` - Parameter calibration
- `firefly-integration.ts` - Pipeline coordinator

**Related docs:**
- [PHASE4_PLAN.md](PHASE4_PLAN.md) - Architecture plan
- [PHASE4_IMPLEMENTATION.md](PHASE4_IMPLEMENTATION.md) - Implementation summary

---

## 📊 Results & Reports

### [TEST_RESULTS_PHASE3.md](TEST_RESULTS_PHASE3.md)
**Phase 3 validation test results**
- Full validation suite results (5 models)
- Corrected ROI calculations
- Before/after bug fixes comparison
- Model rankings
- Performance metrics

**Updated:** 2025-11-13

### [CHANGELOG_PHASE3_FIXES.md](CHANGELOG_PHASE3_FIXES.md)
**Bug fixes changelog**
- 6 critical/major bugs fixed
- Before/after code comparisons
- Root cause analysis
- Testing & validation

**Version:** Phase 3.1 (Bug Fix Release)

### [PROJECT_STATUS.md](PROJECT_STATUS.md)
**Overall project status**
- Phase completion status
- Deliverables summary
- Technical stack
- Version history

**Last updated:** 2025-11-12

---

## 🏗️ Implementation Documentation

### Phase 4 Implementation
**Files:**
- [PHASE4_PLAN.md](PHASE4_PLAN.md) - Architecture & planning
- [PHASE4_IMPLEMENTATION.md](PHASE4_IMPLEMENTATION.md) - Implementation summary

**Topics:**
- Data transformation layer
- Calibration engine
- Integration coordinator
- Report generation

---

## 📖 Historical Documentation

### Legacy Analysis Documents

These documents were created during early phases and provide historical context:

| Document | Purpose | Status |
|----------|---------|--------|
| INTEGRATION_ARCHITECTURE.md | Initial architecture design | Historical |
| FIREFLY_III_INTEGRATION_ANALYSIS.md | Firefly integration analysis | Historical |
| ECONOMIC_MODEL_VALIDATION_REPORT.md | Early validation results | Superseded by TEST_RESULTS_PHASE3.md |
| IMPLEMENTATION_PLAN.md | Original implementation plan | Historical |
| PMOVES_DOX_ANALYSIS.md | DoX integration analysis | Historical |

**Note:** Refer to current documentation for up-to-date information.

---

## 🔍 Quick Lookup Tables

### By Topic

| Topic | Documentation |
|-------|---------------|
| **Installation** | [QUICK_START.md](QUICK_START.md) |
| **Running Simulations** | [USER_GUIDE.md](USER_GUIDE.md), [QUICK_START.md](QUICK_START.md) |
| **Firefly Integration** | [integrations/firefly/README.md](integrations/firefly/README.md) |
| **API Reference** | [API_REFERENCE.md](API_REFERENCE.md) |
| **Architecture** | [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) |
| **Test Results** | [TEST_RESULTS_PHASE3.md](TEST_RESULTS_PHASE3.md) |
| **Bug Fixes** | [CHANGELOG_PHASE3_FIXES.md](CHANGELOG_PHASE3_FIXES.md) |
| **Project Structure** | [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) |

### By User Type

| User Type | Start Here |
|-----------|------------|
| **New User** | [README.md](README.md) → [QUICK_START.md](QUICK_START.md) |
| **Business User** | [USER_GUIDE.md](USER_GUIDE.md) → [TEST_RESULTS_PHASE3.md](TEST_RESULTS_PHASE3.md) |
| **Developer** | [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) → [API_REFERENCE.md](API_REFERENCE.md) |
| **Contributor** | [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) → [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) |

### By Task

| Task | Documentation |
|------|---------------|
| **Run first simulation** | [QUICK_START.md](QUICK_START.md) § Running Your First Simulation |
| **Interpret results** | [USER_GUIDE.md](USER_GUIDE.md) § Understanding Results |
| **Set up Firefly** | [integrations/firefly/README.md](integrations/firefly/README.md) § Usage |
| **Customize models** | [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) § Customization |
| **Run tests** | [QUICK_START.md](QUICK_START.md) § Common Commands |
| **Fix bugs** | [CHANGELOG_PHASE3_FIXES.md](CHANGELOG_PHASE3_FIXES.md) |
| **Understand architecture** | [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) § Architecture |

---

## 🔗 External Resources

### Dependencies Documentation
- [TypeScript](https://www.typescriptlang.org/docs/) - Language reference
- [Node.js](https://nodejs.org/docs/) - Runtime documentation
- [Jest](https://jestjs.io/docs/) - Testing framework
- [Ethers.js](https://docs.ethers.org/) - Ethereum library

### Related Projects
- [Firefly-iii](https://docs.firefly-iii.org/) - Personal finance manager
- [Firefly-iii API](https://api-docs.firefly-iii.org/) - API documentation

---

## 📝 Documentation Standards

### Document Types

1. **README files** - Module/folder overviews
2. **Guide files** - Step-by-step instructions
3. **Reference files** - API/technical reference
4. **Report files** - Test results, status updates

### Naming Conventions

- `README.md` - Main project documentation
- `*_GUIDE.md` - User/technical guides
- `*_REFERENCE.md` - API/technical reference
- `*_RESULTS.md` - Test/validation results
- `*_STATUS.md` - Project/phase status
- `*_PLAN.md` - Planning documents
- `CHANGELOG*.md` - Change logs

### Cross-Reference Format

All docs use markdown links:
```markdown
[Link Text](FILE.md)
[Link to Section](FILE.md#section-anchor)
```

---

## 🆘 Getting Help

### Can't Find What You Need?

1. **Search this index** - Use Ctrl+F/Cmd+F
2. **Check README** - [README.md](README.md)
3. **Try Quick Start** - [QUICK_START.md](QUICK_START.md)
4. **Browse by topic** - See Quick Lookup Tables above

### Still Stuck?

- **GitHub Issues:** [Report an issue](https://github.com/POWERFULMOVES/PMOVEStokensim/issues)
- **Discussions:** [Ask a question](https://github.com/POWERFULMOVES/PMOVEStokensim/discussions)

---

## 📅 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| README.md | ✅ Current | 2025-11-13 |
| QUICK_START.md | ✅ Current | 2025-11-13 |
| USER_GUIDE.md | ✅ Current | 2025-11-13 |
| TECHNICAL_GUIDE.md | ✅ Current | 2025-11-13 |
| API_REFERENCE.md | ✅ Current | 2025-11-13 |
| FOLDER_STRUCTURE.md | ✅ Current | 2025-11-13 |
| TEST_RESULTS_PHASE3.md | ✅ Current | 2025-11-13 |
| CHANGELOG_PHASE3_FIXES.md | ✅ Current | 2025-11-13 |
| PROJECT_STATUS.md | 🟡 Needs Update | 2025-11-12 |
| Phase READMEs | ✅ Current | 2025-11-13 |

---

<p align="center">
  <a href="README.md">Main README</a> •
  <a href="QUICK_START.md">Quick Start</a> •
  <a href="USER_GUIDE.md">User Guide</a> •
  <a href="TECHNICAL_GUIDE.md">Technical Guide</a>
</p>

<p align="center">
  <strong>Complete PMOVES Documentation Index</strong><br>
  Last updated: 2025-11-13
</p>
