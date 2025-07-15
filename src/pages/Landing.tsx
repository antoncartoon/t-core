import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import WhyTCore from '@/components/landing/WhyTCore';
import RiskSelection from '@/components/landing/RiskSelection';
import HowItWorks from '@/components/landing/HowItWorks';
import StatsSection from '@/components/landing/StatsSection';
import ArchitectureDashboard from '@/components/ArchitectureDashboard';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';
import InteractiveTutorial from '@/components/InteractiveTutorial';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { useTutorial } from '@/hooks/useTutorial';

const Landing = () => {
  const isMobile = useIsMobile();
  const { isVisible, startTutorial, completeTutorial, skipTutorial } = useTutorial();

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onStartTutorial={startTutorial} />
      <main>
        <HeroSection onStartTutorial={startTutorial} />
        <WhyTCore />
        <HowItWorks />
        <RiskSelection />
        <StatsSection />
        <ArchitectureDashboard />
        <CTASection />
      </main>
      <LandingFooter />
      
      {/* Enhanced UX Elements */}
      <InteractiveTutorial 
        isVisible={isVisible}
        onComplete={completeTutorial}
        onSkip={skipTutorial}
      />
      <PWAInstallPrompt />
    </div>
  );
};

export default Landing;
