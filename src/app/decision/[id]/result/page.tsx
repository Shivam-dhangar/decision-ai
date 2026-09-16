'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Decision, FinalDecisionRecord, DecisionRisk, DecisionAssumption, MissingInformation, DevilAdvocateChallenge } from '@/types/decision';
import { getDecisionById, saveDecision } from '@/lib/storage/decisionStorage';
import { calculateDecisionResults } from '@/lib/engine/decisionEngine';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { WinnerHeroCard } from '@/components/results/WinnerHeroCard';
import { RadarComparisonChart } from '@/components/results/RadarComparisonChart';
import { ScoreBreakdownChart } from '@/components/results/ScoreBreakdownChart';
import { WhatIfSimulator } from '@/components/results/WhatIfSimulator';
import { SensitivityCard } from '@/components/results/SensitivityCard';
import { RisksSection } from '@/components/results/RisksSection';
import { AssumptionsSection } from '@/components/results/AssumptionsSection';
import { MissingInfoSection } from '@/components/results/MissingInfoSection';
import { DevilAdvocateSection } from '@/components/results/DevilAdvocateSection';
import { AlternativeWinnersSection } from '@/components/results/AlternativeWinnersSection';
import { FinalDecisionModal } from '@/components/results/FinalDecisionModal';
import { ExportReportModal } from '@/components/results/ExportReportModal';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  Scale,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

export default function DecisionResultPage() {
  const params = useParams();
  const router = useRouter();
  const decisionId = params.id as string;
  const { toast } = useToast();

  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isFinalDecisionModalOpen, setIsFinalDecisionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load decision
  useEffect(() => {
    if (!decisionId) return;
    const found = getDecisionById(decisionId);
    if (found) {
      // Ensure results are calculated
      if (!found.results && found.options.length && found.criteria.length) {
        found.results = calculateDecisionResults(found.options, found.criteria, found.scores) || undefined;
      }
      setDecision(found);
    }
    setIsLoaded(true);
  }, [decisionId]);

  // Update assumptions
  const handleUpdateAssumptions = (newAssumptions: DecisionAssumption[]) => {
    if (!decision) return;
    const updated: Decision = {
      ...decision,
      analysis: {
        ...decision.analysis!,
        assumptions: newAssumptions,
      },
    };
    setDecision(updated);
    saveDecision(updated);
    toast('Assumptions updated', { type: 'success' });
  };

  // Update missing info
  const handleUpdateMissingInfo = (newMissingInfo: MissingInformation[]) => {
    if (!decision) return;
    const updated: Decision = {
      ...decision,
      analysis: {
        ...decision.analysis!,
        missingInformation: newMissingInfo,
      },
    };
    setDecision(updated);
    saveDecision(updated);
    toast('Information gaps updated', { type: 'success' });
  };

  // Update devil's advocate challenge
  const handleUpdateChallenge = (newChallenge: DevilAdvocateChallenge) => {
    if (!decision) return;
    const updated: Decision = {
      ...decision,
      analysis: {
        ...decision.analysis!,
        challenge: newChallenge,
      },
    };
    setDecision(updated);
    saveDecision(updated);
  };

  // Save final commitment
  const handleSaveFinalDecision = (record: FinalDecisionRecord) => {
    if (!decision) return;
    const updated: Decision = {
      ...decision,
      finalDecision: record,
      status: 'completed',
    };
    setDecision(updated);
    saveDecision(updated);
    toast('Congratulations! Decision choice committed.', { type: 'success' });
  };

  return (
    <AuthGuard>
      {!isLoaded ? (
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-6">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-80 bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse" />
        </div>
      ) : !decision || !decision.results ? (
        <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Decision Analysis Incomplete
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            This decision does not have enough options or criteria configured yet.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link href={`/decision/${decisionId}`}>
              <Button variant="primary" size="sm">
                Open Decision Wizard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12 space-y-10">
          {/* Top Action & Navigation Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {decision.title}
              </h1>
              {decision.goal && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Goal:</span> {decision.goal}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link href={`/decision/${decision.id}`}>
                <Button variant="outline" size="sm" leftIcon={<Sliders className="w-3.5 h-3.5" />}>
                  Edit Parameters
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
                leftIcon={<FileText className="w-3.5 h-3.5" />}
              >
                Export Report
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsFinalDecisionModalOpen(true)}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                {decision.finalDecision ? 'Update Decision Record' : 'Commit Final Decision'}
              </Button>
            </div>
          </div>

          {/* 1. Winner Hero Card */}
          <WinnerHeroCard
            decision={decision}
            winner={decision.results.ranking[0]}
            allRankings={decision.results.ranking}
            onOpenFinalDecision={() => setIsFinalDecisionModalOpen(true)}
          />

          {/* 2. Why Winner Wins AI Explanation */}
          {decision.analysis?.whyWinnerWins && (
            <div className="p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  Explainable Decision Logic &bull; Why It Wins
                </span>
                <SourceBadge source="AI_SUGGESTED" size="xs" />
              </div>

              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {decision.analysis.whyWinnerWins}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-mono font-semibold">Supporting priority drivers:</span>
                {decision.results.ranking[0].strongestCriteria?.map((sc) => (
                  <span
                    key={sc}
                    className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200 font-semibold"
                  >
                    {sc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. Trade-Offs & Sacrifices */}
          {decision.analysis?.tradeoffs && decision.analysis.tradeoffs.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Comparative Analysis
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Option Trade-Offs & Strategic Sacrifices
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every choice has trade-offs. Understand what you are giving up before finalizing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {decision.analysis.tradeoffs.map((t, idx) => (
                  <div
                    key={t.optionName + idx}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {t.optionName}
                      </h4>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Core Strengths
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          {t.strengths?.slice(0, 3).map((st, i) => (
                            <li key={i}>• {st}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" /> Trade-offs & Limitations
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          {t.tradeoffs?.slice(0, 2).map((to, i) => (
                            <li key={i}>• {to}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {t.keySacrifice && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-amber-600 dark:text-amber-400">Key Sacrifice:</span>{' '}
                        {t.keySacrifice}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Recharts Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <RadarComparisonChart
                options={decision.options}
                criteria={decision.criteria}
                scores={decision.scores}
              />
            </div>
            <div className="lg:col-span-6">
              <ScoreBreakdownChart rankings={decision.results.ranking} />
            </div>
          </div>

          {/* 5. What-If Simulator */}
          <WhatIfSimulator
            decisionTitle={decision.title}
            options={decision.options}
            criteria={decision.criteria}
            scores={decision.scores}
            originalRanking={decision.results.ranking}
          />

          {/* 6. Sensitivity & Robustness Analysis */}
          <SensitivityCard
            stabilityIndex={decision.results.stabilityIndex}
            sensitivityItems={decision.results.sensitivity}
          />

          {/* 7. Categorical Champions & Alternative Winners */}
          <AlternativeWinnersSection analysis={decision.analysis} options={decision.options} />

          {/* 8. Risk Analysis */}
          {decision.analysis?.risks && <RisksSection risks={decision.analysis.risks} />}

          {/* 9. Devil's Advocate / Challenge My Decision */}
          <DevilAdvocateSection
            decisionTitle={decision.title}
            decisionGoal={decision.goal}
            currentLeader={decision.results.ranking[0].optionName}
            rankingSummary={decision.results.ranking.map((r) => ({ name: r.optionName, score: r.finalScore }))}
            criteriaWeights={decision.criteria.reduce((acc, c) => ({ ...acc, [c.name]: c.weight }), {})}
            challenge={decision.analysis?.challenge}
            onUpdateChallenge={handleUpdateChallenge}
          />

          {/* 10. Assumptions & Missing Information */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <AssumptionsSection
                assumptions={decision.analysis?.assumptions || []}
                onUpdateAssumptions={handleUpdateAssumptions}
              />
            </div>
            <div className="lg:col-span-6">
              <MissingInfoSection
                missingInfo={decision.analysis?.missingInformation || []}
                onUpdateMissingInfo={handleUpdateMissingInfo}
              />
            </div>
          </div>

          {/* Final Decision Committed Banner */}
          {decision.finalDecision && (
            <div className="p-6 rounded-3xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Decision Outcome Committed
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {decision.finalDecision.selectedOptionName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl">
                    &ldquo;{decision.finalDecision.reason}&rdquo;
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFinalDecisionModalOpen(true)}
              >
                Edit Rationale
              </Button>
            </div>
          )}

          {/* Commit Decision Modal */}
          <FinalDecisionModal
            isOpen={isFinalDecisionModalOpen}
            onClose={() => setIsFinalDecisionModalOpen(false)}
            options={decision.options}
            defaultWinnerId={decision.results.ranking[0].optionId}
            existingFinalDecision={decision.finalDecision}
            onSaveFinalDecision={handleSaveFinalDecision}
          />

          {/* Export Report Modal */}
          <ExportReportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            decision={decision}
          />
        </div>
      )}
    </AuthGuard>
  );
}
