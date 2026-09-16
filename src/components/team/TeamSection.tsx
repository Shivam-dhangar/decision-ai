import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Zaid Baig',
    role: 'Founder & CEO',
    bio: 'Product strategist and decision-intelligence advocate. Focused on bridging human cognitive reasoning with deterministic computational frameworks.',
    photo: '/team/zaid-baig.jpg',
  },
  {
    name: 'Yash Sharma',
    role: 'Co-Founder & CTO',
    bio: 'Systems architect specializing in verifiable AI systems, client-side cryptographic privacy, and deterministic multi-criteria decision engines.',
    photo: '/team/yash-sharma.jpg',
  },
  {
    name: 'Farid Nirban',
    role: 'Head of Operations',
    bio: 'Operations and growth strategist orchestrating product usability pipelines, enterprise pilot frameworks, and structured evaluation benchmarks.',
    photo: '/team/farid-nirban.jpg',
  },
];

export function TeamSection() {
  return (
    <section id="team" className="py-16 sm:py-20 lg:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Leadership Team
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Engineered for clarity & trust.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            DecisionLens AI was created by practitioners passionate about rational decision-making, transparent mathematics, and user agency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TEAM_MEMBERS.map((member) => (
            <Card key={member.name} hoverEffect className="p-6 sm:p-8 flex flex-col justify-between rounded-3xl shadow-xs">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-slate-400 dark:text-slate-500">
                <span className="text-xs font-mono">DecisionLens Core Leadership</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
