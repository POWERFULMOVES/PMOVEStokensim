import { runSimulation } from './index';
import { DEFAULT_PARAMS } from './utils';
import { SimulationParams } from './types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

/**
 * Parameter sensitivity analysis
 * Tests how changes in individual parameters affect the simulation results
 */
export async function runSensitivityAnalysis() {
  console.log('=== Running Sensitivity Analysis ===');
  
  // Parameters to test and their variation ranges
  const parametersToTest: Array<{
    name: keyof SimulationParams;
    baseValue: number;
    variations: number[];
    description: string;
  }> = [
    {
      name: 'PERCENT_SPEND_INTERNAL_AVG',
      baseValue: DEFAULT_PARAMS.PERCENT_SPEND_INTERNAL_AVG,
      variations: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
      description: 'Average percentage of spending done within the cooperative'
    },
    {
      name: 'GROUP_BUY_SAVINGS_PERCENT',
      baseValue: DEFAULT_PARAMS.GROUP_BUY_SAVINGS_PERCENT,
      variations: [0.05, 0.1, 0.15, 0.2, 0.25, 0.3],
      description: 'Savings from group purchasing'
    },
    {
      name: 'LOCAL_PRODUCTION_SAVINGS_PERCENT',
      baseValue: DEFAULT_PARAMS.LOCAL_PRODUCTION_SAVINGS_PERCENT,
      variations: [0.05, 0.1, 0.15, 0.2, 0.25, 0.3],
      description: 'Savings from local production'
    },
    {
      name: 'GROTOKEN_REWARD_PER_WEEK_AVG',
      baseValue: DEFAULT_PARAMS.GROTOKEN_REWARD_PER_WEEK_AVG,
      variations: [5, 10, 15, 20, 25],
      description: 'Average weekly GroToken rewards'
    },
    {
      name: 'GROTOKEN_USD_VALUE',
      baseValue: DEFAULT_PARAMS.GROTOKEN_USD_VALUE,
      variations: [1, 1.5, 2, 2.5, 3],
      description: 'USD value of GroTokens'
    },
    {
      name: 'NUM_MEMBERS',
      baseValue: DEFAULT_PARAMS.NUM_MEMBERS,
      variations: [20, 50, 100, 200, 500],
      description: 'Number of community members'
    },
    {
      name: 'INITIAL_WEALTH_SIGMA_LOG',
      baseValue: DEFAULT_PARAMS.INITIAL_WEALTH_SIGMA_LOG,
      variations: [0.3, 0.6, 0.9, 1.2, 1.5],
      description: 'Wealth inequality (standard deviation of log-normal distribution)'
    }
  ];
  
  const results: Record<string, any[]> = {};
  
  // Run baseline simulation
  console.log('\nRunning baseline simulation...');
  const baselineParams = { ...DEFAULT_PARAMS };
  const baselineResults = await runSimulation(baselineParams);
  const baselineWeek = baselineResults.history[baselineResults.history.length - 1];
  const baselineWealthDiff = baselineWeek.TotalWealth_B - baselineWeek.TotalWealth_A;
  
  console.log(`Baseline wealth difference: ${formatCurrency(baselineWealthDiff)}`);
  
  // Test each parameter
  for (const param of parametersToTest) {
    console.log(`\n--- Testing parameter: ${param.name} (${param.description}) ---`);
    results[param.name] = [];
    
    for (const value of param.variations) {
      const testParams = { ...DEFAULT_PARAMS };
      testParams[param.name] = value;
      
      console.log(`Testing ${param.name} = ${value}`);
      
      try {
        const simResults = await runSimulation(testParams);
        const finalWeek = simResults.history[simResults.history.length - 1];
        const wealthDiff = finalWeek.TotalWealth_B - finalWeek.TotalWealth_A;
        const percentChange = (wealthDiff - baselineWealthDiff) / Math.abs(baselineWealthDiff);
        
        console.log(`  Wealth difference: ${formatCurrency(wealthDiff)} (${formatPercentage(percentChange)} from baseline)`);
        
        results[param.name].push({
          paramValue: value,
          wealthDiff,
          percentChange,
          totalWealthA: finalWeek.TotalWealth_A,
          totalWealthB: finalWeek.TotalWealth_B,
          avgWealthA: finalWeek.AvgWealth_A,
          avgWealthB: finalWeek.AvgWealth_B,
          giniA: finalWeek.Gini_A,
          giniB: finalWeek.Gini_B
        });
      } catch (error) {
        console.error(`Error testing ${param.name} = ${value}:`, error);
      }
    }
  }
  
  // Analyze results
  console.log('\n=== Sensitivity Analysis Results ===');
  
  for (const [paramName, paramResults] of Object.entries(results)) {
    if (paramResults.length === 0) continue;
    
    console.log(`\n--- ${paramName} ---`);
    
    // Calculate sensitivity coefficient (average % change in output per % change in input)
    const baseValue = parametersToTest.find(p => p.name === paramName)?.baseValue || 0;
    
    if (baseValue) {
      const sensitivities = paramResults.map(result => {
        const paramChange = (result.paramValue - baseValue) / baseValue;
        if (Math.abs(paramChange) < 0.001) return 0; // Avoid division by zero
        return result.percentChange / paramChange;
      });
      
      const avgSensitivity = sensitivities.reduce((sum, val) => sum + val, 0) / sensitivities.length;
      
      console.log(`Average sensitivity coefficient: ${avgSensitivity.toFixed(2)}`);
      console.log(`Interpretation: A 1% change in ${paramName} results in approximately a ${(avgSensitivity * 100).toFixed(2)}% change in wealth difference`);
      
      // Rank parameters by sensitivity
      results[paramName].push({ avgSensitivity });
    }
  }
  
  // Rank parameters by sensitivity
  const paramRankings = Object.entries(results)
    .map(([name, results]) => {
      const sensitivityResult = results.find(r => 'avgSensitivity' in r);
      return {
        name,
        sensitivity: sensitivityResult ? Math.abs(sensitivityResult.avgSensitivity as number) : 0
      };
    })
    .sort((a, b) => b.sensitivity - a.sensitivity);
  
  console.log('\n=== Parameter Sensitivity Rankings ===');
  paramRankings.forEach((param, index) => {
    console.log(`${index + 1}. ${param.name}: ${param.sensitivity.toFixed(2)}`);
  });
  
  return {
    baseline: {
      params: baselineParams,
      wealthDiff: baselineWealthDiff
    },
    parameterResults: results,
    rankings: paramRankings
  };
}
