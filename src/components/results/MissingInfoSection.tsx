'use client';

import React from 'react';
import { MissingInformation } from '@/types/decision';
import { Badge } from '@/components/ui/Badge';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { HelpCircle, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MissingInfoSectionProps {
  missingInfo: MissingInformation[];
  onUpdateMissingInfo: (items: MissingInformation[]) => void;
}

export function MissingInfoSection({
  missingInfo,
  onUpdateMissingInfo,
}: MissingInfoSectionProps) {
  if (!missingInfo || missingInfo.length === 0) return null;

  const handleToggleResolved = (id: string) => {
    const updated = missingInfo.map((m) =>
      m.id === id ? { ...m, resolved: !m.resolved } : m
    );
    onUpdateMissingInfo(updated);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Information Gaps
          </span>
          <SourceBadge source="AI_SUGGESTED" size="xs" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          Missing Information & Unknowns
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Unanswered questions that could influence your decision if verified before committing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missingInfo.map((info) => (
          <div
            key={info.id}
            className={cn(
              'p-5 rounded-2xl border transition-all space-y-3',
              info.resolved
                ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-70'
                : 'border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h4
                  className={cn(
                    'text-sm font-bold',
                    info.resolved
                      ? 'text-slate-500 dark:text-slate-400 line-through'
                      : 'text-slate-900 dark:text-slate-100'
                  )}
                >
                  {info.topic}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Why it matters:
                  </span>{' '}
                  {info.whyItMatters}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleResolved(info.id)}
                className="text-brand-600 dark:text-brand-400 hover:text-brand-700 p-1 shrink-0"
                aria-label="Toggle resolved"
              >
                {info.resolved ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>

            {info.suggestedAction && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-brand-700 dark:text-brand-300 font-medium">
                👉 {info.suggestedAction}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
