
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertTriangle, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRiskRange } from '@/contexts/RiskRangeContext';
import { TIER_DEFINITIONS } from '@/types/riskTiers';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSystemParameters } from '@/hooks/useSystemParameters';

interface AutoDistributeButtonProps {
  amount: number;
  onDistribute: (ranges: Array<{ range: [number, number]; weight: number }>) => void;
}

const AutoDistributeButton = ({ amount, onDistribute }: AutoDistributeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { protocolState } = useRiskRange();
  const { parameters } = useSystemParameters();

  // Calculate current tier distribution
  const calculateCurrentDistribution = () => {
    const tiers = {
      SAFE: 0,
      CONSERVATIVE: 0,
      BALANCED: 0,
      HERO: 0
    };
    
    let totalLiquidity = 0;
    
    protocolState.riskTicks.forEach(tick => {
      totalLiquidity += tick.totalLiquidity;
      
      if (tick.riskLevel >= TIER_DEFINITIONS.SAFE.min && tick.riskLevel <= TIER_DEFINITIONS.SAFE.max) {
        tiers.SAFE += tick.totalLiquidity;
      } else if (tick.riskLevel >= TIER_DEFINITIONS.CONSERVATIVE.min && tick.riskLevel <= TIER_DEFINITIONS.CONSERVATIVE.max) {
        tiers.CONSERVATIVE += tick.totalLiquidity;
      } else if (tick.riskLevel >= TIER_DEFINITIONS.BALANCED.min && tick.riskLevel <= TIER_DEFINITIONS.BALANCED.max) {
        tiers.BALANCED += tick.totalLiquidity;
      } else if (tick.riskLevel >= TIER_DEFINITIONS.HERO.min && tick.riskLevel <= TIER_DEFINITIONS.HERO.max) {
        tiers.HERO += tick.totalLiquidity;
      }
    });
    
    // Convert to percentages
    if (totalLiquidity > 0) {
      Object.keys(tiers).forEach(tier => {
        tiers[tier as keyof typeof tiers] = tiers[tier as keyof typeof tiers] / totalLiquidity;
      });
    }
    
    return tiers;
  };
  
  // Dynamic target distribution from system parameters
  const TARGET_DISTRIBUTION = parameters ? {
    SAFE: parameters.target_tier_distribution.safe,
    CONSERVATIVE: parameters.target_tier_distribution.conservative,
    BALANCED: parameters.target_tier_distribution.balanced,
    HERO: parameters.target_tier_distribution.hero
  } : {
    // Fallback values if parameters not loaded yet
    SAFE: 0.40,
    CONSERVATIVE: 0.20,
    BALANCED: 0.20,
    HERO: 0.20
  };
  
  // Mock current distribution for demo
  const DEMO_CURRENT = {
    SAFE: 0.45,      // 35% overweight
    CONSERVATIVE: 0.25, // 5% overweight  
    BALANCED: 0.20,     // 10% underweight
    HERO: 0.10         // 30% underweight
  };
  
  const autoDistribute = async () => {
    setLoading(true);
    
    try {
      // Use demo data for visualization
      const currentDistribution = DEMO_CURRENT;
      
      // Calculate delta from target
      const delta = {
        SAFE: TARGET_DISTRIBUTION.SAFE - currentDistribution.SAFE,
        CONSERVATIVE: TARGET_DISTRIBUTION.CONSERVATIVE - currentDistribution.CONSERVATIVE,
        BALANCED: TARGET_DISTRIBUTION.BALANCED - currentDistribution.BALANCED,
        HERO: TARGET_DISTRIBUTION.HERO - currentDistribution.HERO
      };
      
      // Only allocate to underweighted tiers (positive delta)
      const underweightedTiers: Array<{ tier: string; delta: number; bonus: number }> = [];
      
      Object.keys(delta).forEach(tier => {
        if (delta[tier as keyof typeof delta] > 0) {
          const bonusAPY = tier === 'BALANCED' ? 1.2 : tier === 'HERO' ? 3.5 : 0;
          underweightedTiers.push({
            tier,
            delta: delta[tier as keyof typeof delta],
            bonus: bonusAPY
          });
        }
      });
      
      // Simulate calculation for 1.5 seconds with progress
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let distributionPlan: Array<{ range: [number, number]; weight: number }> = [];
      
      if (underweightedTiers.length === 0) {
        // If all tiers are at or above target, distribute evenly
        distributionPlan = [
          { range: [TIER_DEFINITIONS.SAFE.min, TIER_DEFINITIONS.SAFE.max], weight: 0.25 },
          { range: [TIER_DEFINITIONS.CONSERVATIVE.min, TIER_DEFINITIONS.CONSERVATIVE.max], weight: 0.25 },
          { range: [TIER_DEFINITIONS.BALANCED.min, TIER_DEFINITIONS.BALANCED.max], weight: 0.25 },
          { range: [TIER_DEFINITIONS.HERO.min, TIER_DEFINITIONS.HERO.max], weight: 0.25 }
        ];
        
        toast({
          title: "✅ All tiers at target",
          description: "Distributing evenly across all tiers since none are underweight.",
        });
      } else {
        // Calculate total delta to normalize weights
        const totalDelta = underweightedTiers.reduce((sum, tier) => sum + tier.delta, 0);
        
        // Generate distribution plan for underweight tiers only
        distributionPlan = underweightedTiers.map(tier => {
          const weight = tier.delta / totalDelta;
          const tierDef = TIER_DEFINITIONS[tier.tier as keyof typeof TIER_DEFINITIONS];
          
          return {
            range: [tierDef.min, tierDef.max] as [number, number],
            weight
          };
        });
        
        // Enhanced success message with details
        const tierDetails = underweightedTiers.map(t => {
          const tierName = TIER_DEFINITIONS[t.tier as keyof typeof TIER_DEFINITIONS].name;
          const weight = Math.round((t.delta / totalDelta) * 100);
          return `${tierName} ${weight}% (+${t.bonus.toFixed(1)}% bonus)`;
        }).join(', ');
        
        toast({
          title: "🎯 Auto-distribution optimized!",
          description: `${amount.toLocaleString()} TDD allocated to underweight tiers: ${tierDetails}`,
          duration: 8000,
        });
      }
      
      // Apply the distribution
      onDistribute(distributionPlan);
      
    } catch (error) {
      console.error("Auto-distribution error:", error);
      toast({
        title: "Auto-distribution failed",
        description: "There was an error optimizing your distribution. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show current underweight opportunities
  const underweightTiers = Object.keys(TARGET_DISTRIBUTION).filter(tier => {
    const current = DEMO_CURRENT[tier as keyof typeof DEMO_CURRENT];
    const target = TARGET_DISTRIBUTION[tier as keyof typeof TARGET_DISTRIBUTION];
    return current < target;
  });

  const totalBonusAvailable = underweightTiers.reduce((sum, tier) => {
    return sum + (tier === 'BALANCED' ? 1.2 : tier === 'HERO' ? 3.5 : 0);
  }, 0);

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Auto-Distribution</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
              AI Powered
            </Badge>
          </div>
          {underweightTiers.length > 0 && (
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              +{totalBonusAvailable.toFixed(1)}% Bonus Available
            </Badge>
          )}
        </div>
        
        {underweightTiers.length > 0 && (
          <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
            <div className="text-sm font-medium mb-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Underweight Opportunities
            </div>
            <div className="space-y-1">
              {underweightTiers.map(tier => {
                const current = DEMO_CURRENT[tier as keyof typeof DEMO_CURRENT];
                const target = TARGET_DISTRIBUTION[tier as keyof typeof TARGET_DISTRIBUTION];
                const deficit = Math.round((target - current) * 100);
                const bonus = tier === 'BALANCED' ? 1.2 : tier === 'HERO' ? 3.5 : 0;
                
                return (
                  <div key={tier} className="flex justify-between text-xs">
                    <span>{TIER_DEFINITIONS[tier as keyof typeof TIER_DEFINITIONS].name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{deficit}% under target</span>
                      {bonus > 0 && (
                        <span className="text-orange-600 font-medium">+{bonus}% bonus</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <Button 
          onClick={autoDistribute}
          disabled={loading || amount <= 0}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating optimal distribution...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Auto-distribute ${amount.toLocaleString()} TDD
            </>
          )}
        </Button>
        
        {amount <= 0 && (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>Enter an amount to enable auto-distribution</span>
          </div>
        )}
        
        <div className="text-xs text-center text-muted-foreground">
          <span className="font-medium">Smart allocation</span> targets underweight tiers for maximum bonus yield
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoDistributeButton;
