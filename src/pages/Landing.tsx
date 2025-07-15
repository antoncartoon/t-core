import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingHeader from '@/components/landing/LandingHeader';
import SimpleHeroSection from '@/components/landing/SimpleHeroSection';
import TDDExplainer from '@/components/landing/TDDExplainer';
import SimpleWhyTCore from '@/components/landing/SimpleWhyTCore';
import SimpleRiskTiers from '@/components/landing/SimpleRiskTiers';
import SimpleHowItWorks from '@/components/landing/SimpleHowItWorks';
import KeyStats from '@/components/landing/KeyStats';
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
        <SimpleHeroSection onStartTutorial={startTutorial} />
        <TDDExplainer />
        <SimpleWhyTCore />
        <SimpleRiskTiers />
        <SimpleHowItWorks />
        <KeyStats />
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
