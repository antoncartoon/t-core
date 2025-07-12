
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, AlertTriangle, BarChart3, Info } from 'lucide-react';
import { calculateRiskLevelAPR, calculateRealisticRangeAPY, MIN_GUARANTEED_APY, MAX_APY, RISK_SCALE_MIN, RISK_SCALE_MAX } from '@/utils/riskRangeCalculations';

interface RangeSelectorProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  liquidityData?: Array<{ risk: number; liquidity: number }>;
  amount?: number; // Amount for realistic APY calculation
  className?: string;
}

const RangeSelector = ({ value, onChange, liquidityData = [], amount = 0, className = "" }: RangeSelectorProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: number[]) => {
    const range: [number, number] = [newValue[0], newValue[1]];
    setLocalValue(range);
    onChange(range);
  };

  const getRangeCategory = (min: number, max: number) => {
    const avg = (min + max) / 2;
    if (avg <= 25) return { name: 'Conservative', color: 'bg-green-100 text-green-700', icon: Shield };
    if (avg <= 60) return { name: 'Moderate', color: 'bg-yellow-100 text-yellow-700', icon: TrendingUp };
    return { name: 'Aggressive', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
  };

  const category = getRangeCategory(localValue[0], localValue[1]);
  const CategoryIcon = category.icon;
  const rangeSize = localValue[1] - localValue[0];
  const efficiency = Math.round(100 / Math.max(1, rangeSize / 10)); // Capital efficiency score

  // Calculate expected APR using realistic calculation with amount
  const realisticAPY = amount > 0 ? calculateRealisticRangeAPY(amount, {
    min: localValue[0],
    max: localValue[1]
  }) : 0;
  
  // Also show theoretical range
  const minTheoreticalAPR = calculateRiskLevelAPR(localValue[0]);
  const maxTheoreticalAPR = calculateRiskLevelAPR(localValue[1]);

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Risk Range Selection</h3>
            <Badge className={category.color}>
              <CategoryIcon className="w-3 h-3 mr-1" />
              {category.name}
            </Badge>
          </div>

          {/* Range Display */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">
              {localValue[0]} - {localValue[1]}
            </div>
            <p className="text-sm text-muted-foreground">
              Risk Level Range ({RISK_SCALE_MIN} = T-Bill +20%, {RISK_SCALE_MAX} = Maximum Risk)
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <Slider
              value={localValue}
              onValueChange={handleChange}
              min={RISK_SCALE_MIN}
              max={RISK_SCALE_MAX}
              step={1}
              className="w-full"
              minStepsBetweenThumbs={1}
            />
            
            {/* Scale Labels */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 (T-Bill +20%)</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100 (Max Risk)</span>
            </div>
          </div>

          {/* Expected APR Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Expected APY</span>
            </div>
            {amount > 0 && realisticAPY > 0 ? (
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {(realisticAPY * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Realistic estimate for {amount.toLocaleString()} TDD
                </p>
                <p className="text-xs text-muted-foreground">
                  Theoretical range: {(minTheoreticalAPR * 100).toFixed(1)}% - {(maxTheoreticalAPR * 100).toFixed(1)}%
                </p>
              </div>
            ) : (
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {(minTheoreticalAPR * 100).toFixed(1)}% - {(maxTheoreticalAPR * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Non-linear curve: r_i = {(MIN_GUARANTEED_APY * 100).toFixed(1)}% + {((MAX_APY - MIN_GUARANTEED_APY) * 100).toFixed(0)}% × ((i-1)/99)²
                </p>
              </div>
            )}
          </div>

          {/* Liquidity Density Visualization */}
          {liquidityData.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Liquidity Density</span>
              </div>
              <div className="h-12 bg-muted rounded relative overflow-hidden">
                {liquidityData.map((item, index) => {
                  const isInRange = item.risk >= localValue[0] && item.risk <= localValue[1];
                  return (
                    <div
                      key={index}
                      className={`absolute transition-colors ${
                        isInRange ? 'bg-blue-500/80 hover:bg-blue-500' : 'bg-blue-500/40 hover:bg-blue-500/60'
                      }`}
                      style={{
                        left: `${((item.risk - 1) / 99) * 100}%`,
                        width: '1%',
                        height: `${Math.min(100, (item.liquidity / Math.max(...liquidityData.map(d => d.liquidity))) * 100)}%`,
                        bottom: 0
                      }}
                    />
                  );
                })}
                {/* Selected Range Overlay */}
                <div
                  className="absolute bg-primary/20 border-2 border-primary rounded"
                  style={{
                    left: `${((localValue[0] - 1) / 99) * 100}%`,
                    width: `${((localValue[1] - localValue[0]) / 99) * 100}%`,
                    height: '100%'
                  }}
                />
              </div>
            </div>
          )}

          {/* Range Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Range Size</p>
              <p className="font-semibold">{rangeSize + 1} levels</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Capital Efficiency</p>
              <p className="font-semibold text-blue-600">{efficiency}%</p>
            </div>
          </div>

          {/* Risk Explanation */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p className="font-medium mb-1">Waterfall Distribution Model:</p>
            <p>• Yield flows bottom-up: level 1 gets paid first (guaranteed T-Bill +20%)</p>
            <p>• Losses flow top-down: level 100 takes losses first</p>
            <p>• Coverage level K depends on 28-day historical protocol APY</p>
            <p>• Narrower ranges = higher capital efficiency but more concentrated risk</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RangeSelector;
