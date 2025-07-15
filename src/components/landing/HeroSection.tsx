import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import APYCalculator from '@/components/APYCalculator';
import InteractiveRiskCalculator from '@/components/InteractiveRiskCalculator';
const HeroSection = () => {
  const isMobile = useIsMobile();
  return <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-12 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-foreground rounded-xl flex items-center justify-center">
              <span className="text-background font-bold text-2xl sm:text-3xl">T</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-foreground mb-4 sm:mb-6 tracking-tight">
            T-Core Finance:{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Stablecoin Yields
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12">
            Mathematical precision meets DeFi innovation. Choose from 4 risk tiers: Safe (6%), Conservative (9%), Balanced (16%), or T-Core HERO (35% max).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
          <NavLink to="/app">
            <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </NavLink>
          
          <a href="#how-it-works">
            <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
              Learn More
            </Button>
          </a>
        </div>

        {/* Interactive Risk Calculator */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <InteractiveRiskCalculator className="bg-card/50 border border-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-border bg-card/50">
            <Shield className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-medium mb-2">Mathematical Precision</h3>
            <p className="text-sm text-muted-foreground">T-Core formula: tier1 = 6% (fixed), higher = fixed + bonus × k^(i-25)</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-border bg-card/50">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-medium mb-2">Anti-Ponzi Design</h3>
            <p className="text-sm text-muted-foreground">
              60% fixed yield (T-Bills, AAVE), 40% bonus from real protocol revenue
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-border bg-card/50">
            <Lock className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-medium mb-2">Waterfall Protection</h3>
            <p className="text-sm text-muted-foreground">T-Core HERO tier protects lower tiers, earns maximum yield</p>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;