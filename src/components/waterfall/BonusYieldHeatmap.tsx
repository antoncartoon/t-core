
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TIER_DEFINITIONS } from '@/types/riskTiers';
import { DISTRIBUTION_PARAMS } from '@/utils/tcoreCalculations';

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
    SAFE: 0.45, // Overweight
    CONSERVATIVE: 0.25, // Slightly overweight
    BALANCED: 0.20, // Underweight
    HERO: 0.10  // Severely underweight
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
    
    // Map tiers to their ranges
    const tierRanges = {
      SAFE: [TIER_DEFINITIONS.SAFE.min, TIER_DEFINITIONS.SAFE.max],
      CONSERVATIVE: [TIER_DEFINITIONS.CONSERVATIVE.min, TIER_DEFINITIONS.CONSERVATIVE.max],
      BALANCED: [TIER_DEFINITIONS.BALANCED.min, TIER_DEFINITIONS.BALANCED.max],
      HERO: [TIER_DEFINITIONS.HERO.min, TIER_DEFINITIONS.HERO.max]
    };
    
    // Generate all buckets from 1 to 100
    for (let i = 1; i <= 100; i++) {
      // Determine which tier this bucket belongs to
      let currentTier = 'SAFE';
      if (i >= TIER_DEFINITIONS.HERO.min && i <= TIER_DEFINITIONS.HERO.max) {
        currentTier = 'HERO';
      } else if (i >= TIER_DEFINITIONS.BALANCED.min && i <= TIER_DEFINITIONS.BALANCED.max) {
        currentTier = 'BALANCED';
      } else if (i >= TIER_DEFINITIONS.CONSERVATIVE.min && i <= TIER_DEFINITIONS.CONSERVATIVE.max) {
        currentTier = 'CONSERVATIVE';
      }
      
      // Imbalance data for this tier
      const imbalance = imbalances[currentTier] || 0;
      const bonusYield = bonusYields[currentTier] || 0;
      
      // Determine color intensity based on imbalance (negative = overweight, positive = underweight)
      let colorClass = 'bg-gray-200 dark:bg-gray-800'; // Neutral
      
      if (imbalance <= -10) {
        colorClass = 'bg-blue-200 dark:bg-blue-900'; // Overweight
      } else if (imbalance < 0) {
        colorClass = 'bg-blue-100 dark:bg-blue-800'; // Slightly overweight
      } else if (imbalance > 20) {
        colorClass = 'bg-orange-500 dark:bg-orange-500'; // Severely underweight - very interesting
      } else if (imbalance > 10) {
        colorClass = 'bg-orange-300 dark:bg-orange-600'; // Very underweight - interesting
      } else if (imbalance > 0) {
        colorClass = 'bg-orange-100 dark:bg-orange-800'; // Slightly underweight - somewhat interesting
      }
      
      buckets.push({
        id: i,
        tier: currentTier,
        imbalance,
        bonusYield,
        colorClass
      });
    }
    
    return buckets;
  };

  const buckets = generateBuckets();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Bonus Yield Heatmap
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full p-1 hover:bg-muted">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p className="text-sm">
                  Orange buckets have higher bonus APY from the performance fee redistribution. 
                  {DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100}% of the {DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}% 
                  performance fee goes to bonus yield for underweighted tiers.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-800" />
              <span>Balanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" />
              <span>Overweight</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-orange-300 dark:bg-orange-600" />
              <span>Underweight (Bonus)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-100 gap-[1px] rounded-md overflow-hidden bg-border">
            {buckets.map((bucket) => (
              <TooltipProvider key={bucket.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`${bucket.colorClass} aspect-square w-full cursor-pointer transition-colors hover:opacity-80`}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-xs">
                      <div className="font-medium">Bucket {bucket.id}</div>
                      <div>{TIER_DEFINITIONS[bucket.tier as keyof typeof TIER_DEFINITIONS].name} Tier</div>
                      {bucket.bonusYield > 0 && (
                        <div className="text-orange-500 font-medium">
                          +{bucket.bonusYield.toFixed(1)}% Bonus Yield
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        {bucket.imbalance < 0 
                          ? `${Math.abs(bucket.imbalance).toFixed(1)}% Overweight` 
                          : bucket.imbalance > 0 
                            ? `${bucket.imbalance.toFixed(1)}% Underweight`
                            : 'Balanced'}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tier Distribution</h4>
            <div className="space-y-2">
              {Object.keys(targetDistribution).map((tier) => {
                const target = targetDistribution[tier] * 100;
                const current = currentDistribution[tier] * 100;
                const delta = current - target;
                const bonusYield = bonusYields[tier];
                
                return (
                  <div key={tier} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{TIER_DEFINITIONS[tier as keyof typeof TIER_DEFINITIONS].name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{current.toFixed(1)}% vs {target.toFixed(1)}% target</span>
                        <span className={`${delta > 0 ? 'text-blue-500' : delta < 0 ? 'text-orange-500' : 'text-green-500'}`}>
                          {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                        </span>
                        {bonusYield > 0 && (
                          <span className="text-orange-500 font-medium">+{bonusYield.toFixed(1)}% bonus</span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          delta > 0 ? 'bg-blue-500' : delta < 0 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${current}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusYieldHeatmap;
