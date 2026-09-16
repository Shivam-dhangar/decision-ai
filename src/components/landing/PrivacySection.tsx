'use client';

import React from 'react';
import { ShieldCheck, HardDrive, EyeOff, Lock, DatabaseZap } from 'lucide-react';

export function PrivacySection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 lg:p-12 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Client-Side Local Storage Guarantee</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Your high-stakes decisions remain private.
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                DecisionLens AI does not store your options, financial estimates, personal trade-offs, or scores in any remote database. Everything lives securely inside your local browser storage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <HardDrive className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero Cloud DB</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <EyeOff className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>No Tracking Pixels</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Lock className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Export JSON / PDF</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-center space-y-2 lg:min-w-[240px]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Persistence Layer
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                LocalStorage
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mx-auto">
                Export, backup, or clear your decision models anytime from settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
