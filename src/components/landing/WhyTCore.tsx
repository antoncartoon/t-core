import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, Brain, Target, Shield } from 'lucide-react';
const WhyTCore = () => {
  const benefits = [{
    icon: Coins,
    title: "Stablecoins at Work",
    description: "Turn USDC, USDT, DAI into profit sources. No volatility risks - only optimized yields.",
    color: "text-green-600"
  }, {
    icon: Brain,
    title: "AI + Pro Managers",
    description: "Expert team and AI advisor manage allocation across top DeFi and CeFi strategies.",
    color: "text-blue-600"
  }, {
    icon: Target,
    title: "Risk-based Split",
    description: "Choose from 100 risk levels (1-100) with waterfall yield distribution. Higher risk tiers get higher yields but absorb losses first.",
    color: "text-purple-600"
  }, {
    icon: Shield,
    title: "Self-Insurance Pool",
    description: "Protocol fees automatically flow into highest risk tiers, creating a protective buffer for all participants.",
    color: "text-orange-600"
  }];
  return <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Why T-Core?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revolutionary approach to stablecoin yields with unprecedented risk and return control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return <Card key={index} className="border-border bg-card/50 hover:bg-card/80 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-3 rounded-full bg-muted/50 ${benefit.color}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};
export default WhyTCore;