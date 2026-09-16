'use client';

import React, { useState } from 'react';
import { OptionResult } from '@/types/decision';
import { cn } from '@/lib/utils/cn';

interface ScoreBreakdownChartProps {
  rankings: OptionResult[];
}

export function ScoreBreakdownChart({ rankings }: ScoreBreakdownChartProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    rankings[0]?.optionId || ''
  );

  const selectedResult =
    rankings.find((r) => r.optionId === selectedOptionId) || rankings[0];

  if (!selectedResult) return null;

  return (
    <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Score Calculation Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Exact mathematical contribution points per criterion summing to final score ({selectedResult.finalScore}/100).
          </p>
        </div>

        {/* Option Selector Tabs */}
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          {rankings.map((r) => (
            <button
              key={r.optionId}
              onClick={() => setSelectedOptionId(r.optionId)}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                selectedOptionId === r.optionId
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              #{r.rank} {r.optionName}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Contribution Bars */}
      <div className="space-y-4 pt-2">
        {selectedResult.contributions.map((c) => {
          const weightPercent = (c.normalizedWeight * 100).toFixed(0);

          return (
            <div key={c.criterionId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {c.criterionName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    (Weight: {weightPercent}%, Score: {c.rawScore}/10)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    +{c.contributionPoints.toFixed(1)} pts
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ({c.percentageOfFinalScore}%)
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (c.contributionPoints / 35) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Calculation Proof */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <span className="text-slate-600 dark:text-slate-400">
          ∑ (Normalized Weight × Option Score × 10) =
        </span>
        <span className="text-base font-bold text-brand-600 dark:text-brand-400">
          Final Score: {selectedResult.finalScore} / 100
        </span>
      </div>
    </div>
  );
}
