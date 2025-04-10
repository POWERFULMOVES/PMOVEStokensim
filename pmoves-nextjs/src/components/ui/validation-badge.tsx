import React from 'react';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { MathModelService } from '@/lib/services/math-model.service';

interface ValidationBadgeProps {
  score: number;
  isDownturn?: boolean;
}

export function ValidationBadge({ score, isDownturn = false }: ValidationBadgeProps) {
  const confidence = MathModelService.getConfidenceLevel(score);
  
  let color = '';
  let label = '';
  
  switch (confidence) {
    case 'high':
      color = 'bg-green-500 hover:bg-green-600';
      label = 'High Confidence';
      break;
    case 'medium':
      color = 'bg-amber-500 hover:bg-amber-600';
      label = 'Medium Confidence';
      break;
    case 'low':
      color = 'bg-red-500 hover:bg-red-600';
      label = 'Low Confidence';
      break;
  }
  
  // Special case for economic downturn scenarios
  if (isDownturn) {
    color = 'bg-blue-500 hover:bg-blue-600';
    label = 'Economic Downturn';
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className={`${color}`}>
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-semibold">Validation score: {score}/100</p>
          <p className="text-sm mt-1">{MathModelService.getValidationDescription(score, isDownturn)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
