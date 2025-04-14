import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DEFAULT_PARAMS, runSimulation } from '@/lib/simulation';
import { SimulationParams } from '@/lib/simulation/types';

export async function POST(request: NextRequest) {
  try {
    const scenarioData = await request.json();
    console.log(`Running scenario: ${scenarioData.name || 'Custom'}`);

    // Create simulation parameters based on the scenario
    let simulationParams: SimulationParams;

    if (scenarioData.params) {
      // Use the provided scenario parameters
      simulationParams = { ...DEFAULT_PARAMS, ...scenarioData.params };
      console.log('Using provided scenario parameters:', simulationParams);
    } else {
      // If no parameters provided, use defaults with scenario-specific adjustments
      simulationParams = { ...DEFAULT_PARAMS };

      // Apply scenario-specific adjustments based on scenario name
      if (scenarioData.name) {
        const scenarioName = scenarioData.name.toLowerCase();

        if (scenarioName.includes('economic downturn') || scenarioName.includes('recession')) {
          // Economic downturn scenario
          simulationParams.WEEKLY_INCOME_AVG = DEFAULT_PARAMS.WEEKLY_INCOME_AVG * 0.8;
          simulationParams.WEEKLY_INCOME_STDDEV = DEFAULT_PARAMS.WEEKLY_INCOME_STDDEV * 1.2;
          console.log('Applied economic downturn adjustments');
        } else if (scenarioName.includes('high inequality') || scenarioName.includes('wealth gap')) {
          // High inequality scenario
          simulationParams.INITIAL_WEALTH_SIGMA_LOG = 1.2;
          simulationParams.WEEKLY_INCOME_STDDEV = DEFAULT_PARAMS.WEEKLY_INCOME_STDDEV * 1.5;
          console.log('Applied high inequality adjustments');
        } else if (scenarioName.includes('strong cooperation') || scenarioName.includes('high engagement')) {
          // Strong cooperation scenario
          simulationParams.PERCENT_SPEND_INTERNAL_AVG = 0.7;
          simulationParams.GROUP_BUY_SAVINGS_PERCENT = 0.25;
          simulationParams.LOCAL_PRODUCTION_SAVINGS_PERCENT = 0.3;
          console.log('Applied strong cooperation adjustments');
        } else if (scenarioName.includes('weak cooperation') || scenarioName.includes('low engagement')) {
          // Weak cooperation scenario
          simulationParams.PERCENT_SPEND_INTERNAL_AVG = 0.2;
          simulationParams.GROUP_BUY_SAVINGS_PERCENT = 0.1;
          simulationParams.LOCAL_PRODUCTION_SAVINGS_PERCENT = 0.1;
          console.log('Applied weak cooperation adjustments');
        }
      }
    }

    // Run the simulation with the scenario parameters
    const results = await runSimulation(simulationParams);

    // Extract key metrics from the simulation results
    const finalWeek = results.history[results.history.length - 1];
    const initialWeek = results.history[0];

    // Calculate growth rates
    const wealthGrowthRate = initialWeek.AvgWealth_B > 0 ?
      (finalWeek.AvgWealth_B - initialWeek.AvgWealth_B) / initialWeek.AvgWealth_B :
      0;

    const inequalityChange = finalWeek.Gini_B - initialWeek.Gini_B;

    const scenarioResults = {
      scenario_name: scenarioData.name || 'Custom Scenario',
      outcome: results.summary?.conclusion || 'Simulation completed.',
      metrics: {
        final_wealth: finalWeek.AvgWealth_B,
        gini: finalWeek.Gini_B,
        poverty_rate: finalWeek.PovertyRate_B,
        wealth_growth: wealthGrowthRate,
        inequality_change: inequalityChange,
        resilience: finalWeek.CommunityResilience
      }
    };

    // Generate comparative analysis based on actual results
    let comparativeAnalysis = '';

    if (wealthGrowthRate > 0.1) {
      comparativeAnalysis = 'This scenario shows strong wealth growth compared to typical outcomes.';
    } else if (wealthGrowthRate < 0) {
      comparativeAnalysis = 'This scenario results in wealth decline, which is concerning.';
    } else {
      comparativeAnalysis = 'This scenario shows moderate wealth growth.';
    }

    if (inequalityChange < -0.05) {
      comparativeAnalysis += ' Inequality decreased significantly, indicating a more equitable distribution.';
    } else if (inequalityChange > 0.05) {
      comparativeAnalysis += ' Inequality increased significantly, which may require attention.';
    }

    // Generate recommendations based on actual results
    const recommendations = [];

    if (finalWeek.PovertyRate_B > 0.1) {
      recommendations.push('Consider mechanisms to reduce poverty rate');
    }

    if (inequalityChange > 0) {
      recommendations.push('Implement wealth redistribution mechanisms');
    }

    if (finalWeek.CommunityResilience < 0.7) {
      recommendations.push('Strengthen community resilience through increased cooperation');
    }

    // Check if internal spending parameter is low
    const internalSpendingParam = simulationParams.PERCENT_SPEND_INTERNAL_AVG;
    const avgInternalSpending = Array.isArray(internalSpendingParam)
      ? internalSpendingParam.reduce((a, b) => a + b, 0) / internalSpendingParam.length
      : internalSpendingParam;

    if (avgInternalSpending < 0.5) {
      recommendations.push('Increase internal spending to improve community outcomes');
    }

    // If no specific recommendations, add a general one
    if (recommendations.length === 0) {
      recommendations.push('Adjust savings parameters for different outcomes');
    }

    return NextResponse.json({
      scenario_results: scenarioResults,
      comparative_analysis: comparativeAnalysis,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error running scenario:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while running the scenario.' },
      { status: 500 }
    );
  }
}
