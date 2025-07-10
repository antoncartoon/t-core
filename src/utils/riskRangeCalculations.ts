
import { RiskRange, RiskTick, LiquidityPosition, RangeCalculationResult } from '@/types/riskRange';

export const RISK_SCALE_MAX = 100;
export const GUARANTEED_APY_BASE = 0.05; // 5% T-Bills
export const GUARANTEED_APY_PREMIUM = 0.20; // +20%

/**
 * Calculate yield distribution across risk ticks (bottom-up)
 */
export const distributeYieldBottomUp = (
  totalYield: number,
  riskTicks: RiskTick[]
): RiskTick[] => {
  const sortedTicks = [...riskTicks].sort((a, b) => a.riskLevel - b.riskLevel);
  let remainingYield = totalYield;
  
  return sortedTicks.map(tick => {
    if (remainingYield <= 0 || tick.totalLiquidity === 0) {
      return { ...tick, availableYield: 0, apr: 0 };
    }
    
    const tickYield = Math.min(remainingYield, tick.totalLiquidity * 0.25); // Max 25% APY per tick
    remainingYield -= tickYield;
    
    const apr = tick.totalLiquidity > 0 ? tickYield / tick.totalLiquidity : 0;
    
    return {
      ...tick,
      availableYield: tickYield,
      apr: apr
    };
  });
};

/**
 * Calculate losses top-down distribution
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
  const amountPerTick = userAmount / rangeSize;
  
  let totalYield = 0;
  
  for (const tick of relevantTicks) {
    if (tick.totalLiquidity > 0) {
      const userShareInTick = amountPerTick / (tick.totalLiquidity + amountPerTick);
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
  const maxPossibleSize = RISK_SCALE_MAX + 1;
  
  // Narrower ranges are more capital efficient
  const sizeEfficiency = maxPossibleSize / rangeSize;
  
  // Higher risk ranges have potential for higher efficiency
  const avgRisk = (riskRange.min + riskRange.max) / 2;
  const riskMultiplier = 1 + (avgRisk / RISK_SCALE_MAX) * 0.5;
  
  return sizeEfficiency * riskMultiplier;
};

/**
 * Calculate potential losses at different protocol drawdown scenarios
 */
export const calculatePotentialLoss = (
  userAmount: number,
  riskRange: RiskRange,
  riskTicks: RiskTick[]
): { at5Percent: number; at10Percent: number; at20Percent: number } => {
  const totalTVL = riskTicks.reduce((sum, tick) => sum + tick.totalLiquidity, 0);
  
  const scenarios = [0.05, 0.10, 0.20];
  const results = scenarios.map(drawdownPercent => {
    const totalLoss = totalTVL * drawdownPercent;
    const lossDistribution = calculateLossDistribution(totalLoss, riskTicks);
    
    const relevantTicks = riskTicks.filter(
      tick => tick.riskLevel >= riskRange.min && tick.riskLevel <= riskRange.max
    );
    
    let userLoss = 0;
    const rangeSize = riskRange.max - riskRange.min + 1;
    const amountPerTick = userAmount / rangeSize;
    
    for (const tick of relevantTicks) {
      const lossRate = lossDistribution[tick.riskLevel] || 0;
      userLoss += amountPerTick * lossRate;
    }
    
    return userLoss;
  });
  
  return {
    at5Percent: results[0],
    at10Percent: results[1],
    at20Percent: results[2]
  };
};

/**
 * Generate initial risk ticks for the protocol
 */
export const generateInitialRiskTicks = (): RiskTick[] => {
  const ticks: RiskTick[] = [];
  
  for (let i = 0; i <= RISK_SCALE_MAX; i += 5) {
    ticks.push({
      riskLevel: i,
      totalLiquidity: 0,
      availableYield: 0,
      apr: 0
    });
  }
  
  return ticks;
};

/**
 * Calculate comprehensive range analysis
 */
export const analyzeRiskRange = (
  amount: number,
  riskRange: RiskRange,
  riskTicks: RiskTick[]
): RangeCalculationResult => {
  const estimatedAPR = calculateRangeAPR(amount, riskRange, riskTicks);
  const capitalEfficiency = calculateCapitalEfficiency(riskRange, riskTicks);
  const avgRisk = (riskRange.min + riskRange.max) / 2;
  const potentialLoss = calculatePotentialLoss(amount, riskRange, riskTicks);
  
  return {
    estimatedAPR,
    capitalEfficiency,
    riskScore: avgRisk,
    potentialLoss
  };
};
