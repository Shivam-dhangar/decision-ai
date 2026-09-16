'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Decision,
  DecisionCategory,
  DecisionOption,
  DecisionCriterion,
  ScoreMatrix,
  DecisionAnalysis,
} from '@/types/decision';
import { UnderstandDecisionResponse, GenerateInsightsResponse } from '@/types/ai';
import { Step1Define } from './Step1Define';
import { AIUnderstandingModal } from './AIUnderstandingModal';
import { Step2Options } from './Step2Options';
import { Step3Criteria } from './Step3Criteria';
import { Step4Priorities } from './Step4Priorities';
import { Step5EvaluateMatrix } from './Step5EvaluateMatrix';
import { calculateDecisionResults } from '@/lib/engine/decisionEngine';
import { saveDecision } from '@/lib/storage/decisionStorage';
import { useToast } from '@/context/ToastContext';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const STEPS = [
  { id: 1, label: 'Define' },
  { id: 2, label: 'Options' },
  { id: 3, label: 'Criteria' },
  { id: 4, label: 'Priorities' },
  { id: 5, label: 'Evaluate' },
];

export function DecisionWizard({ initialDecision }: { initialDecision?: Decision }) {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [id] = useState(initialDecision?.id || `dec-${Date.now().toString(36)}`);
  const [title, setTitle] = useState(initialDecision?.title || '');
  const [goal, setGoal] = useState(initialDecision?.goal || '');
  const [category, setCategory] = useState<DecisionCategory>(
    initialDecision?.category || 'Technology'
  );

  const [options, setOptions] = useState<DecisionOption[]>(
    initialDecision?.options || [
      { id: 'opt-1', name: '', description: '', source: 'USER_PROVIDED' },
      { id: 'opt-2', name: '', description: '', source: 'USER_PROVIDED' },
    ]
  );

  const [criteria, setCriteria] = useState<DecisionCriterion[]>(
    initialDecision?.criteria || [
      { id: 'crit-1', name: '', description: '', weight: 8, source: 'USER_PROVIDED' },
    ]
  );

  const [scores, setScores] = useState<ScoreMatrix>(initialDecision?.scores || {});

  // AI Understanding states
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [understandingResult, setUnderstandingResult] = useState<UnderstandDecisionResponse | null>(null);
  const [showUnderstandingModal, setShowUnderstandingModal] = useState(false);

  // Final analysis state
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Trigger Step 1 AI Understanding
  const handleStep1Next = async () => {
    setIsAnalyzingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'understand_decision',
          title,
          goal,
          category,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setUnderstandingResult(json.data);
        setShowUnderstandingModal(true);
      } else {
        // Fallback proceed directly to step 2
        setCurrentStep(2);
      }
    } catch (err) {
      setCurrentStep(2);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Accept AI understanding and seed criteria/options
  const handleAcceptAIUnderstanding = () => {
    if (understandingResult) {
      if (understandingResult.suggestedCriteria?.length > 0) {
        const seededCriteria: DecisionCriterion[] = understandingResult.suggestedCriteria.map((c, i) => ({
          id: `crit-${i + 1}`,
          name: c.name,
          description: c.description,
          weight: c.suggestedWeight || 7,
          source: 'AI_SUGGESTED',
          category: c.category,
        }));
        setCriteria(seededCriteria);
      }

      if (understandingResult.suggestedOptions && understandingResult.suggestedOptions.length >= 2) {
        const seededOptions: DecisionOption[] = understandingResult.suggestedOptions.map((opt, i) => ({
          id: `opt-${i + 1}`,
          name: opt.name,
          description: opt.description,
          price: opt.estimatedPrice,
          source: 'AI_SUGGESTED',
        }));
        setOptions(seededOptions);
      }
    }

    setShowUnderstandingModal(false);
    setCurrentStep(2);
  };

  // Final Step 5 Finish: Calculate deterministic results and generate AI insights
  const handleStep5Finish = async () => {
    setIsGeneratingInsights(true);

    try {
      // 1. Deterministic Engine Calculation
      const calculationResults = calculateDecisionResults(options, criteria, scores);
      if (!calculationResults) {
        toast('Unable to calculate results. Please check your options and criteria.', { type: 'error' });
        setIsGeneratingInsights(false);
        return;
      }

      // 2. AI Qualitative Analysis Call
      let analysisData: DecisionAnalysis | undefined = undefined;

      try {
        const optionsWithScores = options.map((opt) => {
          const optScores: Record<string, number> = {};
          criteria.forEach((c) => {
            optScores[c.name] = scores[opt.id]?.[c.id]?.score ?? 5;
          });
          return {
            id: opt.id,
            name: opt.name,
            price: opt.price,
            scores: optScores,
          };
        });

        const criteriaWeights: Record<string, number> = {};
        criteria.forEach((c) => {
          criteriaWeights[c.name] = c.weight;
        });

        const rankingSummary = calculationResults.ranking.map((r) => ({
          name: r.optionName,
          score: r.finalScore,
          rank: r.rank,
        }));

        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_decision_insights',
            decisionTitle: title,
            decisionGoal: goal,
            winnerName: calculationResults.winnerName,
            rankingSummary,
            criteriaWeights,
            optionsWithScores,
          }),
        });

        const json = await res.json();
        if (json.success && json.data) {
          const d: GenerateInsightsResponse = json.data;
          analysisData = {
            summary: d.summary,
            whyWinnerWins: d.whyWinnerWins,
            tradeoffs: d.tradeoffs.map((t, idx) => ({
              optionId: options[idx]?.id || `opt-${idx}`,
              optionName: t.optionName,
              strengths: t.strengths,
              tradeoffs: t.tradeoffs,
              keySacrifice: t.keySacrifice,
            })),
            risks: d.risks.map((r, idx) => ({
              id: `risk-${idx + 1}`,
              level: r.level,
              title: r.title,
              description: r.description,
              affectedOptionName: r.affectedOptionName,
              potentialImpact: r.potentialImpact,
              source: 'AI_SUGGESTED',
            })),
            assumptions: d.assumptions.map((a, idx) => ({
              id: `asm-${idx + 1}`,
              text: a.text,
              confirmed: true,
              source: 'AI_SUGGESTED',
              importance: a.importance,
            })),
            missingInformation: d.missingInformation.map((m, idx) => ({
              id: `miss-${idx + 1}`,
              topic: m.topic,
              whyItMatters: m.whyItMatters,
              suggestedAction: m.suggestedAction,
              resolved: false,
            })),
            stabilityIndex: calculationResults.stabilityIndex,
            stabilityExplanation: `Your current winner (${calculationResults.winnerName}) leads with a Decision Stability Index of ${calculationResults.stabilityIndex}%.`,
            alternativeWinners: {
              bestOverall: d.alternativeWinners?.bestOverall
                ? {
                    optionId: calculationResults.winnerId,
                    optionName: d.alternativeWinners.bestOverall.optionName,
                    reason: d.alternativeWinners.bestOverall.reason,
                  }
                : undefined,
              bestValue: d.alternativeWinners?.bestValue
                ? {
                    optionId: calculationResults.ranking[1]?.optionId || calculationResults.winnerId,
                    optionName: d.alternativeWinners.bestValue.optionName,
                    reason: d.alternativeWinners.bestValue.reason,
                  }
                : undefined,
            },
            generatedAt: new Date().toISOString(),
          };
        }
      } catch (aiErr) {
        console.warn('AI insights error, saving deterministic results:', aiErr);
      }

      // 3. Save complete decision to LocalStorage
      const newDecision: Decision = {
        id,
        title,
        goal,
        category,
        createdAt: initialDecision?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'completed',
        options,
        criteria,
        scores,
        results: calculationResults,
        analysis: analysisData,
        version: 1,
      };

      saveDecision(newDecision);
      toast('Decision calculated and saved locally!', { type: 'success' });

      // 4. Navigate to Result Page
      router.push(`/decision/${id}/result`);
    } catch (err: any) {
      toast('Error saving decision: ' + (err.message || 'Unknown error'), { type: 'error' });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Progress Steps Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 w-full -z-10" />

          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center bg-white dark:bg-slate-950 px-2">
                <button
                  type="button"
                  onClick={() => {
                    if (step.id < currentStep) setCurrentStep(step.id);
                  }}
                  disabled={step.id > currentStep}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all',
                    isCompleted
                      ? 'bg-brand-600 text-white cursor-pointer'
                      : isCurrent
                      ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </button>
                <span
                  className={cn(
                    'text-[11px] font-semibold mt-1 hidden sm:block',
                    isCurrent
                      ? 'text-slate-900 dark:text-slate-100 font-bold'
                      : 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Renderers */}
      {currentStep === 1 && (
        <Step1Define
          title={title}
          onTitleChange={setTitle}
          goal={goal}
          onGoalChange={setGoal}
          category={category}
          onCategoryChange={setCategory}
          onNext={handleStep1Next}
          isAnalyzingAI={isAnalyzingAI}
        />
      )}

      {currentStep === 2 && (
        <Step2Options
          decisionTitle={title}
          decisionGoal={goal}
          options={options}
          onOptionsChange={setOptions}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3Criteria
          decisionTitle={title}
          decisionGoal={goal}
          category={category}
          criteria={criteria}
          onCriteriaChange={setCriteria}
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <Step4Priorities
          criteria={criteria}
          onCriteriaChange={setCriteria}
          onNext={() => setCurrentStep(5)}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <Step5EvaluateMatrix
          decisionTitle={title}
          decisionGoal={goal}
          options={options}
          criteria={criteria}
          scores={scores}
          onScoresChange={setScores}
          onNext={handleStep5Finish}
          onBack={() => setCurrentStep(4)}
          isGeneratingInsights={isGeneratingInsights}
        />
      )}

      {/* AI Understanding Confirmation Modal */}
      <AIUnderstandingModal
        isOpen={showUnderstandingModal}
        onClose={() => setShowUnderstandingModal(false)}
        understanding={understandingResult}
        onAccept={handleAcceptAIUnderstanding}
        onRegenerate={handleStep1Next}
        isRegenerating={isAnalyzingAI}
      />
    </div>
  );
}
