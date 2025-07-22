
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Crown, Info } from 'lucide-react';
import { TIER_DEFINITIONS } from '@/types/riskTiers';
import { calculateStressScenarios } from '@/utils/lossDistribution';

interface RiskRangeSelectorProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  amount: number;
  tierData: Array<{
    level: number;
    liquidity: number;
    baseAPY: number;
    bonusAPY: number;
    utilization: number;
  }>;
  insurancePool: number;
}

const RiskRangeSelector = ({
  value,
  onChange,
  amount,
  tierData,
  insurancePool
}: RiskRangeSelectorProps) => {
  // Convert tier data for heat map
  const liquidityMap = tierData.reduce((acc, tier) => {
    acc[tier.level] = tier.liquidity;
    return acc;
  }, {} as Record<number, number>);

  // Calculate stress scenarios for current position
  const stressResults = calculateStressScenarios(
    { amount, riskRange: { min: value[0], max: value[1] } },
    liquidityMap,
    insurancePool
  );

  // Calculate weighted APY for selected range
  const selectedTiers = tierData.filter(
    tier => tier.level >= value[0] && tier.level <= value[1]
  );
  
  const weightedAPY = selectedTiers.reduce((sum, tier) => {
    const weight = 1 / (value[1] - value[0] + 1);
    return sum + (tier.baseAPY + tier.bonusAPY) * weight;
  }, 0);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Selected Range Info */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Selected Risk Range</h3>
            <p className="text-sm text-muted-foreground">
              Levels {value[0]} - {value[1]}
            </p>
          </div>
          <Badge variant="secondary" className="text-lg">
            {(weightedAPY * 100).toFixed(2)}% APY
          </Badge>
        </div>

        {/* Heat Map Visualization */}
        <div className="h-24 relative">
          {tierData.map((tier) => {
            const isSelected = tier.level >= value[0] && tier.level <= value[1];
            const hasBonus = tier.bonusAPY > 0;
            
            return (
              <div
                key={tier.level}
                className={`absolute h-full transition-colors duration-200 ${
                  isSelected ? 'bg-primary/20' : 'bg-muted'
                } ${hasBonus ? 'ring-2 ring-yellow-500/50' : ''}`}
                style={{
                  left: `${(tier.level / 99) * 100}%`,
                  width: '1%',
                  opacity: 0.3 + tier.utilization * 0.7
                }}
                title={`Level ${tier.level}: ${(tier.baseAPY * 100).toFixed(1)}% + ${(tier.bonusAPY * 100).toFixed(1)}% bonus`}
              />
            );
          })}
        </div>

        {/* Risk Range Slider */}
        <Slider
          value={value}
          min={0}
          max={99}
          step={1}
          onValueChange={onChange}
          className="mt-6"
        />

        {/* Tier Indicators */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-green-500" />
            Safe
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Conservative
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
            Balanced
          </div>
          <div className="flex items-center gap-1">
            <Crown className="w-4 h-4 text-purple-500" />
            Hero
          </div>
        </div>

        {/* Stress Test Results */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {stressResults.map((scenario) => (
            <div
              key={scenario.scenarioLoss}
              className="p-3 bg-muted rounded-lg text-center"
            >
              <div className="text-sm text-muted-foreground mb-1">
                {(scenario.scenarioLoss * 100)}% TVL Loss
              </div>
              <div className="text-lg font-semibold text-destructive">
                -{scenario.lossPercentage.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg mt-4">
          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Position Summary</p>
            <p className="text-muted-foreground">
              {amount.toLocaleString()} TDD split across {value[1] - value[0] + 1} risk levels
              {tierData.some(t => t.bonusAPY > 0) && 
                " with bonus yield opportunities"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskRangeSelector;
