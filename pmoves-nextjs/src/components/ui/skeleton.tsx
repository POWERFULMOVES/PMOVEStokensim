/**
 * Skeleton Component
 * Provides loading placeholder for various UI elements
 */

'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      {...props}
    />
  );
}

interface ChartSkeletonProps extends SkeletonProps {
  height?: number;
}

export function ChartSkeleton({ height = 300, className, ...props }: ChartSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      style={{ height: `${height}px` }}
      {...props}
    />
  );
}

interface TextSkeletonProps extends SkeletonProps {
  lines?: number;
  lineHeight?: string;
}

export function TextSkeleton({ lines = 3, lineHeight = 'h-4', className, ...props }: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={cn('animate-pulse rounded bg-muted', lineHeight, 'w-full')} />
      ))}
    </div>
  );
}