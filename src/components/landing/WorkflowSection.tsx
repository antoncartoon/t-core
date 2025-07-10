
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Coins, Settings, Gift, TrendingUp } from 'lucide-react';

const WorkflowSection = () => {
  const steps = [
    {
      icon: Coins,
      title: "Deposit Stablecoins",
      description: "Stake USDC, USDT, or DAI into T-Core protocol",
      detail: "Your funds are held securely and can be withdrawn at any time"
    },
    {
      icon: Settings,
      title: "Choose Your Yield",
      description: "Select your desired APY and risk level using our intuitive interface",
      detail: "Pick anywhere from 5% to 25% based on your preference"
    },
    {
      icon: Gift,
      title: "Receive TDD & NFT",
      description: "Get TDD tokens and an NFT representing your position",
      detail: "NFTs make your position tradeable and composable in DeFi"
    },
    {
      icon: TrendingUp,
      title: "Earn & Manage",
      description: "Enjoy yields distributed via tranches, with AI-optimized rebalancing",
      detail: "Set it and forget it, or actively manage your position"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            How T-Core Powers TDD
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple 4-step process to start earning optimized yields on your stablecoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                      <h3 className="text-lg font-medium mb-3">{step.title}</h3>
                      <p className="text-muted-foreground mb-3 text-sm">
                        {step.description}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
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

export default WorkflowSection;
