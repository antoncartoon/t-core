import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Coins, ArrowRightLeft, Target, Gem, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Coins,
      title: "Deposit Stables",
      description: "USDC, USDT, DAI",
      detail: "Deposit any stablecoins into T-Core protocol"
    },
    {
      icon: ArrowRightLeft,
      title: "Get TDD",
      description: "1:1 to deposit",
      detail: "Mint TDD stablecoin in 1:1 ratio"
    },
    {
      icon: Target,
      title: "Choose Risk",
      description: "Conservative / Balanced / Agressive",
      detail: "Control your risk/return ratio yourself"
    },
    {
      icon: TrendingUp,
      title: "Stake TDD & Earn",
      description: "Passive income",
      detail: "Stake your TDD tokens and receive yield based on your risk selection"
    },
    {
      icon: Gem,
      title: "NFT + DeFi",
      description: "Position + Usage",
      detail: "Get NFT position and use in secondary markets"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            How It Works?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple 5-step process to start earning on stablecoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="border-border bg-card/50 hover:bg-card/80 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium mb-4">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                      <p className="text-primary font-medium mb-3 text-sm">
                        {step.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;