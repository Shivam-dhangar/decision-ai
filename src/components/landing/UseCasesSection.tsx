'use client';

import React, { useState } from 'react';
import { Briefcase, Laptop, Building2, Wallet, ShoppingBag, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface UseCase {
  id: string;
  category: string;
  icon: React.ReactNode;
  decisionExample: string;
  options: string[];
  keyCriteria: string[];
  highlight: string;
}

const USE_CASES: UseCase[] = [
  {
    id: 'career',
    category: 'Career',
    icon: <Briefcase className="w-4 h-4" />,
    decisionExample: 'Should I accept the High-Growth AI Startup offer or Stay at Enterprise Tech?',
    options: ['Series B AI Startup', 'Tier-1 Tech Enterprise', 'Seed Stage Founder in Residence'],
    keyCriteria: ['Compensation & Equity (₹)', 'Learning Velocity', 'Work-Life Balance', 'Prestige & Runway'],
    highlight: 'Balances financial upside against job stability and working hours.',
  },
  {
    id: 'technology',
    category: 'Technology',
    icon: <Laptop className="w-4 h-4" />,
    decisionExample: 'Which database architecture should we adopt for our real-time analytics pipeline?',
    options: ['ClickHouse Managed', 'PostgreSQL with TimescaleDB', 'Snowflake'],
    keyCriteria: ['Ingestion Latency', 'Monthly Infrastructure Cost (₹)', 'Query Complexity', 'Operational Overhead'],
    highlight: 'Computes total cost of ownership vs engineering maintenance burden.',
  },
  {
    id: 'purchasing',
    category: 'Purchasing',
    icon: <ShoppingBag className="w-4 h-4" />,
    decisionExample: 'Which developer laptop should I purchase under ₹1,50,000?',
    options: ['MacBook Air M4', 'ThinkPad X1 Carbon', 'Dell XPS 14'],
    keyCriteria: ['Performance & Docker', 'Battery Life (18h)', 'Portability', 'Build Quality'],
    highlight: 'Ranks hardware specs strictly against your individual daily workflows.',
  },
  {
    id: 'housing',
    category: 'Housing',
    icon: <Home className="w-4 h-4" />,
    decisionExample: 'Which 2BHK apartment should I rent in Bengaluru / Gurgaon?',
    options: ['Gated Society near Tech Park', 'City-Center Builder Floor', 'Suburban Villa Community'],
    keyCriteria: ['Monthly Rent (₹)', 'Daily Commute Time', 'Power Backup & Amenities', 'Neighborhood Safety'],
    highlight: 'Quantifies whether paying extra rent saves enough commute stress to be worthwhile.',
  },
  {
    id: 'business',
    category: 'Business',
    icon: <Building2 className="w-4 h-4" />,
    decisionExample: 'Which go-to-market strategy should we execute for Q4 product launch?',
    options: ['Product-Led Self-Serve', 'Outbound Enterprise Sales', 'Partner & Ecosystem Distribution'],
    keyCriteria: ['Customer Acquisition Cost', 'Sales Cycle Length', 'LTV Expansion Potential', 'Implementation Speed'],
    highlight: 'Clarifies strategic resource allocation under strict budget constraints.',
  },
  {
    id: 'finance',
    category: 'Finance',
    icon: <Wallet className="w-4 h-4" />,
    decisionExample: 'How should I allocate ₹10,00,000 across asset classes for medium-term goals?',
    options: ['Index Funds + Sovereign Gold', 'Commercial Real Estate REITs', 'Fixed Deposits + Debt Funds'],
    keyCriteria: ['Inflation-Adjusted Yield', 'Capital Protection Risk', 'Liquidity Access', 'Tax Efficiency'],
    highlight: 'Models downside risk sensitivity against target financial timelines.',
  },
];

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState('career');
  const selected = USE_CASES.find((u) => u.id === activeTab) || USE_CASES[0];

  return (
    <section id="use-cases" className="py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Real-World Decision Scenarios
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Every high-stakes decision has structure.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Whether for your career, technology stack, personal finances, or major purchases, DecisionLens brings objective clarity.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {USE_CASES.map((uc) => (
            <button
              key={uc.id}
              onClick={() => setActiveTab(uc.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                activeTab === uc.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {uc.icon}
              <span>{uc.category}</span>
            </button>
          ))}
        </div>

        {/* Selected Use Case Preview Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-mono text-xs font-bold uppercase">
              {selected.category} Scenario
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-snug">
            &ldquo;{selected.decisionExample}&rdquo;
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Evaluated Options
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                {selected.options.map((opt) => (
                  <li key={opt} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Critical Criteria
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.keyCriteria.map((crit) => (
                  <span
                    key={crit}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {crit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-brand-700 dark:text-brand-300 font-medium">
            💡 {selected.highlight}
          </p>
        </div>
      </div>
    </section>
  );
}
