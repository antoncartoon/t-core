import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import ValueProposition from '@/components/landing/ValueProposition';
import ConcentratedLiquidityDemo from '@/components/landing/ConcentratedLiquidityDemo';
import WorkflowSection from '@/components/landing/WorkflowSection';
import SecurityEmphasis from '@/components/landing/SecurityEmphasis';
import StatsSection from '@/components/landing/StatsSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

const Landing = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <ValueProposition />
        <ConcentratedLiquidityDemo />
        <WorkflowSection />
        <SecurityEmphasis />
        <StatsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landing;
