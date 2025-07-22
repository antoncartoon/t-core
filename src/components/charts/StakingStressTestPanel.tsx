
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react';
import { calculateStressScenarios } from '@/utils/tzFormulas';

interface StakingStressTestPanelProps {
  amount: number;
  selectedRange: [number, number];
  totalTVL?: number;
}

const StakingStressTestPanel: React.FC<StakingStressTestPanelProps> = ({
  amount,
  selectedRange,
  totalTVL = 10000000 // Default 10M TVL for demo
}) => {
  // Calculate stress scenarios using the formula from tzFormulas
  const stressScenarios = amount > 0 ? calculateStressScenarios(amount, selectedRange, totalTVL) : null;

  const scenarioConfigs = [
    {
      name: '1% Protocol Loss',
      description: 'Minor market stress',
      icon: Shield,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      data: stressScenarios?.scenario1
    },
    {
      name: '5% Protocol Loss', 
      description: 'Moderate market downturn',
      icon: AlertTriangle,
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-800 dark:text-orange-200',
      data: stressScenarios?.scenario5
    },
    {
      name: '10% Protocol Loss',
      description: 'Severe market crisis',
      icon: TrendingDown,
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      data: stressScenarios?.scenario10
    }
  ];

  if (!stressScenarios) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Stress Test Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter an amount to see potential loss scenarios for your position
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No position to analyze</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Real-Time Stress Test Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Potential losses for your ${amount.toLocaleString()} position in buckets {selectedRange[0]}-{selectedRange[1]}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarioConfigs.map((scenario, index) => {
              const Icon = scenario.icon;
              const data = scenario.data;
              
              return (
                <div
                  key={scenario.name}
                  className={`p-4 rounded-lg border-2 ${scenario.bgColor} ${scenario.borderColor}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`h-4 w-4 ${scenario.textColor}`} />
                    <Badge variant="outline" className="text-xs">
                      Scenario {index + 1}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-1">{scenario.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{scenario.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Loss %:</span>
                      <span className={`font-bold text-sm ${scenario.textColor}`}>
                        -{data?.lossPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Dollar Loss:</span>
                      <span className={`font-bold text-sm ${scenario.textColor}`}>
                        -${data?.dollarLoss.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Remaining Value:</span>
                      <span className="font-medium text-sm">
                        ${(amount - (data?.dollarLoss || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Risk Level Indicator */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="font-medium text-sm">Your Risk Profile</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Position Size</p>
                <p className="font-semibold">${amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Risk Range</p>
                <p className="font-semibold">{selectedRange[0]} - {selectedRange[1]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Max Potential Loss</p>
                <p className="font-semibold text-red-600">
                  -${stressScenarios.scenario10.dollarLoss.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Protection Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">
                Hero Tier Insurance Protection
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                25% of all performance fees are continuously allocated to Hero tier participants as compensation 
                for absorbing losses first. This creates a sustainable insurance mechanism where higher-risk participants 
                protect lower tiers while earning proportionally higher rewards.
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-600 dark:text-blue-400">
                <span>• Waterfall loss absorption</span>
                <span>• Performance fee compensation</span>
                <span>• Automated rebalancing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingStressTestPanel;
