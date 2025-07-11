import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import WhyTCore from '@/components/landing/WhyTCore';
import RiskSelection from '@/components/landing/RiskSelection';
import HowItWorks from '@/components/landing/HowItWorks';
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
        <WhyTCore />
        <HowItWorks />
        <RiskSelection />
        <StatsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landing;
