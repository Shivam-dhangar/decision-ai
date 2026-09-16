'use client';

import React, { useState } from 'react';
import { DecisionOption } from '@/types/decision';
import { AnalyzeOptionResponse } from '@/types/ai';
import { Button } from '@/components/ui/Button';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { OptionAIAnalysisModal } from './OptionAIAnalysisModal';
import { formatCurrency } from '@/lib/utils/formatters';
import { useToast } from '@/context/ToastContext';
import {
  Plus,
  Trash2,
  Copy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';

interface Step2OptionsProps {
  decisionTitle: string;
  decisionGoal?: string;
  options: DecisionOption[];
  onOptionsChange: (options: DecisionOption[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Options({
  decisionTitle,
  decisionGoal,
  options,
  onOptionsChange,
  onNext,
  onBack,
}: Step2OptionsProps) {
  const { toast } = useToast();
  const [analyzingOptionId, setAnalyzingOptionId] = useState<string | null>(null);
  const [activeAnalysisModal, setActiveAnalysisModal] = useState<{
    optionName: string;
    analysis: AnalyzeOptionResponse;
    optionId: string;
  } | null>(null);

  // Add new option
  const handleAddOption = () => {
    if (options.length >= 10) {
      toast('Maximum 10 options allowed in V1', { type: 'warning' });
      return;
    }
    const newId = `opt-${Date.now().toString(36)}`;
    const newOpt: DecisionOption = {
      id: newId,
      name: '',
      description: '',
      price: undefined,
      source: 'USER_PROVIDED',
    };
    onOptionsChange([...options, newOpt]);
  };

  // Update option
  const handleUpdateOption = (id: string, updates: Partial<DecisionOption>) => {
    const updated = options.map((opt) => {
      if (opt.id === id) {
        return {
          ...opt,
          ...updates,
          source: opt.source === 'AI_SUGGESTED' ? 'USER_EDITED' : opt.source,
        };
      }
      return opt;
    });
    onOptionsChange(updated);
  };

  // Remove option
  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      toast('At least 2 options are required for comparison', { type: 'warning' });
      return;
    }
    onOptionsChange(options.filter((o) => o.id !== id));
  };

  // Duplicate option
  const handleDuplicateOption = (opt: DecisionOption) => {
    if (options.length >= 10) {
      toast('Maximum 10 options allowed', { type: 'warning' });
      return;
    }
    const newId = `opt-${Date.now().toString(36)}`;
    const duplicated: DecisionOption = {
      ...opt,
      id: newId,
      name: `${opt.name} (Copy)`,
      source: 'USER_PROVIDED',
    };
    onOptionsChange([...options, duplicated]);
  };

  // AI Option Analysis
  const handleAnalyzeOption = async (opt: DecisionOption) => {
    if (!opt.name.trim()) {
      toast('Please enter an option name first', { type: 'warning' });
      return;
    }

    setAnalyzingOptionId(opt.id);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze_option',
          decisionTitle,
          decisionGoal,
          optionName: opt.name,
          optionDescription: opt.description,
          price: opt.price,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setActiveAnalysisModal({
          optionName: opt.name,
          analysis: json.data,
          optionId: opt.id,
        });
      } else {
        toast('Unable to analyze option. Please verify details.', { type: 'error' });
      }
    } catch (e) {
      toast('AI service error. Please try again.', { type: 'error' });
    } finally {
      setAnalyzingOptionId(null);
    }
  };

  // Attach analysis
  const handleApplyAnalysis = (analysis: AnalyzeOptionResponse) => {
    if (!activeAnalysisModal) return;
    const { optionId } = activeAnalysisModal;
    handleUpdateOption(optionId, {
      strengths: analysis.pros,
      weaknesses: analysis.cons,
      aiAnalysis: {
        summary: analysis.summary,
        pros: analysis.pros,
        cons: analysis.cons,
        risks: analysis.risks,
        source: 'AI_SUGGESTED',
      },
    });
    toast(`AI analysis attached to ${activeAnalysisModal.optionName}`, { type: 'success' });
  };

  // Validate duplicate names
  const names = options.map((o) => o.name.trim().toLowerCase()).filter(Boolean);
  const hasDuplicates = new Set(names).size !== names.length;
  const validOptionCount = options.filter((o) => o.name.trim().length > 0).length;
  const canProceed = validOptionCount >= 2 && !hasDuplicates;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <span>Step 2 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Add the options you are comparing.
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Provide at least 2 candidates (up to 10). Add prices in INR (₹) or let AI suggest key trade-offs.
        </p>
      </div>

      {hasDuplicates && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>Option names must be unique. Please rename duplicate options.</span>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-4">
        {options.map((opt, index) => (
          <div
            key={opt.id}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 font-mono text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <SourceBadge source={opt.source} size="xs" />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="subtle"
                  size="sm"
                  isLoading={analyzingOptionId === opt.id}
                  disabled={!opt.name.trim()}
                  onClick={() => handleAnalyzeOption(opt)}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
                >
                  Analyze with AI
                </Button>

                <button
                  type="button"
                  onClick={() => handleDuplicateOption(opt)}
                  title="Duplicate Option"
                  aria-label="Duplicate Option"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  disabled={options.length <= 2}
                  title="Remove Option"
                  aria-label="Remove Option"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:hover:text-slate-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Option Name */}
              <div className="sm:col-span-8">
                <input
                  type="text"
                  value={opt.name}
                  onChange={(e) => handleUpdateOption(opt.id, { name: e.target.value })}
                  placeholder={`Option ${index + 1} Name (e.g. MacBook Air M4)`}
                  className="w-full h-10 px-3 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Price in INR */}
              <div className="sm:col-span-4 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono font-bold">
                  ₹
                </div>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={opt.price ?? ''}
                  onChange={(e) =>
                    handleUpdateOption(opt.id, {
                      price: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="Price in ₹ (INR)"
                  className="w-full h-10 pl-7 pr-3 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-12">
                <input
                  type="text"
                  value={opt.description || ''}
                  onChange={(e) => handleUpdateOption(opt.id, { description: e.target.value })}
                  placeholder="Short description, specs, or highlights (optional)"
                  className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* AI Strengths/Weaknesses Pill Preview */}
            {opt.aiAnalysis && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs space-y-1.5">
                <p className="text-slate-600 dark:text-slate-400 italic font-medium">
                  &ldquo;{opt.aiAnalysis.summary}&rdquo;
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opt.aiAnalysis.pros.slice(0, 2).map((pro, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px]"
                    >
                      + {pro}
                    </span>
                  ))}
                  {opt.aiAnalysis.cons.slice(0, 1).map((con, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px]"
                    >
                      - {con}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      {options.length < 10 && (
        <button
          type="button"
          onClick={handleAddOption}
          className="w-full py-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-700 bg-slate-50/50 dark:bg-slate-900/30 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Option ({options.length}/10)</span>
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
          Next: Set Criteria
        </Button>
      </div>

      {/* AI Analysis Inspection Modal */}
      {activeAnalysisModal && (
        <OptionAIAnalysisModal
          isOpen={Boolean(activeAnalysisModal)}
          onClose={() => setActiveAnalysisModal(null)}
          optionName={activeAnalysisModal.optionName}
          analysis={activeAnalysisModal.analysis}
          onApplyAnalysis={handleApplyAnalysis}
        />
      )}
    </div>
  );
}
