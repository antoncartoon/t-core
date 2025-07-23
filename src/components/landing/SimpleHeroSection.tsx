
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Play, Shield, TrendingUp, Lock, Calculator } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { T_BILL_RATE, FIXED_BASE_MULTIPLIER } from '@/utils/riskRangeCalculations';
import { FIXED_BASE_APY } from '@/utils/protocolConstants';

interface SimpleHeroSectionProps {
  onStartTutorial?: () => void;
}

const SimpleHeroSection = ({ onStartTutorial }: SimpleHeroSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-foreground mb-4 sm:mb-6 leading-tight">
            <span className="text-green-600 font-medium">{(FIXED_BASE_APY * 100).toFixed(0)}% Guaranteed Safe</span> +{' '}
            <span className="text-primary font-medium">Dynamic Bonus Yields</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Mathematical precision staking with waterfall distribution, bonus yield optimization, and transparent formulas
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Safe: {(FIXED_BASE_APY * 100).toFixed(0)}% guaranteed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Bonus: mathematical optimization
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Hero: waterfall residuals
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16">
            <NavLink to="/app">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="w-full sm:w-auto text-base font-medium px-6 sm:px-8 py-4 sm:py-6 h-auto bg-primary hover:bg-primary/90 animate-pulse"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Go to App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </NavLink>

            {onStartTutorial && (
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "lg"} 
                className="w-full sm:w-auto text-base px-6 sm:px-8 py-4 sm:py-6 h-auto"
                onClick={onStartTutorial}
              >
                <Play className="w-4 h-4 mr-2" />
                Interactive Tutorial
              </Button>
            )}
          </div>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium">Waterfall Distribution</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">Bonus Yield Optimization</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Lock className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <span className="text-sm font-medium">Mathematical Precision</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHeroSection;
