
import { RiskRange, RiskTick, LiquidityPosition, RangeCalculationResult } from '@/types/riskRange';

// T-Core Protocol constants with new T-Core formulas
export const RISK_SCALE_MIN = 1;
export const RISK_SCALE_MAX = 100;
export const T_BILL_RATE = 0.05; // 5% T-Bills rate
export const FIXED_BASE_MULTIPLIER = 1.2; // T-Bills * 1.2 for tier1 guarantee
export const FIXED_BASE_APY = T_BILL_RATE * FIXED_BASE_MULTIPLIER; // 6% guaranteed for tier1
export const OPTIMAL_K = 1.03; // Optimal k value for gradual bonus growth
export const VARIANCE_TARGET = 2.9e-7; // Target variance for liquidity uniformity
export const TIER1_WIDTH = 25; // Width of tier1 (levels 1-25)

// T-Core 4-tier preset structure
export const TIER_PRESETS = {
  TIER1: { range: [1, 25], name: 'Fixed Safe', fixedAPY: FIXED_BASE_APY },
  TIER2: { range: [26, 50], name: 'Low Bonus', fixedAPY: FIXED_BASE_APY },
  TIER3: { range: [51, 75], name: 'Medium Bonus', fixedAPY: FIXED_BASE_APY },
  TIER4: { range: [76, 100], name: 'High Bonus', fixedAPY: FIXED_BASE_APY }
};

// Protocol data with T-Core structure
export const PROTOCOL_TVL = 12_500_000; // USD
export const TOTAL_TDD_ISSUED = 12_500_000;
export const TDD_IN_STAKING = 8_750_000; // 70%
export const PROTOCOL_APY_28_DAYS = 0.105; // 10.5%
export const AVERAGE_APY_TARGET = 0.0873; // 8.73% from simulation
export const BONUS_SPREAD = 0.0891; // 8.91% spread from simulation

// Updated distribution matching T-Core tiers
export const CATEGORY_DISTRIBUTION = {
  TIER1: { range: [1, 25], totalTDD: 4_750_000, isFixed: true },
  TIER2: { range: [26, 50], totalTDD: 2_500_000, isFixed: false },
  TIER3: { range: [51, 75], totalTDD: 3_250_000, isFixed: false },
  TIER4: { range: [76, 100], totalTDD: 2_000_000, isFixed: false }
};

/**
 * Calculate T-Core APY using tier1 fixed + bonus formula:
 * tier1 APY = fixed_base = T-Bills_rate * 1.2 (6% guaranteed)
 * higher tiers APY = fixed_base + bonus * f(i), where f(i) = p * k^(i - tier1_width)
 */
export const calculateTCoreAPY = (riskLevel: number): number => {
  if (riskLevel < RISK_SCALE_MIN || riskLevel > RISK_SCALE_MAX) {
    return FIXED_BASE_APY;
  }
  
  // Tier1 (1-25): guaranteed fixed APY, no bonus
  if (riskLevel <= TIER1_WIDTH) {
    return FIXED_BASE_APY; // 6% guaranteed
  }
  
  // Higher tiers (26-100): fixed_base + bonus
  const p = 1; // Scale factor
  const bonusExponent = riskLevel - TIER1_WIDTH; // Distance from tier1
  const bonusMultiplier = p * Math.pow(OPTIMAL_K, bonusExponent);
  
  // Bonus calculation (gradual growth with k=1.03)
  const bonus = (bonusMultiplier - 1) * FIXED_BASE_APY; // Bonus relative to fixed_base
  
  return FIXED_BASE_APY + bonus;
};

/**
 * Legacy function for backward compatibility
 */
export const calculateRiskLevelAPR = (riskLevel: number): number => {
  return calculateTCoreAPY(riskLevel);
};

/**
 * Generate T-Core risk ticks with 4-tier structure
 */
export const generateTCoreRiskTicks = (): RiskTick[] => {
  const ticks: RiskTick[] = [];
  
  // Calculate TDD per tick for each T-Core tier
  const tier1TDDPerTick = CATEGORY_DISTRIBUTION.TIER1.totalTDD / 25; // 25 ticks (1-25)
  const tier2TDDPerTick = CATEGORY_DISTRIBUTION.TIER2.totalTDD / 25; // 25 ticks (26-50)
  const tier3TDDPerTick = CATEGORY_DISTRIBUTION.TIER3.totalTDD / 25; // 25 ticks (51-75)
  const tier4TDDPerTick = CATEGORY_DISTRIBUTION.TIER4.totalTDD / 25; // 25 ticks (76-100)
  
  for (let i = RISK_SCALE_MIN; i <= RISK_SCALE_MAX; i++) {
    let totalLiquidity = 0;
    
    // Determine which T-Core tier this tick belongs to
    if (i >= 1 && i <= 25) {
      totalLiquidity = tier1TDDPerTick;
    } else if (i >= 26 && i <= 50) {
      totalLiquidity = tier2TDDPerTick;
    } else if (i >= 51 && i <= 75) {
      totalLiquidity = tier3TDDPerTick;
    } else if (i >= 76 && i <= 100) {
      totalLiquidity = tier4TDDPerTick;
    }
    
    ticks.push({
      riskLevel: i,
      totalLiquidity,
      availableYield: 0,
      apr: calculateTCoreAPY(i)
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
    const expectedAPR = calculateRiskLevelAPR(riskLevel);
    
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
      const expectedAPR = calculateRiskLevelAPR(riskLevel);
      const tickYield = Math.min(remainingYield, totalLiquidity * expectedAPR);
      remainingYield -= tickYield;
      
      return {
        ...tick,
        availableYield: tickYield,
        apr: tickYield / totalLiquidity
      };
    } else if (riskLevel === coverageLevel + 1 && remainingYield > 0 && totalLiquidity > 0) {
      // Partial coverage for level k+1
      const tickYield = Math.min(remainingYield, totalLiquidity * calculateRiskLevelAPR(riskLevel));
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
  
  // Tier1 (1-25) has 0 loss (guaranteed)
  for (let i = 1; i <= TIER1_WIDTH; i++) {
    lossPerTick[i] = 0;
  }
  
  // Calculate f(i) for higher tiers (26-100)
  const higherTierFactors: { [riskLevel: number]: number } = {};
  let totalFactor = 0;
  
  for (let i = TIER1_WIDTH + 1; i <= RISK_SCALE_MAX; i++) {
    const p = 1; // Scale factor
    const bonusExponent = i - TIER1_WIDTH;
    const factor = p * Math.pow(OPTIMAL_K, bonusExponent);
    higherTierFactors[i] = factor;
    totalFactor += factor;
  }
  
  // Distribute losses based on subordination formula
  for (let i = TIER1_WIDTH + 1; i <= RISK_SCALE_MAX; i++) {
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
 * Calculate user's normalized risk using the formula: r_norm = (average_risk_level - 1) / 99
 */
export const calculateNormalizedRisk = (riskRange: RiskRange): number => {
  const averageRiskLevel = (riskRange.min + riskRange.max) / 2;
  return (averageRiskLevel - 1) / 99;
};

/**
 * Calculate T-Core personal APY using formula:
 * Личный APY = ∑ [fixed_base if j in tier1 else fixed_base + bonus] * (S_user_j / S_j)
 */
export const calculateTCorePersonalAPY = (
  userAmount: number,
  riskRange: RiskRange
): number => {
  // Handle tier1 ranges (guaranteed fixed APY)
  if (riskRange.max <= TIER1_WIDTH) {
    return FIXED_BASE_APY; // 6% guaranteed for tier1
  }
  
  // Calculate range size and user allocation per tick
  const rangeSize = riskRange.max - riskRange.min + 1;
  const userTDDPerTick = userAmount / rangeSize;
  
  let weightedAPR = 0;
  let totalWeight = 0;
  
  // Calculate weighted average APR across the range using T-Core formula
  for (let tick = riskRange.min; tick <= riskRange.max; tick++) {
    let tickAPR: number;
    let weight = userTDDPerTick;
    
    if (tick <= TIER1_WIDTH) {
      // Tier1: guaranteed fixed APY
      tickAPR = FIXED_BASE_APY;
    } else {
      // Higher tiers: fixed_base + bonus
      tickAPR = calculateTCoreAPY(tick);
      
      // Apply dilution effect based on T-Core tier structure
      const baseLiquidity = (() => {
        if (tick >= 1 && tick <= 25) return CATEGORY_DISTRIBUTION.TIER1.totalTDD / 25;
        if (tick >= 26 && tick <= 50) return CATEGORY_DISTRIBUTION.TIER2.totalTDD / 25;
        if (tick >= 51 && tick <= 75) return CATEGORY_DISTRIBUTION.TIER3.totalTDD / 25;
        if (tick >= 76 && tick <= 100) return CATEGORY_DISTRIBUTION.TIER4.totalTDD / 25;
        return 1000000; // fallback
      })();
      
      // Dilution factor for large positions (S_user_j / S_j effect)
      const dilutionFactor = 1 - (userTDDPerTick / (baseLiquidity + userTDDPerTick)) * 0.03;
      tickAPR *= Math.max(0.97, dilutionFactor); // Max 3% dilution
    }
    
    weightedAPR += tickAPR * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? weightedAPR / totalWeight : FIXED_BASE_APY;
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
 * Calculate user's position APR in a risk range (legacy function, kept for compatibility)
 */
export const calculateRangeAPR = (
  userAmount: number,
  riskRange: RiskRange,
  riskTicks: RiskTick[]
): number => {
  // Use the new realistic calculation
  return calculateRealisticRangeAPY(userAmount, riskRange);
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
 * Generate risk ticks for all levels 1-100
 */
export const generateInitialRiskTicks = (): RiskTick[] => {
  const ticks: RiskTick[] = [];
  
  for (let i = RISK_SCALE_MIN; i <= RISK_SCALE_MAX; i++) {
    ticks.push({
      riskLevel: i,
      totalLiquidity: 0,
      availableYield: 0,
      apr: calculateRiskLevelAPR(i)
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
 * Calculate comprehensive range analysis using exact formulas from document
 */
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
