import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
const CTASection = () => {
  const isMobile = useIsMobile();
  return <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
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
    </section>;
};
export default CTASection;