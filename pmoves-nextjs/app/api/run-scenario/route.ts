import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DEFAULT_PARAMS, runSimulation } from '@/lib/simulation';

export async function POST(request: NextRequest) {
  try {
    const scenarioData = await request.json();
    console.log(`Running scenario: ${scenarioData.name || 'Custom'}`);

    // Rerun default for demo, similar to Flask backend
    const results = await runSimulation(DEFAULT_PARAMS);

    const scenarioResults = {
      scenario_name: scenarioData.name || 'Custom Scenario',
      outcome: results.summary?.conclusion || 'Simulation completed.',
      metrics: {
        final_wealth: results.history?.[results.history.length - 1]?.AvgWealth_B || 'N/A',
        gini: results.history?.[results.history.length - 1]?.Gini_B || 'N/A',
        poverty_rate: results.history?.[results.history.length - 1]?.PovertyRate_B || 'N/A'
      }
    };

    return NextResponse.json({
      scenario_results: scenarioResults,
      comparative_analysis: 'Scenario performed similarly to baseline in this mock run.',
      recommendations: ['Adjust savings parameters for different outcomes.']
    });
  } catch (error) {
    console.error('Error running scenario:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while running the scenario.' },
      { status: 500 }
    );
  }
}
