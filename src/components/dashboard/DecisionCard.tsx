'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Decision } from '@/types/decision';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate, getScoreFitBadge } from '@/lib/utils/formatters';
import {
  Trophy,
  ArrowRight,
  Trash2,
  Calendar,
  Layers,
  Sliders,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface DecisionCardProps {
  decision: Decision;
  onDelete: (id: string) => void;
}

export function DecisionCard({ decision, onDelete }: DecisionCardProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const winner = decision.results?.ranking?.[0];
  const fitInfo = winner ? getScoreFitBadge(winner.finalScore) : null;
  const isFinalized = Boolean(decision.finalDecision);

  // Compute completeness progress (options, criteria, scores)
  let progress = 0;
  if (decision.title) progress += 20;
  if (decision.options?.length >= 2) progress += 25;
  if (decision.criteria?.length >= 1) progress += 25;
  if (decision.results) progress += 30;

  return (
    <>
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between group">
        <div className="space-y-4">
          {/* Header Row: Category & Status */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                {decision.category}
              </span>
              {decision.isDemo && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-[11px] font-mono font-semibold">
                  Demo
                </span>
              )}
            </div>

            {isFinalized ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Decided
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                {decision.status === 'completed' ? 'Analyzed' : 'Draft'}
              </span>
            )}
          </div>

          {/* Title & Goal */}
          <div>
            <Link
              href={`/decision/${decision.id}/result`}
              className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                {decision.title}
              </h3>
            </Link>
            {decision.goal && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {decision.goal}
              </p>
            )}
          </div>

          {/* Current Leader / Top Fit */}
          {winner ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" /> Current Leader
                </span>
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                  {winner.finalScore} / 100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
                  {winner.optionName}
                </span>
                {fitInfo && (
                  <Badge variant={fitInfo.variant === 'emerald' ? 'emerald' : 'brand'} size="sm">
                    {fitInfo.label}
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
              Configure options & criteria to compute rankings
            </div>
          )}

          {/* Meta details */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {decision.options?.length || 0} options
            </span>
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              {decision.criteria?.length || 0} criteria
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(decision.updatedAt || decision.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDeleteModalOpen(true)}
              aria-label="Delete decision"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <Link href={`/decision/${decision.id}/result`}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Result
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Decision"
        description="This action is permanent and cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-slate-100">&ldquo;{decision.title}&rdquo;</span>? All options, weights, and scoring matrices will be removed from your browser.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(decision.id);
                setDeleteModalOpen(false);
              }}
            >
              Yes, Delete Decision
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
