import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle } from "lucide-react";

// Import documentation content
import {
  Documentation,
  overviewContent,
  mathematicalModelContent,
  scenarioPresetsContent,
  keyMetricsContent,
  interpretationGuideContent
} from './documentation-content';

interface DocumentationDialogProps {
  initialTab?: string;
}

export function DocumentationDialog({ initialTab = "overview" }: DocumentationDialogProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>PMOVES Token Simulator Documentation</DialogTitle>
          <DialogDescription>
            Learn about the simulator, its mathematical model, and how to interpret the results.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="model">Mathematical Model</TabsTrigger>
            <TabsTrigger value="presets">Scenario Presets</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            <TabsTrigger value="interpretation">Interpretation Guide</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[60vh] mt-4 p-4 rounded-md border">
            <TabsContent value="overview" className="prose max-w-none">
              <Documentation content={overviewContent} />
            </TabsContent>
            <TabsContent value="model" className="prose max-w-none">
              <Documentation content={mathematicalModelContent} />
            </TabsContent>
            <TabsContent value="presets" className="prose max-w-none">
              <Documentation content={scenarioPresetsContent} />
            </TabsContent>
            <TabsContent value="metrics" className="prose max-w-none">
              <Documentation content={keyMetricsContent} />
            </TabsContent>
            <TabsContent value="interpretation" className="prose max-w-none">
              <Documentation content={interpretationGuideContent} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
