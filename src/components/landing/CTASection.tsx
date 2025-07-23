
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CTASection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Simplified CTA Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 sm:p-12 border border-primary/20">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
              Start Earning with T-Core
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
              Join thousands earning optimized yields through mathematical precision staking 
              with transparent risk management and waterfall distribution.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink to="/app">
                <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Launch App
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </NavLink>
              
              <NavLink to="/app">
                <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Interactive Tutorial
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
