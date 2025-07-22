
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Sparkles, Calculator, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CTASection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* New Staking Feature Highlight */}
        <div className="mb-12 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Calculator className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-medium text-foreground mb-3">
            🎉 New: Advanced T-Core Staking is Live!
          </h2>
          
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
            Waterfall distribution, bonus yield heatmap, stress testing with exact mathematical formulas. 
            Choose your risk bucket (0-99) and see real-time APY predictions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <NavLink to="/staking">
              <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                <Calculator className="w-4 h-4 mr-2" />
                Try Advanced Staking
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </NavLink>
            
            <NavLink to="/app">
              <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </NavLink>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Waterfall Distribution
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Stress Testing
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              Bonus Yield Optimization
            </span>
          </div>
        </div>

        {/* Original CTA */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 sm:p-12 border border-primary/20">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
              Ready to Start Earning with T-Core?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
              Join thousands of users already earning optimized yields across diversified DeFi strategies. 
              Fair distribution, transparent rewards, and risk-managed approach.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <NavLink to="/app">
                <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
                  Launch App
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </NavLink>
              
              <NavLink to="/docs">
                <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
                  Read Documentation
                </Button>
              </NavLink>
            </div>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Diversified Assets</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Fair Distribution</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Risk-Managed</span>
              </div>
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
