'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Decision } from '@/types/decision';
import { getDecisionById, saveDecision } from '@/lib/storage/decisionStorage';
import { DecisionWizard } from '@/components/wizard/DecisionWizard';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Layers, FileSpreadsheet } from 'lucide-react';

export default function DecisionWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const decisionId = params.id as string;

  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!decisionId) return;
    const found = getDecisionById(decisionId);
    setDecision(found);
    setIsLoaded(true);
  }, [decisionId]);

  return (
    <AuthGuard>
      {!isLoaded ? (
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse" />
        </div>
      ) : !decision ? (
        <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Decision Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The decision model with ID <code className="font-mono">{decisionId}</code> could not be found in your browser storage.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/decision/new">
              <Button variant="primary" size="sm">
                Create New Decision
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            {decision.results && (
              <Link href={`/decision/${decision.id}/result`}>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Comprehensive Result
                </Button>
              </Link>
            )}
          </div>

          <DecisionWizard initialDecision={decision} />
        </div>
      )}
    </AuthGuard>
  );
}
