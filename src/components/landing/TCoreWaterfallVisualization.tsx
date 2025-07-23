
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Star, 
  Crown, 
  ArrowUp, 
  ArrowDown,
  Info,
  Zap
} from 'lucide-react';
import { 
  calculateTCoreAPY, 
  TIER_PRESETS,
  FIXED_BASE_APY,
  OPTIMAL_K,
  TIER1_WIDTH
} from '@/utils/riskRangeCalculations';

interface TCoreWaterfallVisualizationProps {
  className?: string;
}

const TCoreWaterfallVisualization: React.FC<TCoreWaterfallVisualizationProps> = ({ className }) => {
  const [selectedLevel, setSelectedLevel] = useState(50);
  const [liquidityScenario, setLiquidityScenario] = useState('balanced'); // balanced, unbalanced, crisis
  
  // T-Core tier definitions with uneven widths
  const tierDefinitions = [
    { 
      name: 'Safe', 
      range: [0, 9], 
      width: 10, 
      color: 'bg-green-500', 
      textColor: 'text-green-600',
      icon: Shield,
      description: 'Fixed 6% guarantee'
    },
    { 
      name: 'Conservative', 
      range: [10, 29], 
      width: 20, 
      color: 'bg-blue-500', 
      textColor: 'text-blue-600',
      icon: Shield,
      description: 'Stable yields'
    },
    { 
      name: 'Balanced', 
      range: [30, 59], 
      width: 30, 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600',
      icon: Star,
      description: 'Enhanced yields'
    },
    { 
      name: 'Hero', 
      range: [60, 99], 
      width: 40, 
      color: 'bg-purple-500', 
      textColor: 'text-purple-600',
      icon: Crown,
      description: 'Maximum upside'
    }
  ];

  // Liquidity distribution scenarios
  const liquidityScenarios = {
    balanced: { tier1: 0.25, tier2: 0.25, tier3: 0.25, tier4: 0.25 }, // Equal distribution
    unbalanced: { tier1: 0.6, tier2: 0.2, tier3: 0.15, tier4: 0.05 }, // Heavy tier1
    crisis: { tier1: 0.8, tier2: 0.15, tier3: 0.04, tier4: 0.01 } // Flight to safety
  };

  const currentDistribution = liquidityScenarios[liquidityScenario as keyof typeof liquidityScenarios];

  // Calculate APY components for selected level
  const calculateAPYBreakdown = (level: number) => {
    const baseAPY = FIXED_BASE_APY;
    const totalAPY = calculateTCoreAPY(level);
    const bonusAPY = totalAPY - baseAPY;
    
    // Calculate bonus yield based on liquidity distribution
    const tier = tierDefinitions.find(t => level >= t.range[0] && level <= t.range[1]);
    if (!tier) return { baseAPY, bonusAPY: 0, totalAPY: baseAPY, liquidityBonus: 0 };
    
    const tierIndex = tierDefinitions.indexOf(tier);
    const tierLiquidity = Object.values(currentDistribution)[tierIndex];
    const targetLiquidity = 0.25; // 25% target per tier
    
    // Bonus yield inversely proportional to liquidity (incentivizes low-liquidity tiers)
    const liquidityBonus = tierLiquidity < targetLiquidity ? 
      (targetLiquidity - tierLiquidity) * 0.1 : 0; // Up to 1% bonus for low liquidity
    
    return {
      baseAPY,
      bonusAPY,
      liquidityBonus,
      totalAPY: totalAPY + liquidityBonus
    };
  };

  const apyBreakdown = calculateAPYBreakdown(selectedLevel);
  const selectedTier = tierDefinitions.find(t => selectedLevel >= t.range[0] && selectedLevel <= t.range[1]);

  // Generate waterfall flow data
  const generateWaterfallData = () => {
    const totalYield = 1000000; // $1M protocol yield for visualization
    const performanceFee = totalYield * 0.2; // 20% performance fee
    const bonusPool = performanceFee * 0.25; // 25% of fee goes to bonus
    
    // Tier 1 guaranteed yield first
    const tier1Yield = totalYield * currentDistribution.tier1 * FIXED_BASE_APY;
    const remainingYield = totalYield - tier1Yield;
    
    // Distribute remaining yield using f(i) formula
    const tiers = tierDefinitions.map((tier, index) => {
      if (index === 0) {
        return {
          ...tier,
          baseYield: tier1Yield,
          bonusYield: 0,
          totalYield: tier1Yield
        };
      }
      
      const avgLevel = (tier.range[0] + tier.range[1]) / 2;
      const factor = Math.pow(OPTIMAL_K, avgLevel - TIER1_WIDTH);
      const tierLiquidity = Object.values(currentDistribution)[index];
      const yieldShare = (factor * tierLiquidity) / 
        tierDefinitions.slice(1).reduce((sum, t, i) => {
          const level = (t.range[0] + t.range[1]) / 2;
          const f = Math.pow(OPTIMAL_K, level - TIER1_WIDTH);
          return sum + f * Object.values(currentDistribution)[i + 1];
        }, 0);
      
      const tierBaseYield = remainingYield * yieldShare;
      const tierBonusYield = bonusPool * (tierLiquidity < 0.25 ? (0.25 - tierLiquidity) * 4 : 0);
      
      return {
        ...tier,
        baseYield: tierBaseYield,
        bonusYield: tierBonusYield,
        totalYield: tierBaseYield + tierBonusYield
      };
    });
    
    return tiers;
  };

  const waterfallData = generateWaterfallData();

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            T-Core Waterfall Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Level: {selectedLevel}</label>
              <Slider
                value={[selectedLevel]}
                onValueChange={(value) => setSelectedLevel(value[0])}
                min={0}
                max={99}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Liquidity Scenario</label>
              <div className="flex gap-2">
                {Object.keys(liquidityScenarios).map((scenario) => (
                  <Button
                    key={scenario}
                    variant={liquidityScenario === scenario ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLiquidityScenario(scenario)}
                    className="capitalize"
                  >
                    {scenario}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Tier Visualization with Uneven Widths */}
          <div className="space-y-4">
            <h4 className="font-medium">Tier Structure (Uneven Widths for Fair Distribution)</h4>
            <div className="relative h-16 bg-muted/20 rounded-lg overflow-hidden">
              {tierDefinitions.map((tier, index) => {
                const startPercent = tierDefinitions.slice(0, index).reduce((sum, t) => sum + t.width, 0);
                const isSelected = selectedLevel >= tier.range[0] && selectedLevel <= tier.range[1];
                
                return (
                  <div
                    key={tier.name}
                    className={`absolute h-full transition-all duration-300 border-r-2 border-background cursor-pointer ${
                      isSelected ? 'ring-2 ring-primary ring-inset' : ''
                    }`}
                    style={{
                      left: `${startPercent}%`,
                      width: `${tier.width}%`,
                      backgroundColor: `hsl(var(${tier.color.replace('bg-', '--')}))`
                    }}
                    onClick={() => setSelectedLevel(Math.floor((tier.range[0] + tier.range[1]) / 2))}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-white text-xs font-medium">
                      <tier.icon className="h-3 w-3 mb-1" />
                      <span>{tier.name}</span>
                      <span className="opacity-70">{tier.range[0]}-{tier.range[1]}</span>
                    </div>
                  </div>
                );
              })}
              
              {/* Selected level indicator */}
              <div
                className="absolute top-0 w-0.5 h-full bg-red-500 z-10 animate-pulse"
                style={{ left: `${selectedLevel}%` }}
              />
            </div>
          </div>

          {/* APY Breakdown */}
          {selectedTier && (
            <Card className="bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-950/20 dark:to-purple-950/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Base APY</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {(apyBreakdown.baseAPY * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Risk Bonus</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      +{(apyBreakdown.bonusAPY * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Liquidity Bonus</span>
                    </div>
                    <div className="text-xl font-bold text-yellow-600">
                      +{(apyBreakdown.liquidityBonus * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Total APY</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {(apyBreakdown.totalAPY * 100).toFixed(1}}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Waterfall Flow Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Yield Flow (Bottom-Up) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <ArrowUp className="h-4 w-4" />
                  Yield Waterfall (Bottom-Up)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {waterfallData.map((tier, index) => (
                    <div key={tier.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <tier.icon className={`h-4 w-4 ${tier.textColor}`} />
                          <span className="font-medium">{tier.name}</span>
                        </div>
                        <Badge variant="outline">
                          ${(tier.totalYield / 1000).toFixed(0)}k
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Base:</span>
                          <span>${(tier.baseYield / 1000).toFixed(0)}k</span>
                        </div>
                        {tier.bonusYield > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Bonus:</span>
                            <span className="text-yellow-600">+${(tier.bonusYield / 1000).toFixed(0)}k</span>
                          </div>
                        )}
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className={tier.color}
                          style={{ width: `${(tier.totalYield / Math.max(...waterfallData.map(t => t.totalYield))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Loss Cascade (Top-Down) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <ArrowDown className="h-4 w-4" />
                  Loss Cascade (Top-Down)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...waterfallData].reverse().map((tier, index) => {
                    const originalIndex = waterfallData.length - 1 - index;
                    const isProtected = originalIndex === 0; // Tier1 is protected
                    
                    return (
                      <div key={tier.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <tier.icon className={`h-4 w-4 ${tier.textColor}`} />
                            <span className="font-medium">{tier.name}</span>
                          </div>
                          <Badge variant={isProtected ? "secondary" : "destructive"}>
                            {isProtected ? 'Protected' : `${index + 1}st Loss`}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {isProtected 
                            ? '0% loss - Fixed guarantee protection'
                            : `Absorbs losses first via subordination`
                          }
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className={isProtected ? 'bg-green-500' : 'bg-red-500'}
                            style={{ width: `${isProtected ? 100 : (4 - index) * 25}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formula Explanation */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>T-Core Formula:</strong> f(i) = {OPTIMAL_K}^(i-{TIER1_WIDTH}) where i = risk level. 
              Tier1 (0-9) gets fixed {(FIXED_BASE_APY * 100).toFixed(1)}% guarantee. 
              Higher tiers get base + bonus yield proportional to f(i). 
              Performance fee (20%) creates bonus pool for liquidity incentives.
            </AlertDescription>
          </Alert>

          {/* Liquidity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Current Liquidity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tierDefinitions.map((tier, index) => {
                  const currentLiquidity = Object.values(currentDistribution)[index];
                  const targetLiquidity = 0.25;
                  const isUnderweight = currentLiquidity < targetLiquidity;
                  
                  return (
                    <div key={tier.name} className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <tier.icon className={`h-4 w-4 ${tier.textColor}`} />
                        <span className="font-medium">{tier.name}</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {(currentLiquidity * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Target: {(targetLiquidity * 100)}%
                      </div>
                      {isUnderweight && (
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Bonus Active
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default TCoreWaterfallVisualization;
