import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Calculator, TrendingUp, Zap } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/data/tcoreData';
import { simulateSurplusDistribution } from '@/utils/riskRangeCalculations';

const SurplusSimulator = () => {
  const [amount, setAmount] = useState(10000);
  const [riskRange, setRiskRange] = useState([26, 50]);
  const [showResults, setShowResults] = useState(false);

  const calculateSurplusFlow = () => {
    const distribution = simulateSurplusDistribution();
    const [minRisk, maxRisk] = riskRange;
    
    // Determine which tier the user is in
    let tierBonus = 0;
    let tierName = '';
    
    if (maxRisk <= 25) {
      tierBonus = 0;
      tierName = 'Tier 1 (Fixed)';
    } else if (maxRisk <= 50) {
      tierBonus = distribution.tier2;
      tierName = 'Tier 2 (Low Bonus)';
    } else if (maxRisk <= 75) {
      tierBonus = distribution.tier3;
      tierName = 'Tier 3 (Medium Bonus)';
    } else {
      tierBonus = distribution.tier4;
      tierName = 'Tier 4 (High Bonus)';
    }
    
    // Calculate user's share based on position size
    const avgRisk = (minRisk + maxRisk) / 2;
    const baseAPY = 0.06; // 6% fixed base
    const bonusAPY = tierBonus * 0.000001; // Convert to APY
    
    // Risk-adjusted bonus
    const riskMultiplier = Math.pow(1.03, avgRisk - 25);
    const adjustedBonus = bonusAPY * riskMultiplier;
    
    const totalAPY = baseAPY + adjustedBonus;
    const annualReturn = amount * totalAPY;
    const monthlyReturn = annualReturn / 12;
    
    return {
      tierName,
      baseAPY,
      bonusAPY: adjustedBonus,
      totalAPY,
      annualReturn,
      monthlyReturn,
      surplusShare: tierBonus
    };
  };

  const results = calculateSurplusFlow();

  const handleSimulate = () => {
    setShowResults(true);
  };

  return (
    <div className="space-y-4">
      {/* Input Controls */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="text-sm font-medium">
            Investment Amount
          </Label>
          <div className="relative mt-1">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="pl-8"
              min="1000"
              max="1000000"
              step="1000"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              $
            </span>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Risk Range: {riskRange[0]} - {riskRange[1]}
          </Label>
          <div className="mt-2 px-2">
            <Slider
              value={riskRange}
              onValueChange={setRiskRange}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Safe (1)</span>
            <span>Hero (100)</span>
          </div>
        </div>

        <Button 
          onClick={handleSimulate}
          className="w-full"
          size="sm"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Simulate Cash Flow
        </Button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Projected Returns</span>
            <Badge variant="outline" className="text-xs">
              {results.tierName}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Fixed Base APY</p>
              <p className="text-sm font-semibold">
                {formatPercentage(results.baseAPY)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Surplus Bonus</p>
              <p className="text-sm font-semibold text-green-600">
                +{formatPercentage(results.bonusAPY)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total APY</span>
              <span className="text-lg font-bold text-blue-600">
                {formatPercentage(results.totalAPY)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground">Annual Return</p>
                <p className="font-semibold">{formatCurrency(results.annualReturn)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monthly Return</p>
                <p className="font-semibold">{formatCurrency(results.monthlyReturn)}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Surplus Impact</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your tier receives {formatCurrency(results.surplusShare)} from the surplus pool,
              boosting your base yield by {formatPercentage(results.bonusAPY)}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurplusSimulator;