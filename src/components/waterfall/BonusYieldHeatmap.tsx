
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Info, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TIER_DEFINITIONS } from '@/types/riskTiers';
import { DISTRIBUTION_PARAMS } from '@/utils/tcoreCalculations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BonusYieldHeatmapProps {
  targetDistribution?: Record<string, number>;
  currentDistribution?: Record<string, number>;
  bonusYields?: Record<string, number>;
}

const BonusYieldHeatmap = ({
  targetDistribution = {
    SAFE: 0.10,
    CONSERVATIVE: 0.20,
    BALANCED: 0.30,
    HERO: 0.40
  },
  currentDistribution = {
    SAFE: 0.45, // Overweight (no bonus)
    CONSERVATIVE: 0.25, // Slightly overweight (no bonus)
    BALANCED: 0.20, // Underweight (gets bonus)
    HERO: 0.10  // Severely underweight (gets most bonus)
  },
  bonusYields = {
    SAFE: 0,
    CONSERVATIVE: 0,
    BALANCED: 1.2,
    HERO: 3.5
  }
}: BonusYieldHeatmapProps) => {
  // Calculate imbalances
  const imbalances = Object.keys(targetDistribution).reduce((acc, tier) => {
    acc[tier] = ((targetDistribution[tier] - currentDistribution[tier]) / targetDistribution[tier]) * 100;
    return acc;
  }, {} as Record<string, number>);

  // Generate bucket data with intensity
  const generateBuckets = () => {
    const buckets = [];
    
    // Generate all buckets from 0 to 99 (matching ТЗ)
    for (let i = 0; i < 100; i++) {
      // Determine which tier this bucket belongs to based on ТЗ ranges
      let currentTier = 'SAFE';
      if (i >= 0 && i <= 9) {
        currentTier = 'SAFE';
      } else if (i >= 10 && i <= 29) {
        currentTier = 'CONSERVATIVE';
      } else if (i >= 30 && i <= 59) {
        currentTier = 'BALANCED';
      } else if (i >= 60 && i <= 99) {
        currentTier = 'HERO';
      }
      
      // Imbalance data for this tier
      const imbalance = imbalances[currentTier] || 0;
      const bonusYield = bonusYields[currentTier] || 0;
      
      // Determine color intensity based on imbalance (negative = overweight, positive = underweight)
      let colorClass = 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'; // Neutral
      let intensity = 'none';
      
      if (imbalance <= -10) {
        colorClass = 'bg-blue-300 dark:bg-blue-800 border border-blue-400 dark:border-blue-700'; // Overweight
        intensity = 'overweight';
      } else if (imbalance < 0) {
        colorClass = 'bg-blue-200 dark:bg-blue-700 border border-blue-300 dark:border-blue-600'; // Slightly overweight
        intensity = 'slight-over';
      } else if (imbalance > 20) {
        colorClass = 'bg-orange-500 dark:bg-orange-600 border-2 border-orange-400 dark:border-orange-500 shadow-lg'; // Severely underweight - very interesting
        intensity = 'high-bonus';
      } else if (imbalance > 10) {
        colorClass = 'bg-orange-400 dark:bg-orange-500 border border-orange-300 dark:border-orange-400 shadow-md'; // Very underweight - interesting
        intensity = 'medium-bonus';
      } else if (imbalance > 0) {
        colorClass = 'bg-orange-200 dark:bg-orange-700 border border-orange-300 dark:border-orange-600'; // Slightly underweight - somewhat interesting
        intensity = 'low-bonus';
      }
      
      buckets.push({
        id: i,
        tier: currentTier,
        imbalance,
        bonusYield,
        colorClass,
        intensity
      });
    }
    
    return buckets;
  };

  const buckets = generateBuckets();
  
  // Calculate total bonus pool
  const bonusPoolAmount = 125000;
  const totalUnderweight = Object.keys(imbalances).filter(tier => imbalances[tier] > 0).length;

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Flame className="h-6 w-6 text-orange-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            Bonus Yield Heatmap
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">LIVE</Badge>
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full p-1 hover:bg-muted">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[350px]">
                <p className="text-sm">
                  This live heatmap shows which risk buckets (0-99) receive bonus APY. Orange buckets are underweight 
                  and earn extra yield from {DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100}% of the {DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}% 
                  performance fee. The brighter the orange, the higher the bonus!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Alert variant="default" className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800 mb-6">
          <Lightbulb className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-muted-foreground text-sm">
            <span className="font-medium text-orange-600">Hot Zones:</span> Bright orange areas show underweight buckets 
            receiving up to <span className="font-bold text-orange-700">+3.5% bonus APY</span> from protocol fee redistribution.
            Position in these zones for maximum returns!
          </AlertDescription>
        </Alert>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <div className="text-xl font-bold text-orange-600">${bonusPoolAmount.toLocaleString()}</div>
            <div className="text-xs text-orange-700">Bonus Pool Available</div>
          </div>
          <div className="text-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{totalUnderweight}</div>
            <div className="text-xs text-orange-700">Tiers Getting Bonus</div>
          </div>
          <div className="text-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <div className="text-xl font-bold text-orange-600">+{Math.max(...Object.values(bonusYields)).toFixed(1)}%</div>
            <div className="text-xs text-orange-700">Max Bonus APY</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-sm bg-blue-300 border border-blue-400" />
            <span>Overweight (No Bonus)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-sm bg-gray-200 border border-gray-300" />
            <span>Balanced</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-sm bg-orange-300 border border-orange-400" />
            <span>Bonus Zone</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-sm bg-orange-500 border-2 border-orange-400 shadow-lg" />
            <span>High Bonus</span>
          </div>
        </div>
        
        {/* Heatmap Grid */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-center">Risk Buckets (0-99) - Click for details</h4>
          <div className="grid grid-cols-20 gap-[2px] rounded-lg overflow-hidden bg-border p-2" 
               style={{ gridTemplateColumns: 'repeat(20, 1fr)' }}>
            {buckets.map((bucket) => (
              <TooltipProvider key={bucket.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`${bucket.colorClass} aspect-square w-full cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 relative flex items-center justify-center`}
                      style={{ fontSize: '6px', minWidth: '16px', minHeight: '16px' }}
                    >
                      {bucket.intensity === 'high-bonus' && (
                        <div className="absolute inset-0 bg-orange-400 animate-pulse rounded-sm"></div>
                      )}
                      <span className="relative text-[6px] font-bold text-white drop-shadow-sm">
                        {bucket.id}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <div className="text-xs space-y-1">
                      <div className="font-bold">Bucket {bucket.id}</div>
                      <div className="text-orange-600">{TIER_DEFINITIONS[bucket.tier as keyof typeof TIER_DEFINITIONS].name} Tier</div>
                      {bucket.bonusYield > 0 ? (
                        <div className="font-bold text-orange-500 text-sm">
                          🔥 +{bucket.bonusYield.toFixed(1)}% Bonus APY
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No bonus (overweight)</div>
                      )}
                      <div className="text-muted-foreground">
                        {bucket.imbalance < 0 
                          ? `${Math.abs(bucket.imbalance).toFixed(1)}% Overweight` 
                          : bucket.imbalance > 0 
                            ? `${bucket.imbalance.toFixed(1)}% Underweight`
                            : 'Perfectly Balanced'}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          {/* Tier Labels */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <div className="font-medium">Safe (0-9)</div>
              <div className="text-green-600">10 buckets</div>
            </div>
            <div className="text-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <div className="font-medium">Conservative (10-29)</div>
              <div className="text-blue-600">20 buckets</div>
            </div>
            <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
              <div className="font-medium">Balanced (30-59)</div>
              <div className="text-yellow-600">30 buckets</div>
            </div>
            <div className="text-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
              <div className="font-medium">Hero (60-99)</div>
              <div className="text-purple-600">40 buckets</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Live Tier Analysis
          </h4>
          <div className="space-y-3">
            {Object.keys(targetDistribution).map((tier) => {
              const target = targetDistribution[tier] * 100;
              const current = currentDistribution[tier] * 100;
              const delta = target - current; // Positive = underweight (needs more)
              const bonusYield = bonusYields[tier];
              const isUnderweight = delta > 0;
              
              return (
                <div key={tier} className={`p-3 rounded-lg border-2 ${
                  isUnderweight 
                    ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' 
                    : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{TIER_DEFINITIONS[tier as keyof typeof TIER_DEFINITIONS].name}</span>
                      {isUnderweight && bonusYield > 0 && (
                        <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{bonusYield.toFixed(1)}% Bonus
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {current.toFixed(1)}% / {target.toFixed(1)}% target
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={current} 
                      className={`h-2 ${
                        isUnderweight 
                          ? '[&>div]:bg-orange-500' 
                          : '[&>div]:bg-blue-500'
                      }`} 
                    />
                    <div className="flex justify-between text-xs">
                      <span className={isUnderweight ? 'text-orange-600' : 'text-blue-600'}>
                        {isUnderweight 
                          ? `${delta.toFixed(1)}% underweight - receiving bonus` 
                          : `${Math.abs(delta).toFixed(1)}% overweight - no bonus`}
                      </span>
                      {bonusYield > 0 && (
                        <span className="font-medium text-orange-600">
                          💰 Earning ${(bonusPoolAmount * 0.25).toLocaleString()} bonus
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Formula explanation */}
        <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg mt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Live Formula:</strong> bonus_i = (${bonusPoolAmount.toLocaleString()} × (target_weight_i - current_weight_i)) / sum_positive_deltas
            <br />
            <span className="text-orange-600">Orange zones</span> show real-time underweight buckets receiving bonus yield from fee redistribution
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusYieldHeatmap;
