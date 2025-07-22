
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Info } from 'lucide-react';
import { TIER_DEFINITIONS } from '@/types/riskTiers';

interface RiskTierSelectorProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  amount: number;
  className?: string;
}

const RiskTierSelector = ({ value, onChange, amount, className = "" }: RiskTierSelectorProps) => {
  // Get current tier based on selected range
  const getCurrentTier = (range: [number, number]) => {
    const avgRisk = (range[0] + range[1]) / 2;
    return Object.entries(TIER_DEFINITIONS).find(
      ([_, tier]) => avgRisk >= tier.min && avgRisk <= tier.max
    );
  };

  const currentTier = getCurrentTier(value);
  const expectedAPY = currentTier?.[1].baseAPY || 0;
  const isFixed = currentTier?.[1].isFixed || false;

  return (
    <Card className={className}>
      <CardContent className="p-6 space-y-6">
        {/* Current Selection Info */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Selected Risk Range</h3>
            <p className="text-sm text-muted-foreground">
              Levels {value[0]} - {value[1]}
            </p>
          </div>
          <Badge variant={isFixed ? "secondary" : "default"} className="text-lg">
            {(expectedAPY * 100).toFixed(2)}% {isFixed ? "(Fixed)" : "APY"}
          </Badge>
        </div>

        {/* Risk Level Slider */}
        <div className="space-y-4">
          <Slider
            value={value}
            min={1}
            max={100}
            step={1}
            onValueChange={onChange}
            className="mt-6"
          />

          {/* Tier Indicators */}
          <div className="grid grid-cols-4 gap-2 text-sm">
            {Object.entries(TIER_DEFINITIONS).map(([key, tier]) => (
              <div
                key={key}
                className={`p-2 rounded-lg ${
                  currentTier?.[0] === key 
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-1 justify-center">
                  {tier.name === 'Safe' ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span>{tier.name}</span>
                </div>
                <div className="text-center text-xs text-muted-foreground mt-1">
                  {tier.min}-{tier.max}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APY Breakdown */}
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Expected Annual Return</span>
            {amount > 0 && (
              <span className="text-lg font-bold text-primary">
                ${(amount * expectedAPY).toFixed(2)}
              </span>
            )}
          </div>
          
          {isFixed ? (
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-500 mt-1" />
              <p className="text-sm text-muted-foreground">
                This range provides a fixed {(expectedAPY * 100).toFixed(1)}% APY 
                guaranteed by T-Bills
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-1" />
              <p className="text-sm text-muted-foreground">
                Variable APY based on protocol performance and bonus yield distribution
              </p>
            </div>
          )}
        </div>

        {/* Position Summary */}
        {amount > 0 && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Initial Deposit</p>
              <p className="font-semibold">${amount.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Annual Yield</p>
              <p className="font-semibold text-primary">
                ${(amount * expectedAPY).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskTierSelector;
