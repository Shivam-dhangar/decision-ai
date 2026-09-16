'use client';

import React, { useState } from 'react';
import { DevilAdvocateChallenge } from '@/types/decision';
import { ChallengeDecisionResponse } from '@/types/ai';
import { Button } from '@/components/ui/Button';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { useToast } from '@/context/ToastContext';
import {
  Flame,
  Sparkles,
  EyeOff,
  AlertTriangle,
  HelpCircle,
  Compass,
  RefreshCw,
} from 'lucide-react';

interface DevilAdvocateSectionProps {
  decisionTitle: string;
  decisionGoal?: string;
  currentLeader: string;
  rankingSummary: any[];
  criteriaWeights: Record<string, number>;
  challenge?: DevilAdvocateChallenge;
  onUpdateChallenge: (challenge: DevilAdvocateChallenge) => void;
}

export function DevilAdvocateSection({
  decisionTitle,
  decisionGoal,
  currentLeader,
  rankingSummary,
  criteriaWeights,
  challenge,
  onUpdateChallenge,
}: DevilAdvocateSectionProps) {
  const { toast } = useToast();
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleRunChallenge = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'challenge_decision',
          decisionTitle,
          decisionGoal,
          currentLeader,
          rankingSummary,
          criteriaWeights,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d: ChallengeDecisionResponse = json.data;
        const newChallenge: DevilAdvocateChallenge = {
          blindSpots: d.blindSpots,
          counterArgument: d.counterArgument,
          weakAssumptions: d.weakAssumptions,
          challengingQuestions: d.challengingQuestions,
          alternativePerspective: d.alternativePerspective,
        };
        onUpdateChallenge(newChallenge);
        toast("Devil's Advocate challenge generated.", { type: 'success' });
      }
    } catch (e) {
      toast('Failed to generate challenge. Please try again.', { type: 'error' });
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 bg-gradient-to-b from-rose-50/30 via-white to-white dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100 dark:border-rose-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Critical Red Team
            </span>
            <SourceBadge source="AI_SUGGESTED" size="xs" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Challenge My Decision
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Constructive devil&apos;s advocate analysis designed to prevent confirmation bias and reveal blind spots.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRunChallenge}
          isLoading={isLoadingAI}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {challenge ? 'Refresh Challenge' : 'Run Devil’s Advocate'}
        </Button>
      </div>

      {challenge ? (
        <div className="space-y-6">
          {/* Counter Argument Hero Box */}
          <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5 font-mono">
              <Flame className="w-3.5 h-3.5" />
              The Contrarian Case
            </span>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {challenge.counterArgument}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blind Spots */}
            {challenge.blindSpots?.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-amber-500" />
                  Potential Blind Spots
                </span>
                <ul className="space-y-2">
                  {challenge.blindSpots.map((spot, i) => (
                    <li
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      • {spot}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenging Questions */}
            {challenge.challengingQuestions?.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Hard Questions To Ask Yourself
                </span>
                <ul className="space-y-2">
                  {challenge.challengingQuestions.map((q, i) => (
                    <li
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      ❓ {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Alternative Perspective */}
          {challenge.alternativePerspective && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
              <Compass className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Alternative Lens:{' '}
                </span>
                {challenge.alternativePerspective}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Challenge your current leaning to stress-test your decision against counter-arguments and hidden biases.
          </p>
          <Button
            variant="subtle"
            size="sm"
            onClick={handleRunChallenge}
            isLoading={isLoadingAI}
            leftIcon={<Flame className="w-4 h-4 text-rose-500" />}
          >
            Activate Devil&apos;s Advocate
          </Button>
        </div>
      )}
    </div>
  );
}
