'use client';

import React from 'react';
import Link from 'next/link';
import { DecisionWizard } from '@/components/wizard/DecisionWizard';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ArrowLeft } from 'lucide-react';

export default function NewDecisionPage() {
  return (
    <AuthGuard>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspace</span>
          </Link>
        </div>

        {/* Guided Wizard */}
        <DecisionWizard />
      </div>
    </AuthGuard>
  );
}
