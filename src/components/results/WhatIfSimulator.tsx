'use client';

import React, { useState } from 'react';
import {
  DecisionOption,
  DecisionCriterion,
  ScoreMatrix,
  OptionResult,
} from '@/types/decision';
import { ExplainWhatIfResponse } from '@/types/ai';
import { recalculateWhatIf } from '@/lib/engine/decisionEngine';
import { Button } from '@/components/ui/Button';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { useToast } from '@/context/ToastContext';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface WhatIfSimulatorProps {
  decisionTitle: string;
  options: DecisionOption[];
  criteria: DecisionCriterion[];
  scores: ScoreMatrix;
  originalRanking: OptionResult[];
}

export function WhatIfSimulator({
  decisionTitle,
  options,
  criteria,
  scores,
  originalRanking,
}: WhatIfSimulatorProps) {
  const { toast } = useToast();

  // Simulated weights map
  const [simulatedWeights, setSimulatedWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    criteria.forEach((c) => {
      initial[c.id] = c.weight;
    });
    return initial;
  });

  const [aiExplanation, setAiExplanation] = useState<ExplainWhatIfResponse | null>(null);
  const [isExplainingAI, setIsExplainingAI] = useState(false);

  // Compute live recalculated rankings
  const { ranking: currentSimulatedRanking, winner: simulatedWinner } =
    recalculateWhatIf(options, criteria, scores, simulatedWeights);

  const originalWinner = originalRanking[0];
  const hasRankingFlipped = simulatedWinner.optionId !== originalWinner.optionId;

  // Handle slider weight adjustment
  const handleWeightChange = (criterionId: string, newWeight: number) => {
    setSimulatedWeights((prev) => ({
      ...prev,
      [criterionId]: newWeight,
    }));
    setAiExplanation(null); // Clear previous AI explanation when weights change
  };

  // Reset to original
  const handleReset = () => {
    const resetMap: Record<string, number> = {};
    criteria.forEach((c) => {
      resetMap[c.id] = c.weight;
    });
    setSimulatedWeights(resetMap);
    setAiExplanation(null);
    toast('Weights reset to original decision baseline', { type: 'info' });
  };

  // Call AI to explain why the ranking shifted
  const handleExplainChange = async () => {
    setIsExplainingAI(true);

    const changedCriteria = criteria
      .filter((c) => simulatedWeights[c.id] !== c.weight)
      .map((c) => ({
        criterionName: c.name,
        oldWeight: c.weight,
        newWeight: simulatedWeights[c.id],
      }));

    if (changedCriteria.length === 0) {
      toast('Adjust one or more sliders to test a scenario first.', { type: 'info' });
      setIsExplainingAI(false);
      return;
    }

    const prevScores: Record<string, number> = {};
    originalRanking.forEach((r) => {
      prevScores[r.optionName] = r.finalScore;
    });

    const newScores: Record<string, number> = {};
    currentSimulatedRanking.forEach((r) => {
      newScores[r.optionName] = r.finalScore;
    });

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain_what_if',
          decisionTitle,
          previousWinner: originalWinner.optionName,
          previousScores: prevScores,
          newWinner: simulatedWinner.optionName,
          newScores,
          changedCriteria,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiExplanation(json.data);
      }
    } catch (err) {
      toast('Failed to get AI explanation', { type: 'error' });
    } finally {
      setIsExplainingAI(false);
    }
  };

  const hasChanges = criteria.some((c) => simulatedWeights[c.id] !== c.weight);

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-mono text-xs font-bold uppercase tracking-wider">
              Dynamic Sensitivity
            </span>
            <SourceBadge source="CALCULATED" size="xs" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            What-If Scenario Simulator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust criteria priorities in real time to see which factors cause the winning option to flip.
          </p>
        </div>

        {hasChanges && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Weights
          </Button>
        )}
      </div>

      {/* Main Grid: Sliders on Left, Live Outcome Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Column */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Simulate Priority Weights (1–10)
          </span>

          {criteria.map((crit) => {
            const currentW = simulatedWeights[crit.id] ?? crit.weight;
            const isChanged = currentW !== crit.weight;

            return (
              <div
                key={crit.id}
                className={cn(
                  'p-3.5 rounded-xl border transition-all',
                  isChanged
                    ? 'border-brand-400 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                )}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-800 dark:text-slate-200">
                    {crit.name}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    {isChanged && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {crit.weight}
                      </span>
                    )}
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      {currentW} / 10
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={currentW}
                  onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                  aria-label={`Simulated weight for ${crit.name}`}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-brand-600"
                />
              </div>
            );
          })}
        </div>

        {/* Live Comparison Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Ranking Impact
            </span>
            {hasRankingFlipped ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
                ⚡ Winner Flipped!
              </span>
            ) : (
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ Baseline Winner Retained
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {currentSimulatedRanking.map((sim, index) => {
              const orig = originalRanking.find((o) => o.optionId === sim.optionId);
              const scoreDiff = Number((sim.finalScore - (orig?.finalScore || 0)).toFixed(1));
              const isWinner = index === 0;

              return (
                <div
                  key={sim.optionId}
                  className={cn(
                    'p-4 rounded-xl border transition-all flex items-center justify-between',
                    isWinner
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  )}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-5 h-5 rounded font-mono text-xs font-bold flex items-center justify-center',
                          isWinner
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        )}
                      >
                        #{sim.rank}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {sim.optionName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    {scoreDiff !== 0 && (
                      <span
                        className={cn(
                          'text-xs font-mono font-semibold flex items-center gap-0.5',
                          scoreDiff > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        )}
                      >
                        {scoreDiff > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
                      </span>
                    )}

                    <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                      {sim.finalScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Explain Button */}
          {hasChanges && (
            <div className="pt-2">
              <Button
                variant="subtle"
                size="sm"
                className="w-full"
                onClick={handleExplainChange}
                isLoading={isExplainingAI}
                leftIcon={<Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
              >
                Explain Ranking Shift with AI
              </Button>
            </div>
          )}

          {/* AI Explanation Card */}
          {aiExplanation && (
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Shift Explanation
                </span>
                <SourceBadge source="AI_SUGGESTED" size="xs" />
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {aiExplanation.explanation}
              </p>
              {aiExplanation.implication && (
                <p className="text-[11px] text-indigo-950 dark:text-indigo-300 pt-1 border-t border-indigo-200/60 dark:border-indigo-900/40">
                  <span className="font-bold">Key takeaway:</span> {aiExplanation.implication}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
