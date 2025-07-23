
import { calculateQuadraticRisk, TIER_BREAKPOINTS } from '@/utils/tzFormulas';

// Realistic tier TVL distribution based on T-Core model
const TIER_TVL_DISTRIBUTION = {
  safe: 0.10,       // 10% of TVL in Safe tier (0-9)
  conservative: 0.20, // 20% of TVL in Conservative tier (10-29)
  balanced: 0.30,    // 30% of TVL in Balanced tier (30-59)
  hero: 0.40        // 40% of TVL in Hero tier (60-99)
};

interface StressScenarioResult {
  lossPercent: number;
  dollarLoss: number;
}

interface StressScenarios {
  scenario1: StressScenarioResult;
  scenario5: StressScenarioResult;
  scenario10: StressScenarioResult;
}

/**
 * Calculate which tier a segment belongs to
 */
const getTierFromSegment = (segment: number): 'safe' | 'conservative' | 'balanced' | 'hero' => {
  if (segment <= TIER_BREAKPOINTS.SAFE_END) return 'safe';
  if (segment <= TIER_BREAKPOINTS.CONSERVATIVE_END) return 'conservative';
  if (segment <= TIER_BREAKPOINTS.BALANCED_END) return 'balanced';
  return 'hero';
};

/**
 * Calculate waterfall loss distribution using T-Core subordination model
 * Losses flow from Hero → Balanced → Conservative → Safe
 */
const calculateWaterfallLosses = (
  totalLoss: number,
  totalTVL: number
): Record<'safe' | 'conservative' | 'balanced' | 'hero', number> => {
  const tierTVL = {
    safe: totalTVL * TIER_TVL_DISTRIBUTION.safe,
    conservative: totalTVL * TIER_TVL_DISTRIBUTION.conservative,
    balanced: totalTVL * TIER_TVL_DISTRIBUTION.balanced,
    hero: totalTVL * TIER_TVL_DISTRIBUTION.hero
  };

  const tierLosses = {
    safe: 0,
    conservative: 0,
    balanced: 0,
    hero: 0
  };

  let remainingLoss = totalLoss;

  // Step 1: Hero tier absorbs losses first (up to 100% of their TVL)
  if (remainingLoss > 0) {
    const heroLoss = Math.min(remainingLoss, tierTVL.hero);
    tierLosses.hero = heroLoss;
    remainingLoss -= heroLoss;
  }

  // Step 2: Balanced tier absorbs remaining losses
  if (remainingLoss > 0) {
    const balancedLoss = Math.min(remainingLoss, tierTVL.balanced);
    tierLosses.balanced = balancedLoss;
    remainingLoss -= balancedLoss;
  }

  // Step 3: Conservative tier absorbs remaining losses
  if (remainingLoss > 0) {
    const conservativeLoss = Math.min(remainingLoss, tierTVL.conservative);
    tierLosses.conservative = conservativeLoss;
    remainingLoss -= conservativeLoss;
  }

  // Step 4: Safe tier absorbs remaining losses (should be rare)
  if (remainingLoss > 0) {
    const safeLoss = Math.min(remainingLoss, tierTVL.safe);
    tierLosses.safe = safeLoss;
  }

  return tierLosses;
};

/**
 * Calculate user's loss percentage based on their position in the waterfall
 */
const calculateUserLoss = (
  userPosition: number,
  userTier: 'safe' | 'conservative' | 'balanced' | 'hero',
  tierTotalLoss: number,
  tierTVL: number
): number => {
  if (tierTVL === 0) return 0;
  
  // User's loss is proportional to their share of the tier's TVL
  const userTierShare = userPosition / tierTVL;
  const userLoss = tierTotalLoss * userTierShare;
  
  return Math.min(userLoss, userPosition); // Can't lose more than position value
};

/**
 * Enhanced stress test calculation with proper waterfall model
 */
export const calculateEnhancedStressScenarios = (
  userPosition: number,
  bucketRange: [number, number],
  totalTVL: number
): StressScenarios => {
  // Calculate average segment and determine tier
  const avgSegment = (bucketRange[0] + bucketRange[1]) / 2;
  const userTier = getTierFromSegment(avgSegment);
  
  // Calculate tier TVL amounts
  const tierTVL = {
    safe: totalTVL * TIER_TVL_DISTRIBUTION.safe,
    conservative: totalTVL * TIER_TVL_DISTRIBUTION.conservative,
    balanced: totalTVL * TIER_TVL_DISTRIBUTION.balanced,
    hero: totalTVL * TIER_TVL_DISTRIBUTION.hero
  };

  // Define stress scenarios
  const scenarios = [
    { name: 'scenario1', tvlLossPercent: 0.01 },  // 1% TVL loss
    { name: 'scenario5', tvlLossPercent: 0.05 },  // 5% TVL loss
    { name: 'scenario10', tvlLossPercent: 0.10 }  // 10% TVL loss
  ];

  const results: any = {};

  scenarios.forEach(({ name, tvlLossPercent }) => {
    const totalLoss = totalTVL * tvlLossPercent;
    
    // Calculate waterfall loss distribution
    const tierLosses = calculateWaterfallLosses(totalLoss, totalTVL);
    
    // Calculate user's specific loss
    const userLoss = calculateUserLoss(
      userPosition,
      userTier,
      tierLosses[userTier],
      tierTVL[userTier]
    );

    const lossPercent = userPosition > 0 ? (userLoss / userPosition) * 100 : 0;

    results[name] = {
      lossPercent: Math.max(0, lossPercent), // Ensure non-negative
      dollarLoss: Math.max(0, userLoss)
    };
  });

  return results as StressScenarios;
};

/**
 * Get tier protection level for display
 */
export const getTierProtectionLevel = (segment: number): {
  name: string;
  protection: string;
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
} => {
  const tier = getTierFromSegment(segment);
  
  switch (tier) {
    case 'safe':
      return {
        name: 'Safe',
        protection: 'Maximum Protection',
        riskLevel: 'low'
      };
    case 'conservative':
      return {
        name: 'Conservative',
        protection: 'High Protection',
        riskLevel: 'medium'
      };
    case 'balanced':
      return {
        name: 'Balanced',
        protection: 'Moderate Protection',
        riskLevel: 'high'
      };
    case 'hero':
      return {
        name: 'Hero',
        protection: 'First Loss Absorption',
        riskLevel: 'very-high'
      };
  }
};
