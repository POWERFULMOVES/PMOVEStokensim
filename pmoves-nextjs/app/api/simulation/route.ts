import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { runSimulation } from '@/lib/simulation';

export async function POST(request: NextRequest) {
  try {
    const params = await request.json();

    // Log the parameters in a readable format
    console.log('API received simulation parameters:');
    const keyParams = [
      'NUM_MEMBERS', 'SIMULATION_WEEKS', 'WEEKLY_INCOME_AVG', 'WEEKLY_FOOD_BUDGET_AVG',
      'PERCENT_SPEND_INTERNAL_AVG', 'GROUP_BUY_SAVINGS_PERCENT', 'LOCAL_PRODUCTION_SAVINGS_PERCENT',
      'GROTOKEN_REWARD_PER_WEEK_AVG', 'GROTOKEN_USD_VALUE', 'INITIAL_WEALTH_SIGMA_LOG', 'WEEKLY_COOP_FEE_B'
    ];

    for (const key of keyParams) {
      if (key in params) {
        console.log(`  ${key}: ${params[key]}`);
      }
    }
    const simulationResults = await runSimulation(params);
    return NextResponse.json(simulationResults);
  } catch (error) {
    console.error('Error during simulation:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during simulation.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method with simulation parameters' },
    { status: 200 }
  );
}
