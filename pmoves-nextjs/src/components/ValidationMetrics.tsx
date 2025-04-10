import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricTooltip } from '@/components/ui/metric-tooltip';
import { metricTooltips } from '@/lib/tooltips';
import { formatPercentage } from '@/lib/utils/formatters';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ValidationMetricsProps {
  validation?: {
    isDirectionallyCorrect?: boolean;
    isInequalityReduced?: boolean;
    hasReasonableMagnitude?: boolean;
    downturnBenefitConsistency?: boolean;
    validationScore?: number;
    errorPercentage?: number;
    acceptableErrorThreshold?: number;
    isWithinErrorRange?: boolean;
  };
}

export function ValidationMetrics({ validation }: ValidationMetricsProps) {
  if (!validation) return null;

  const {
    isDirectionallyCorrect,
    isInequalityReduced,
    hasReasonableMagnitude,
    downturnBenefitConsistency,
    validationScore,
    errorPercentage,
    acceptableErrorThreshold,
    isWithinErrorRange
  } = validation;

  // Determine validation score category
  let scoreCategory = 'POOR';
  let scoreColor = 'text-red-600';
  
  if (validationScore && validationScore >= 70) {
    scoreCategory = 'GOOD';
    scoreColor = 'text-green-600';
  } else if (validationScore && validationScore >= 50) {
    scoreCategory = 'ACCEPTABLE';
    scoreColor = 'text-amber-600';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Validation Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {isDirectionallyCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <MetricTooltip tooltip={metricTooltips.directionalCorrectness}>
                  <p className="font-medium">Directional Correctness</p>
                </MetricTooltip>
                <p className="text-sm text-muted-foreground">
                  {isDirectionallyCorrect 
                    ? 'Cooperative model outperforms traditional as expected' 
                    : 'Cooperative model does not outperform traditional'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {isInequalityReduced ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <MetricTooltip tooltip={metricTooltips.inequalityReduction}>
                  <p className="font-medium">Inequality Reduction</p>
                </MetricTooltip>
                <p className="text-sm text-muted-foreground">
                  {isInequalityReduced 
                    ? 'Gini coefficient decreased as expected' 
                    : 'Gini coefficient did not decrease as expected'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {hasReasonableMagnitude ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <MetricTooltip tooltip={metricTooltips.reasonableMagnitude}>
                  <p className="font-medium">Reasonable Magnitude</p>
                </MetricTooltip>
                <p className="text-sm text-muted-foreground">
                  {hasReasonableMagnitude 
                    ? 'Benefit per member is within reasonable range' 
                    : 'Benefit per member is outside reasonable range'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {downturnBenefitConsistency ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <MetricTooltip tooltip={metricTooltips.economicTheoryConsistency}>
                  <p className="font-medium">Economic Theory Consistency</p>
                </MetricTooltip>
                <p className="text-sm text-muted-foreground">
                  {downturnBenefitConsistency 
                    ? 'Results align with economic theory' 
                    : 'Results do not align with economic theory'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <MetricTooltip tooltip={metricTooltips.validationScore}>
              <p className="font-medium">Validation Score</p>
            </MetricTooltip>
            <p className={`font-bold ${scoreColor}`}>
              {validationScore}/100 ({scoreCategory})
            </p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <MetricTooltip tooltip={metricTooltips.mathematicalConsistency}>
              <p className="font-medium">Mathematical Consistency</p>
            </MetricTooltip>
            <div className="flex items-center gap-2">
              {isWithinErrorRange ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <p className={isWithinErrorRange ? 'text-green-600' : 'text-red-600'}>
                {isWithinErrorRange ? 'PASS' : 'FAIL'} 
                {errorPercentage !== undefined && acceptableErrorThreshold !== undefined && (
                  <span className="text-sm ml-1">
                    ({formatPercentage(errorPercentage)} error vs {formatPercentage(acceptableErrorThreshold)} threshold)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">About Validation Metrics</p>
              <p className="mt-1">
                These metrics assess the reliability of the simulation results. A high validation score indicates that the results align with economic theory and mathematical expectations.
              </p>
              <p className="mt-1">
                Even scenarios that fail mathematical consistency checks may still provide valuable qualitative insights. The mathematical model has known limitations, particularly for economic downturn scenarios and extreme community sizes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
