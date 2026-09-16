import React from 'react';
import { Sparkles, Calculator, UserCheck, Check } from 'lucide-react';

export function EngineVsAISection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            System Philosophy & Boundaries
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Deterministic Math + Generative Intelligence.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We never allow an LLM to hallucinate your final numerical rankings. Here is how responsibilities are cleanly divided.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* AI Role */}
          <div className="p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Qualitative Reasoning
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  AI Intelligence
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Interprets natural language, suggests overlooked criteria, identifies hidden risks, detects unstated assumptions, and challenges blind spots.
              </p>

              <ul className="space-y-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500 shrink-0" /> Natural language goal parsing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500 shrink-0" /> Criteria & Option suggestions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500 shrink-0" /> Risk & Blind spot identification
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500 shrink-0" /> Devil’s advocate challenge
                </li>
              </ul>
            </div>
            <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold pt-4 border-t border-indigo-200/60 dark:border-indigo-900/60">
              &rarr; AI Helps You Think
            </div>
          </div>

          {/* Decision Engine Role */}
          <div className="p-6 sm:p-8 rounded-3xl border border-brand-300 dark:border-brand-800 bg-white dark:bg-slate-900 shadow-lg ring-1 ring-brand-500/10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-600/20">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  100% Deterministic Engine
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Computation Core
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates weighted criteria, normalizes score matrix distributions, computes mathematical rankings, and tests sensitivity thresholds in real time.
              </p>

              <ul className="space-y-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-500 shrink-0" /> Weighted linear summation (0-100)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-500 shrink-0" /> Exact criteria contribution points
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-500 shrink-0" /> Instant local What-If recalculations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-500 shrink-0" /> Mathematical Decision Stability Index
                </li>
              </ul>
            </div>
            <div className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold pt-4 border-t border-slate-100 dark:border-slate-800">
              &rarr; DecisionLens Helps You See
            </div>
          </div>

          {/* User Role */}
          <div className="p-6 sm:p-8 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Human In The Loop
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Your Judgment
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                You set your priorities, validate or edit any AI suggestions, adjust weightings to reflect your true values, and commit to the final decision.
              </p>

              <ul className="space-y-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Full manual override at all steps
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom priority weight control
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Assumption validation & notes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Final commitment record
                </li>
              </ul>
            </div>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold pt-4 border-t border-emerald-200/60 dark:border-emerald-900/60">
              &rarr; You Make The Decision
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
