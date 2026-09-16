import React from 'react';
import { Decision } from '@/types/decision';
import { Layers, CheckCircle2, Clock, Award } from 'lucide-react';

interface DashboardStatsProps {
  decisions: Decision[];
}

export function DashboardStats({ decisions }: DashboardStatsProps) {
  const total = decisions.length;
  const completed = decisions.filter((d) => d.status === 'completed').length;
  const inProgress = total - completed;

  // Compute average score of completed decisions
  const completedScores = decisions
    .filter((d) => d.results?.winnerScore)
    .map((d) => d.results!.winnerScore);
  const avgScore = completedScores.length
    ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
    : 0;

  const stats = [
    {
      label: 'Total Decisions',
      value: total,
      icon: <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
      subtext: 'Structured models',
    },
    {
      label: 'Completed & Decided',
      value: completed,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      subtext: `${total > 0 ? Math.round((completed / total) * 100) : 0}% completion rate`,
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      subtext: 'Under evaluation',
    },
    {
      label: 'Avg Winner Score',
      value: avgScore > 0 ? `${avgScore}/100` : '—',
      icon: <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      subtext: 'Weighted fit index',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {s.label}
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
              {s.icon}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {s.value}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              {s.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
