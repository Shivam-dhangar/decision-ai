import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatementSection } from '@/components/landing/StatementSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { EngineVsAISection } from '@/components/landing/EngineVsAISection';
import { WhyUsSection } from '@/components/landing/WhyUsSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { TeamSection } from '@/components/team/TeamSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatementSection />
      <HowItWorksSection />
      <EngineVsAISection />
      <WhyUsSection />
      <UseCasesSection />
      <PrivacySection />
      <TeamSection />
      <FinalCTASection />
    </div>
  );
}
