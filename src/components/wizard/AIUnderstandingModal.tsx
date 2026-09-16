'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { UnderstandDecisionResponse } from '@/types/ai';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { Sparkles, Check, RefreshCw, Layers, Sliders, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface AIUnderstandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  understanding: UnderstandDecisionResponse | null;
  onAccept: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function AIUnderstandingModal({
  isOpen,
  onClose,
  understanding,
  onAccept,
  onRegenerate,
  isRegenerating,
}: AIUnderstandingModalProps) {
  if (!understanding) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title="Here's how AI understands your decision"
      description="Review and accept the extracted structure. You can customize every item in the next steps."
    >
      <div className="space-y-6">
        {/* Interpreted Goal */}
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Interpreted Core Objective
            </span>
            <SourceBadge source="AI_SUGGESTED" />
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {understanding.interpretedGoal}
          </p>
        </div>

        {/* Primary Concerns */}
        {understanding.primaryConcerns?.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Primary Concerns Detected
            </span>
            <div className="flex flex-wrap gap-2">
              {understanding.primaryConcerns.map((concern, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  • {concern}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Criteria Preview */}
        {understanding.suggestedCriteria?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-500" />
                Suggested Decision Criteria ({understanding.suggestedCriteria.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {understanding.suggestedCriteria.map((c, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {c.description}
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shrink-0">
                    {c.suggestedWeight}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Options Preview */}
        {understanding.suggestedOptions && understanding.suggestedOptions.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Suggested Candidates ({understanding.suggestedOptions.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {understanding.suggestedOptions.map((opt, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-0.5"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {opt.name}
                  </p>
                  {opt.estimatedPrice !== undefined && (
                    <p className="text-[11px] font-mono font-semibold text-brand-600 dark:text-brand-400">
                      {formatCurrency(opt.estimatedPrice)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            isLoading={isRegenerating}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Regenerate AI Analysis
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1 sm:flex-initial">
              Edit Input
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onAccept}
              leftIcon={<Check className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
