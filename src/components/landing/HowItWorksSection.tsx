import React from 'react';
import { HelpCircle, ListPlus, Sliders, Scale, PlayCircle, Award } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Define your decision',
    desc: 'Describe what you are trying to decide in plain English. Gemini AI extracts the core objective, underlying constraints, and primary concerns.',
    icon: <HelpCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
  },
  {
    step: '02',
    title: 'Add your options',
    desc: 'Add the candidates you are considering. AI can suggest realistic alternatives or analyze strengths and trade-offs for each candidate in INR (₹).',
    icon: <ListPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    step: '03',
    title: 'Set what matters',
    desc: 'Establish multi-criteria evaluation dimensions (performance, cost, culture, longevity) with AI suggestions you can accept or refine.',
    icon: <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
  },
  {
    step: '04',
    title: 'Assign priority weights',
    desc: 'Use 1-10 sliders to set relative importance. The engine automatically normalizes all weights to mathematically sound percentages.',
    icon: <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    step: '05',
    title: 'Explore what-if scenarios',
    desc: 'Dynamically tweak criteria weights and watch rankings recalculate instantly. Test decision stability against unexpected priority shifts.',
    icon: <PlayCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
  },
  {
    step: '06',
    title: 'Make your decision',
    desc: 'Review Why Winner Wins, hidden assumptions, trade-offs, and devil’s advocate challenges before committing your final choice.',
    icon: <Award className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Structured 6-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            From ambiguity to rigorous clarity in 6 steps.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A structured framework that organizes complex trade-offs without taking away your autonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-slate-200 dark:text-slate-700">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
