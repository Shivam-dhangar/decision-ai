'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AnalyzeOptionResponse } from '@/types/ai';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { Sparkles, Check, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';

interface OptionAIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionName: string;
  analysis: AnalyzeOptionResponse | null;
  onApplyAnalysis: (analysis: AnalyzeOptionResponse) => void;
}

export function OptionAIAnalysisModal({
  isOpen,
  onClose,
  optionName,
  analysis,
  onApplyAnalysis,
}: OptionAIAnalysisModalProps) {
  if (!analysis) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={`AI Analysis: ${optionName}`}
      description="Objective evaluation of strengths, drawbacks, and risks."
    >
      <div className="space-y-5">
        {/* Summary */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overview
            </span>
            <SourceBadge source="AI_SUGGESTED" />
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Pros */}
        {analysis.pros?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Key Strengths</span>
            </div>
            <ul className="space-y-1.5">
              {analysis.pros.map((pro, i) => (
                <li
                  key={i}
                  className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2"
                >
                  <span className="font-bold text-emerald-600">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cons */}
        {analysis.cons?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Realistic Drawbacks</span>
            </div>
            <ul className="space-y-1.5">
              {analysis.cons.map((con, i) => (
                <li
                  key={i}
                  className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-950 dark:text-rose-200 flex items-start gap-2"
                >
                  <span className="font-bold text-rose-600">-</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {analysis.risks?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Potential Risks</span>
            </div>
            <ul className="space-y-1.5">
              {analysis.risks.map((risk, i) => (
                <li
                  key={i}
                  className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2"
                >
                  <span className="font-bold text-amber-600">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Dismiss
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onApplyAnalysis(analysis);
              onClose();
            }}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Attach Analysis to Option
          </Button>
        </div>
      </div>
    </Modal>
  );
}
