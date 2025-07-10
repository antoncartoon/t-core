
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, Eye } from 'lucide-react';

const ValueProposition = () => {
  const propositions = [
    {
      icon: Target,
      title: "Custom Risk & Reward",
      description: "You decide your risk and income—tailor your TDD position with our dynamic yield curve. Higher yields don't mean extreme risks when you're dealing with stablecoins only.",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Maximized Stablecoin Yields",
      description: "Turn your stablecoins into a profit engine with exposure to the best DeFi and CeFi strategies. Our AI optimizes allocations across proven protocols.",
      color: "text-green-600"
    },
    {
      icon: Eye,
      title: "Transparency & Trust",
      description: "On-chain visibility and expert-managed allocations. See exactly where your funds go and how yields are generated with full transparency.",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Why T-Core & TDD?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revolutionary stablecoin yields with unprecedented control over your risk and rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {propositions.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <Card key={index} className="border-border bg-card/50 hover:bg-card/80 transition-colors">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <Icon className={`w-6 h-6 ${prop.color}`} />
                    </div>
                    <h3 className="text-xl font-medium mb-3">{prop.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
