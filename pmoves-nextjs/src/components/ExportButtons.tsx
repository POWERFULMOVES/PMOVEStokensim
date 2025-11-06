/**
 * Export button components for simulation data
 */

'use client';

import React from 'react';
import { Download, FileJson, FileSpreadsheet, FileText, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  exportSimulationHistoryToCSV,
  exportMemberDataToCSV,
  exportKeyEventsToCSV,
  exportSimulationBundle,
  exportComparisonToCSV,
  exportSummaryStatistics,
  exportWealthDistributionToCSV,
  exportCompleteSimulation,
} from '@/lib/utils/exportUtils';
import { SimulationResults } from '@/lib/simulation/types';

interface ExportButtonsProps {
  results: SimulationResults;
  scenarioName?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * Dropdown menu with multiple export options
 */
export function ExportDropdown({
  results,
  scenarioName = 'simulation',
  variant = 'outline',
  size = 'default',
}: ExportButtonsProps) {
  if (!results || !results.history) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => exportSimulationHistoryToCSV(results.history, scenarioName)}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Weekly History (CSV)</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportMemberDataToCSV(results.final_members, scenarioName)}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Member Data (CSV)</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportWealthDistributionToCSV(results.final_members, scenarioName)}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Wealth Distribution (CSV)</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportComparisonToCSV(results.history, scenarioName)}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Comparison Summary (CSV)</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportSummaryStatistics(results, scenarioName)}
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Summary Statistics (CSV)</span>
        </DropdownMenuItem>

        {results.key_events && results.key_events.length > 0 && (
          <DropdownMenuItem
            onClick={() => exportKeyEventsToCSV(results.key_events || [], scenarioName)}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Key Events (CSV)</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => exportSimulationBundle(results, scenarioName)}
        >
          <FileJson className="mr-2 h-4 w-4" />
          <span>Complete Bundle (JSON)</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => exportCompleteSimulation(results, scenarioName)}
          className="text-blue-600 dark:text-blue-400"
        >
          <Package className="mr-2 h-4 w-4" />
          <span>Export All (6 files)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Single CSV export button
 */
export function ExportCSVButton({
  results,
  scenarioName = 'simulation',
  variant = 'outline',
  size = 'default',
}: ExportButtonsProps) {
  if (!results || !results.history) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => exportSimulationHistoryToCSV(results.history, scenarioName)}
      className="gap-2"
    >
      <FileSpreadsheet className="h-4 w-4" />
      Export CSV
    </Button>
  );
}

/**
 * Single JSON export button
 */
export function ExportJSONButton({
  results,
  scenarioName = 'simulation',
  variant = 'outline',
  size = 'default',
}: ExportButtonsProps) {
  if (!results || !results.history) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => exportSimulationBundle(results, scenarioName)}
      className="gap-2"
    >
      <FileJson className="h-4 w-4" />
      Export JSON
    </Button>
  );
}

/**
 * Export all button
 */
export function ExportAllButton({
  results,
  scenarioName = 'simulation',
  variant = 'default',
  size = 'default',
}: ExportButtonsProps) {
  if (!results || !results.history) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => exportCompleteSimulation(results, scenarioName)}
      className="gap-2"
    >
      <Package className="h-4 w-4" />
      Export All Data
    </Button>
  );
}

/**
 * Compact button group with CSV, JSON, and dropdown
 */
export function ExportButtonGroup({
  results,
  scenarioName = 'simulation',
}: ExportButtonsProps) {
  if (!results || !results.history) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <ExportCSVButton results={results} scenarioName={scenarioName} size="sm" />
      <ExportJSONButton results={results} scenarioName={scenarioName} size="sm" />
      <ExportDropdown results={results} scenarioName={scenarioName} size="sm" />
    </div>
  );
}

/**
 * Simple export section with title and buttons
 */
export function ExportSection({
  results,
  scenarioName = 'simulation',
  title = 'Export Data',
  description,
}: ExportButtonsProps & { title?: string; description?: string }) {
  if (!results || !results.history) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <ExportDropdown results={results} scenarioName={scenarioName} />
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportSimulationHistoryToCSV(results.history, scenarioName)}
          className="gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Weekly History
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => exportMemberDataToCSV(results.final_members, scenarioName)}
          className="gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Members
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => exportSummaryStatistics(results, scenarioName)}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Statistics
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => exportSimulationBundle(results, scenarioName)}
          className="gap-2"
        >
          <FileJson className="h-4 w-4" />
          Full JSON
        </Button>
      </div>
    </div>
  );
}
