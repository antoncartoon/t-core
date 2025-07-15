import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Wallet, Target, TrendingUp } from 'lucide-react';

const SimpleHowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: 'Connect & Deposit',
      description: 'Connect your wallet and deposit USDC to start earning immediately.',
      color: 'text-blue-600'
    },
    {
      icon: Target,
      title: 'Choose Risk Tier',
      description: 'Select from Safe (6%) to Hero (35%) based on your risk tolerance.',
      color: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Earn & Compound',
      description: 'Watch your yields grow automatically with transparent, on-chain tracking.',
      color: 'text-green-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Start earning in three simple steps. No complex strategies, just transparent yields.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-border hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Ready to start earning sustainable yields?
          </p>
          <a href="/app" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
            Launch App
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default SimpleHowItWorks;