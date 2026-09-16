'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Compass, Shield, Cpu, Lock, Mail } from 'lucide-react';

export function Footer() {
  const { openContactModal } = useAuth();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 transition-colors print:hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                DecisionLens <span className="text-brand-600 dark:text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              &ldquo;Turn difficult decisions into clear, explainable choices.&rdquo;
              <br />
              A deterministic decision-intelligence engine paired with Google Gemini AI assistance.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 font-mono">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-brand-500" /> Deterministic JS Engine
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> 100% Client-Side Privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-500" /> Zero DB Storage
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Platform
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Decision Workspace
                </Link>
              </li>
              <li>
                <Link href="/decision/new" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Create Decision
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Data & Settings
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Enterprise & Access
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={openContactModal}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-center gap-1.5 font-semibold text-brand-600 dark:text-brand-400"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Us &bull; Request Access
                </button>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  About & Manifesto
                </Link>
              </li>
              <li>
                <Link href="/#team" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Leadership Team
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Demo Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} DecisionLens AI. Built for clear, rational decision-making.</p>
          <div className="flex items-center gap-1">
            <span>Deterministic engine calculates &bull; AI assists &bull; You decide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
