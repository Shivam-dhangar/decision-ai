'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { DecisionOption, DecisionCriterion, ScoreMatrix } from '@/types/decision';

interface RadarComparisonChartProps {
  options: DecisionOption[];
  criteria: DecisionCriterion[];
  scores: ScoreMatrix;
}

const COLORS = [
  '#6366f1', // brand indigo
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
];

export function RadarComparisonChart({
  options,
  criteria,
  scores,
}: RadarComparisonChartProps) {
  // Format data for Recharts Radar
  const data = criteria.map((crit) => {
    const entry: Record<string, any> = {
      criterion: crit.name,
      fullMark: 10,
    };

    options.slice(0, 4).forEach((opt) => {
      const cell = scores[opt.id]?.[crit.id];
      entry[opt.name] = cell?.score ?? 5;
    });

    return entry;
  });

  return (
    <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Multi-Dimensional Radar Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparing raw performance scores (1–10 scale) across all evaluated dimensions.
          </p>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
            <PolarAngleAxis
              dataKey="criterion"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />

            {options.slice(0, 4).map((opt, index) => (
              <Radar
                key={opt.id}
                name={opt.name}
                dataKey={opt.name}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}

            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '10px',
                fontSize: '12px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
