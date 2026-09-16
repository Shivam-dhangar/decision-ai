'use client';

import React from 'react';
import { SensitivityItem } from '@/types/decision';
import { Badge } from '@/components/ui/Badge';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { ShieldCheck, AlertCircle, Info, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SensitivityCardProps {
  stabilityIndex: number;
  sensitivityItems: SensitivityItem[];
}

export function SensitivityCard({
  stabilityIndex,
  sensitivityItems,
}: SensitivityCardProps) {
  const getStabilityLabel = (index: number) => {
    if (index >= 80) return { text: 'High Stability', variant: 'emerald' as const };
    if (index >= 60) return { text: 'Moderate Stability', variant: 'amber' as const };
    return { text: 'Volatile / Sensitive to Priorities', variant: 'rose' as const };
  };

  const status = getStabilityLabel(stabilityIndex);

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Robustness Analysis
            </span>
            <SourceBadge source="CALCULATED" size="xs" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            How Stable Is Your Decision?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Measures whether reasonable changes to criteria weights could overturn the winning option.
          </p>
        </div>

        {/* Stability Index Score */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex items-center gap-4 self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
                {stabilityIndex}%
              </span>
              <Badge variant={status.variant} size="sm">
                {status.text}
              </Badge>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Decision Stability Index
            </span>
          </div>
        </div>
      </div>

      {/* Sensitivity List */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Criterion Sensitivity Breakdown
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sensitivityItems.map((item) => (
            <div
              key={item.criterionId}
              className={cn(
                'p-4 rounded-2xl border transition-all space-y-2',
                item.sensitivityLevel === 'HIGH'
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20'
                  : item.sensitivityLevel === 'MODERATE'
                  ? 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {item.criterionName}
                </span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase',
                    item.sensitivityLevel === 'HIGH'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : item.sensitivityLevel === 'MODERATE'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  )}
                >
                  {item.sensitivityLevel} Sensitivity
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.explanation}
              </p>

              {item.flipThresholdWeight !== undefined && item.flipOptionName && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Flip threshold: Weight &rarr;{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.flipThresholdWeight}/10
                  </span>{' '}
                  favors{' '}
                  <span className="font-bold text-brand-600 dark:text-brand-400">
                    {item.flipOptionName}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
