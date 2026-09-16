'use client';

import React from 'react';
import { Decision, OptionResult } from '@/types/decision';
import { Badge } from '@/components/ui/Badge';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { getScoreFitBadge, formatCurrency } from '@/lib/utils/formatters';
import { Trophy, CheckCircle2, Award, Sparkles, ChevronRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface WinnerHeroCardProps {
  decision: Decision;
  winner: OptionResult;
  allRankings: OptionResult[];
  onOpenFinalDecision: () => void;
}

export function WinnerHeroCard({
  decision,
  winner,
  allRankings,
  onOpenFinalDecision,
}: WinnerHeroCardProps) {
  const fitInfo = getScoreFitBadge(winner.finalScore);
  const isFinalized = Boolean(decision.finalDecision);
  const winnerOption = decision.options.find((o) => o.id === winner.optionId);

  return (
    <div className="rounded-3xl border border-brand-200 dark:border-brand-800/80 bg-gradient-to-b from-brand-50/50 via-white to-white dark:from-brand-950/40 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-brand-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            Rank #1 Leader
          </span>
          <Badge variant={fitInfo.variant === 'emerald' ? 'emerald' : 'brand'}>
            {fitInfo.label}
          </Badge>
          {isFinalized && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Decision Committed
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenFinalDecision}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          {isFinalized ? 'Edit Final Decision Record' : 'Commit & Mark as Decided'} &rarr;
        </button>
      </div>

      {/* Hero Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col: Option Info */}
        <div className="lg:col-span-8 space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Optimal Choice Based on Your Prioritized Criteria
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {winner.optionName}
            </h2>
          </div>

          {winnerOption?.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {winnerOption.description}
            </p>
          )}

          {winnerOption?.price !== undefined && (
            <div className="text-sm font-mono text-slate-700 dark:text-slate-300 font-semibold">
              Price:{' '}
              <span className="text-brand-600 dark:text-brand-400 font-bold">
                {formatCurrency(winnerOption.price)}
              </span>
            </div>
          )}

          {/* Strongest Contributing Factors */}
          {winner.strongestCriteria?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                Key Strengths:
              </span>
              {winner.strongestCriteria.map((sc) => (
                <span
                  key={sc}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                >
                  ✓ {sc}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Score Badge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-xs">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Calculated Weighted Score
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl sm:text-6xl font-extrabold font-mono text-brand-600 dark:text-brand-400 tracking-tight">
              {winner.finalScore}
            </span>
            <span className="text-lg font-mono text-slate-400">/ 100</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, winner.finalScore)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
            Deterministic Weighted Linear Sum
          </p>
        </div>
      </div>

      {/* Runner-Ups Horizontal Strip */}
      {allRankings.length > 1 && (
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Other Compared Alternatives
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allRankings.slice(1).map((item) => (
              <div
                key={item.optionId}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{item.rank}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.optionName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate">
                    Δ {(winner.finalScore - item.finalScore).toFixed(1)} pts behind
                  </span>
                </div>

                <span className="text-base font-bold font-mono text-slate-700 dark:text-slate-300 shrink-0">
                  {item.finalScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
