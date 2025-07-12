
import { RiskRange, RiskTick, LiquidityPosition, RangeCalculationResult } from '@/types/riskRange';

// Protocol constants (updated with real data)
export const RISK_SCALE_MIN = 1;
export const RISK_SCALE_MAX = 100;
export const T_BILL_RATE = 0.0418; // 4.18%
export const PREMIUM_RATE = 0.20; // 20% premium
export const MIN_GUARANTEED_APY = T_BILL_RATE * (1 + PREMIUM_RATE); // 5.016%
export const MAX_APY = 0.80; // 80% max theoretical APY

// Real protocol data
export const PROTOCOL_TVL = 12_500_000; // USD
export const TOTAL_TDD_ISSUED = 12_500_000;
export const TDD_IN_STAKING = 8_750_000; // 70%
export const PROTOCOL_APY_28_DAYS = 0.105; // 10.5%
export const YIELD_CURVE_K = 2; // Non-linear curve steepness

// TDD distribution by risk categories
export const CATEGORY_DISTRIBUTION = {
  SAFE: { range: [1, 3], totalTDD: 4_750_000 }, // Safe (1-3)
  CONSERVATIVE: { range: [4, 24], totalTDD: 1_000_000 }, // Conservative (4-24) 
  BALANCED: { range: [25, 80], totalTDD: 2_500_000 }, // Balanced (25-80)
  INSURANCE: { range: [81, 100], totalTDD: 500_000 } // Insurance (81-100)
};

/**
 * Calculate risk level APR using non-linear yield curve (k=2):
 * r_i = r_min + (r_max - r_min) * ((i - 1) / 99)^k
 * For Safe ticks (1-3): guaranteed 5.016% APY
 */
export const calculateRiskLevelAPR = (riskLevel: number): number => {
  if (riskLevel < RISK_SCALE_MIN || riskLevel > RISK_SCALE_MAX) {
    return MIN_GUARANTEED_APY;
  }
  
  // Safe ticks (1-3) get guaranteed APY
  if (riskLevel <= 3) {
    return MIN_GUARANTEED_APY;
  }
  
  // Non-linear curve for ticks 4-100
  const normalizedPosition = (riskLevel - 1) / 99;
  const curveValue = Math.pow(normalizedPosition, YIELD_CURVE_K);
  return MIN_GUARANTEED_APY + (MAX_APY - MIN_GUARANTEED_APY) * curveValue;
};

/**
 * Generate initial risk ticks with real protocol liquidity distribution
 */
export const generateRealProtocolRiskTicks = (): RiskTick[] => {
  const ticks: RiskTick[] = [];
  
  // Calculate TDD per tick for each category
  const safeTDDPerTick = CATEGORY_DISTRIBUTION.SAFE.totalTDD / 3; // 3 ticks (1-3)
  const conservativeTDDPerTick = CATEGORY_DISTRIBUTION.CONSERVATIVE.totalTDD / 21; // 21 ticks (4-24)
  const balancedTDDPerTick = CATEGORY_DISTRIBUTION.BALANCED.totalTDD / 56; // 56 ticks (25-80)
  const insuranceTDDPerTick = CATEGORY_DISTRIBUTION.INSURANCE.totalTDD / 20; // 20 ticks (81-100)
  
  for (let i = RISK_SCALE_MIN; i <= RISK_SCALE_MAX; i++) {
    let totalLiquidity = 0;
    
    // Determine which category this tick belongs to
    if (i >= 1 && i <= 3) {
      totalLiquidity = safeTDDPerTick;
    } else if (i >= 4 && i <= 24) {
      totalLiquidity = conservativeTDDPerTick;
    } else if (i >= 25 && i <= 80) {
      totalLiquidity = balancedTDDPerTick;
    } else if (i >= 81 && i <= 100) {
      totalLiquidity = insuranceTDDPerTick;
    }
    
    ticks.push({
      riskLevel: i,
      totalLiquidity,
      availableYield: 0,
      apr: calculateRiskLevelAPR(i)
    });
  }
  
  return ticks;
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
 * Calculate losses top-down distribution (high risk levels absorb losses first)
 */
export const calculateLossDistribution = (
  totalLoss: number,
  riskTicks: RiskTick[]
): { [riskLevel: number]: number } => {
  const sortedTicks = [...riskTicks].sort((a, b) => b.riskLevel - a.riskLevel);
  let remainingLoss = totalLoss;
  const lossPerTick: { [riskLevel: number]: number } = {};
  
  for (const tick of sortedTicks) {
    if (remainingLoss <= 0) {
      lossPerTick[tick.riskLevel] = 0;
      continue;
    }
    
    const tickLoss = Math.min(remainingLoss, tick.totalLiquidity);
    lossPerTick[tick.riskLevel] = tick.totalLiquidity > 0 ? tickLoss / tick.totalLiquidity : 0;
    remainingLoss -= tickLoss;
  }
  
  return lossPerTick;
};

/**
 * Calculate user's normalized risk using the formula: r_norm = (average_risk_level - 1) / 99
 */
export const calculateNormalizedRisk = (riskRange: RiskRange): number => {
  const averageRiskLevel = (riskRange.min + riskRange.max) / 2;
  return (averageRiskLevel - 1) / 99;
};

/**
 * Calculate realistic APY for new user with proper weighted average
 * Uses theoretical APR for each tick and calculates weighted average
 */
export const calculateRealisticRangeAPY = (
  userAmount: number,
  riskRange: RiskRange
): number => {
  // Handle safe ticks separately (guaranteed APY)
  if (riskRange.max <= 3) {
    return MIN_GUARANTEED_APY; // 5.016% for safe ticks
  }
  
  // Calculate range size
  const rangeSize = riskRange.max - riskRange.min + 1;
  const userTDDPerTick = userAmount / rangeSize;
  
  let weightedAPR = 0;
  let totalWeight = 0;
  
  // Calculate weighted average APR across the range
  for (let tick = riskRange.min; tick <= riskRange.max; tick++) {
    let tickAPR: number;
    let weight = userTDDPerTick;
    
    if (tick >= 1 && tick <= 3) {
      // Safe ticks: guaranteed APY
      tickAPR = MIN_GUARANTEED_APY;
    } else {
      // Risk ticks: use theoretical APR curve
      tickAPR = calculateRiskLevelAPR(tick);
      
      // Apply slight dilution effect for large positions
      // Larger positions have slightly lower effective APR due to increased supply
      const baseLiquidity = (() => {
        if (tick >= 4 && tick <= 24) return CATEGORY_DISTRIBUTION.CONSERVATIVE.totalTDD / 21;
        if (tick >= 25 && tick <= 80) return CATEGORY_DISTRIBUTION.BALANCED.totalTDD / 56;
        if (tick >= 81 && tick <= 100) return CATEGORY_DISTRIBUTION.INSURANCE.totalTDD / 20;
        return 1000000; // fallback
      })();
      
      // Small dilution factor based on user contribution to tick
      const dilutionFactor = 1 - (userTDDPerTick / (baseLiquidity + userTDDPerTick)) * 0.05;
      tickAPR *= Math.max(0.95, dilutionFactor); // Max 5% dilution
    }
    
    weightedAPR += tickAPR * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? weightedAPR / totalWeight : 0;
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
