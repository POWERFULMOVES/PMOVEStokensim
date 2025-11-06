/**
 * Heatmap Chart Component
 * Displays parameter sensitivity or correlation matrices
 */

'use client';

import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface HeatmapData {
  x: string | number;
  y: string | number;
  value: number;
  label?: string;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title?: string;
  description?: string;
  xLabel?: string;
  yLabel?: string;
  colorScale?: 'sequential' | 'diverging';
  valueRange?: [number, number];
}

export function HeatmapChart({
  data,
  title = "Heatmap",
  description,
  xLabel = "X Axis",
  yLabel = "Y Axis",
  colorScale = 'sequential',
  valueRange,
}: HeatmapChartProps) {
  // Get unique x and y values
  const xValues = Array.from(new Set(data.map(d => d.x))).sort();
  const yValues = Array.from(new Set(data.map(d => d.y))).sort();

  // Calculate value range if not provided
  const values = data.map(d => d.value);
  const minValue = valueRange ? valueRange[0] : Math.min(...values);
  const maxValue = valueRange ? valueRange[1] : Math.max(...values);
  const valueSpan = maxValue - minValue;

  // Color scale function
  const getColor = (value: number): string => {
    if (colorScale === 'diverging') {
      // Diverging scale: blue (negative) → white (0) → red (positive)
      const normalized = (value - minValue) / valueSpan;
      if (normalized < 0.5) {
        // Blue to white
        const intensity = Math.round((1 - normalized * 2) * 255);
        return `rgb(${intensity}, ${intensity}, 255)`;
      } else {
        // White to red
        const intensity = Math.round((1 - (normalized - 0.5) * 2) * 255);
        return `rgb(255, ${intensity}, ${intensity})`;
      }
    } else {
      // Sequential scale: light blue → dark blue
      const normalized = (value - minValue) / valueSpan;
      const intensity = Math.round((1 - normalized) * 200 + 55);
      return `rgb(${intensity}, ${intensity}, 255)`;
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
          <p className="font-semibold">{data.label || `${data.x} × ${data.y}`}</p>
          <p className="text-sm">Value: {data.value.toFixed(4)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="category"
              dataKey="x"
              name={xLabel}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              type="category"
              dataKey="y"
              name={yLabel}
              width={60}
            />
            <ZAxis type="number" dataKey="value" range={[400, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data} shape="square">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">Low</span>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => {
              const value = minValue + (i / 9) * valueSpan;
              return (
                <div
                  key={i}
                  className="w-8 h-4"
                  style={{ backgroundColor: getColor(value) }}
                  title={value.toFixed(2)}
                />
              );
            })}
          </div>
          <span className="text-sm text-muted-foreground">High</span>
        </div>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          Range: {minValue.toFixed(4)} to {maxValue.toFixed(4)}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Helper function to create heatmap data from a matrix
 */
export function matrixToHeatmapData(
  matrix: number[][],
  xLabels: string[],
  yLabels: string[]
): HeatmapData[] {
  const data: HeatmapData[] = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      data.push({
        x: xLabels[x],
        y: yLabels[y],
        value: matrix[y][x],
        label: `${yLabels[y]} × ${xLabels[x]}`
      });
    }
  }

  return data;
}

/**
 * Helper function to create correlation matrix heatmap data
 */
export function correlationMatrixToHeatmap(
  correlations: Record<string, Record<string, number>>
): HeatmapData[] {
  const data: HeatmapData[] = [];
  const keys = Object.keys(correlations);

  for (const yKey of keys) {
    for (const xKey of keys) {
      data.push({
        x: xKey,
        y: yKey,
        value: correlations[yKey][xKey],
        label: `${yKey} × ${xKey}: ${correlations[yKey][xKey].toFixed(3)}`
      });
    }
  }

  return data;
}
