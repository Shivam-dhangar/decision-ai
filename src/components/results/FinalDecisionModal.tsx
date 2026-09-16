'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DecisionOption, FinalDecisionRecord } from '@/types/decision';
import { CheckCircle2, Award, Sparkles } from 'lucide-react';

interface FinalDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: DecisionOption[];
  defaultWinnerId: string;
  existingFinalDecision?: FinalDecisionRecord;
  onSaveFinalDecision: (record: FinalDecisionRecord) => void;
}

export function FinalDecisionModal({
  isOpen,
  onClose,
  options,
  defaultWinnerId,
  existingFinalDecision,
  onSaveFinalDecision,
}: FinalDecisionModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState(
    existingFinalDecision?.selectedOptionId || defaultWinnerId
  );
  const [reason, setReason] = useState(
    existingFinalDecision?.reason ||
      'Strongest overall fit across performance, battery endurance, and long-term durability.'
  );

  const handleCommit = () => {
    const matched = options.find((o) => o.id === selectedOptionId) || options[0];

    const record: FinalDecisionRecord = {
      selectedOptionId,
      selectedOptionName: matched.name,
      reason,
      decidedAt: new Date().toISOString(),
    };

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch (e) {
      // ignore
    }

    onSaveFinalDecision(record);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Commit Your Final Decision"
      description="Record your choice and reasoning to solidify your commitment and reference in the future."
    >
      <div className="space-y-5">
        {/* Selected Option Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Selected Choice <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedOptionId}
            onChange={(e) => setSelectedOptionId(e.target.value)}
            className="w-full h-11 px-3.5 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} {opt.price ? `(₹${opt.price.toLocaleString('en-IN')})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Reason / Rationale */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Why Did You Choose This Option?
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Write down your key rationale or what trade-off you decided was acceptable..."
            className="w-full p-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
          />
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleCommit}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Commit Decision
          </Button>
        </div>
      </div>
    </Modal>
  );
}
