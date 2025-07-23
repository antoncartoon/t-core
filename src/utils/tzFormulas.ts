/**
 * T-Core Protocol: Unified Formula Library
 * 
 * This is the single source of truth for all T-Core mathematical formulas and calculations.
 * Contains the complete mathematical model for the T-Core protocol including:
 * 
 * - 4-Tier Piecewise APY Structure (Safe, Conservative, Balanced, Hero)
 * - Quadratic Risk Model for loss distribution
 * - Stress Testing and Scenario Analysis
 * - Yield Distribution and Bonus Calculations
 * - Tier Utilities and Visualization Data Generation
 * 
 * @version 2.0.0
 * @author T-Core Protocol Team
 */

// ============================================================================
// SECTION 1: PROTOCOL CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Base economic parameters derived from T-Bills rate
 */
export const T_BILLS_RATE = 0.05; // 5% T-Bills baseline
export const SAFE_MULTIPLIER = 1.2; // T-Bills × 1.2 for safe tier
export const SAFE_APY = T_BILLS_RATE * SAFE_MULTIPLIER; // 6% effective safe rate

/**
 * 4-Tier structure breakpoints (segments 0-99)
 * Each tier has distinct mathematical properties and risk profiles
 */
export const TIER_BREAKPOINTS = {
  SAFE_END: 9,                    // Safe: 0-9 (10 segments)
  CONSERVATIVE_START: 10,         // Conservative: 10-29 (20 segments)  
  CONSERVATIVE_END: 29,
  BALANCED_START: 30,             // Balanced: 30-59 (30 segments)
  BALANCED_END: 59,
  HERO_START: 60,                 // Hero: 60-99 (40 segments)
  HERO_END: 99
} as const;

/**
 * Target APY rates for each tier's mathematical formula
 */
export const TARGET_APYS = {
  SAFE: 0.0516,                   // 5.16% fixed (T-Bills × 1.2)
  CONSERVATIVE_START: 0.0516,     // 5.16% starting point
  CONSERVATIVE_END: 0.07,         // 7% ending point
  BALANCED_START: 0.07,           // 7% starting point  
  BALANCED_END: 0.095,            // 9.5% ending point
  HERO_START: 0.095,              // 9.5% starting point
  HERO_EXPONENTIAL_BASE: 25       // Base multiplier for exponential growth
} as const;

/**
 * Tier presets for UI quick selection
 */
export const TIER_PRESETS = {
  safe: { name: 'Safe', range: [0, 9] as const },
  conservative: { name: 'Conservative', range: [10, 29] as const },
  balanced: { name: 'Balanced', range: [30, 59] as const },
  hero: { name: 'Hero', range: [60, 99] as const }
} as const;

/**
 * Target allocation weights for balanced protocol distribution
 */
export const TARGET_TIER_WEIGHTS = {
  safe: 0.10,        // 10% in safe tier
  conservative: 0.20, // 20% in conservative tier
  balanced: 0.30,     // 30% in balanced tier
  hero: 0.40         // 40% in hero tier
} as const;

// ============================================================================
// SECTION 2: CORE APY CALCULATION FUNCTIONS
// ============================================================================

/**
 * PRIMARY FUNCTION: Calculate APY for any segment using 4-tier piecewise formula
 * 
 * This is the core T-Core APY calculation that implements the mathematical model:
 * - Tier 1 (0-9): Fixed 5.16% (T-Bills × 1.2)
 * - Tier 2 (10-29): Linear progression 5.16% → 7%
 * - Tier 3 (30-59): Quadratic progression 7% → 9.5%
 * - Tier 4 (60-99): Exponential progression 9.5% × 1.03^(segment-60)
 * 
 * @param segment - Risk segment (0-99)
 * @returns APY as decimal (e.g., 0.0516 = 5.16%)
 */
export const calculatePiecewiseAPY = (segment: number): number => {
  // Input validation and normalization
  const i = Math.max(0, Math.min(99, Math.round(segment)));
  
  // Tier 1: Safe (0-9) - Fixed Rate
  if (i <= TIER_BREAKPOINTS.SAFE_END) {
    return TARGET_APYS.SAFE;
  }
  
  // Tier 2: Conservative (10-29) - Linear Progression
  if (i <= TIER_BREAKPOINTS.CONSERVATIVE_END) {
    const progress = (i - TIER_BREAKPOINTS.CONSERVATIVE_START) / 
                    (TIER_BREAKPOINTS.CONSERVATIVE_END - TIER_BREAKPOINTS.CONSERVATIVE_START);
    return TARGET_APYS.CONSERVATIVE_START + 
           (TARGET_APYS.CONSERVATIVE_END - TARGET_APYS.CONSERVATIVE_START) * progress;
  }
  
  // Tier 3: Balanced (30-59) - Quadratic Progression
  if (i <= TIER_BREAKPOINTS.BALANCED_END) {
    const progress = (i - TIER_BREAKPOINTS.BALANCED_START) / 
                    (TIER_BREAKPOINTS.BALANCED_END - TIER_BREAKPOINTS.BALANCED_START);
    return TARGET_APYS.BALANCED_START + 
           (TARGET_APYS.BALANCED_END - TARGET_APYS.BALANCED_START) * Math.pow(progress, 2);
  }
  
  // Tier 4: Hero (60-99) - Exponential Progression
  return TARGET_APYS.HERO_START * Math.pow(1.03, i - TIER_BREAKPOINTS.HERO_START);
};

/**
 * Calculate weighted average APY across a range of segments
 * Used for range-based staking positions
 * 
 * @param startSegment - Starting segment (inclusive)
 * @param endSegment - Ending segment (inclusive)
 * @returns Weighted average APY as decimal
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
 * Calculate predicted annual yield in dollar terms
 * 
 * @param amount - Principal amount in dollars
 * @param bucketRange - [startSegment, endSegment] range
 * @returns Object with APY percentage and dollar yield
 */
export const calculatePredictedYield = (
  amount: number,
  bucketRange: [number, number]
): { percentAPY: number; dollarYield: number } => {
  const avgAPY = calculateRangeWeightedAPY(bucketRange[0], bucketRange[1]);
  const dollarYield = amount * avgAPY;
  
  return {
    percentAPY: avgAPY * 100,
    dollarYield
  };
};

// ============================================================================
// SECTION 3: RISK MODEL & CALCULATIONS
// ============================================================================

/**
 * Quadratic risk function: Risk(segment) = (segment/99)²
 * 
 * This provides smooth risk scaling where higher segments absorb 
 * disproportionately more losses in stress scenarios.
 * 
 * @param segment - Risk segment (0-99)
 * @returns Risk factor (0.0 to 1.0)
 */
export const calculateQuadraticRisk = (segment: number): number => {
  const i = Math.max(0, Math.min(99, segment));
  return Math.pow(i / 99, 2);
};

/**
 * Calculate stress loss for a specific position using waterfall model
 * 
 * @param userPosition - User's position value in dollars
 * @param residualLoss - Remaining loss after higher tiers absorbed losses
 * @returns Loss percentage (0.0 to 1.0)
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
 * Calculate comprehensive stress test scenarios for a position
 * 
 * Implements the T-Core waterfall loss distribution model:
 * - Higher segments absorb proportionally more losses
 * - Hero tier has exponential loss absorption scaling
 * - Quadratic risk model determines base absorption rates
 * 
 * @param userPosition - Position value in dollars
 * @param bucketRange - [startSegment, endSegment] position range
 * @param totalTVL - Total value locked in protocol
 * @returns Stress scenario results for 1%, 5%, and 10% TVL losses
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
  // Calculate position's average risk characteristics
  const avgSegment = (bucketRange[0] + bucketRange[1]) / 2;
  const quadraticRisk = calculateQuadraticRisk(avgSegment);
  
  // Define stress scenarios as percentage of total TVL
  const tvlLoss1 = totalTVL * 0.01;   // 1% TVL loss scenario
  const tvlLoss5 = totalTVL * 0.05;   // 5% TVL loss scenario  
  const tvlLoss10 = totalTVL * 0.10;  // 10% TVL loss scenario
  
  // Calculate loss absorption multiplier based on tier
  let lossMultiplier = quadraticRisk;
  
  // Hero tier gets exponential scaling for loss absorption
  if (avgSegment >= TIER_BREAKPOINTS.HERO_START) {
    const heroProgress = (avgSegment - TIER_BREAKPOINTS.HERO_START) / 
                        (TIER_BREAKPOINTS.HERO_END - TIER_BREAKPOINTS.HERO_START);
    lossMultiplier = quadraticRisk * Math.pow(1.2, heroProgress * 4); // Scale factor of 4 for full range
  }
  
  // Calculate losses for each scenario using waterfall model
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

// ============================================================================
// SECTION 4: TIER INFORMATION & UTILITIES
// ============================================================================

/**
 * Get comprehensive tier information for any segment
 * 
 * @param segment - Risk segment (0-99)
 * @returns Complete tier metadata including formula and styling
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
      targetWeight: TARGET_TIER_WEIGHTS.safe
    };
  }
  
  if (i <= TIER_BREAKPOINTS.CONSERVATIVE_END) {
    return {
      name: 'Conservative',
      range: [10, 29],
      formula: 'Linear: 5.16% → 7%',
      color: 'text-blue-600',
      targetWeight: TARGET_TIER_WEIGHTS.conservative
    };
  }
  
  if (i <= TIER_BREAKPOINTS.BALANCED_END) {
    return {
      name: 'Balanced',
      range: [30, 59],
      formula: 'Quadratic: 7% → 9.5%',
      color: 'text-yellow-600',
      targetWeight: TARGET_TIER_WEIGHTS.balanced
    };
  }
  
  return {
    name: 'Hero',
    range: [60, 99],
    formula: 'Exponential: 9.5% × 1.03^(i-60)',
    color: 'text-purple-600',
    targetWeight: TARGET_TIER_WEIGHTS.hero
  };
};

/**
 * Get simplified tier information for UI display
 * 
 * @param segment - Risk segment (0-99)
 * @returns Simplified tier info for badges and labels
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

// ============================================================================
// SECTION 5: VISUALIZATION & DATA GENERATION
// ============================================================================

/**
 * Generate complete curve data for charting and visualization
 * 
 * Creates data points for all 100 segments with APY values,
 * tier classifications, and formula descriptions.
 * 
 * @returns Array of data points for rendering charts
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
      apy: apy * 100, // Convert to percentage for display
      tier: tier.name,
      formula: tier.formula
    });
  }
  
  return data;
};

// ============================================================================
// SECTION 6: BONUS YIELD & INCENTIVE CALCULATIONS
// ============================================================================

/**
 * Calculate bonus yield distribution to incentivize target tier allocations
 * 
 * The protocol distributes performance fees as bonuses to underrepresented tiers
 * to maintain optimal risk distribution across all segments.
 * 
 * @param currentDistribution - Current TVL distribution across tiers
 * @param performanceFeePool - Available performance fees for distribution
 * @returns Bonus allocation for each tier
 */
export const calculateBonusYield = (
  currentDistribution: { safe: number; conservative: number; balanced: number; hero: number },
  performanceFeePool: number
): { safe: number; conservative: number; balanced: number; hero: number } => {
  const targets = TARGET_TIER_WEIGHTS;
  const bonuses = { safe: 0, conservative: 0, balanced: 0, hero: 0 };
  
  // Calculate how much each tier is under target allocation
  const underweights = {
    safe: Math.max(0, targets.safe - currentDistribution.safe),
    conservative: Math.max(0, targets.conservative - currentDistribution.conservative),
    balanced: Math.max(0, targets.balanced - currentDistribution.balanced),
    hero: Math.max(0, targets.hero - currentDistribution.hero)
  };
  
  const totalUnderweight = underweights.safe + underweights.conservative + 
                          underweights.balanced + underweights.hero;
  
  // Distribute bonus yield proportionally to underweight amounts
  if (totalUnderweight > 0) {
    bonuses.safe = (underweights.safe / totalUnderweight) * performanceFeePool;
    bonuses.conservative = (underweights.conservative / totalUnderweight) * performanceFeePool;
    bonuses.balanced = (underweights.balanced / totalUnderweight) * performanceFeePool;
    bonuses.hero = (underweights.hero / totalUnderweight) * performanceFeePool;
  }
  
  return bonuses;
};

// ============================================================================
// SECTION 7: TYPE DEFINITIONS & INTERFACES
// ============================================================================

/**
 * Standard tier distribution type used throughout the protocol
 */
export type TierDistribution = {
  safe: number;
  conservative: number;
  balanced: number;
  hero: number;
};

/**
 * Stress test result structure
 */
export type StressTestResult = {
  lossPercent: number;
  dollarLoss: number;
};

/**
 * Complete stress scenario results
 */
export type StressScenarios = {
  scenario1: StressTestResult;  // 1% TVL loss
  scenario5: StressTestResult;  // 5% TVL loss
  scenario10: StressTestResult; // 10% TVL loss
};

/**
 * Tier information structure
 */
export type TierInfo = {
  name: string;
  range: [number, number];
  formula: string;
  color: string;
  targetWeight: number;
};

// ============================================================================
// EXPORTS SUMMARY
// ============================================================================

/*
 * This module exports the following categories of functions:
 * 
 * CONSTANTS:
 * - TIER_BREAKPOINTS, TARGET_APYS, TIER_PRESETS, TARGET_TIER_WEIGHTS
 * 
 * CORE CALCULATIONS:
 * - calculatePiecewiseAPY, calculateRangeWeightedAPY, calculatePredictedYield
 * 
 * RISK MODELS:
 * - calculateQuadraticRisk, calculateStressLoss, calculateStressScenarios
 * 
 * UTILITIES:
 * - getTierForSegment, getTierForBucket
 * 
 * VISUALIZATION:
 * - generatePiecewiseCurveData
 * 
 * INCENTIVES:
 * - calculateBonusYield
 * 
 * TYPES:
 * - TierDistribution, StressTestResult, StressScenarios, TierInfo
 */