import React from 'react';
import { cn } from '@/lib/utils/cn';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/70',
        className
      )}
      {...props}
    />
  );
}

export function AISkeletonCard({ title = 'Analyzing with AI...' }: { title?: string }) {
  return (
    <div className="p-6 rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-indigo-500 animate-ping" />
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          {title}
        </p>
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  );
}
