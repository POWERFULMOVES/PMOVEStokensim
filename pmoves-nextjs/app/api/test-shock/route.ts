import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_PARAMS, runSimulation } from '@/lib/simulation';
import { SimulationParams } from '@/lib/simulation/types';

export async function POST(request: NextRequest) {
  try {
    const shockParams = await request.json();
    console.log(`Testing shock: ${JSON.stringify(shockParams)}`);

    // Get shock parameters with defaults
    const shockType = shockParams.type || 'income_reduction';
    const magnitude = shockParams.magnitude || 0.2;
    const duration = shockParams.duration || 4;

    // Create a copy of default parameters for the baseline simulation
    const baselineParams: SimulationParams = { ...DEFAULT_PARAMS };

    // Run baseline simulation (shorter duration for performance)
    baselineParams.SIMULATION_WEEKS = 52; // 1 year baseline
    const baselineResults = await runSimulation(baselineParams);

    // Create shock parameters by modifying the baseline parameters
    const shockSimParams: SimulationParams = { ...DEFAULT_PARAMS };

    // Run simulation with longer duration to see recovery
    shockSimParams.SIMULATION_WEEKS = 52 + duration + 26; // Pre-shock + shock duration + recovery period

    // Apply shock parameters based on shock type
    if (shockType === 'income_reduction') {
      // Reduce income during shock period
      shockSimParams.WEEKLY_INCOME_AVG = DEFAULT_PARAMS.WEEKLY_INCOME_AVG * (1 - magnitude);
    } else if (shockType === 'cost_increase') {
      // Increase food budget (costs) during shock period
      shockSimParams.WEEKLY_FOOD_BUDGET_AVG = DEFAULT_PARAMS.WEEKLY_FOOD_BUDGET_AVG * (1 + magnitude);
    } else if (shockType === 'market_disruption') {
      // Combined effect - reduce income and increase costs
      shockSimParams.WEEKLY_INCOME_AVG = DEFAULT_PARAMS.WEEKLY_INCOME_AVG * (1 - magnitude * 0.7);
      shockSimParams.WEEKLY_FOOD_BUDGET_AVG = DEFAULT_PARAMS.WEEKLY_FOOD_BUDGET_AVG * (1 + magnitude * 0.5);
    }

    // Run the shock simulation
    const shockResults = await runSimulation(shockSimParams);

    // Calculate impact metrics by comparing baseline to shock simulation
    const baselineWealth = baselineResults.history[baselineResults.history.length - 1].AvgWealth_B;
    const shockWealth = shockResults.history[52].AvgWealth_B; // Wealth at shock peak
    const wealthReduction = (baselineWealth - shockWealth) / baselineWealth;

    const baselinePoverty = baselineResults.history[baselineResults.history.length - 1].PovertyRate_B;
    const shockPoverty = shockResults.history[52].PovertyRate_B; // Poverty at shock peak
    const povertyIncrease = Math.max(0, shockPoverty - baselinePoverty);

    // Calculate recovery time by analyzing post-shock period
    let recoveryTime = duration; // Minimum recovery time is the shock duration
    const recoveryThreshold = baselineWealth * 0.95; // 95% of baseline wealth

    for (let i = 52 + duration; i < shockResults.history.length; i++) {
      if (shockResults.history[i].AvgWealth_B >= recoveryThreshold) {
        recoveryTime = i - 52; // Weeks since start of shock
        break;
      }
    }

    // Calculate recovery rate
    const recoveryRate = recoveryTime > duration ?
      (shockResults.history[52 + recoveryTime].AvgWealth_B - shockWealth) /
      (recoveryTime - duration) / baselineWealth : 0;

    // Calculate resilience score (0-1 scale)
    // Higher is better - factors in both impact severity and recovery speed
    const impactFactor = 1 - Math.min(1, wealthReduction * 2); // 0-1 scale, lower impact is better
    const recoveryFactor = 1 - Math.min(1, (recoveryTime - duration) / 52); // 0-1 scale, faster recovery is better
    const resilienceScore = (impactFactor * 0.6) + (recoveryFactor * 0.4); // Weighted average

    // Generate recommendations based on simulation results
    const recommendations = [];

    if (wealthReduction > 0.2) {
      recommendations.push('Build emergency reserves');
    }

    if (recoveryTime > duration * 2) {
      recommendations.push('Diversify income sources');
    }

    if (shockResults.history[52].Gini_B > baselineResults.history[baselineResults.history.length - 1].Gini_B * 1.1) {
      recommendations.push('Strengthen mutual aid mechanisms');
    }

    if (shockType === 'cost_increase' && magnitude > 0.15) {
      recommendations.push('Increase local production capacity');
    }

    // If no specific recommendations, add general ones
    if (recommendations.length === 0) {
      recommendations.push('Continue building community resilience');
      recommendations.push('Maintain emergency preparedness');
    }

    // Format the results
    const results = {
      shock_type: shockType,
      magnitude: magnitude,
      duration: duration,
      impact: {
        wealth_reduction: wealthReduction,
        poverty_increase: povertyIncrease,
        recovery_time: recoveryTime
      }
    };

    return NextResponse.json({
      shock_results: results,
      recovery_metrics: {
        recovery_rate: recoveryRate,
        resilience_score: resilienceScore
      },
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error testing shock:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while testing the shock.' },
      { status: 500 }
    );
  }
}
