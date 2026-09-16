import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TeamSection } from '@/components/team/TeamSection';
import { Compass, Sparkles, Calculator, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="pt-16 pb-12 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Product Manifesto & Vision</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Turn difficult decisions into{' '}
            <span className="text-brand-600 dark:text-brand-400">clear, explainable choices.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            DecisionLens AI was built to solve a modern crisis: information overload combined with opaque AI recommendations. We believe in empowering human agency through transparent mathematics.
          </p>
        </div>
      </section>

      {/* Philosophy Principles */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Core Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Why we never let AI determine final scores.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Generic LLMs are creative, fluent, and capable of qualitative synthesis. However, when asked to rank complex options, language models frequently hallucinate numerical totals, introduce unstated biases, or provide generic platitudes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              1. AI Helps You Think
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Gemini understands natural language, extracts core goals, uncovers hidden risks, suggests overlooked criteria, and acts as a devil’s advocate.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              2. DecisionLens Helps You See
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our deterministic JavaScript engine calculates exact weighted sums, normalizes matrix scores, computes sensitivity flip points, and guarantees mathematical reproducibility.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              3. You Make The Decision
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You assign what matters, challenge assumptions, override any AI score, explore what-if scenarios, and commit to the final choice with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <TeamSection />

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4 pt-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Ready to structure your next high-stakes choice?
        </h2>
        <div className="flex justify-center gap-3">
          <Link href="/decision/new">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create a Decision
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Go to Workspace
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
