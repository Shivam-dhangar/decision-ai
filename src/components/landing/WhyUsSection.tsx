import React from 'react';
import { Eye, Layers, Sparkles, User, ShieldCheck, Gauge } from 'lucide-react';

const FEATURES = [
  {
    icon: <Eye className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
    title: 'Explainable, Not Black-Box',
    desc: 'Every point in the final score is mathematically accounted for. See exact criterion contribution breakdowns rather than opaque AI claims.',
  },
  {
    icon: <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    title: 'Structured Multi-Criteria Modeling',
    desc: 'Transforms vague pro/con debates into a balanced, normalized decision matrix modeled after proven management decision frameworks.',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    title: 'AI-Assisted Intelligence',
    desc: 'Uncovers hidden trade-offs, identifies unstated risks, detects missing information, and challenges confirmation bias.',
  },
  {
    icon: <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    title: 'User-Controlled & Editable',
    desc: 'You have 100% manual override. Every score, criterion, weight, and assumption can be adjusted, deleted, or customized at will.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    title: 'Privacy-First Architecture',
    desc: 'Your decisions stay in your browser. All data is saved to LocalStorage without remote database tracking or telemetry harvesting.',
  },
  {
    icon: <Gauge className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    title: 'Real-Time Scenario & What-If Aware',
    desc: 'Adjust priority sliders in real time and see rank shifts dynamically without waiting for API roundtrips or page reloads.',
  },
];

export function WhyUsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Why DecisionLens?
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Built for serious decisions.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Designed for founders, engineers, consultants, managers, and anyone facing high-stakes choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
