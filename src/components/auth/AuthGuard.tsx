'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Lock, Sparkles, UserCheck, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, loginDemo, loginGuest, openContactModal } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 animate-pulse" />
          <p className="text-xs font-mono text-slate-400">Verifying session credentials...</p>
        </div>
      </div>
    );
  }

  if (!user?.isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
              <span>Authentication Required</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Sign In to Access Decision Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              To protect proprietary decision models and prevent unverified crawlers, all decision tools require authentication. You can sign in using demo credentials or request enterprise access.
            </p>
          </div>

          {/* Demo Credentials Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono font-bold text-slate-700 dark:text-slate-300">
              <span>Quick Demo Credentials:</span>
              <span className="text-brand-600 dark:text-brand-400">Pre-authorized</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Email:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">demo@decisionlens.ai</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Password:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">demo123</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => loginDemo()}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              One-Click Demo Login
            </Button>

            <Link href="/sign-in" className="block w-full">
              <Button variant="outline" size="md" className="w-full">
                Go to Sign In Page
              </Button>
            </Link>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={openContactModal}
                className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
              >
                Contact Us / Request Access
              </button>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <button
                type="button"
                onClick={loginGuest}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
