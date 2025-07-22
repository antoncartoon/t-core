
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingHeader from '@/components/landing/LandingHeader';
import SimpleHeroSection from '@/components/landing/SimpleHeroSection';
import TDDExplainer from '@/components/landing/TDDExplainer';
import SimpleWhyTCore from '@/components/landing/SimpleWhyTCore';
import UnifiedRiskSelection from '@/components/landing/UnifiedRiskSelection';
import LiveStakingPreview from '@/components/landing/LiveStakingPreview';
import StatsSection from '@/components/landing/StatsSection';
import TransparencyPreview from '@/components/landing/TransparencyPreview';
import SecurityEmphasis from '@/components/landing/SecurityEmphasis';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';
import InteractiveTutorial from '@/components/InteractiveTutorial';
import StakingOnboardingTutorial from '@/components/tutorial/StakingOnboardingTutorial';
import FloatingStakingButton from '@/components/FloatingStakingButton';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { useTutorial } from '@/hooks/useTutorial';

const Landing = () => {
  const isMobile = useIsMobile();
  const { isVisible, startTutorial, completeTutorial, skipTutorial } = useTutorial();
  const [showStakingTutorial, setShowStakingTutorial] = React.useState(false);

  const handleStartStakingTutorial = () => {
    setShowStakingTutorial(true);
  };

  const handleCompleteStakingTutorial = () => {
    setShowStakingTutorial(false);
  };

  const handleSkipStakingTutorial = () => {
    setShowStakingTutorial(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader 
        onStartTutorial={startTutorial} 
        onStartStakingTutorial={handleStartStakingTutorial}
      />
      <main>
        <SimpleHeroSection 
          onStartTutorial={startTutorial}
          onStartStakingTutorial={handleStartStakingTutorial}
        />
        <TDDExplainer />
        <SimpleWhyTCore />
        
        {/* NEW: Unified Risk Selection (replaces SimpleRiskTiers) */}
        <UnifiedRiskSelection />
        
        {/* NEW: Live Staking Preview */}
        <LiveStakingPreview />
        
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
      
      {/* NEW: Staking-specific tutorial */}
      <StakingOnboardingTutorial
        isVisible={showStakingTutorial}
        onComplete={handleCompleteStakingTutorial}
        onSkip={handleSkipStakingTutorial}
      />
      
      {/* NEW: Floating staking button */}
      <FloatingStakingButton />
      
      <PWAInstallPrompt />
    </div>
  );
};

export default Landing;
