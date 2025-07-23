
import React from 'react';
import APYTestComponent from '@/components/debug/APYTestComponent';
import { useIsMobile } from '@/hooks/use-mobile';
import LandingHeader from '@/components/landing/LandingHeader';
import SimpleHeroSection from '@/components/landing/SimpleHeroSection';
import TDDExplainer from '@/components/landing/TDDExplainer';
import SimpleWhyTCore from '@/components/landing/SimpleWhyTCore';
import CompactRiskDemo from '@/components/landing/CompactRiskDemo';
import { DualAxisRiskYieldChart } from '@/components/landing/DualAxisRiskYieldChart';
import StatsSection from '@/components/landing/StatsSection';
import TransparencyPreview from '@/components/landing/TransparencyPreview';
import SecurityEmphasis from '@/components/landing/SecurityEmphasis';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';
import UnifiedTutorial from '@/components/UnifiedTutorial';
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
        
        {/* Debug APY Values */}
        <div className="py-8 bg-red-50 border-y-2 border-red-200">
          <div className="max-w-4xl mx-auto px-4">
            <APYTestComponent />
          </div>
        </div>
        
        {/* Simplified Risk Demo */}
        <CompactRiskDemo />
        
        {/* Dual Axis Risk & Yield Chart */}
        <div className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <DualAxisRiskYieldChart />
          </div>
        </div>
        
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
      
      <PWAInstallPrompt />
    </div>
  );
};

export default Landing;
