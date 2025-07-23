/**
 * T-Core Protocol: Updated Piecewise Yield Distribution Function
 * 
 * This implements the updated yield curve with 4 distinct tiers and correct progressive formulas:
 * - Safe (0-9): Fixed 5.16% APY (T-Bills × 1.2)
 * - Conservative (10-29): Linear from 5.16% to 7%
 * - Balanced (30-59): Quadratic from 7% to 9.5%
 * - Hero (60-99): Exponential from 9.5% using 1.03^(i-60)
 */

// Constants from the specification
export const T_BILLS_RATE = 0.05; // 5% T-Bills
export const SAFE_MULTIPLIER = 1.2; // T-Bills × 1.2
export const SAFE_APY = T_BILLS_RATE * SAFE_MULTIPLIER; // 5.16%

// Tier breakpoints
export const TIER_BREAKPOINTS = {
  SAFE_END: 9,
  CONSERVATIVE_START: 10,
  CONSERVATIVE_END: 29,
  BALANCED_START: 30,
  BALANCED_END: 59,
  HERO_START: 60,
  HERO_END: 99
};

// Target APYs for each tier (updated with correct values)
export const TARGET_APYS = {
  SAFE: 0.0516, // 5.16% (T-Bills × 1.2)
  CONSERVATIVE_START: 0.0516, // 5.16% (starting point)
  CONSERVATIVE_END: 0.07, // 7% (ending point)
  BALANCED_START: 0.07, // 7% (starting point)
  BALANCED_END: 0.095, // 9.5% (ending point)
  HERO_START: 0.095, // 9.5% (starting point)
  HERO_EXPONENTIAL_BASE: 60 // Base for exponential calculation: 1.03^(i-60)
};

/**
 * Calculate quadratic risk for any segment
 * Risk(i) = (i/99)^2
 */
export const calculateQuadraticRisk = (segment: number): number => {
  const i = Math.max(0, Math.min(99, Math.round(segment)));
  return Math.pow(i / 99, 2);
};

/**
 * Calculate APY for any segment using the correct piecewise function
 */
export const calculatePiecewiseAPY = (segment: number): number => {
  // Clamp segment to valid range
  const i = Math.max(0, Math.min(99, Math.round(segment)));
  
  if (i <= TIER_BREAKPOINTS.SAFE_END) {
    // Safe Tier (0-9): Fixed 5.16%
    // f(i) = 5.16 for i ∈ [0, 9]
    return TARGET_APYS.SAFE;
  }
  
  if (i <= TIER_BREAKPOINTS.CONSERVATIVE_END) {
    // Conservative Tier (10-29): Linear from 5.16% to 7%
    // f(i) = 5.16 + (7 - 5.16) * (i - 10) / 19 for i ∈ [10, 29]
    const progress = (i - TIER_BREAKPOINTS.CONSERVATIVE_START) / (TIER_BREAKPOINTS.CONSERVATIVE_END - TIER_BREAKPOINTS.CONSERVATIVE_START);
    return TARGET_APYS.CONSERVATIVE_START + (TARGET_APYS.CONSERVATIVE_END - TARGET_APYS.CONSERVATIVE_START) * progress;
  }
  
  if (i <= TIER_BREAKPOINTS.BALANCED_END) {
    // Balanced Tier (30-59): Quadratic from 7% to 9.5%
    // f(i) = 7 + (9.5 - 7) * ((i - 30)/29)^2 for i ∈ [30, 59]
    const progress = (i - TIER_BREAKPOINTS.BALANCED_START) / (TIER_BREAKPOINTS.BALANCED_END - TIER_BREAKPOINTS.BALANCED_START);
    return TARGET_APYS.BALANCED_START + (TARGET_APYS.BALANCED_END - TARGET_APYS.BALANCED_START) * Math.pow(progress, 2);
  }
  
  // Hero Tier (60-99): Exponential from 9.5% using 1.03^(i-60)
  // f(i) = 9.5 * 1.03^(i - 60) for i ∈ [60, 99]
  return TARGET_APYS.HERO_START * Math.pow(1.03, i - TARGET_APYS.HERO_EXPONENTIAL_BASE);
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

/**
 * Get tier information for a given segment (updated formulas)
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
