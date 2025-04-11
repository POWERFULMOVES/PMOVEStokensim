"use client";

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { SimulationParams, SimulationResults } from '@/lib/simulation/types';
import { DEFAULT_PARAMS } from '@/lib/simulation';
import { toast } from 'sonner';
import { applyPreset, PRESET_SCENARIOS } from '@/lib/presets';

interface SimulationContextType {
  params: SimulationParams;
  results: SimulationResults | null;
  isLoading: boolean;
  activeTab: string;
  presetName: string | null;
  setParams: (params: Partial<SimulationParams>) => void;
  setActiveTab: (tab: string) => void;
  runSimulation: () => Promise<void>;
  applyPresetAndRun: (presetId: string) => Promise<void>;
  resetParams: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [params, setParamsState] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('presets');
  const [presetName, setPresetName] = useState<string | null>(null);

  const setParams = (newParams: Partial<SimulationParams>) => {
    setParamsState((prevParams) => ({
      ...prevParams,
      ...newParams,
    }));
  };

  const resetParams = () => {
    setParamsState(DEFAULT_PARAMS);
    setPresetName(null);
  };

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      // Log the parameters being sent to the simulation in a readable format
      console.log('Running simulation with parameters:');
      const keyParams = [
        'NUM_MEMBERS', 'SIMULATION_WEEKS', 'WEEKLY_INCOME_AVG', 'WEEKLY_FOOD_BUDGET_AVG',
        'PERCENT_SPEND_INTERNAL_AVG', 'GROUP_BUY_SAVINGS_PERCENT', 'LOCAL_PRODUCTION_SAVINGS_PERCENT',
        'GROTOKEN_REWARD_PER_WEEK_AVG', 'GROTOKEN_USD_VALUE', 'INITIAL_WEALTH_SIGMA_LOG', 'WEEKLY_COOP_FEE_B'
      ];

      for (const key of keyParams) {
        if (key in params) {
          console.log(`  ${key}: ${params[key as keyof SimulationParams]}`);
        }
      }

      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to run simulation');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('analysis');
      toast.success('Simulation completed successfully!');
      return data;
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Failed to run simulation. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const applyPresetAndRun = async (presetId: string) => {
    const preset = PRESET_SCENARIOS.find(p => p.id === presetId);
    if (!preset) {
      console.error(`Preset with ID ${presetId} not found`);
      return;
    }

    console.log(`Applying preset: ${preset.name} with params:`, preset.params);

    // Get the combined parameters
    const presetParams = applyPreset(presetId);

    // Important: We need to directly use these parameters for the simulation
    // instead of relying on the state update
    setParamsState(presetParams);
    setPresetName(preset.name); // Use the actual name, not the ID

    // Run simulation with the preset parameters directly
    setIsLoading(true);
    try {
      console.log('Running simulation with preset parameters:', presetParams);

      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(presetParams), // Use presetParams directly
      });

      if (!response.ok) {
        throw new Error('Failed to run simulation');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('analysis');
      toast.success(`Simulation for "${preset.name}" completed successfully!`);
      return data;
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Failed to run simulation. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        params,
        results,
        isLoading,
        activeTab,
        presetName,
        setParams,
        setActiveTab,
        runSimulation,
        applyPresetAndRun,
        resetParams,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
