
import { calculateQuadraticRisk, TIER_BREAKPOINTS } from '@/utils/tzFormulas';

// More realistic tier TVL distribution based on actual risk appetite
const TIER_TVL_DISTRIBUTION = {
  safe: 0.15,       // 15% of TVL in Safe tier (0-9)
  conservative: 0.30, // 30% of TVL in Conservative tier (10-29) - increased
  balanced: 0.35,    // 35% of TVL in Balanced tier (30-59)
  hero: 0.20        // 20% of TVL in Hero tier (60-99) - reduced
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
 * Simplified waterfall loss calculation with realistic distribution
 */
const calculateWaterfallLosses = (
  totalLoss: number,
  totalTVL: number
): Record<'safe' | 'conservative' | 'balanced' | 'hero', number> => {
  console.log('=== WATERFALL CALCULATION DEBUG ===');
  console.log('Total Loss:', totalLoss);
  console.log('Total TVL:', totalTVL);
  
  const tierTVL = {
    safe: totalTVL * TIER_TVL_DISTRIBUTION.safe,
    conservative: totalTVL * TIER_TVL_DISTRIBUTION.conservative,
    balanced: totalTVL * TIER_TVL_DISTRIBUTION.balanced,
    hero: totalTVL * TIER_TVL_DISTRIBUTION.hero
  };
  
  console.log('Tier TVL Distribution:', tierTVL);

  const tierLosses = {
    safe: 0,
    conservative: 0,
    balanced: 0,
    hero: 0
  };

  let remainingLoss = totalLoss;
  console.log('Starting remaining loss:', remainingLoss);

  // SIMPLIFIED WATERFALL: Hero absorbs first, then cascades down
  
  // Hero tier absorbs losses first (up to 90% of their TVL)
  if (remainingLoss > 0 && tierTVL.hero > 0) {
    const heroAbsorption = Math.min(remainingLoss, tierTVL.hero * 0.9);
    tierLosses.hero = heroAbsorption;
    remainingLoss -= heroAbsorption;
    console.log('Hero absorbed:', heroAbsorption, 'Remaining:', remainingLoss);
  }

  // Balanced tier absorbs next (up to 70% of their TVL)
  if (remainingLoss > 0 && tierTVL.balanced > 0) {
    const balancedAbsorption = Math.min(remainingLoss, tierTVL.balanced * 0.7);
    tierLosses.balanced = balancedAbsorption;
    remainingLoss -= balancedAbsorption;
    console.log('Balanced absorbed:', balancedAbsorption, 'Remaining:', remainingLoss);
  }

  // Conservative tier absorbs next (up to 50% of their TVL)
  if (remainingLoss > 0 && tierTVL.conservative > 0) {
    const conservativeAbsorption = Math.min(remainingLoss, tierTVL.conservative * 0.5);
    tierLosses.conservative = conservativeAbsorption;
    remainingLoss -= conservativeAbsorption;
    console.log('Conservative absorbed:', conservativeAbsorption, 'Remaining:', remainingLoss);
  }

  // Safe tier absorbs last (up to 30% of their TVL in extreme cases)
  if (remainingLoss > 0 && tierTVL.safe > 0) {
    const safeAbsorption = Math.min(remainingLoss, tierTVL.safe * 0.3);
    tierLosses.safe = safeAbsorption;
    remainingLoss -= safeAbsorption;
    console.log('Safe absorbed:', safeAbsorption, 'Remaining:', remainingLoss);
  }

  console.log('Final tier losses:', tierLosses);
  console.log('=== END WATERFALL DEBUG ===');

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
  
  console.log(`User Loss Calculation for ${userTier}:`, {
    userPosition,
    tierTotalLoss,
    tierTVL,
    lossPercentage: tierTotalLoss / tierTVL
  });
  
  // Calculate loss percentage based on tier's total loss
  const tierLossPercentage = tierTotalLoss / tierTVL;
  
  // User's loss is their position times the tier's loss percentage
  const userLoss = userPosition * tierLossPercentage;
  
  // Ensure loss doesn't exceed position value
  return Math.min(userLoss, userPosition);
};

/**
 * Enhanced stress test calculation with realistic scenarios
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
  
  console.log('User Position Analysis:', {
    userPosition,
    bucketRange,
    avgSegment,
    userTier,
    totalTVL
  });
  
  // Calculate tier TVL amounts
  const tierTVL = {
    safe: totalTVL * TIER_TVL_DISTRIBUTION.safe,
    conservative: totalTVL * TIER_TVL_DISTRIBUTION.conservative,
    balanced: totalTVL * TIER_TVL_DISTRIBUTION.balanced,
    hero: totalTVL * TIER_TVL_DISTRIBUTION.hero
  };

  // More realistic stress scenarios
  const scenarios = [
    { name: 'scenario1', tvlLossPercent: 0.02 },  // 2% TVL loss
    { name: 'scenario5', tvlLossPercent: 0.08 },  // 8% TVL loss  
    { name: 'scenario10', tvlLossPercent: 0.15 }  // 15% TVL loss
  ];

  const results: any = {};

  scenarios.forEach(({ name, tvlLossPercent }) => {
    console.log(`\n=== SCENARIO ${name.toUpperCase()} (${tvlLossPercent * 100}% TVL LOSS) ===`);
    
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

    console.log(`User final loss for ${name}:`, {
      userLoss,
      lossPercent: lossPercent.toFixed(4)
    });

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
