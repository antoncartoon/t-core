import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, TrendingUp, Users } from 'lucide-react';

const SimpleWhyTCore = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Guaranteed 6% minimum return for Safe tier backed by T-Bills + Bluechip DeFi. Minimal risk exposure.',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Scalable Returns',
      description: 'Choose your risk level from 6% safe to 35% heroic yields. Higher risk, higher reward.',
      color: 'text-primary'
    },
    {
      icon: Users,
      title: 'Community Protection',
      description: 'Heroes protect lower tiers, everyone benefits. Fair distribution guaranteed by smart contracts.',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
            Why Choose T-Core?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A revolutionary approach to DeFi yields that combines safety, transparency, and community protection.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                    <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleWhyTCore;