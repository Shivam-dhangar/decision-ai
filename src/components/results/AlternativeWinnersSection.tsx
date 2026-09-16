'use client';

import React from 'react';
import { DecisionAnalysis, DecisionOption } from '@/types/decision';
import { Trophy, Zap, DollarSign, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface AlternativeWinnersSectionProps {
  analysis?: DecisionAnalysis;
  options: DecisionOption[];
}

export function AlternativeWinnersSection({
  analysis,
  options,
}: AlternativeWinnersSectionProps) {
  if (!analysis?.alternativeWinners) return null;

  const { alternativeWinners } = analysis;

  const categories = [
    {
      title: 'Best Overall Fit',
      data: alternativeWinners.bestOverall,
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
      bg: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20',
    },
    {
      title: 'Best Value for Money',
      data: alternativeWinners.bestValue,
      icon: <DollarSign className="w-4 h-4 text-emerald-500" />,
      bg: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20',
    },
    {
      title: 'Best Pure Performance',
      data: alternativeWinners.bestPerformance,
      icon: <Zap className="w-4 h-4 text-indigo-500" />,
      bg: 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20',
    },
    {
      title: 'Lowest Risk & High Durability',
      data: alternativeWinners.lowestRisk,
      icon: <ShieldCheck className="w-4 h-4 text-teal-500" />,
      bg: 'border-teal-200 dark:border-teal-900/60 bg-teal-50/20 dark:bg-teal-950/20',
    },
    {
      title: 'Best Target Budget Fit',
      data: alternativeWinners.bestBudget,
      icon: <Tag className="w-4 h-4 text-purple-500" />,
      bg: 'border-purple-200 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/20',
    },
  ].filter((c) => Boolean(c.data));

  if (categories.length === 0) return null;

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Categorical Champions
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          Alternative Winners by Priority Focus
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Depending on which single dimension you value above all else, here are the respective leaders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const optMatch = options.find(
            (o) => o.name.toLowerCase() === cat.data?.optionName.toLowerCase()
          );

          return (
            <div
              key={cat.title}
              className={`p-5 rounded-2xl border ${cat.bg} flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {cat.title}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 pt-1">
                  {cat.data?.optionName}
                </h4>

                {optMatch?.price !== undefined && (
                  <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    Price: {formatCurrency(optMatch.price)}
                  </p>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cat.data?.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
