
import { calculateQuadraticRisk, TIER_BREAKPOINTS } from '@/utils/tzFormulas';

// More realistic tier TVL distribution based on actual risk appetite
const TIER_TVL_DISTRIBUTION = {
  safe: 0.15,       // 15% of TVL in Safe tier (0-9) - higher than before
  conservative: 0.25, // 25% of TVL in Conservative tier (10-29)
  balanced: 0.35,    // 35% of TVL in Balanced tier (30-59)
  hero: 0.25        // 25% of TVL in Hero tier (60-99) - reduced from 40%
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
 * Enhanced waterfall loss calculation with more realistic loss distribution
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

  // Enhanced waterfall with more realistic distribution
  // Hero tier absorbs first, but with enhanced loss multipliers
  if (remainingLoss > 0) {
    const heroAbsorptionCapacity = tierTVL.hero * 0.8; // Hero can absorb up to 80% of their TVL
    const heroLoss = Math.min(remainingLoss * 1.5, heroAbsorptionCapacity); // 1.5x multiplier for hero losses
    tierLosses.hero = Math.min(heroLoss, tierTVL.hero);
    remainingLoss -= heroLoss;
  }

  // Balanced tier absorbs with moderate multiplier
  if (remainingLoss > 0) {
    const balancedAbsorptionCapacity = tierTVL.balanced * 0.6; // Balanced can absorb up to 60% of their TVL
    const balancedLoss = Math.min(remainingLoss * 1.2, balancedAbsorptionCapacity); // 1.2x multiplier
    tierLosses.balanced = Math.min(balancedLoss, tierTVL.balanced);
    remainingLoss -= balancedLoss;
  }

  // Conservative tier gets meaningful losses in severe scenarios
  if (remainingLoss > 0) {
    const conservativeAbsorptionCapacity = tierTVL.conservative * 0.4; // Conservative can absorb up to 40% of their TVL
    const conservativeLoss = Math.min(remainingLoss * 0.8, conservativeAbsorptionCapacity); // 0.8x multiplier
    tierLosses.conservative = Math.min(conservativeLoss, tierTVL.conservative);
    remainingLoss -= conservativeLoss;
  }

  // Safe tier only in extreme scenarios
  if (remainingLoss > 0) {
    const safeAbsorptionCapacity = tierTVL.safe * 0.2; // Safe can absorb up to 20% of their TVL
    const safeLoss = Math.min(remainingLoss * 0.3, safeAbsorptionCapacity); // 0.3x multiplier
    tierLosses.safe = Math.min(safeLoss, tierTVL.safe);
  }

  return tierLosses;
};

/**
 * Calculate user's loss percentage with improved precision
 */
const calculateUserLoss = (
  userPosition: number,
  userTier: 'safe' | 'conservative' | 'balanced' | 'hero',
  tierTotalLoss: number,
  tierTVL: number
): number => {
  if (tierTVL === 0 || userPosition === 0) return 0;
  
  // Calculate loss percentage based on tier's total loss
  const tierLossPercentage = tierTotalLoss / tierTVL;
  
  // User's loss is based on their position and tier loss percentage
  const userLoss = userPosition * tierLossPercentage;
  
  // Ensure loss doesn't exceed position value
  return Math.min(userLoss, userPosition);
};

/**
 * Enhanced stress test calculation with more realistic scenarios
 */
export const calculateEnhancedStressScenarios = (
  userPosition: number,
  bucketRange: [number, number],
  totalTVL: number
): StressScenarios => {
  if (userPosition <= 0) {
    return {
      scenario1: { lossPercent: 0, dollarLoss: 0 },
      scenario5: { lossPercent: 0, dollarLoss: 0 },
      scenario10: { lossPercent: 0, dollarLoss: 0 }
    };
  }

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

  // Enhanced stress scenarios with more realistic losses
  const scenarios = [
    { name: 'scenario1', tvlLossPercent: 0.02 },  // 2% TVL loss
    { name: 'scenario5', tvlLossPercent: 0.08 },  // 8% TVL loss  
    { name: 'scenario10', tvlLossPercent: 0.15 }  // 15% TVL loss
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
      lossPercent: Math.max(0, Math.round(lossPercent * 100) / 100), // Round to 2 decimal places
      dollarLoss: Math.max(0, Math.round(userLoss * 100) / 100)
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
