/**
 * Projection Scenario Configurations
 *
 * Defines the three main business projection models from the 5-Year
 * Business Projections analysis for validation against simulation.
 */

import { ProjectionModel } from './projection-validator';

/**
 * AI-Enhanced Local Service Business
 *
 * Highest projected ROI (1,366%) with 75% success probability.
 * Focus on AI-enabled service delivery to local community.
 *
 * Key assumptions:
 * - 75% participation rate (optimistic AI adoption)
 * - Weekly growth driven by word-of-mouth and AI efficiency
 * - Break-even in 3.3 months
 * - Strong token distribution for community rewards
 */
export const AI_ENHANCED_LOCAL_SERVICE: ProjectionModel = {
  name: 'AI-Enhanced Local Service Business',
  description: 'AI-powered local services with token rewards for participation',

  // Financial projections
  initialInvestment: 5000,
  projectedYear5Revenue: 94277,
  projectedRiskAdjustedROI: 13.66, // 1,366%
  projectedBreakEvenMonths: 3.3,
  successProbability: 0.75,

  // Simulation parameters
  populationSize: 500, // Community size
  participationRate: 0.75, // 75% adoption rate (high due to AI benefits)

  // Revenue modeling
  // Year 5 revenue: $94,277 / 52 weeks = ~$1,813/week
  // Working backward with growth: start at ~$100/week
  weeklyRevenuePerParticipant: 0.53, // $0.53/participant/week at start
  growthRatePerWeek: 0.0125, // 1.25% weekly growth (compounds to 5-year target)

  // Token economy (strong rewards for AI usage)
  tokenDistributionRate: 0.6, // 60% of participants receive tokens weekly
  groupBuyingSavings: 0.15, // 15% savings through bulk AI-service purchasing
  stakingParticipation: 0.40, // 40% stake tokens for governance
};

/**
 * Sustainable Energy AI Consulting
 *
 * Second-tier ROI (818%) with 60% success probability.
 * Specialized consulting on energy efficiency using AI analytics.
 *
 * Key assumptions:
 * - 60% participation rate (moderate adoption)
 * - Niche market with steady growth
 * - Break-even in 4.4 months
 * - Token rewards for energy savings achievements
 */
export const ENERGY_CONSULTING: ProjectionModel = {
  name: 'Sustainable Energy AI Consulting',
  description: 'AI-driven energy efficiency consulting with token incentives',

  // Financial projections
  initialInvestment: 4000,
  projectedYear5Revenue: 63020,
  projectedRiskAdjustedROI: 8.18, // 818%
  projectedBreakEvenMonths: 4.4,
  successProbability: 0.60,

  // Simulation parameters
  populationSize: 400, // Smaller, specialized market
  participationRate: 0.60, // 60% adoption (niche market)

  // Revenue modeling
  // Year 5 revenue: $63,020 / 52 weeks = ~$1,212/week
  // Start at ~$80/week
  weeklyRevenuePerParticipant: 0.67, // $0.67/participant/week at start
  growthRatePerWeek: 0.0110, // 1.1% weekly growth

  // Token economy (incentives for energy savings)
  tokenDistributionRate: 0.50, // 50% receive tokens based on savings achieved
  groupBuyingSavings: 0.15, // Bulk purchasing of energy equipment
  stakingParticipation: 0.30, // 30% stake for voting on initiatives
};

/**
 * Community Token Pre-Order System
 *
 * Token-focused model with 350% ROI and 40% success probability.
 * Community currency for local goods and services pre-orders.
 *
 * Key assumptions:
 * - 40% participation rate (high risk, community currency challenges)
 * - Growth dependent on network effects
 * - Break-even in 6.9 months
 * - Heavy reliance on token adoption and utility
 */
export const TOKEN_PRE_ORDER: ProjectionModel = {
  name: 'Community Token Pre-Order System',
  description: 'Local community currency for pre-ordering goods and services',

  // Financial projections
  initialInvestment: 3000,
  projectedYear5Revenue: 33084,
  projectedRiskAdjustedROI: 3.50, // 350%
  projectedBreakEvenMonths: 6.9,
  successProbability: 0.40,

  // Simulation parameters
  populationSize: 300, // Smaller community required for trust
  participationRate: 0.40, // 40% adoption (network effect challenges)

  // Revenue modeling
  // Year 5 revenue: $33,084 / 52 weeks = ~$636/week
  // Start at ~$50/week, slower initial growth until network effects kick in
  weeklyRevenuePerParticipant: 0.83, // $0.83/participant/week at start
  growthRatePerWeek: 0.0090, // 0.9% weekly growth (slower due to adoption challenges)

  // Token economy (core to business model)
  tokenDistributionRate: 0.80, // 80% receive tokens (high to drive adoption)
  groupBuyingSavings: 0.15, // Savings through pre-order coordination
  stakingParticipation: 0.50, // 50% stake (high community governance)
};

/**
 * Bull Market Scenario - Optimistic variant
 *
 * +50% ROI impact, +20% success rate increase
 * Applied to AI-Enhanced Local Service model
 */
export const AI_SERVICE_BULL_MARKET: ProjectionModel = {
  ...AI_ENHANCED_LOCAL_SERVICE,
  name: 'AI-Enhanced Local Service (Bull Market)',
  projectedRiskAdjustedROI: AI_ENHANCED_LOCAL_SERVICE.projectedRiskAdjustedROI * 1.5, // +50%
  successProbability: Math.min(0.95, AI_ENHANCED_LOCAL_SERVICE.successProbability + 0.20), // +20%
  participationRate: Math.min(0.90, AI_ENHANCED_LOCAL_SERVICE.participationRate + 0.10), // +10%
  growthRatePerWeek: AI_ENHANCED_LOCAL_SERVICE.growthRatePerWeek * 1.3, // 30% faster growth
};

/**
 * Bear Market Scenario - Pessimistic variant
 *
 * -40% ROI impact, -25% success rate decrease
 * Applied to Token Pre-Order model (most vulnerable)
 */
export const TOKEN_PRE_ORDER_BEAR_MARKET: ProjectionModel = {
  ...TOKEN_PRE_ORDER,
  name: 'Community Token Pre-Order (Bear Market)',
  projectedRiskAdjustedROI: TOKEN_PRE_ORDER.projectedRiskAdjustedROI * 0.6, // -40%
  successProbability: Math.max(0.15, TOKEN_PRE_ORDER.successProbability - 0.25), // -25%
  participationRate: Math.max(0.20, TOKEN_PRE_ORDER.participationRate - 0.15), // -15%
  growthRatePerWeek: TOKEN_PRE_ORDER.growthRatePerWeek * 0.7, // 30% slower growth
};

/**
 * All baseline projection models for comparison
 */
export const BASELINE_MODELS: ProjectionModel[] = [
  AI_ENHANCED_LOCAL_SERVICE,
  ENERGY_CONSULTING,
  TOKEN_PRE_ORDER,
];

/**
 * All models including market variants
 */
export const ALL_MODELS: ProjectionModel[] = [
  AI_ENHANCED_LOCAL_SERVICE,
  ENERGY_CONSULTING,
  TOKEN_PRE_ORDER,
  AI_SERVICE_BULL_MARKET,
  TOKEN_PRE_ORDER_BEAR_MARKET,
];

/**
 * Market scenario configurations
 */
export const MARKET_SCENARIOS = {
  bull: {
    name: 'Bull Market + High AI Adoption',
    probability: 0.25,
    roiMultiplier: 1.5,
    successRateIncrease: 0.20,
    growthAcceleration: 1.3,
  },
  normal: {
    name: 'Normal Growth',
    probability: 0.50,
    roiMultiplier: 1.0,
    successRateIncrease: 0.0,
    growthAcceleration: 1.0,
  },
  downturn: {
    name: 'Economic Downturn',
    probability: 0.20,
    roiMultiplier: 0.6,
    successRateIncrease: -0.25,
    growthAcceleration: 0.7,
  },
  cryptoWinter: {
    name: 'Crypto Winter + AI Skepticism',
    probability: 0.05,
    roiMultiplier: 0.4,
    successRateIncrease: -0.35,
    growthAcceleration: 0.5,
  },
};

/**
 * Success factors by model type
 */
export const SUCCESS_FACTORS = {
  aiModels: {
    adoptionRate: 0.68, // 68% of small businesses already using AI
    workforceGrowth: 0.82, // 82% increased workforce
    averageGrowthRate: 0.45, // 45% annual growth typical
    breakEvenMonths: [3, 5], // 3-5 month range
  },
  tokenModels: {
    failureRate: 0.53, // 53% failure rate since 2021
    minActiveParticipants: 200, // Minimum for success
    networkEffectThreshold: 0.30, // 30% participation needed for viability
    regulatoryRisk: 'high',
  },
};
