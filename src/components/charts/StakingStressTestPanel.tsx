
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertTriangle, Shield, TrendingDown, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateEnhancedStressScenarios, getTierProtectionLevel } from '@/utils/stressTestCalculations';
import { PROTOCOL_USD_TVL } from '@/utils/protocolConstants';

interface StakingStressTestPanelProps {
  amount: number;
  selectedRange: [number, number];
  totalTVL?: number;
}

const StakingStressTestPanel: React.FC<StakingStressTestPanelProps> = ({
  amount,
  selectedRange,
  totalTVL = PROTOCOL_USD_TVL // Use unified protocol constant
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
    if (!value) return '0.0000';
    if (value === 0) return '0.0000';
    if (value < 0.01) return value.toFixed(4);
    return value.toFixed(2);
  };

  const formatDollarLoss = (value: number | undefined): string => {
    if (!value) return '0.0000';
    if (value === 0) return '0.0000';
    if (value < 0.01) return value.toFixed(4);
    return value.toFixed(2);
  };

  if (!stressScenarios) {
    return (
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            Stress Test Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-4 text-muted-foreground">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Enter amount to analyze</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get max loss for quick preview
  const maxLoss = stressScenarios?.scenario10?.dollarLoss || 0;
  const maxLossPercent = stressScenarios?.scenario10?.lossPercent || 0;

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Stress Test Analysis
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${
                  tierProtection.riskLevel === 'low' ? 'text-green-600' :
                  tierProtection.riskLevel === 'medium' ? 'text-blue-600' :
                  tierProtection.riskLevel === 'high' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {tierProtection.name}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            {!isOpen && (
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>Max Loss: ${formatDollarLoss(maxLoss)} ({formatLossPercent(maxLossPercent)}%)</span>
                <span>Click to expand</span>
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
              {scenarioConfigs.map((scenario, index) => {
                const data = scenario.data;
                return (
                  <div key={scenario.name} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{scenario.name.split(' ')[0]}</div>
                    <div className={`font-semibold text-sm ${scenario.textColor}`}>
                      ${formatDollarLoss(data?.dollarLoss)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Scenarios */}
            <div className="space-y-3">
              {scenarioConfigs.map((scenario, index) => {
                const Icon = scenario.icon;
                const data = scenario.data;
                
                return (
                  <div key={scenario.name} className={`p-3 rounded-lg border ${scenario.borderColor} ${scenario.bgColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-3 w-3 ${scenario.textColor}`} />
                        <span className="font-medium text-xs">{scenario.name}</span>
                      </div>
                      <span className={`font-bold text-sm ${scenario.textColor}`}>
                        ${formatDollarLoss(data?.dollarLoss)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Loss: {formatLossPercent(data?.lossPercent)}%</span>
                      <span>Remaining: ${(amount - (data?.dollarLoss || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Protection Info */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-3 w-3 text-blue-600" />
                <span className="font-medium text-xs text-blue-800 dark:text-blue-200">
                  Mathematical Protection
                </span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Losses cascade through tiers using mathematical formulas. Your position in the {tierProtection.name} tier 
                has {tierProtection.protection.toLowerCase()}.
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default StakingStressTestPanel;
