
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Sparkles, Calculator, TrendingUp, Play, Shield, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CTASection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Unified CTA Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 sm:p-12 border border-primary/20">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
              Start Earning with T-Core Advanced Staking
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
              Experience mathematical precision staking with waterfall distribution, bonus yield optimization, 
              and transparent risk management. Join thousands already earning optimized yields.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <NavLink to="/app">
                <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Calculator className="w-4 h-4 mr-2" />
                  Launch Staking App
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </NavLink>
              
              <NavLink to="/app">
                <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Interactive Tutorial
                </Button>
              </NavLink>
              
              <NavLink to="/docs">
                <Button variant="ghost" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
                  Read Documentation
                </Button>
              </NavLink>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="flex flex-col items-center space-y-2 p-4 bg-background/50 rounded-lg border border-border/50">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">Waterfall Distribution</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2 p-4 bg-background/50 rounded-lg border border-border/50">
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Bonus Yield Optimization</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2 p-4 bg-background/50 rounded-lg border border-border/50">
                <Lock className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">Mathematical Precision</span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Stress Testing
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Risk Analytics
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Fair Distribution
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Transparent Formulas
              </span>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
