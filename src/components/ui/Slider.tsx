import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps {
  label: string;
  description?: string;
  value: number; // 1 to 10
  onChange: (value: number) => void;
  normalizedPercentage?: number; // 0 to 100
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  label,
  description,
  value,
  onChange,
  normalizedPercentage,
  min = 1,
  max = 10,
  step = 1,
  className,
}: SliderProps) {
  return (
    <div className={cn('p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 transition-all', className)}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </span>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {normalizedPercentage !== undefined && (
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
              {normalizedPercentage.toFixed(0)}%
            </span>
          )}
          <span className="w-12 text-center py-0.5 text-xs font-bold font-mono rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            {value} / {max}
          </span>
        </div>
      </div>

      <div className="relative flex items-center mt-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${label} importance weight`}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 px-0.5">
        <span>Low (1)</span>
        <span>Neutral (5)</span>
        <span>Critical (10)</span>
      </div>
    </div>
  );
}
