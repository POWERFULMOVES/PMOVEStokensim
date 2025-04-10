import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricTooltip } from '@/components/ui/metric-tooltip';
import { metricTooltips } from '@/lib/tooltips';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KeyMetricsTableProps {
  finalMetrics: {
    TotalWealth_A: number;
    TotalWealth_B: number;
    AvgWealth_A: number;
    AvgWealth_B: number;
    MedianWealth_A: number;
    MedianWealth_B: number;
    Gini_A: number;
    Gini_B: number;
    WealthGap_A: number;
    WealthGap_B: number;
    PovertyRate_A: number;
    PovertyRate_B: number;
    LocalEconomyStrength: number;
    WealthMobility: number;
    [key: string]: number;
  };
}

export function KeyMetricsTable({ finalMetrics }: KeyMetricsTableProps) {
  // Calculate differences and percentages
  const totalWealthDiff = finalMetrics.TotalWealth_B - finalMetrics.TotalWealth_A;
  const totalWealthDiffPct = (totalWealthDiff / finalMetrics.TotalWealth_A) * 100;
  const avgWealthDiff = finalMetrics.AvgWealth_B - finalMetrics.AvgWealth_A;
  const medianWealthDiff = finalMetrics.MedianWealth_B - finalMetrics.MedianWealth_A;
  const giniDiff = finalMetrics.Gini_B - finalMetrics.Gini_A;
  const wealthGapDiff = finalMetrics.WealthGap_B - finalMetrics.WealthGap_A;
  const povertyRateDiff = finalMetrics.PovertyRate_B - finalMetrics.PovertyRate_A;

  // Helper function to render trend indicators
  const renderTrend = (value: number, isGoodWhenPositive = true) => {
    if (Math.abs(value) < 0.001) return <Minus className="h-4 w-4 text-gray-500" />;
    
    const isPositive = value > 0;
    const isGood = isPositive === isGoodWhenPositive;
    
    if (isPositive) {
      return <TrendingUp className={`h-4 w-4 ${isGood ? 'text-green-500' : 'text-red-500'}`} />;
    } else {
      return <TrendingDown className={`h-4 w-4 ${isGood ? 'text-green-500' : 'text-red-500'}`} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Key Metrics
          <span className="text-sm font-normal text-muted-foreground">
            Final week comparison
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Scenario A</TableHead>
              <TableHead className="text-right">Scenario B</TableHead>
              <TableHead className="text-right">Difference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Wealth Metrics */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={4} className="font-medium">Wealth Metrics</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MetricTooltip tooltip={metricTooltips.totalWealth}>
                  Total Wealth
                </MetricTooltip>
              </TableCell>
              <TableCell className="text-right">{formatCurrency(finalMetrics.TotalWealth_A)}</TableCell>
              <TableCell className="text-right">{formatCurrency(finalMetrics.TotalWealth_B)}</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-1">
                {renderTrend(totalWealthDiff)}
                <span className={totalWealthDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(Math.abs(totalWealthDiff))} ({formatPercentage(Math.abs(totalWealthDiffPct) / 100)})
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MetricTooltip tooltip={metricTooltips.avgWealth}>
                  Average Wealth
                </MetricTooltip>
              </TableCell>
              <TableCell className="text-right">{formatCurrency(finalMetrics.AvgWealth_A)}</TableCell>
              <TableCell className="text-right">{formatCurrency(finalMetrics.AvgWealth_B)}</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-1">
                {renderTrend(avgWealthDiff)}
                <span className={avgWealthDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(Math.abs(avgWealthDiff))}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MetricTooltip tooltip={metricTooltips.medianWealth}>
                  Median Wealth
                </MetricTooltip>
              </TableCell>
              <TableCell className="text-right">{formatCurrency(finalMetrics.MedianWealth_A)}</TableCell>
              <TableCell className="text-right">{formatCurrency(finalMetrics.MedianWealth_B)}</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-1">
                {renderTrend(medianWealthDiff)}
                <span className={medianWealthDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(Math.abs(medianWealthDiff))}
                </span>
              </TableCell>
            </TableRow>

            {/* Inequality Metrics */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={4} className="font-medium">Inequality Metrics</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MetricTooltip tooltip={metricTooltips.gini}>
                  Gini Coefficient
                </MetricTooltip>
              </TableCell>
              <TableCell className="text-right">{formatNumber(finalMetrics.Gini_A, 3, 3)}</TableCell>
              <TableCell className="text-right">{formatNumber(finalMetrics.Gini_B, 3, 3)}</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-1">
                {renderTrend(giniDiff, false)}
                <span className={giniDiff <= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatNumber(Math.abs(giniDiff), 3, 3)}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MetricTooltip tooltip={metricTooltips.wealthGap}>
                  Wealth Gap
                </MetricTooltip>
              </TableCell>
              <TableCell className="text-right">{formatNumber(finalMetrics.WealthGap_A, 1, 1)}x</TableCell>
              <TableCell className="text-right">{formatNumber(finalMetrics.WealthGap_B, 1, 1)}x</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-1">
                {renderTrend(wealthGapDiff, false)}
                <span className={wealthGapDiff <= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatNumber(Math.abs(wealthGapDiff), 1, 1)}x
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MetricTooltip tooltip={metricTooltips.povertyRate}>
                  Poverty Rate
                </MetricTooltip>
              </TableCell>
              <TableCell className="text-right">{formatPercentage(finalMetrics.PovertyRate_A)}</TableCell>
              <TableCell className="text-right">{formatPercentage(finalMetrics.PovertyRate_B)}</TableCell>
              <TableCell className="text-right flex items-center justify-end gap-1">
                {renderTrend(povertyRateDiff, false)}
                <span className={povertyRateDiff <= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(Math.abs(povertyRateDiff))}
                </span>
              </TableCell>
            </TableRow>

            {/* Community Metrics */}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={4} className="font-medium">Community Metrics</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MetricTooltip tooltip={metricTooltips.localEconomyStrength}>
                  Local Economy Strength
                </MetricTooltip>
              </TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">{formatPercentage(finalMetrics.LocalEconomyStrength)}</TableCell>
              <TableCell className="text-right">-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MetricTooltip tooltip={metricTooltips.wealthMobility}>
                  Wealth Mobility
                </MetricTooltip>
              </TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">{formatNumber(finalMetrics.WealthMobility, 1, 1)}</TableCell>
              <TableCell className="text-right">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
          <p className="font-medium">Understanding the Metrics</p>
          <p>
            <strong>Scenario A</strong> represents a traditional economic model where individuals spend money primarily outside their community.
          </p>
          <p>
            <strong>Scenario B</strong> represents a cooperative economic model with internal spending, group buying, local production, and community currency.
          </p>
          <p className="mt-1">
            Hover over metric names for detailed explanations. Green values indicate improvements in Scenario B compared to Scenario A.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
