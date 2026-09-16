'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowRight,
  Sparkles,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export function HeroSection() {
  const { openContactModal } = useAuth();
  const [batteryWeight, setBatteryWeight] = useState(8);
  const [priceWeight, setPriceWeight] = useState(7);

  // Live calculation for preview
  const macScore = Math.round(((9 * 0.35 + 7 * (priceWeight / 20) + 10 * (batteryWeight / 20)) / 1.7) * 10);
  const thinkScore = Math.round(((8 * 0.35 + 6 * (priceWeight / 20) + 7 * (batteryWeight / 20)) / 1.7) * 10);
  const dellScore = Math.round(((8 * 0.35 + 8 * (priceWeight / 20) + 6 * (batteryWeight / 20)) / 1.7) * 10);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-18 lg:pb-28">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[950px] h-[400px] bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted &bull; Deterministic Decision Engine &bull; 100% Client-Side</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15] max-w-3xl mx-auto"
          >
            Turn difficult decisions into{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
              clear, explainable
            </span>{' '}
            choices.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Compare your options, understand the trade-offs, and see what actually changes your decision.
            You always remain the final decision maker.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
          >
            <Link href="/decision/new">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create a Decision
              </Button>
            </Link>
            <Link href="/decision/demo-dev-laptop-choice/result">
              <Button size="lg" variant="outline" leftIcon={<Sparkles className="w-4 h-4 text-brand-500" />}>
                Try Interactive Demo
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
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2 font-mono">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant demo login
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> Zero remote database
            </span>
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Real-time What-If
            </span>
          </div>
        </div>

        {/* Live Interactive Hero Preview Card - Expanded & Proportionate */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 w-full max-w-5xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-xl p-6 sm:p-8 lg:p-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[11px] font-mono rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold uppercase">
                  Live Interactive Decision Preview
                </span>
                <span className="text-xs text-slate-400 font-mono">Real-Time Evaluation</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                Which laptop should I buy for full-stack development?
              </h3>
            </div>

            <Link href="/decision/demo-dev-laptop-choice/result" className="shrink-0">
              <Button variant="subtle" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Full Decision Matrix
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Live Sliders */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Dynamic Priority Weights
                </p>
                <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-semibold">
                  Drag to test rank shifts
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span>Battery Life & Efficiency</span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{batteryWeight} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={batteryWeight}
                    onChange={(e) => setBatteryWeight(Number(e.target.value))}
                    aria-label="Battery Life Weight Slider"
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Low</span>
                    <span>Critical</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span>Price Sensitivity & Target Budget</span>
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{priceWeight} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={priceWeight}
                    onChange={(e) => setPriceWeight(Number(e.target.value))}
                    aria-label="Price Sensitivity Slider"
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Low</span>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Results Preview */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Deterministic Score Ranking
                </p>
                <span className="text-[11px] font-mono text-slate-400">
                  Normalized to 100
                </span>
              </div>

              {/* Option 1 */}
              <div className="p-4 rounded-2xl border border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-950/40 flex items-center justify-between shadow-xs">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-600 text-white shrink-0">
                      #1
                    </span>
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                      MacBook Air M4 (24GB / 512GB)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {formatCurrency(149900)} &bull; 18h Battery &bull; Fanless Silent Unibody
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-extrabold font-mono text-brand-600 dark:text-brand-400">
                    {macScore}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">/ 100</span>
                </div>
              </div>

              {/* Option 2 */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                      #2
                    </span>
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                      ThinkPad X1 Carbon Gen 12
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {formatCurrency(158000)} &bull; 1.09kg &bull; Linux Certified Keyboard
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">
                    {thinkScore}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">/ 100</span>
                </div>
              </div>

              {/* Option 3 */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                      #3
                    </span>
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                      Dell XPS 14 (32GB / RTX 4050)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {formatCurrency(145000)} &bull; Dedicated CUDA GPU &bull; OLED Display
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">
                    {dellScore}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">/ 100</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
