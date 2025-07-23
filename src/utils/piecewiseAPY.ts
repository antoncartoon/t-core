
/**
 * T-Core Protocol: Updated Piecewise Yield Distribution Function
 * 
 * This implements the updated yield curve with 4 distinct tiers and simplified flat rates:
 * - Safe (0-9): Fixed 5.16% APY (T-Bills × 1.2)
 * - Conservative (10-29): Flat 7% APY
 * - Balanced (30-59): Flat 9% APY
 * - Hero (60-99): Exponential growth using 1.03^(i-25)%
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

// Target APYs for each tier (simplified model)
export const TARGET_APYS = {
  SAFE: 0.0516, // 5.16% (T-Bills × 1.2)
  CONSERVATIVE: 0.07, // 7% (flat)
  BALANCED: 0.09, // 9% (flat)
  HERO_EXPONENTIAL_BASE: 25 // Base for exponential calculation: 1.03^(i-25)
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
 * Calculate APY for any segment using the updated piecewise function
 */
export const calculatePiecewiseAPY = (segment: number): number => {
  // Clamp segment to valid range
  const i = Math.max(0, Math.min(99, Math.round(segment)));
  
  if (i <= TIER_BREAKPOINTS.SAFE_END) {
    // Safe Tier (0-9): Fixed 5.16%
    return TARGET_APYS.SAFE;
  }
  
  if (i <= TIER_BREAKPOINTS.CONSERVATIVE_END) {
    // Conservative Tier (10-29): Flat 7%
    return TARGET_APYS.CONSERVATIVE;
  }
  
  if (i <= TIER_BREAKPOINTS.BALANCED_END) {
    // Balanced Tier (30-59): Flat 9%
    return TARGET_APYS.BALANCED;
  }
  
  // Hero Tier (60-99): Exponential growth 1.03^(i-25)
  const exponentialResult = Math.pow(1.03, i - TARGET_APYS.HERO_EXPONENTIAL_BASE) / 100;
  return exponentialResult;
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
 * Get tier information for a given segment (updated model)
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
      formula: 'Flat 7%',
      color: 'text-blue-600',
      targetWeight: 0.20
    };
  }
  
  if (i <= TIER_BREAKPOINTS.BALANCED_END) {
    return {
      name: 'Balanced',
      range: [30, 59],
      formula: 'Flat 9%',
      color: 'text-yellow-600',
      targetWeight: 0.30
    };
  }
  
  return {
    name: 'Hero',
    range: [60, 99],
    formula: 'Exponential: 1.03^(i-25)%',
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
