
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Info, Crown } from 'lucide-react';
import { TIER_DEFINITIONS } from '@/types/riskTiers';
import { calculatePiecewiseAPY, calculateQuadraticRisk } from '@/utils/tzFormulas';

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
  const avgSegment = (value[0] + value[1]) / 2;
  const expectedAPY = calculatePiecewiseAPY(avgSegment);
  const quadraticRisk = calculateQuadraticRisk(avgSegment);
  const isFixed = currentTier?.[1].isFixed || false;

  return (
    <Card className={className}>
      <CardContent className="p-6 space-y-6">
        {/* Current Selection Info */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Selected Risk Range</h3>
            <p className="text-sm text-muted-foreground">
              Segments {value[0]} - {value[1]}
            </p>
            <p className="text-xs text-muted-foreground">
              Quadratic Risk: {(quadraticRisk * 100).toFixed(1)}%
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
            min={0}
            max={99}
            step={1}
            onValueChange={onChange}
            className="mt-6"
          />

          {/* Tier Indicators */}
          <div className="grid grid-cols-4 gap-2 text-sm">
            {Object.entries(TIER_DEFINITIONS).map(([key, tier]) => {
              const isSelected = currentTier?.[0] === key;
              const tierIcon = tier.name === 'Safe' ? Shield : 
                              tier.name === 'Conservative' ? Shield :
                              tier.name === 'Balanced' ? TrendingUp : Crown;
              
              return (
                <div
                  key={key}
                  className={`p-2 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-primary/20 border border-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    {React.createElement(tierIcon, { className: "w-4 h-4" })}
                    <span>{tier.name}</span>
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-1">
                    {tier.min}-{tier.max}
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-1">
                    {tier.formula}
                  </div>
                </div>
              );
            })}
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
                guaranteed by T-Bills × 1.2
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-1" />
              <p className="text-sm text-muted-foreground">
                Progressive APY based on {currentTier?.[1].formula}. 
                Risk increases quadratically: (i/99)²
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

        {/* Stress Test Preview */}
        <div className="bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-950/20 dark:to-yellow-950/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium">Stress Test Scenarios</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-muted-foreground">1% TVL Loss</p>
              <p className="font-semibold text-yellow-700">
                -{(amount * quadraticRisk * 0.01).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">5% TVL Loss</p>
              <p className="font-semibold text-orange-700">
                -{(amount * quadraticRisk * 0.05).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">10% TVL Loss</p>
              <p className="font-semibold text-red-700">
                -{(amount * quadraticRisk * 0.10).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskTierSelector;
