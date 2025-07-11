import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, Zap } from 'lucide-react';

const RiskSelection = () => {
  const [selectedRisk, setSelectedRisk] = useState('medium');

  const riskLevels = [
    {
      id: 'low',
      icon: Shield,
      title: 'Low Risk',
      apy: '5-8%',
      description: 'Stable income with minimal risks',
      features: ['T-Bill + 20% guarantee', 'Blue chip DeFi', 'Maximum protection'],
      color: 'green'
    },
    {
      id: 'medium', 
      icon: TrendingUp,
      title: 'Medium Risk',
      apy: '8-15%',
      description: 'Balance between yield and safety',
      features: ['Strategy diversification', 'AI optimization', 'Good liquidity'],
      color: 'blue'
    },
    {
      id: 'high',
      icon: Zap,
      title: 'High Risk',
      apy: '15-25%',
      description: 'Maximum yield for experienced users',
      features: ['New opportunities', 'First in yields', 'Higher fees'],
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      green: {
        icon: 'text-green-600',
        bg: isSelected ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-card/50',
        button: 'text-green-600'
      },
      blue: {
        icon: 'text-blue-600', 
        bg: isSelected ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800' : 'bg-card/50',
        button: 'text-blue-600'
      },
      purple: {
        icon: 'text-purple-600',
        bg: isSelected ? 'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800' : 'bg-card/50', 
        button: 'text-purple-600'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Choose Your Risk Level
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You control the balance between yield and safety
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {riskLevels.map((level) => {
            const Icon = level.icon;
            const isSelected = selectedRisk === level.id;
            const colorClasses = getColorClasses(level.color, isSelected);
            
            return (
              <Card 
                key={level.id} 
                className={`border-border ${colorClasses.bg} cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary/20' : ''
                }`}
                onClick={() => setSelectedRisk(level.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
                      <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
                    </div>
                    <h3 className="text-xl font-medium mb-2">{level.title}</h3>
                    <div className={`text-2xl font-bold mb-3 ${colorClasses.button}`}>
                      {level.apy}
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {level.description}
                    </p>
                    <div className="space-y-2 w-full">
                      {level.features.map((feature, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex items-center justify-center">
                          <div className={`w-1.5 h-1.5 rounded-full ${colorClasses.button.replace('text-', 'bg-')} mr-2`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" className="px-8">
            Start with {riskLevels.find(l => l.id === selectedRisk)?.title.toLowerCase()}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            You can change your risk level at any time
          </p>
        </div>
      </div>
    </section>
  );
};

export default RiskSelection;