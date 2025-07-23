
/**
 * T-Core Protocol: Unified Formula Library
 * 
 * This file contains all T-Core mathematical formulas and calculations:
 * - Piecewise APY calculations (4-tier structure)
 * - Quadratic risk model
 * - Stress testing scenarios
 * - Tier utilities and bonus calculations
 * - Waterfall loss distribution
 */

// ============= CONSTANTS & CONFIGURATION =============

// T-Bills base rate and multipliers
export const T_BILLS_RATE = 0.05; // 5% T-Bills
export const SAFE_MULTIPLIER = 1.2; // T-Bills × 1.2
export const SAFE_APY = T_BILLS_RATE * SAFE_MULTIPLIER; // 5.16%

// Tier breakpoints (updated 4-tier structure)
export const TIER_BREAKPOINTS = {
  SAFE_END: 9,
  CONSERVATIVE_START: 10,
  CONSERVATIVE_END: 29,
  BALANCED_START: 30,
  BALANCED_END: 59,
  HERO_START: 60,
  HERO_END: 99
};

// Target APYs for each tier
export const TARGET_APYS = {
  SAFE: 0.0516, // 5.16% (T-Bills × 1.2)
  CONSERVATIVE_START: 0.0516, // 5.16% (starting point)
  CONSERVATIVE_END: 0.07, // 7% (ending point)
  BALANCED_START: 0.07, // 7% (starting point)
  BALANCED_END: 0.095, // 9.5% (ending point)
  HERO_START: 0.095, // 9.5% (starting point)
  HERO_EXPONENTIAL_BASE: 25 // Base for exponential calculation
};

// ============= CORE APY CALCULATIONS =============

/**
 * Calculate APY for any segment using the correct piecewise function
 * This is the main T-Core APY calculation function
 */
export const calculatePiecewiseAPY = (segment: number): number => {
  // Clamp segment to valid range
  const i = Math.max(0, Math.min(99, Math.round(segment)));
  
  if (i <= TIER_BREAKPOINTS.SAFE_END) {
    // Safe Tier (0-9): Fixed 5.16%
    return TARGET_APYS.SAFE;
  }
  
  if (i <= TIER_BREAKPOINTS.CONSERVATIVE_END) {
    // Conservative Tier (10-29): Linear from 5.16% to 7%
    const progress = (i - TIER_BREAKPOINTS.CONSERVATIVE_START) / (TIER_BREAKPOINTS.CONSERVATIVE_END - TIER_BREAKPOINTS.CONSERVATIVE_START);
    return TARGET_APYS.CONSERVATIVE_START + (TARGET_APYS.CONSERVATIVE_END - TARGET_APYS.CONSERVATIVE_START) * progress;
  }
  
  if (i <= TIER_BREAKPOINTS.BALANCED_END) {
    // Balanced Tier (30-59): Quadratic from 7% to 9.5%
    const progress = (i - TIER_BREAKPOINTS.BALANCED_START) / (TIER_BREAKPOINTS.BALANCED_END - TIER_BREAKPOINTS.BALANCED_START);
    return TARGET_APYS.BALANCED_START + (TARGET_APYS.BALANCED_END - TARGET_APYS.BALANCED_START) * Math.pow(progress, 2);
  }
  
  // Hero Tier (60-99): Exponential from 9.5% using 1.03^(i-60)
  return TARGET_APYS.HERO_START * Math.pow(1.03, i - 60);
};

/**
 * Calculate weighted APY for a range of segments
 */
export const calculateRangeWeightedAPY = (startSegment: number, endSegment: number): number => {
  const start = Math.max(0, Math.min(99, Math.round(startSegment)));
  const end = Math.max(start, Math.min(99, Math.round(endSegment)));
  
  let totalAPY = 0;
  let segmentCount = 0;
  
  for (let i = start; i <= end; i++) {
    totalAPY += calculatePiecewiseAPY(i);
    segmentCount++;
  }
  
  return segmentCount > 0 ? totalAPY / segmentCount : TARGET_APYS.SAFE;
};

// ============= RISK CALCULATIONS =============

/**
 * Quadratic risk function: Risk(i) = (i/99)^2
 */
export const calculateQuadraticRisk = (segment: number): number => {
  const i = Math.max(0, Math.min(99, segment));
  return Math.pow(i / 99, 2);
};

// ============= STRESS TESTING FORMULAS =============

/**
 * Stress Loss Formula using quadratic risk model
 */
export const calculateStressLoss = (
  userPosition: number,
  residualLoss: number
): number => {
  if (userPosition <= 0) return 0;
  
  const actualLoss = Math.min(residualLoss, userPosition);
  return actualLoss / userPosition;
};

/**
 * Calculate stress scenarios using quadratic risk model and proper waterfall logic
 */
export const calculateStressScenarios = (
  userPosition: number,
  bucketRange: [number, number],
  totalTVL: number
): {
  scenario1: { lossPercent: number; dollarLoss: number };
  scenario5: { lossPercent: number; dollarLoss: number };
  scenario10: { lossPercent: number; dollarLoss: number };
} => {
  // Calculate average segment and its quadratic risk
  const avgSegment = (bucketRange[0] + bucketRange[1]) / 2;
  const quadraticRisk = calculateQuadraticRisk(avgSegment);
  
  // TVL loss scenarios
  const tvlLoss1 = totalTVL * 0.01; // -1% TVL
  const tvlLoss5 = totalTVL * 0.05; // -5% TVL  
  const tvlLoss10 = totalTVL * 0.10; // -10% TVL
  
  // Higher segments absorb more losses in waterfall model
  // Loss absorption scales with quadratic risk + exponential factor for hero tier
  let lossMultiplier = quadraticRisk;
  if (avgSegment >= 60) {
    // Hero tier gets exponential loss absorption
    lossMultiplier = quadraticRisk * Math.pow(1.2, (avgSegment - 60) / 10);
  }
  
  // Calculate actual losses based on waterfall model
  const calculateScenarioLoss = (tvlLoss: number) => {
    const userLossShare = tvlLoss * lossMultiplier;
    const actualLoss = Math.min(userLossShare, userPosition);
    return {
      lossPercent: (actualLoss / userPosition) * 100,
      dollarLoss: actualLoss
    };
  };

  return {
    scenario1: calculateScenarioLoss(tvlLoss1),
    scenario5: calculateScenarioLoss(tvlLoss5),
    scenario10: calculateScenarioLoss(tvlLoss10)
  };
};

// ============= YIELD CALCULATIONS =============

/**
 * Calculate predicted yield using piecewise APY formula
 */
export const calculatePredictedYield = (
  amount: number,
  bucketRange: [number, number]
): { percentAPY: number; dollarYield: number } => {
  // Calculate average APY across the selected range using piecewise formula
  let totalAPY = 0;
  const rangeSize = bucketRange[1] - bucketRange[0] + 1;
  
  for (let segment = bucketRange[0]; segment <= bucketRange[1]; segment++) {
    totalAPY += calculatePiecewiseAPY(segment);
  }
  
  const avgAPY = totalAPY / rangeSize;
  const dollarYield = amount * avgAPY;
  
  return {
    percentAPY: avgAPY * 100,
    dollarYield
  };
};

// ============= TIER PRESETS =============

/**
 * Tier presets for quick selection
 */
export const TIER_PRESETS = {
  safe: { name: 'Safe', range: [0, 9] },
  conservative: { name: 'Conservative', range: [10, 29] },
  balanced: { name: 'Balanced', range: [30, 59] },
  hero: { name: 'Hero', range: [60, 99] }
} as const;

// ============= TIER UTILITIES =============

/**
 * Get tier information for a given segment
 */
export const getTierForSegment = (segment: number): {
  name: string;
  range: [number, number];
  formula: string;
  color: string;
  targetWeight: number;
} => {
  const i = Math.max(0, Math.min(99, Math.round(segment)));
  
  if (i <= TIER_BREAKPOINTS.SAFE_END) {
    return {
      name: 'Safe',
      range: [0, 9],
      formula: 'Fixed 5.16%',
      color: 'text-green-600',
      targetWeight: 0.10
    };
  }
  
  if (i <= TIER_BREAKPOINTS.CONSERVATIVE_END) {
    return {
      name: 'Conservative',
      range: [10, 29],
      formula: 'Linear: 5.16% → 7%',
      color: 'text-blue-600',
      targetWeight: 0.20
    };
  }
  
  if (i <= TIER_BREAKPOINTS.BALANCED_END) {
    return {
      name: 'Balanced',
      range: [30, 59],
      formula: 'Quadratic: 7% → 9.5%',
      color: 'text-yellow-600',
      targetWeight: 0.30
    };
  }
  
  return {
    name: 'Hero',
    range: [60, 99],
    formula: 'Exponential: 9.5% × 1.03^(i-60)',
    color: 'text-purple-600',
    targetWeight: 0.40
  };
};

/**
 * Get tier info for a bucket (simplified version)
 */
export const getTierForBucket = (segment: number): {
  name: string;
  range: string;
  color: string;
} => {
  const tier = getTierForSegment(segment);
  return {
    name: tier.name,
    range: `${tier.range[0]}-${tier.range[1]}`,
    color: tier.color
  };
};

// ============= VISUALIZATION DATA =============

/**
 * Generate curve data for visualization
 */
export const generatePiecewiseCurveData = (): Array<{
  segment: number;
  apy: number;
  tier: string;
  formula: string;
}> => {
  const data = [];
  
  for (let i = 0; i <= 99; i++) {
    const apy = calculatePiecewiseAPY(i);
    const tier = getTierForSegment(i);
    
    data.push({
      segment: i,
      apy: apy * 100, // Convert to percentage
      tier: tier.name,
      formula: tier.formula
    });
  }
  
  return data;
};

// ============= BONUS YIELD CALCULATIONS =============

/**
 * Calculate bonus yield for underrepresented tiers
 */
export const calculateBonusYield = (
  currentDistribution: { safe: number; conservative: number; balanced: number; hero: number },
  performanceFeePool: number
): { safe: number; conservative: number; balanced: number; hero: number } => {
  const targets = { safe: 0.10, conservative: 0.20, balanced: 0.30, hero: 0.40 };
  const bonuses = { safe: 0, conservative: 0, balanced: 0, hero: 0 };
  
  // Calculate underweight amounts
  let totalUnderweight = 0;
  const underweights = {
    safe: Math.max(0, targets.safe - currentDistribution.safe),
    conservative: Math.max(0, targets.conservative - currentDistribution.conservative),
    balanced: Math.max(0, targets.balanced - currentDistribution.balanced),
    hero: Math.max(0, targets.hero - currentDistribution.hero)
  };
  
  totalUnderweight = underweights.safe + underweights.conservative + 
                   underweights.balanced + underweights.hero;
  
  // Distribute bonus proportionally to underweight tiers
  if (totalUnderweight > 0) {
    bonuses.safe = (underweights.safe / totalUnderweight) * performanceFeePool;
    bonuses.conservative = (underweights.conservative / totalUnderweight) * performanceFeePool;
    bonuses.balanced = (underweights.balanced / totalUnderweight) * performanceFeePool;
    bonuses.hero = (underweights.hero / totalUnderweight) * performanceFeePool;
  }
  
  return bonuses;
};
