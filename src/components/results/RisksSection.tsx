'use client';

import React from 'react';
import { DecisionRisk } from '@/types/decision';
import { Badge } from '@/components/ui/Badge';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RisksSectionProps {
  risks: DecisionRisk[];
}

export function RisksSection({ risks }: RisksSectionProps) {
  if (!risks || risks.length === 0) return null;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return { label: 'HIGH RISK', variant: 'rose' as const };
      case 'MEDIUM':
        return { label: 'MEDIUM RISK', variant: 'amber' as const };
      default:
        return { label: 'LOW RISK', variant: 'emerald' as const };
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Risk Identification
            </span>
            <SourceBadge source="AI_SUGGESTED" size="xs" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Potential Decision Risks & Pitfalls
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {risks.map((risk) => {
          const badge = getRiskBadge(risk.level);

          return (
            <div
              key={risk.id}
              className={cn(
                'p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3',
                risk.level === 'HIGH' || risk.level === 'CRITICAL'
                  ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                  : risk.level === 'MEDIUM'
                  ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40'
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                  {risk.affectedOptionName && (
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                      {risk.affectedOptionName}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {risk.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {risk.description}
                </p>
              </div>

              {risk.potentialImpact && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Impact:
                  </span>{' '}
                  {risk.potentialImpact}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
