
import { RiskRange, RiskTick, LiquidityPosition, RangeCalculationResult } from '@/types/riskRange';

export const RISK_SCALE_MIN = 1;
export const RISK_SCALE_MAX = 100;
export const T_BILL_RATE = 0.05; // 5% T-Bills (example)
export const PREMIUM_RATE = 0.20; // +20% premium
export const MIN_GUARANTEED_APY = T_BILL_RATE + PREMIUM_RATE; // T-Bill + 20%
export const MAX_APY = 0.25; // 25% maximum

/**
 * Calculate risk level APR using the exact formula from the document:
 * r_i = r_min + (r_max - r_min) * (i - 1) / 99
 */
export const calculateRiskLevelAPR = (riskLevel: number): number => {
  if (riskLevel < RISK_SCALE_MIN || riskLevel > RISK_SCALE_MAX) {
    return MIN_GUARANTEED_APY;
  }
  
  return MIN_GUARANTEED_APY + (MAX_APY - MIN_GUARANTEED_APY) * (riskLevel - 1) / 99;
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
 * Calculate user's position APR in a risk range
 */
export const calculateRangeAPR = (
  userAmount: number,
  riskRange: RiskRange,
  riskTicks: RiskTick[]
): number => {
  const relevantTicks = riskTicks.filter(
    tick => tick.riskLevel >= riskRange.min && tick.riskLevel <= riskRange.max
  );
  
  if (relevantTicks.length === 0) return 0;
  
  const rangeSize = riskRange.max - riskRange.min + 1;
  const amountPerLevel = userAmount / rangeSize;
  
  let totalYield = 0;
  
  for (const tick of relevantTicks) {
    if (tick.totalLiquidity > 0) {
      const userShareInTick = amountPerLevel / (tick.totalLiquidity + amountPerLevel);
      totalYield += tick.availableYield * userShareInTick;
    }
  }
  
  return userAmount > 0 ? (totalYield / userAmount) : 0;
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
