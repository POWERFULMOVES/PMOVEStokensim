"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PRESET_SCENARIOS } from '@/lib/presets';
import { testPreset, testAllPresets } from '@/lib/simulation/test-utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function TestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [testOutput, setTestOutput] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);

  // Capture console.log output
  const captureConsoleOutput = (fn: () => Promise<any>) => {
    const originalLog = console.log;
    const originalError = console.error;
    let output = '';

    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog(...args);
    };

    console.error = (...args) => {
      output += 'ERROR: ' + args.join(' ') + '\n';
      originalError(...args);
    };

    return fn()
      .then(result => {
        console.log = originalLog;
        console.error = originalError;
        setTestOutput(output);
        return result;
      })
      .catch(error => {
        console.log = originalLog;
        console.error = originalError;
        setTestOutput(output + '\nERROR: ' + error.message);
        throw error;
      });
  };

  const handleRunTest = async () => {
    if (!selectedPreset) return;

    setIsRunning(true);
    setTestOutput('Running test...\n');

    try {
      await captureConsoleOutput(() => testPreset(selectedPreset));
    } catch (error) {
      console.error('Error running test:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunAllTests = async () => {
    setIsRunning(true);
    setTestOutput('Running all tests...\n');

    try {
      const results = await captureConsoleOutput(() => testAllPresets());
      setTestResults(results);
    } catch (error) {
      console.error('Error running all tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">PMOVES Simulation Tests</h1>
        <p className="text-muted-foreground">
          Verify the mathematical accuracy of the economic simulation
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Select a preset to test or run all tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {PRESET_SCENARIOS.map(preset => (
                  <div
                    key={preset.id}
                    className={`p-3 border rounded-md cursor-pointer transition-all ${selectedPreset === preset.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setSelectedPreset(preset.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{preset.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                      </div>
                      {selectedPreset === preset.id && (
                        <Badge variant="outline" className="ml-2 bg-primary/10">Selected</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {preset.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleRunAllTests}
                disabled={isRunning}
              >
                {isRunning ? 'Running...' : 'Run All Tests'}
              </Button>
              <Button
                onClick={handleRunTest}
                disabled={isRunning || !selectedPreset}
              >
                {isRunning ? 'Running...' : 'Run Selected Test'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Mathematical verification of simulation results
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Tabs defaultValue="output" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="output">Console Output</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="output" className="flex-grow">
                  <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <pre className="text-xs font-mono whitespace-pre-wrap">{testOutput}</pre>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="summary" className="flex-grow">
                  {testResults.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Test Summary</h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-xs">Pass ({testResults.filter(r => !('error' in r) && r.verification.isWithinErrorRange).length})</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-xs">Fail ({testResults.filter(r => !('error' in r) && !r.verification.isWithinErrorRange).length})</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                            <span className="text-xs">Error ({testResults.filter(r => 'error' in r).length})</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={testResults.filter(r => !('error' in r)).map((r: any) => ({
                              name: r.presetName,
                              expected: r.verification.expectedWealthDiff,
                              actual: r.verification.actualWealthDiff,
                              error: r.verification.errorPercentage * 100,
                              passed: r.verification.isWithinErrorRange
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={70}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="expected" name="Expected Diff ($)" fill="#8884d8" />
                            <Bar yAxisId="left" dataKey="actual" name="Actual Diff ($)" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={testResults.filter(r => !('error' in r)).map((r: any) => ({
                              name: r.presetName,
                              error: r.verification.errorPercentage * 100,
                              passed: r.verification.isWithinErrorRange
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={70}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="error"
                              name="Error (%)"
                              fill="#8884d8"
                              shape={(props: any) => {
                                const { x, y, width, height, passed } = props;
                                return (
                                  <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    fill={passed ? '#82ca9d' : '#ff7f7f'}
                                    stroke="none"
                                  />
                                );
                              }}
                            />
                            <ReferenceLine y={5} stroke="red" strokeDasharray="3 3" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <div className="p-4">
                          <h3 className="text-lg font-medium mb-4">Detailed Results</h3>
                          <div className="space-y-3">
                            {testResults.map((result: any) => (
                              <div
                                key={result.presetId}
                                className={`p-3 rounded-md border ${
                                  'error' in result
                                    ? 'border-gray-200 bg-gray-50'
                                    : result.verification.isWithinErrorRange
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-red-200 bg-red-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{result.presetName}</h4>
                                  {'error' in result ? (
                                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Error</Badge>
                                  ) : result.verification.isWithinErrorRange ? (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                      Pass
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">Fail</Badge>
                                  )}
                                </div>
                                {'error' in result ? (
                                  <p className="text-sm text-gray-600 mt-1">{result.error}</p>
                                ) : (
                                  <div className="text-sm mt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>Expected Diff:</div>
                                      <div className="font-mono">${result.verification.expectedWealthDiff.toFixed(2)}</div>
                                      <div>Actual Diff:</div>
                                      <div className="font-mono">${result.verification.actualWealthDiff.toFixed(2)}</div>
                                      <div>Error:</div>
                                      <div className="font-mono">{(result.verification.errorPercentage * 100).toFixed(2)}%</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Run tests to see results</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
