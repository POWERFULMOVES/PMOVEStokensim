import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { MathModelService } from '@/lib/services/math-model.service';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';
import { ValidationBadge } from './validation-badge';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface MathValidationProps {
  simulationParams: Record<string, number>;
  finalWeek: Record<string, number>;
}

export function MathValidation({ simulationParams, finalWeek }: MathValidationProps) {
  // Calculate validation metrics
  const expectedWealthDiff = MathModelService.calculateExpectedWealthDifference(simulationParams);
  const errorThreshold = MathModelService.determineErrorThreshold(simulationParams);
  const actualWealthDiff = finalWeek.TotalWealth_B - finalWeek.TotalWealth_A;
  const errorPercentage = Math.abs(actualWealthDiff - expectedWealthDiff) / expectedWealthDiff;
  const passed = errorPercentage <= errorThreshold;
  
  const validationScore = MathModelService.calculateValidationScore(
    actualWealthDiff,
    expectedWealthDiff,
    simulationParams
  );
  
  const isDownturn = MathModelService.isEconomicDownturnScenario(simulationParams);
  const isSevereDownturn = MathModelService.isSevereEconomicDownturnScenario(simulationParams);
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Mathematical Validation</CardTitle>
            <CardDescription>Comparison with mathematical model</CardDescription>
          </div>
          <ValidationBadge score={validationScore} isDownturn={isDownturn} />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Expected wealth difference:</span>
              <span>{formatCurrency(expectedWealthDiff)}</span>
            </div>
            <div className="flex justify-between">
              <span>Actual wealth difference:</span>
              <span>{formatCurrency(actualWealthDiff)}</span>
            </div>
            <div className="flex justify-between">
              <span>Error percentage:</span>
              <span className={passed ? "text-green-500" : "text-amber-500"}>
                {formatPercentage(errorPercentage)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Error threshold:</span>
              <span>{formatPercentage(errorThreshold)}</span>
            </div>
            <div className="flex justify-between">
              <span>Validation score:</span>
              <span className={validationScore >= 80 ? "text-green-500" : "text-amber-500"}>
                {validationScore}/100
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isDownturn && (
        <Alert className="mt-4">
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>Economic Downturn Scenario</AlertTitle>
          <AlertDescription>
            {isSevereDownturn 
              ? "This severe economic downturn scenario shows significantly higher benefits than our mathematical model predicts. During severe economic stress, mutual aid and resource sharing become essential survival mechanisms, creating non-linear benefits that are difficult to capture in simple mathematical models."
              : "The benefits of cooperative economics are typically greater during economic downturns than our mathematical model predicts. This is due to the increased importance of mutual aid and resource sharing during challenging economic times."}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
