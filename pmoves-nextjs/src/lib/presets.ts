/**
 * Preset scenarios for the economic simulator
 * These presets allow users to quickly test different economic conditions
 */

import { SimulationParams } from './simulation/types';
import { DEFAULT_PARAMS } from './simulation';

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  params: Partial<SimulationParams>;
  tags: string[];
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  // Original presets
  {
    id: 'baseline',
    name: 'Baseline Comparison',
    description: 'Standard parameters for a fair comparison between traditional and cooperative models',
    params: {},
    tags: ['general', 'baseline']
  },
  {
    id: 'high-inequality',
    name: 'High Initial Inequality',
    description: 'Starts with high wealth inequality to test how each model addresses existing disparities',
    params: {
      INITIAL_WEALTH_SIGMA_LOG: 1.2,
      WEEKLY_INCOME_STDDEV: 100
    },
    tags: ['inequality', 'challenging']
  },
  {
    id: 'economic-downturn',
    name: 'Economic Downturn',
    description: 'Simulates conditions during an economic recession with lower incomes',
    params: {
      WEEKLY_INCOME_AVG: 120,
      WEEKLY_FOOD_BUDGET_AVG: 80
    },
    tags: ['recession', 'challenging']
  },
  {
    id: 'small-community',
    name: 'Small Rural Community',
    description: 'Parameters typical for a small rural community with moderate incomes',
    params: {
      NUM_MEMBERS: 50,
      WEEKLY_INCOME_AVG: 150,
      WEEKLY_INCOME_STDDEV: 50,
      PERCENT_SPEND_INTERNAL_AVG: 0.4
    },
    tags: ['rural', 'small-scale']
  },
  {
    id: 'urban-neighborhood',
    name: 'Urban Neighborhood',
    description: 'Parameters typical for an urban neighborhood with higher incomes but also higher costs',
    params: {
      NUM_MEMBERS: 200,
      WEEKLY_INCOME_AVG: 250,
      WEEKLY_FOOD_BUDGET_AVG: 120,
      PERCENT_SPEND_INTERNAL_AVG: 0.3
    },
    tags: ['urban', 'large-scale']
  },
  {
    id: 'strong-cooperation',
    name: 'Strong Cooperation',
    description: 'High levels of community participation and internal spending',
    params: {
      PERCENT_SPEND_INTERNAL_AVG: 0.7,
      GROUP_BUY_SAVINGS_PERCENT: 0.25,
      LOCAL_PRODUCTION_SAVINGS_PERCENT: 0.3
    },
    tags: ['optimistic', 'high-engagement']
  },
  {
    id: 'weak-cooperation',
    name: 'Minimal Cooperation',
    description: 'Low levels of community participation to test if the model still provides benefits',
    params: {
      PERCENT_SPEND_INTERNAL_AVG: 0.2,
      GROUP_BUY_SAVINGS_PERCENT: 0.1,
      LOCAL_PRODUCTION_SAVINGS_PERCENT: 0.1
    },
    tags: ['pessimistic', 'low-engagement']
  },
  {
    id: 'token-focused',
    name: 'Strong Community Currency',
    description: 'Higher value and distribution of community currency (GroTokens)',
    params: {
      GROTOKEN_REWARD_PER_WEEK_AVG: 15,
      GROTOKEN_USD_VALUE: 3.0
    },
    tags: ['currency', 'innovative']
  },
  {
    id: 'long-term',
    name: 'Long-Term Projection',
    description: 'Extended simulation to see long-term trends and outcomes',
    params: {
      SIMULATION_WEEKS: 260 // 5 years
    },
    tags: ['long-term', 'strategic']
  },

  // Additional test scenarios for edge cases
  {
    id: 'extreme-inequality',
    name: 'Extreme Wealth Inequality',
    description: 'Tests the model under conditions of extreme wealth inequality',
    params: {
      INITIAL_WEALTH_SIGMA_LOG: 1.5,
      WEEKLY_INCOME_STDDEV: 150,
      NUM_MEMBERS: 100
    },
    tags: ['inequality', 'edge-case', 'test']
  },
  {
    id: 'severe-downturn',
    name: 'Severe Economic Downturn',
    description: 'Simulates a severe economic recession with very low incomes',
    params: {
      WEEKLY_INCOME_AVG: 100,
      WEEKLY_FOOD_BUDGET_AVG: 80,
      WEEKLY_INCOME_STDDEV: 30
    },
    tags: ['recession', 'edge-case', 'test']
  },
  {
    id: 'tiny-community',
    name: 'Tiny Rural Community',
    description: 'Tests the model with a very small community',
    params: {
      NUM_MEMBERS: 20,
      WEEKLY_INCOME_AVG: 150,
      PERCENT_SPEND_INTERNAL_AVG: 0.5
    },
    tags: ['rural', 'small-scale', 'edge-case', 'test']
  },
  {
    id: 'large-community',
    name: 'Large Urban Community',
    description: 'Tests the model with a large urban community',
    params: {
      NUM_MEMBERS: 500,
      WEEKLY_INCOME_AVG: 250,
      WEEKLY_FOOD_BUDGET_AVG: 120,
      PERCENT_SPEND_INTERNAL_AVG: 0.3
    },
    tags: ['urban', 'large-scale', 'edge-case', 'test']
  },
  {
    id: 'mixed-scenario',
    name: 'Mixed Economic Conditions',
    description: 'Combines high inequality with strong cooperation',
    params: {
      INITIAL_WEALTH_SIGMA_LOG: 1.2,
      PERCENT_SPEND_INTERNAL_AVG: 0.7,
      GROUP_BUY_SAVINGS_PERCENT: 0.25,
      LOCAL_PRODUCTION_SAVINGS_PERCENT: 0.3
    },
    tags: ['mixed', 'complex', 'test']
  }
];

/**
 * Apply a preset to the default parameters
 * @param presetId The ID of the preset to apply
 * @returns The combined parameters
 */
export function applyPreset(presetId: string): SimulationParams {
  const preset = PRESET_SCENARIOS.find(p => p.id === presetId);

  if (!preset) {
    console.error(`Preset with ID ${presetId} not found`);
    return DEFAULT_PARAMS;
  }

  // Format the preset parameters for better debugging
  console.log(`Applying preset ${preset.name} with params:`);
  Object.entries(preset.params).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  const combinedParams = {
    ...DEFAULT_PARAMS,
    ...preset.params
  };

  // Log the key parameters that differ from defaults
  console.log('Key parameters for this preset:');
  const keyParams = [
    'NUM_MEMBERS', 'SIMULATION_WEEKS', 'WEEKLY_INCOME_AVG', 'WEEKLY_FOOD_BUDGET_AVG',
    'PERCENT_SPEND_INTERNAL_AVG', 'GROUP_BUY_SAVINGS_PERCENT', 'LOCAL_PRODUCTION_SAVINGS_PERCENT',
    'GROTOKEN_REWARD_PER_WEEK_AVG', 'GROTOKEN_USD_VALUE', 'INITIAL_WEALTH_SIGMA_LOG'
  ];

  keyParams.forEach(key => {
    if (key in preset.params || key === 'NUM_MEMBERS' || key === 'SIMULATION_WEEKS') {
      console.log(`  ${key}: ${combinedParams[key as keyof SimulationParams]}`);
    }
  });

  return combinedParams;
}

/**
 * Get presets by tag
 * @param tag The tag to filter by
 * @returns Array of presets with the specified tag
 */
export function getPresetsByTag(tag: string): PresetScenario[] {
  return PRESET_SCENARIOS.filter(preset => preset.tags.includes(tag));
}
