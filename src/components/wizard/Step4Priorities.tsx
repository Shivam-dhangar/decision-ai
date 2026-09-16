'use client';

import React from 'react';
import { DecisionCriterion } from '@/types/decision';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { calculateNormalizedWeights } from '@/lib/engine/decisionEngine';
import { ArrowRight, ArrowLeft, Scale, Info } from 'lucide-react';

interface Step4PrioritiesProps {
  criteria: DecisionCriterion[];
  onCriteriaChange: (criteria: DecisionCriterion[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4Priorities({
  criteria,
  onCriteriaChange,
  onNext,
  onBack,
}: Step4PrioritiesProps) {
  const normalizedWeights = calculateNormalizedWeights(criteria);

  const handleWeightChange = (id: string, newWeight: number) => {
    const updated = criteria.map((c) => (c.id === id ? { ...c, weight: newWeight } : c));
    onCriteriaChange(updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <span>Step 4 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Set your priority weights.
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          How important is each factor to you? The engine normalizes all slider values into mathematically sound percentages automatically.
        </p>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
        <Scale className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Automated Mathematical Normalization:
          </span>{' '}
          Your priorities determine how much each factor influences the final ranking. When you increase the weight of one factor, relative influence recalibrates smoothly so total weight is always 100%.
        </div>
      </div>

      {/* Sliders List */}
      <div className="space-y-3">
        {criteria.map((crit) => {
          const normPercent = (normalizedWeights[crit.id] || 0) * 100;
          return (
            <Slider
              key={crit.id}
              label={crit.name}
              description={crit.description}
              value={crit.weight}
              normalizedPercentage={normPercent}
              onChange={(w) => handleWeightChange(crit.id, w)}
            />
          );
        })}
      </div>

      {/* Weight Distribution Preview Bar */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Priority Distribution Breakdown</span>
          <span className="font-mono text-brand-600 dark:text-brand-400">Total: 100%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          {criteria.map((crit, idx) => {
            const pct = (normalizedWeights[crit.id] || 0) * 100;
            const colors = [
              'bg-brand-600',
              'bg-indigo-500',
              'bg-purple-500',
              'bg-teal-500',
              'bg-amber-500',
              'bg-rose-500',
              'bg-blue-400',
              'bg-emerald-500',
            ];
            const colorClass = colors[idx % colors.length];
            return (
              <div
                key={crit.id}
                style={{ width: `${pct}%` }}
                className={`${colorClass} h-full transition-all duration-200`}
                title={`${crit.name}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Button variant="outline" size="md" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>

        <Button variant="primary" size="lg" onClick={onNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Next: Score Options Matrix
        </Button>
      </div>
    </div>
  );
}
