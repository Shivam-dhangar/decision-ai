'use client';

import React, { useState } from 'react';
import { DecisionCriterion } from '@/types/decision';
import { Button } from '@/components/ui/Button';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { useToast } from '@/context/ToastContext';
import {
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sliders,
} from 'lucide-react';

interface Step3CriteriaProps {
  decisionTitle: string;
  decisionGoal?: string;
  category?: string;
  criteria: DecisionCriterion[];
  onCriteriaChange: (criteria: DecisionCriterion[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Criteria({
  decisionTitle,
  decisionGoal,
  category,
  criteria,
  onCriteriaChange,
  onNext,
  onBack,
}: Step3CriteriaProps) {
  const { toast } = useToast();
  const [isSuggestingAI, setIsSuggestingAI] = useState(false);

  const handleAddCriterion = () => {
    if (criteria.length >= 10) {
      toast('Maximum 10 criteria recommended for clarity', { type: 'warning' });
      return;
    }
    const newId = `crit-${Date.now().toString(36)}`;
    const newCrit: DecisionCriterion = {
      id: newId,
      name: '',
      description: '',
      weight: 7,
      source: 'USER_PROVIDED',
    };
    onCriteriaChange([...criteria, newCrit]);
  };

  const handleUpdateCriterion = (id: string, updates: Partial<DecisionCriterion>) => {
    const updated = criteria.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          ...updates,
          source: c.source === 'AI_SUGGESTED' ? 'USER_EDITED' : c.source,
        };
      }
      return c;
    });
    onCriteriaChange(updated);
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 1) {
      toast('At least one decision criterion is required', { type: 'warning' });
      return;
    }
    onCriteriaChange(criteria.filter((c) => c.id !== id));
  };

  const handleSuggestAICriteria = async () => {
    setIsSuggestingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_criteria_options',
          title: decisionTitle,
          goal: decisionGoal,
          category,
          existingCriteria: criteria.map((c) => c.name),
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.criteria) {
        const existingNames = new Set(criteria.map((c) => c.name.toLowerCase()));
        const newSuggested: DecisionCriterion[] = json.data.criteria
          .filter((c: any) => !existingNames.has(c.name.toLowerCase()))
          .map((c: any) => ({
            id: `crit-${Math.random().toString(36).substring(2, 8)}`,
            name: c.name,
            description: c.description,
            weight: c.suggestedWeight || 7,
            source: 'AI_SUGGESTED' as const,
          }));

        if (newSuggested.length === 0) {
          toast('You already have comprehensive criteria defined!', { type: 'info' });
        } else {
          onCriteriaChange([...criteria, ...newSuggested.slice(0, 4)]);
          toast(`Added ${newSuggested.slice(0, 4).length} suggested criteria`, { type: 'success' });
        }
      }
    } catch (err) {
      toast('Failed to suggest criteria. Please add manually.', { type: 'error' });
    } finally {
      setIsSuggestingAI(false);
    }
  };

  const validCriteriaCount = criteria.filter((c) => c.name.trim().length > 0).length;
  const canProceed = validCriteriaCount >= 1;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <span>Step 3 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          What matters most in this decision?
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Define the evaluation criteria. These are the factors against which your options will be scored.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Criteria List ({criteria.length})
        </span>

        <Button
          variant="subtle"
          size="sm"
          onClick={handleSuggestAICriteria}
          isLoading={isSuggestingAI}
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
        >
          Suggest More with AI
        </Button>
      </div>

      {/* Criteria List */}
      <div className="space-y-3">
        {criteria.map((crit, index) => (
          <div
            key={crit.id}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <SourceBadge source={crit.source} size="xs" />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCriterion(crit.id)}
                disabled={criteria.length <= 1}
                title="Remove Criterion"
                aria-label="Remove Criterion"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:hover:text-slate-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={crit.name}
                onChange={(e) => handleUpdateCriterion(crit.id, { name: e.target.value })}
                placeholder={`Criterion ${index + 1} (e.g. Battery Life & Endurance)`}
                className="w-full h-10 px-3 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <input
                type="text"
                value={crit.description || ''}
                onChange={(e) => handleUpdateCriterion(crit.id, { description: e.target.value })}
                placeholder="Why does this matter? (e.g. Need 16+ hours for travel and remote work)"
                className="w-full h-8 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Criterion Button */}
      {criteria.length < 10 && (
        <button
          type="button"
          onClick={handleAddCriterion}
          className="w-full py-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-700 bg-slate-50/50 dark:bg-slate-900/30 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Criterion</span>
        </button>
      )}

      {/* Navigation Controls */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Button variant="outline" size="md" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>

        <Button
          variant="primary"
          size="lg"
          disabled={!canProceed}
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Next: Set Priorities
        </Button>
      </div>
    </div>
  );
}
