import React from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ParameterInfoProps {
  title: string;
  description: string;
  impact?: string;
}

export function ParameterInfo({ title, description, impact }: ParameterInfoProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoCircledIcon className="h-4 w-4 ml-1 inline-block text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            <p className="font-medium">{title}</p>
            <p className="text-xs">{description}</p>
            {impact && (
              <p className="text-xs text-blue-500">
                <span className="font-medium">Impact:</span> {impact}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
