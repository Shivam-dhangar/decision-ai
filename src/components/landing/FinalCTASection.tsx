'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sparkles, Mail } from 'lucide-react';

export function FinalCTASection() {
  const { openContactModal } = useAuth();

  return (
    <section className="py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Make Your Next Decision With Clarity</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Stop second-guessing. Start structuring.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn emotional uncertainty into transparent mathematical evidence. Compare options, test sensitivity, and gain confidence in your next move.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link href="/decision/new">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Your Decision
              </Button>
            </Link>
            <Link href="/decision/demo-dev-laptop-choice/result">
              <Button size="lg" variant="outline">
                Explore Sample Decision
              </Button>
            </Link>
            <Button
              size="lg"
              variant="subtle"
              onClick={openContactModal}
              leftIcon={<Mail className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
            >
              Contact Us &bull; Request Access
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
