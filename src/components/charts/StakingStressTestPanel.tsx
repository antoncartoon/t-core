
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, TrendingDown, Info } from 'lucide-react';
import { calculateEnhancedStressScenarios, getTierProtectionLevel } from '@/utils/stressTestCalculations';

interface StakingStressTestPanelProps {
  amount: number;
  selectedRange: [number, number];
  totalTVL?: number;
}

const StakingStressTestPanel: React.FC<StakingStressTestPanelProps> = ({
  amount,
  selectedRange,
  totalTVL = 12500000 // Use actual protocol TVL
}) => {
  // Calculate stress scenarios using enhanced waterfall model
  const stressScenarios = amount > 0 ? calculateEnhancedStressScenarios(amount, selectedRange, totalTVL) : null;
  
  // Get tier protection info
  const avgSegment = (selectedRange[0] + selectedRange[1]) / 2;
  const tierProtection = getTierProtectionLevel(avgSegment);

  const scenarioConfigs = [
    {
      name: '5% Protocol Loss',
      description: 'Minor market stress',
      icon: Shield,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      data: stressScenarios?.scenario1
    },
    {
      name: '10% Protocol Loss', 
      description: 'Moderate market downturn',
      icon: AlertTriangle,
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-800 dark:text-orange-200',
      data: stressScenarios?.scenario5
    },
    {
      name: '20% Protocol Loss',
      description: 'Severe market crisis',
      icon: TrendingDown,
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      data: stressScenarios?.scenario10
    }
  ];

  const formatLossPercent = (value: number | undefined): string => {
    if (!value || value === 0) return '0.00';
    return value.toFixed(2);
  };

  const formatDollarLoss = (value: number | undefined): string => {
    if (!value || value === 0) return '0.00';
    return value.toFixed(2);
  };

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
            Mathematical Waterfall Loss Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Potential losses for your ${amount.toLocaleString()} position in segments {selectedRange[0]}-{selectedRange[1]} ({tierProtection.name} tier)
          </p>
        </CardHeader>
        <CardContent>
          {/* Tier Protection Status */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Mathematical Protection Level</span>
              </div>
              <Badge variant="outline" className={`${
                tierProtection.riskLevel === 'low' ? 'text-green-600' :
                tierProtection.riskLevel === 'medium' ? 'text-blue-600' :
                tierProtection.riskLevel === 'high' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {tierProtection.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {tierProtection.protection} - Mathematical loss absorption using quadratic and exponential scaling
            </p>
          </div>

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
                        {formatLossPercent(data?.lossPercent)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Dollar Loss:</span>
                      <span className={`font-bold text-sm ${scenario.textColor}`}>
                        ${formatDollarLoss(data?.dollarLoss)}
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
              <span className="font-medium text-sm">Mathematical Risk Profile</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Position Size</p>
                <p className="font-semibold">${amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Risk Range</p>
                <p className="font-semibold">{selectedRange[0]} - {selectedRange[1]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tier Protection</p>
                <p className="font-semibold">{tierProtection.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Max Mathematical Loss</p>
                <p className="font-semibold text-red-600">
                  ${formatDollarLoss(stressScenarios.scenario10.dollarLoss)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mathematical Waterfall Protection Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">
                T-Core Mathematical Waterfall Protection
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                Losses cascade through risk tiers using mathematical formulas: Hero tier uses exponential scaling, 
                Balanced tier uses quadratic progression, Conservative tier uses linear progression, and Safe tier 
                maintains maximum protection. Each tier's absorption capacity is calculated using precise mathematical 
                functions from the T-Core protocol formulas.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-blue-600 dark:text-blue-400 mt-3">
                <div>
                  <span className="font-medium">Hero Tier:</span> Exponential absorption (40% TVL)
                </div>
                <div>
                  <span className="font-medium">Balanced Tier:</span> Quadratic scaling (30% TVL)
                </div>
                <div>
                  <span className="font-medium">Conservative Tier:</span> Linear progression (20% TVL)
                </div>
                <div>
                  <span className="font-medium">Safe Tier:</span> Mathematical protection (10% TVL)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingStressTestPanel;
