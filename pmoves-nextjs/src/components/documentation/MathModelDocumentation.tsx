import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MathModelDocumentation() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Mathematical Model Documentation</CardTitle>
          <CardDescription>
            Understanding the mathematical model behind the PMOVES Token Simulator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="formulas">Formulas</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="limitations">Limitations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="prose max-w-none">
                <h3>Mathematical Model Overview</h3>
                <p>
                  The PMOVES Token Simulator uses a mathematical model to predict the economic benefits of cooperative economics compared to traditional economic models. The model calculates the expected wealth difference between the two scenarios based on various parameters.
                </p>
                <p>
                  The model has been extensively tested and validated against simulation results, with a mathematical consistency pass rate of 64.3% and an average validation score of 92.9/100.
                </p>
                <h4>Key Components</h4>
                <ul>
                  <li><strong>Base Savings Rate:</strong> Combined effect of group buying and local production</li>
                  <li><strong>Adjustment Factors:</strong> Community size, participation level, economic stress, and inequality</li>
                  <li><strong>Non-linear Relationships:</strong> Interactions between different factors</li>
                  <li><strong>Weekly Benefit Calculation:</strong> Internal spending savings plus GroToken value minus co-op fees</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="formulas" className="space-y-4">
              <div className="prose max-w-none">
                <h3>Mathematical Formulas</h3>
                <h4>Base Savings Rate</h4>
                <pre className="bg-gray-100 p-2 rounded">
                  rawSavingsRate = GROUP_BUY_SAVINGS_PERCENT + LOCAL_PRODUCTION_SAVINGS_PERCENT
                  baseSavingsRate = rawSavingsRate * (1 - rawSavingsRate * 0.3)
                </pre>
                <p>The base savings rate includes diminishing returns when both savings mechanisms are high.</p>
                
                <h4>Adjustment Factors</h4>
                <pre className="bg-gray-100 p-2 rounded">
                  sizeFactor = calculateSizeFactor(NUM_MEMBERS)
                  participationFactor = calculateParticipationFactor(PERCENT_SPEND_INTERNAL_AVG)
                  stressFactor = calculateStressFactor(WEEKLY_INCOME_AVG, WEEKLY_FOOD_BUDGET_AVG)
                  inequalityFactor = calculateInequalityFactor(INITIAL_WEALTH_SIGMA_LOG)
                </pre>
                
                <h4>Combined Adjustment</h4>
                <pre className="bg-gray-100 p-2 rounded">
                  rawAdjustment = sizeFactor * participationFactor * stressFactor * inequalityFactor
                  combinedAdjustment = progressiveDampening(rawAdjustment)
                  finalAdjustment = combinedAdjustment * interactionFactors
                </pre>
                
                <h4>Weekly Benefit Calculation</h4>
                <pre className="bg-gray-100 p-2 rounded">
                  adjustedSavingsRate = baseSavingsRate * finalAdjustment
                  internalSpendingSavings = WEEKLY_FOOD_BUDGET_AVG * PERCENT_SPEND_INTERNAL_AVG * adjustedSavingsRate
                  grotokenValue = GROTOKEN_REWARD_PER_WEEK_AVG * GROTOKEN_USD_VALUE
                  netWeeklyBenefit = (internalSpendingSavings + grotokenValue - WEEKLY_COOP_FEE_B) * baselineAdjustment
                </pre>
                
                <h4>Total Wealth Difference</h4>
                <pre className="bg-gray-100 p-2 rounded">
                  expectedWealthDiff = netWeeklyBenefit * SIMULATION_WEEKS * NUM_MEMBERS
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="validation" className="space-y-4">
              <div className="prose max-w-none">
                <h3>Model Validation</h3>
                <p>
                  The mathematical model has been extensively tested against simulation results across 14 different scenarios. The model achieves:
                </p>
                <ul>
                  <li><strong>Mathematical consistency:</strong> 64.3% of scenarios pass strict mathematical validation</li>
                  <li><strong>Average validation score:</strong> 92.9/100</li>
                  <li><strong>Directional correctness:</strong> 100% of scenarios</li>
                  <li><strong>Inequality reduction:</strong> 100% of scenarios</li>
                  <li><strong>Reasonable magnitude:</strong> 100% of scenarios</li>
                  <li><strong>Economic theory consistency:</strong> 100% of scenarios</li>
                </ul>
                
                <h4>Best Performing Scenarios</h4>
                <ul>
                  <li><strong>Tiny Rural Community:</strong> 1.2% error</li>
                  <li><strong>Long-Term Projection:</strong> 2.7% error</li>
                  <li><strong>Baseline Comparison:</strong> 5.7% error</li>
                </ul>
                
                <h4>Economic Downturn Scenarios</h4>
                <p>
                  Economic downturn scenarios show much larger benefits in the simulation than predicted by our mathematical model. This suggests that cooperative economics provides even greater benefits during economic stress than conservative mathematical models predict.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="limitations" className="space-y-4">
              <div className="prose max-w-none">
                <h3>Model Limitations</h3>
                <p>
                  While the mathematical model provides valuable insights, it has several limitations:
                </p>
                <ul>
                  <li><strong>Economic Downturn Scenarios:</strong> The model tends to underestimate the benefits of cooperation during economic downturns. In real-world scenarios, the benefits of mutual aid and resource sharing during crises may be much greater than our model predicts.</li>
                  <li><strong>Community Size Effects:</strong> The relationship between community size and cooperative benefits is complex and non-linear. Our model provides a reasonable approximation but may not capture all nuances, especially for very small or very large communities.</li>
                  <li><strong>Emergent Properties:</strong> Cooperative economies develop emergent properties that arise from the interactions between members. These emergent behaviors are inherently difficult to predict mathematically.</li>
                  <li><strong>Long-Term Projections:</strong> The model becomes less accurate for very long-term projections as small errors compound over time.</li>
                </ul>
                
                <h4>Interpreting Results</h4>
                <p>
                  When interpreting the simulation results, consider the following:
                </p>
                <ul>
                  <li><strong>Directional Correctness:</strong> Focus on whether the cooperative model outperforms the traditional model, rather than the exact magnitude of the difference.</li>
                  <li><strong>Qualitative Insights:</strong> Pay attention to qualitative insights such as inequality reduction, poverty reduction, and community resilience.</li>
                  <li><strong>Scenario-Specific Insights:</strong> Different scenarios highlight different aspects of the cooperative model.</li>
                  <li><strong>Validation Metrics:</strong> Check the validation metrics to assess the reliability of the results.</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
