
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CTASection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 sm:p-12 border border-primary/20">
          <div className="relative z-10">
            <h2 className="heading-section text-foreground mb-4 sm:mb-6">
              Ready to Start Earning?
            </h2>
            
            <p className="body-large text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
              Join thousands earning optimized yields through mathematical precision staking 
              with transparent risk management.
            </p>

            <NavLink to="/app">
              <Button size={isMobile ? "default" : "lg"} className="font-brand bg-primary hover:bg-primary/90">
                Launch T-Core App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </NavLink>
            
            <div className="body-small text-muted-foreground mt-4">
              No lock-up periods • Mathematical precision • Waterfall protection
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
