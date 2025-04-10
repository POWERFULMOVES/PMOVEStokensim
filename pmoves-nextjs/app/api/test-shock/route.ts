import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const shockParams = await request.json();
    console.log(`Testing shock: ${JSON.stringify(shockParams)}`);
    
    // Placeholder implementation similar to Flask backend
    const results = {
      shock_type: shockParams.type || 'income_reduction',
      magnitude: shockParams.magnitude || 0.2,
      duration: shockParams.duration || 4,
      impact: {
        wealth_reduction: 0.15 + Math.random() * 0.1,
        poverty_increase: 0.08 + Math.random() * 0.05,
        recovery_time: Math.floor(Math.random() * 12) + 8
      }
    };
    
    return NextResponse.json({
      shock_results: results,
      recovery_metrics: {
        recovery_rate: 0.05 + Math.random() * 0.03,
        resilience_score: 0.72 + Math.random() * 0.1 - 0.05
      },
      recommendations: ['Build emergency reserves', 'Diversify income sources']
    });
  } catch (error) {
    console.error('Error testing shock:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while testing the shock.' },
      { status: 500 }
    );
  }
}
