'use client';

import React, { useState } from 'react';
import {
  DecisionOption,
  DecisionCriterion,
  ScoreMatrix,
  OptionScore,
} from '@/types/decision';
import { Button } from '@/components/ui/Button';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { calculateNormalizedWeights } from '@/lib/engine/decisionEngine';
import { useToast } from '@/context/ToastContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Info,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Step5EvaluateMatrixProps {
  decisionTitle: string;
  decisionGoal?: string;
  options: DecisionOption[];
  criteria: DecisionCriterion[];
  scores: ScoreMatrix;
  onScoresChange: (scores: ScoreMatrix) => void;
  onNext: () => void;
  onBack: () => void;
  isGeneratingInsights: boolean;
}

export function Step5EvaluateMatrix({
  decisionTitle,
  decisionGoal,
  options,
  criteria,
  scores,
  onScoresChange,
  onNext,
  onBack,
  isGeneratingInsights,
}: Step5EvaluateMatrixProps) {
  const { toast } = useToast();
  const [isScoringAI, setIsScoringAI] = useState(false);
  const [activeScoreNote, setActiveScoreNote] = useState<{
    optionName: string;
    criterionName: string;
    scoreObj: OptionScore;
  } | null>(null);

  const normalizedWeights = calculateNormalizedWeights(criteria);

  // Update a single cell in the matrix
  const handleScoreChange = (
    optionId: string,
    criterionId: string,
    newScore: number,
    isManual: boolean = true
  ) => {
    const existingOpt = scores[optionId] || {};
    const existingCell = existingOpt[criterionId];

    const updatedCell: OptionScore = {
      score: Math.max(1, Math.min(10, newScore)),
      reasoning: existingCell?.reasoning,
      source: isManual
        ? existingCell?.source === 'AI_SUGGESTED'
          ? 'USER_EDITED'
          : 'USER_PROVIDED'
        : 'AI_SUGGESTED',
      isEdited: isManual && existingCell?.source === 'AI_SUGGESTED',
    };

    const newMatrix: ScoreMatrix = {
      ...scores,
      [optionId]: {
        ...existingOpt,
        [criterionId]: updatedCell,
      },
    };

    onScoresChange(newMatrix);
  };

  // AI-Assisted Scoring
  const handleAIScoreAll = async () => {
    setIsScoringAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_scores',
          decisionTitle,
          decisionGoal,
          options: options.map((o) => ({
            id: o.id,
            name: o.name,
            description: o.description,
            price: o.price,
          })),
          criteria: criteria.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            weight: c.weight,
          })),
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.scores) {
        const aiScores: ScoreMatrix = {};
        options.forEach((opt) => {
          aiScores[opt.id] = {};
          criteria.forEach((crit) => {
            const raw = json.data.scores[opt.id]?.[crit.id];
            aiScores[opt.id][crit.id] = {
              score: raw?.score ?? 7,
              reasoning: raw?.reasoning || 'AI estimated score based on specifications.',
              source: 'AI_SUGGESTED',
              confidence: raw?.confidence || 'HIGH',
            };
          });
        });

        onScoresChange(aiScores);
        toast('AI score matrix generated. You can edit any value.', { type: 'success' });
      }
    } catch (err) {
      toast('Failed to generate AI scores. You can score manually.', { type: 'error' });
    } finally {
      setIsScoringAI(false);
    }
  };

  // Compute live column totals
  const columnScores: Record<string, number> = {};
  options.forEach((opt) => {
    let total = 0;
    criteria.forEach((crit) => {
      const cell = scores[opt.id]?.[crit.id];
      const val = cell?.score ?? 5;
      const weightNorm = normalizedWeights[crit.id] || 0;
      total += weightNorm * val * 10;
    });
    columnScores[opt.id] = Number(total.toFixed(1));
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <span>Step 5 of 6</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Evaluate options across criteria.
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Score each candidate from 1 (poor) to 10 (outstanding). You can score manually or use AI to generate reasoned baseline scores.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60">
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
          <span>Need help scoring? AI can analyze specs and provide reasoned 1-10 estimates.</span>
        </div>

        <Button
          variant="subtle"
          size="sm"
          onClick={handleAIScoreAll}
          isLoading={isScoringAI}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Auto-Score Matrix with AI
        </Button>
      </div>

      {/* Decision Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-1/3">
                Criteria (Weight %)
              </th>
              {options.map((opt) => (
                <th
                  key={opt.id}
                  className="p-4 text-xs font-bold text-slate-900 dark:text-slate-100 text-center"
                >
                  <span className="block truncate max-w-[180px] mx-auto">{opt.name}</span>
                  {opt.price !== undefined && (
                    <span className="block text-[11px] font-mono text-slate-400 dark:text-slate-500 font-normal">
                      ₹{opt.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {criteria.map((crit) => {
              const normPct = ((normalizedWeights[crit.id] || 0) * 100).toFixed(0);
              return (
                <tr key={crit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  {/* Criterion Row Header */}
                  <td className="p-4 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {crit.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                        {normPct}%
                      </span>
                    </div>
                    {crit.description && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1">
                        {crit.description}
                      </p>
                    )}
                  </td>

                  {/* Options Cells */}
                  {options.map((opt) => {
                    const cell = scores[opt.id]?.[crit.id];
                    const currentScore = cell?.score ?? 5;

                    return (
                      <td key={opt.id} className="p-3 text-center align-middle">
                        <div className="inline-flex flex-col items-center space-y-1.5">
                          {/* Score Input Selector (1 to 10) */}
                          <div className="flex items-center gap-1.5">
                            <select
                              value={currentScore}
                              onChange={(e) =>
                                handleScoreChange(opt.id, crit.id, Number(e.target.value))
                              }
                              aria-label={`Score for ${opt.name} on ${crit.name}`}
                              className="h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer text-center"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                                <option key={val} value={val}>
                                  {val}
                                </option>
                              ))}
                            </select>

                            {cell?.reasoning && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveScoreNote({
                                    optionName: opt.name,
                                    criterionName: crit.name,
                                    scoreObj: cell,
                                  })
                                }
                                title="View reasoning"
                                aria-label="View reasoning"
                                className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded transition-colors"
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {cell?.source && <SourceBadge source={cell.source} size="xs" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* Matrix Footer: Live Calculated Total Scores */}
          <tfoot>
            <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <td className="p-4 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Deterministic Score Preview</span>
              </td>
              {options.map((opt) => (
                <td key={opt.id} className="p-4 text-center">
                  <span className="text-xl font-extrabold font-mono text-brand-600 dark:text-brand-400">
                    {columnScores[opt.id] ?? 0}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">/ 100</span>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Score Reasoning Inspection Tooltip/Modal */}
      {activeScoreNote && (
        <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Reasoning: {activeScoreNote.optionName} &rarr; {activeScoreNote.criterionName} ({activeScoreNote.scoreObj.score}/10)
            </span>
            <button
              onClick={() => setActiveScoreNote(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            {activeScoreNote.scoreObj.reasoning}
          </p>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Button variant="outline" size="md" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>

        <Button
          variant="primary"
          size="lg"
          isLoading={isGeneratingInsights}
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isGeneratingInsights ? 'Computing Results & Insights...' : 'Analyze & View Results'}
        </Button>
      </div>
    </div>
  );
}
