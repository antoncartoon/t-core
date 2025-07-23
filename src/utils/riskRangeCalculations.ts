import { RiskRange, RiskTick, LiquidityPosition, RangeCalculationResult } from '@/types/riskRange';
import { calculatePiecewiseAPY, calculateRangeWeightedAPY, getTierForSegment, TARGET_APYS } from '@/utils/tzFormulas';

// Export the new piecewise calculation as the main APY calculator
export const calculateTCoreAPY = calculatePiecewiseAPY;
export const calculateRiskLevelAPR = calculatePiecewiseAPY;

// Update constants to match new model
export const RISK_SCALE_MIN = 0;
export const RISK_SCALE_MAX = 99;
export const T_BILL_RATE = 0.05; // 5% T-Bills rate
export const FIXED_BASE_MULTIPLIER = 1.2; // T-Bills * 1.2 for Safe tier
export const FIXED_BASE_APY = T_BILL_RATE * FIXED_BASE_MULTIPLIER; // 5.16% guaranteed for Safe tier

// Legacy constants for backward compatibility
export const TIER1_WIDTH = 9; // Safe tier end (0-9)
export const OPTIMAL_K = 75; // Optimal risk level for balanced positioning

// Import TIER_PRESETS from unified formula library
// Note: TIER_PRESETS is now imported from tzFormulas.ts for consistency

// Protocol data with T-Core structure
export const PROTOCOL_TVL = 12_500_000; // USD
export const TOTAL_TDD_ISSUED = 12_500_000;
export const TDD_IN_STAKING = 8_750_000; // 70%
export const PROTOCOL_APY_28_DAYS = 0.105; // 10.5%
export const AVERAGE_APY_TARGET = 0.0873; // 8.73% from simulation
export const BONUS_SPREAD = 0.0891; // 8.91% spread from simulation

// Updated distribution matching T-Core tiers with new ranges
export const CATEGORY_DISTRIBUTION = {
  SAFE: { range: [0, 9], totalTDD: 875_000, isFixed: true }, // 10% (reduced from original)
  CONSERVATIVE: { range: [10, 29], totalTDD: 1_750_000, isFixed: false }, // 20%
  BALANCED: { range: [30, 59], totalTDD: 2_625_000, isFixed: false }, // 30%
  HERO: { range: [60, 99], totalTDD: 3_500_000, isFixed: false } // 40%
};

/**
 * Generate T-Core risk ticks with 4-tier structure using new piecewise model
 */
export const generateTCoreRiskTicks = (): RiskTick[] => {
  const ticks: RiskTick[] = [];
  
  // Calculate TDD per tick for each T-Core tier
  const safeTDDPerTick = CATEGORY_DISTRIBUTION.SAFE.totalTDD / 10; // 10 ticks (0-9)
  const conservativeTDDPerTick = CATEGORY_DISTRIBUTION.CONSERVATIVE.totalTDD / 20; // 20 ticks (10-29)
  const balancedTDDPerTick = CATEGORY_DISTRIBUTION.BALANCED.totalTDD / 30; // 30 ticks (30-59)
  const heroTDDPerTick = CATEGORY_DISTRIBUTION.HERO.totalTDD / 40; // 40 ticks (60-99)
  
  for (let i = RISK_SCALE_MIN; i <= RISK_SCALE_MAX; i++) {
    let totalLiquidity = 0;
    
    // Determine which T-Core tier this tick belongs to
    if (i >= 0 && i <= 9) {
      totalLiquidity = safeTDDPerTick;
    } else if (i >= 10 && i <= 29) {
      totalLiquidity = conservativeTDDPerTick;
    } else if (i >= 30 && i <= 59) {
      totalLiquidity = balancedTDDPerTick;
    } else if (i >= 60 && i <= 99) {
      totalLiquidity = heroTDDPerTick;
    }
    
    ticks.push({
      riskLevel: i,
      totalLiquidity,
      availableYield: 0,
      apr: calculatePiecewiseAPY(i)
    });
  }
  
  return ticks;
};

/**
 * Legacy function for backward compatibility
 */
export const generateRealProtocolRiskTicks = (): RiskTick[] => {
  return generateTCoreRiskTicks();
};

/**
 * Calculate T-Core personal APY using new piecewise formula
 */
export const calculateTCorePersonalAPY = (
  userAmount: number,
  riskRange: RiskRange
): number => {
  return calculateRangeWeightedAPY(riskRange.min, riskRange.max);
};

/**
 * Legacy function for backward compatibility
 */
export const calculateRealisticRangeAPY = (
  userAmount: number,
  riskRange: RiskRange
): number => {
  return calculateTCorePersonalAPY(userAmount, riskRange);
};

/**
 * Calculate user's position APR in a risk range (updated for piecewise)
 */
export const calculateRangeAPR = (
  userAmount: number,
  riskRange: RiskRange,
  riskTicks: RiskTick[]
): number => {
  return calculateRangeWeightedAPY(riskRange.min, riskRange.max);
};

/**
 * Calculate total protocol yield for 28 days based on real data
 */
export const calculateProtocolYield28Days = (): number => {
  return (PROTOCOL_TVL * PROTOCOL_APY_28_DAYS / 365) * 28;
};

/**
 * Find the coverage level k - the highest risk level that gets full expected yield
 * Based on: Find largest k such that sum(S_i * r_i) <= Y_est for i=1 to k
 */
export const findCoverageLevel = (
  totalExpectedYield: number,
  riskTicks: RiskTick[]
): number => {
  let cumulativeYieldNeeded = 0;
  
  for (let riskLevel = RISK_SCALE_MIN; riskLevel <= RISK_SCALE_MAX; riskLevel++) {
    const tick = riskTicks.find(t => t.riskLevel === riskLevel);
    const liquidity = tick?.totalLiquidity || 0;
    const expectedAPR = calculatePiecewiseAPY(riskLevel);
    
    cumulativeYieldNeeded += liquidity * expectedAPR;
    
    if (cumulativeYieldNeeded > totalExpectedYield) {
      return Math.max(RISK_SCALE_MIN, riskLevel - 1);
    }
  }
  
  return RISK_SCALE_MAX;
};

/**
 * Distribute yield bottom-up using the waterfall model from the document
 */
export const distributeYieldBottomUp = (
  totalYield: number,
  riskTicks: RiskTick[]
): RiskTick[] => {
  const coverageLevel = findCoverageLevel(totalYield, riskTicks);
  let remainingYield = totalYield;
  
  return riskTicks.map(tick => {
    const { riskLevel, totalLiquidity } = tick;
    
    if (riskLevel <= coverageLevel && totalLiquidity > 0) {
      const expectedAPR = calculatePiecewiseAPY(riskLevel);
      const tickYield = Math.min(remainingYield, totalLiquidity * expectedAPR);
      remainingYield -= tickYield;
      
      return {
        ...tick,
        availableYield: tickYield,
        apr: tickYield / totalLiquidity
      };
    } else if (riskLevel === coverageLevel + 1 && remainingYield > 0 && totalLiquidity > 0) {
      // Partial coverage for level k+1
      const tickYield = Math.min(remainingYield, totalLiquidity * calculatePiecewiseAPY(riskLevel));
      remainingYield -= tickYield;
      
      return {
        ...tick,
        availableYield: tickYield,
        apr: tickYield / totalLiquidity
      };
    }
    
    return {
      ...tick,
      availableYield: 0,
      apr: 0
    };
  });
};

/**
 * Calculate T-Core subordination losses (high absorbs losses first via Loss_i formula)
 * Loss_i = L_total * (f(i)/∑f(j>1)), where f(i) = p * k^(i - tier1_width)
 */
export const calculateTCoreSubordinationLoss = (
  totalLoss: number,
  riskTicks: RiskTick[]
): { [riskLevel: number]: number } => {
  const lossPerTick: { [riskLevel: number]: number } = {};
  
  // Tier1 (0-9) has 0 loss (guaranteed)
  for (let i = 0; i <= 9; i++) {
    lossPerTick[i] = 0;
  }
  
  // Calculate f(i) for higher tiers (10-99)
  const higherTierFactors: { [riskLevel: number]: number } = {};
  let totalFactor = 0;
  
  for (let i = 10; i <= RISK_SCALE_MAX; i++) {
    const factor = calculatePiecewiseAPY(i); // Use APY as the factor
    higherTierFactors[i] = factor;
    totalFactor += factor;
  }
  
  // Distribute losses based on subordination formula
  for (let i = 10; i <= RISK_SCALE_MAX; i++) {
    if (totalFactor > 0) {
      const lossRatio = higherTierFactors[i] / totalFactor;
      lossPerTick[i] = totalLoss * lossRatio;
    } else {
      lossPerTick[i] = 0;
    }
  }
  
  return lossPerTick;
};

/**
 * Legacy function for backward compatibility
 */
export const calculateLossDistribution = (
  totalLoss: number,
  riskTicks: RiskTick[]
): { [riskLevel: number]: number } => {
  return calculateTCoreSubordinationLoss(totalLoss, riskTicks);
};

/**
 * Calculate user's normalized risk using the formula: r_norm = (average_risk_level) / 99
 */
export const calculateNormalizedRisk = (riskRange: RiskRange): number => {
  const averageRiskLevel = (riskRange.min + riskRange.max) / 2;
  return averageRiskLevel / 99;
};

/**
 * Calculate capital efficiency for a range
 */
export const calculateCapitalEfficiency = (
  riskRange: RiskRange,
  riskTicks: RiskTick[]
): number => {
  const rangeSize = riskRange.max - riskRange.min + 1;
  const maxPossibleSize = RISK_SCALE_MAX - RISK_SCALE_MIN + 1;
  
  // Narrower ranges are more capital efficient
  const sizeEfficiency = maxPossibleSize / rangeSize;
  
  // Higher risk ranges have potential for higher efficiency
  const avgRisk = (riskRange.min + riskRange.max) / 2;
  const riskMultiplier = 1 + ((avgRisk - RISK_SCALE_MIN) / (RISK_SCALE_MAX - RISK_SCALE_MIN)) * 0.5;
  
  return sizeEfficiency * riskMultiplier;
};

/**
 * Calculate potential losses using normalized risk
 */
export const calculatePotentialLoss = (
  userAmount: number,
  riskRange: RiskRange,
  riskTicks: RiskTick[]
): { at5Percent: number; at10Percent: number; at20Percent: number } => {
  const normalizedRisk = calculateNormalizedRisk(riskRange);
  
  // Loss scenarios based on protocol drawdown
  const scenarios = [0.05, 0.10, 0.20];
  const results = scenarios.map(protocolLoss => {
    // User loss is proportional to their normalized risk position
    return userAmount * protocolLoss * normalizedRisk;
  });
  
  return {
    at5Percent: results[0],
    at10Percent: results[1],
    at20Percent: results[2]
  };
};

/**
 * Generate risk ticks for all levels 0-99 (updated range)
 */
export const generateInitialRiskTicks = (): RiskTick[] => {
  const ticks: RiskTick[] = [];
  
  for (let i = RISK_SCALE_MIN; i <= RISK_SCALE_MAX; i++) {
    ticks.push({
      riskLevel: i,
      totalLiquidity: 0,
      availableYield: 0,
      apr: calculatePiecewiseAPY(i)
    });
  }
  
  return ticks;
};

/**
 * Calculate historical APY estimate (28-day rolling average)
 */
export const calculateHistoricalAPY = (historicalYields: number[]): number => {
  if (historicalYields.length === 0) return 0.10; // Default 10%
  
  const sum = historicalYields.reduce((acc, yield_) => acc + yield_, 0);
  return sum / historicalYields.length;
};

/**
 * Simulate annual value increase from burns
 * Based on simulation: ~0.5-5% annually depending on burn rate
 */
export const simulateAnnualValueIncrease = (
  totalFees: number,
  burnRate: number,
  currentPrice: number = 1.0
): number => {
  const annualBurnAmount = totalFees * burnRate;
  const baseIncrease = 0.005; // 0.5% base
  const scalingFactor = burnRate * 10; // Higher burn rate = more value increase
  
  return Math.min(baseIncrease + (scalingFactor * 0.001), 0.05); // Cap at 5%
};

// ============= SURPLUS POOL CALCULATIONS =============

/**
 * Calculate surplus pool after minimum yields distributed
 * Formula: Surplus = Y_total - (fixed_base * S_tier1)
 */
export const calculateSurplusPool = (
  totalYield: number,
  tier1Stake: number = CATEGORY_DISTRIBUTION.SAFE.totalTDD
): number => {
  const minYieldsRequired = tier1Stake * FIXED_BASE_APY;
  return Math.max(0, totalYield - minYieldsRequired);
};

/**
 * Calculate surplus distribution to higher tiers
 * Formula: Dist_i = surplus * (f(i)/∑f(j>1)) * (S_i / ∑S_higher)
 * where f(i) = 1 * 1.03^(i - 25) for i > 25
 */
export const calculateSurplusDistribution = (
  surplus: number,
  riskTicks: RiskTick[]
): { [riskLevel: number]: number } => {
  const distribution: { [riskLevel: number]: number } = {};
  
  // Tier1 gets 0 surplus (already has fixed minimum)
  for (let i = 0; i <= 9; i++) {
    distribution[i] = 0;
  }
  
  // Calculate factors for higher tiers (10-99)
  const higherTierFactors: { [riskLevel: number]: number } = {};
  let totalFactor = 0;
  let totalHigherStake = 0;
  
  for (let i = 10; i <= RISK_SCALE_MAX; i++) {
    const factor = calculatePiecewiseAPY(i);
    higherTierFactors[i] = factor;
    totalFactor += factor;
    
    // Get stake for this tier
    const tick = riskTicks.find(t => t.riskLevel === i);
    totalHigherStake += tick?.totalLiquidity || 0;
  }
  
  // Distribute surplus proportionally
  for (let i = 10; i <= RISK_SCALE_MAX; i++) {
    if (totalFactor > 0 && totalHigherStake > 0) {
      const tick = riskTicks.find(t => t.riskLevel === i);
      const stake = tick?.totalLiquidity || 0;
      
      const proportionalWeight = (higherTierFactors[i] / totalFactor) * (stake / totalHigherStake);
      distribution[i] = surplus * proportionalWeight;
    } else {
      distribution[i] = 0;
    }
  }
  
  return distribution;
};

/**
 * Simulate surplus distribution for UI display
 * Returns example distribution for 1M TVL scenario
 */
export const simulateSurplusDistribution = (): {
  tier1: number;
  tier2: number; 
  tier3: number;
  tier4: number;
} => {
  const totalYield = 1_000_000 * 0.105; // 10.5% on 1M TVL
  const surplus = calculateSurplusPool(totalYield);
  
  // Simulated distribution based on T-Core weights
  return {
    tier1: 0, // No surplus for tier1 (already has fixed)
    tier2: surplus * 0.08, // ~8% of surplus (~5.8k)
    tier3: surplus * 0.17, // ~17% of surplus (~12.5k)
    tier4: surplus * 0.75  // ~75% of surplus (~54k)
  };
};

export const analyzeRiskRange = (
  amount: number,
  riskRange: RiskRange,
  riskTicks: RiskTick[],
  historicalAPY?: number
): RangeCalculationResult => {
  const estimatedAPR = calculateRangeAPR(amount, riskRange, riskTicks);
  const capitalEfficiency = calculateCapitalEfficiency(riskRange, riskTicks);
  const riskScore = calculateNormalizedRisk(riskRange) * 100; // Convert to 0-100 scale
  const potentialLoss = calculatePotentialLoss(amount, riskRange, riskTicks);
  
  return {
    estimatedAPR,
    capitalEfficiency,
    riskScore,
    potentialLoss
  };
};
