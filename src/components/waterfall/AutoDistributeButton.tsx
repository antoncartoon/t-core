
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRiskRange } from '@/contexts/RiskRangeContext';
import { TIER_DEFINITIONS } from '@/types/riskTiers';

interface AutoDistributeButtonProps {
  amount: number;
  onDistribute: (ranges: Array<{ range: [number, number]; weight: number }>) => void;
}

const AutoDistributeButton = ({ amount, onDistribute }: AutoDistributeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { protocolState } = useRiskRange();

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
  
  // Target distribution from knowledge document
  const TARGET_DISTRIBUTION = {
    SAFE: 0.10,
    CONSERVATIVE: 0.20,
    BALANCED: 0.30,
    HERO: 0.40
  };
  
  const autoDistribute = async () => {
    setLoading(true);
    
    try {
      // Get current distribution
      const currentDistribution = calculateCurrentDistribution();
      
      // Calculate delta from target
      const delta = {
        SAFE: TARGET_DISTRIBUTION.SAFE - currentDistribution.SAFE,
        CONSERVATIVE: TARGET_DISTRIBUTION.CONSERVATIVE - currentDistribution.CONSERVATIVE,
        BALANCED: TARGET_DISTRIBUTION.BALANCED - currentDistribution.BALANCED,
        HERO: TARGET_DISTRIBUTION.HERO - currentDistribution.HERO
      };
      
      // Only allocate to underweighted tiers (positive delta)
      const underweightedTiers: Array<{ tier: string; delta: number }> = [];
      
      Object.keys(delta).forEach(tier => {
        if (delta[tier as keyof typeof delta] > 0) {
          underweightedTiers.push({
            tier,
            delta: delta[tier as keyof typeof delta]
          });
        }
      });
      
      // If all tiers are at or above target, distribute evenly
      if (underweightedTiers.length === 0) {
        toast({
          title: "All tiers at or above target",
          description: "Distributing evenly across all tiers",
        });
        
        onDistribute([
          { range: [TIER_DEFINITIONS.SAFE.min, TIER_DEFINITIONS.SAFE.max], weight: 0.25 },
          { range: [TIER_DEFINITIONS.CONSERVATIVE.min, TIER_DEFINITIONS.CONSERVATIVE.max], weight: 0.25 },
          { range: [TIER_DEFINITIONS.BALANCED.min, TIER_DEFINITIONS.BALANCED.max], weight: 0.25 },
          { range: [TIER_DEFINITIONS.HERO.min, TIER_DEFINITIONS.HERO.max], weight: 0.25 }
        ]);
        
        setLoading(false);
        return;
      }
      
      // Calculate total delta to normalize weights
      const totalDelta = underweightedTiers.reduce((sum, tier) => sum + tier.delta, 0);
      
      // Generate distribution plan
      const distributionPlan = underweightedTiers.map(tier => {
        const weight = tier.delta / totalDelta;
        const tierDef = TIER_DEFINITIONS[tier.tier as keyof typeof TIER_DEFINITIONS];
        
        return {
          range: [tierDef.min, tierDef.max] as [number, number],
          weight
        };
      });
      
      // Simulate calculation for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Apply the distribution
      onDistribute(distributionPlan);
      
      toast({
        title: "Auto-distribution applied",
        description: `Your ${amount.toFixed(2)} TDD has been optimally distributed across ${underweightedTiers.length} underweighted tiers.`,
      });
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

  return (
    <Button 
      onClick={autoDistribute}
      disabled={loading || amount <= 0}
      className="w-full"
      variant="outline"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Optimizing distribution...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Auto-distribute to underweighted tiers
        </>
      )}
    </Button>
  );
};

export default AutoDistributeButton;
