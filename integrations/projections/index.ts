/**
 * PMOVES Projection Validation Module
 *
 * Validates business projection models against 5-year simulation runs.
 */

export {
  ProjectionValidator,
  ProjectionModel,
  SimulationResults,
  ValidationReport,
} from './projection-validator';

export {
  AI_ENHANCED_LOCAL_SERVICE,
  ENERGY_CONSULTING,
  TOKEN_PRE_ORDER,
  AI_SERVICE_BULL_MARKET,
  TOKEN_PRE_ORDER_BEAR_MARKET,
  BASELINE_MODELS,
  ALL_MODELS,
  MARKET_SCENARIOS,
  SUCCESS_FACTORS,
} from './scenario-configs';

export {
  runAllValidations,
  runQuickValidation,
} from './run-validation';

export {
  exportValidationReportCSV,
  exportWeeklyDataCSV,
  exportComparisonCSV,
  exportAllResults,
  generateMarkdownReport,
} from './export-results';

export { CalibrationEngine } from './calibration-engine';
export type {
  CalibrationResult,
  CategoryComparison,
  CalibrationReport,
} from './calibration-engine';
