import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/formatters';

interface ScenarioResultsProps {
  results: {
    scenario_results: {
      scenario_name: string;
      outcome: string;
      metrics: {
        final_wealth: number | string;
        gini: number | string;
        poverty_rate: number | string;
      };
    };
    comparative_analysis?: string;
    recommendations?: string[];
  };
}

export function ScenarioResults({ results }: ScenarioResultsProps) {
  if (!results) return null;

  const { scenario_results, comparative_analysis, recommendations } = results;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scenario Results: {scenario_results.scenario_name}</CardTitle>
          <CardDescription>Analysis of the scenario outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Final Wealth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof scenario_results.metrics.final_wealth === 'number'
                      ? formatCurrency(scenario_results.metrics.final_wealth)
                      : scenario_results.metrics.final_wealth}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Gini Coefficient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof scenario_results.metrics.gini === 'number'
                      ? formatNumber(scenario_results.metrics.gini, 3, 3)
                      : scenario_results.metrics.gini}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Poverty Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof scenario_results.metrics.poverty_rate === 'number'
                      ? formatPercentage(scenario_results.metrics.poverty_rate)
                      : scenario_results.metrics.poverty_rate}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Outcome</h3>
                <p className="text-muted-foreground">{scenario_results.outcome}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Comparative Analysis</h3>
                <p className="text-muted-foreground">{comparative_analysis}</p>
              </div>

              {recommendations && recommendations.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-1">Recommendations</h4>
                  <ul className="list-disc list-inside text-sm text-blue-700">
                    {recommendations.map((recommendation: string, index: number) => (
                      <li key={`recommendation-${index}`}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
