'use client';

import React from 'react';
import { DecisionCategory } from '@/types/decision';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Step1DefineProps {
  title: string;
  onTitleChange: (val: string) => void;
  goal: string;
  onGoalChange: (val: string) => void;
  category: DecisionCategory;
  onCategoryChange: (val: DecisionCategory) => void;
  onNext: () => void;
  isAnalyzingAI: boolean;
}

const CATEGORIES: DecisionCategory[] = [
  'Career',
  'Technology',
  'Business',
  'Finance',
  'Education',
  'Purchasing',
  'Travel',
  'Housing',
  'Projects',
  'Other',
];

const EXAMPLE_DECISIONS = [
  {
    title: 'Which laptop should I buy for full-stack development?',
    goal: 'I want a reliable laptop under ₹1,50,000 that can handle Docker, multiple IDEs, and heavy development workflows for 4+ years.',
    category: 'Technology' as DecisionCategory,
  },
  {
    title: 'Should I join an early-stage AI startup or accept an enterprise tech offer?',
    goal: 'I want to maximize career trajectory and equity upside while maintaining manageable burn out.',
    category: 'Career' as DecisionCategory,
  },
  {
    title: 'Which 2BHK apartment should I rent in Bengaluru / Gurgaon?',
    goal: 'I want to balance monthly rent under ₹50,000 against a commute time under 30 minutes with 24/7 power backup.',
    category: 'Housing' as DecisionCategory,
  },
];

export function Step1Define({
  title,
  onTitleChange,
  goal,
  onGoalChange,
  category,
  onCategoryChange,
  onNext,
  isAnalyzingAI,
}: Step1DefineProps) {
  const canProceed = title.trim().length >= 5;

  const handleApplyExample = (ex: (typeof EXAMPLE_DECISIONS)[0]) => {
    onTitleChange(ex.title);
    onGoalChange(ex.goal);
    onCategoryChange(ex.category);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <span>Step 1 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          What decision are you trying to make?
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          State your question clearly. DecisionLens will help you dissect the trade-offs and structure what matters most.
        </p>
      </div>

      <div className="space-y-6">
        {/* Decision Question Input */}
        <div className="space-y-2">
          <label
            htmlFor="decision-title"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Decision Title / Question <span className="text-rose-500">*</span>
          </label>
          <input
            id="decision-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Which laptop should I buy for full-stack development?"
            className="w-full text-base sm:text-lg font-medium p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
          {title.trim().length > 0 && title.trim().length < 5 && (
            <p className="text-xs text-rose-500">Please enter at least 5 characters.</p>
          )}
        </div>

        {/* Goal / Desired Outcome */}
        <div className="space-y-2">
          <label
            htmlFor="decision-goal"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Desired Outcome & Key Constraints (Optional)
          </label>
          <textarea
            id="decision-goal"
            rows={3}
            value={goal}
            onChange={(e) => onGoalChange(e.target.value)}
            placeholder="e.g. I want a reliable device under ₹1,50,000 that will last at least 4 years with 16h battery."
            className="w-full text-sm p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm resize-y"
          />
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Decision Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors',
                  category === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Inspiration Examples */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Or try one of these realistic templates:</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {EXAMPLE_DECISIONS.map((ex) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => handleApplyExample(ex)}
                className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:border-brand-300 dark:hover:border-brand-800 transition-colors group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 block">
                  {ex.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {ex.goal}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!canProceed}
          isLoading={isAnalyzingAI}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={onNext}
        >
          {isAnalyzingAI ? 'AI Understanding Decision...' : 'Continue with AI Assistance'}
        </Button>
      </div>
    </div>
  );
}
