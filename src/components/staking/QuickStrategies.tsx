
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, TrendingUp, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickStrategy {
  name: string;
  icon: React.ReactNode;
  bucketRange: [number, number];
  expectedAPY: string;
  risk: 'Low' | 'Medium' | 'High' | 'Very High';
  description: string;
  color: string;
}

interface QuickStrategiesProps {
  onSelectStrategy: (bucketRange: [number, number]) => void;
}

const QuickStrategies: React.FC<QuickStrategiesProps> = ({ onSelectStrategy }) => {
  const { toast } = useToast();

  const strategies: QuickStrategy[] = [
    {
      name: 'Safe Haven',
      icon: <Shield className="h-5 w-5" />,
      bucketRange: [0, 9],
      expectedAPY: '6.0%',
      risk: 'Low',
      description: 'T-Bills backed, guaranteed returns',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      name: 'Conservative',
      icon: <Target className="h-5 w-5" />,
      bucketRange: [10, 29],
      expectedAPY: '8.5%',
      risk: 'Medium',
      description: 'Balanced risk with steady bonus',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      name: 'Balanced Growth',
      icon: <TrendingUp className="h-5 w-5" />,
      bucketRange: [30, 59],
      expectedAPY: '14.2%',
      risk: 'High',
      description: 'Higher yields with managed risk',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      name: 'Hero Maximizer',
      icon: <Zap className="h-5 w-5" />,
      bucketRange: [60, 99],
      expectedAPY: '35%+',
      risk: 'Very High',
      description: 'Maximum upside, residual yields',
      color: 'bg-red-100 text-red-800 border-red-200'
    }
  ];

  const handleStrategySelect = (strategy: QuickStrategy) => {
    onSelectStrategy(strategy.bucketRange);
    toast({
      title: `${strategy.name} Strategy Selected`,
      description: `Bucket range: ${strategy.bucketRange[0]}-${strategy.bucketRange[1]} • Expected: ${strategy.expectedAPY}`
    });
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Strategy Selection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a pre-configured strategy or customize your own bucket range
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.name}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${strategy.color}`}
              onClick={() => handleStrategySelect(strategy)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {strategy.icon}
                  <span className="font-medium">{strategy.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {strategy.risk}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold">{strategy.expectedAPY}</div>
                <div className="text-sm opacity-80">{strategy.description}</div>
                <div className="text-xs opacity-70">
                  Buckets: {strategy.bucketRange[0]}-{strategy.bucketRange[1]}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Pro tip:</strong> Click any strategy to auto-configure your staking parameters. 
            You can always adjust the bucket range manually after selection.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStrategies;
