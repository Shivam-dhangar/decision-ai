'use client';

import React, { useState } from 'react';
import { DecisionAssumption } from '@/types/decision';
import { Button } from '@/components/ui/Button';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { CheckCircle2, Circle, Plus, Trash2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AssumptionsSectionProps {
  assumptions: DecisionAssumption[];
  onUpdateAssumptions: (assumptions: DecisionAssumption[]) => void;
}

export function AssumptionsSection({
  assumptions,
  onUpdateAssumptions,
}: AssumptionsSectionProps) {
  const [newText, setNewText] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleToggleConfirm = (id: string) => {
    const updated = assumptions.map((a) =>
      a.id === id ? { ...a, confirmed: !a.confirmed } : a
    );
    onUpdateAssumptions(updated);
  };

  const handleRemove = (id: string) => {
    onUpdateAssumptions(assumptions.filter((a) => a.id !== id));
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    const newAsm: DecisionAssumption = {
      id: `asm-${Date.now().toString(36)}`,
      text: newText.trim(),
      confirmed: true,
      source: 'USER_PROVIDED',
      importance: 'HIGH',
    };
    onUpdateAssumptions([...assumptions, newAsm]);
    setNewText('');
    setShowAdd(false);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Foundational Assumptions
            </span>
            <SourceBadge source="USER_ASSUMPTION" size="xs" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Your Decision Depends on These Assumptions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Confirm whether these premises hold true. If an assumption fails, your ranking might shift.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdd(!showAdd)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Assumption
        </Button>
      </div>

      {showAdd && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="e.g. I expect to use this laptop for at least 4 years."
            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdd}>
              Save Assumption
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {assumptions.map((asm) => (
          <div
            key={asm.id}
            className={cn(
              'p-4 rounded-xl border transition-all flex items-start justify-between gap-3',
              asm.confirmed
                ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20'
            )}
          >
            <button
              type="button"
              onClick={() => handleToggleConfirm(asm.id)}
              className="mt-0.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0"
              aria-label={asm.confirmed ? 'Mark unconfirmed' : 'Mark confirmed'}
            >
              {asm.confirmed ? (
                <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              )}
            </button>

            <div className="flex-1 space-y-1">
              <p
                className={cn(
                  'text-xs sm:text-sm leading-relaxed font-medium',
                  asm.confirmed
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-600 dark:text-slate-400 line-through opacity-80'
                )}
              >
                &ldquo;{asm.text}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Importance: {asm.importance}
                </span>
                <SourceBadge source={asm.source} size="xs" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(asm.id)}
              className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
              aria-label="Delete assumption"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
