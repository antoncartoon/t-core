
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, AlertTriangle, BarChart3, Info } from 'lucide-react';
import { calculateRiskLevelAPR, calculateRealisticRangeAPY, FIXED_BASE_APY, calculateTCoreAPY, RISK_SCALE_MIN, RISK_SCALE_MAX } from '@/utils/riskRangeCalculations';
import { calculateQuadraticRisk, getTierForSegment } from '@/utils/tzFormulas';

interface RangeSelectorProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  liquidityData?: Array<{ risk: number; liquidity: number }>;
  amount?: number;
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
    const tier = getTierForSegment(avg);
    const icons = {
      'Safe': Shield,
      'Conservative': Shield,
      'Balanced': TrendingUp,
      'Hero': AlertTriangle
    };
    const colors = {
      'Safe': 'bg-green-100 text-green-700',
      'Conservative': 'bg-blue-100 text-blue-700',
      'Balanced': 'bg-yellow-100 text-yellow-700',
      'Hero': 'bg-purple-100 text-purple-700'
    };
    return { 
      name: tier.name, 
      color: colors[tier.name] || 'bg-gray-100 text-gray-700',
      icon: icons[tier.name] || TrendingUp,
      formula: tier.formula
    };
  };

  const category = getRangeCategory(localValue[0], localValue[1]);
  const CategoryIcon = category.icon;
  const rangeSize = localValue[1] - localValue[0];
  const efficiency = Math.round(100 / Math.max(1, rangeSize / 10));

  // Calculate quadratic risk for the range
  const avgRisk = (localValue[0] + localValue[1]) / 2;
  const quadraticRisk = calculateQuadraticRisk(avgRisk);

  // Calculate expected APR using realistic calculation with amount
  const realisticAPY = amount > 0 ? calculateRealisticRangeAPY(amount, {
    min: localValue[0],
    max: localValue[1]
  }) : 0;
  
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
              Risk Segments (0 = Safe, 99 = Maximum Risk)
            </p>
            <p className="text-xs text-muted-foreground">
              Quadratic Risk Level: {(quadraticRisk * 100).toFixed(1)}%
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
              <span>0 (Safe)</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>99 (Max Risk)</span>
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
                  {category.formula}
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
                        left: `${(item.risk / 99) * 100}%`,
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
                    left: `${(localValue[0] / 99) * 100}%`,
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
              <p className="font-semibold">{rangeSize + 1} segments</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Capital Efficiency</p>
              <p className="font-semibold text-blue-600">{efficiency}%</p>
            </div>
          </div>

          {/* Risk Explanation */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p className="font-medium mb-1">Quadratic Risk & Piecewise Yield Model:</p>
            <p>• Risk increases quadratically: Risk(i) = (i/99)²</p>
            <p>• Safe (0-9): Fixed 5.16% | Conservative (10-29): Linear 5.16%→7%</p>
            <p>• Balanced (30-59): Quadratic 7%→9.5% | Hero (60-99): Exponential 9.5%×1.03^(i-25)</p>
            <p>• Yield flows bottom-up, losses flow top-down</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RangeSelector;
