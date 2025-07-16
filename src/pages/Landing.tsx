import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingHeader from '@/components/landing/LandingHeader';
import SimpleHeroSection from '@/components/landing/SimpleHeroSection';
import TDDExplainer from '@/components/landing/TDDExplainer';
import SimpleWhyTCore from '@/components/landing/SimpleWhyTCore';
import SimpleRiskTiers from '@/components/landing/SimpleRiskTiers';
import SimpleHowItWorks from '@/components/landing/SimpleHowItWorks';
import StatsSection from '@/components/landing/StatsSection';
import TransparencyPreview from '@/components/landing/TransparencyPreview';
import SecurityEmphasis from '@/components/landing/SecurityEmphasis';
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
        <StatsSection />
        <TransparencyPreview />
        <SecurityEmphasis />
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
