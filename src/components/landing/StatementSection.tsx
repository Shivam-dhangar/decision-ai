import React from 'react';
import { Compass, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

export function StatementSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            From Uncertainty to Clarity
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            &ldquo;Decisions are too important to leave to emotional guesswork or opaque black-box AI claims.&rdquo;
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            DecisionLens AI brings executive-grade multi-criteria decision analysis (MCDA) to your everyday choices. We combine verified deterministic calculations with Gemini AI insights so you always understand why an option ranks highest.
          </p>
        </div>
      </div>
    </section>
  );
}
