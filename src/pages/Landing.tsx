
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingHeader from '@/components/landing/LandingHeader';
import SimpleHeroSection from '@/components/landing/SimpleHeroSection';
import TDDExplainer from '@/components/landing/TDDExplainer';
import SimpleWhyTCore from '@/components/landing/SimpleWhyTCore';
import InteractiveRiskSelection from '@/components/landing/InteractiveRiskSelection';
import StatsSection from '@/components/landing/StatsSection';
import TransparencyPreview from '@/components/landing/TransparencyPreview';
import SecurityEmphasis from '@/components/landing/SecurityEmphasis';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';
import UnifiedTutorial from '@/components/UnifiedTutorial';
import FloatingStakingButton from '@/components/FloatingStakingButton';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { useUnifiedTutorial } from '@/hooks/useUnifiedTutorial';

const Landing = () => {
  const isMobile = useIsMobile();
  const { isVisible, startTutorial, completeTutorial, skipTutorial } = useUnifiedTutorial();

  const handleStartTutorial = () => {
    startTutorial();
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader 
        onStartTutorial={handleStartTutorial}
      />
      <main>
        <SimpleHeroSection 
          onStartTutorial={handleStartTutorial}
        />
        <TDDExplainer />
        <SimpleWhyTCore />
        
        {/* Single Unified Risk Selection */}
        <InteractiveRiskSelection />
        
        <StatsSection />
        <TransparencyPreview />
        <SecurityEmphasis />
        <CTASection />
      </main>
      <LandingFooter />
      
      {/* Enhanced UX Elements */}
      <UnifiedTutorial 
        isVisible={isVisible}
        onComplete={completeTutorial}
        onSkip={skipTutorial}
      />
      
      {/* Floating staking button */}
      <FloatingStakingButton />
      
      <PWAInstallPrompt />
    </div>
  );
};

export default Landing;
