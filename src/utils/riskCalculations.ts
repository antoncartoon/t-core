import { PoolSettings } from '@/types/staking';

export const DEFAULT_POOL_SETTINGS: PoolSettings = {
  baseAPY: 0.05, // 5% T-Bills rate (minimum)
  maxAPY: 0.25, // 25% maximum possible APY
  lambda: 1.5, // Risk sensitivity coefficient
  totalPoolValue: 0,
  dailyYield: 0
};

/**
 * Calculate risk score based on desired APY
 * Formula: riskScore = min(10000, λ * ((r_user - r_base)/(r_max - r_base))^2 * 10000)
 */
export const calculateRiskScore = (
  desiredAPY: number,
  poolSettings: PoolSettings = DEFAULT_POOL_SETTINGS
): number => {
  const { baseAPY, maxAPY, lambda } = poolSettings;
  
  // Ensure desired APY is within bounds
  const clampedAPY = Math.max(baseAPY, Math.min(maxAPY, desiredAPY));
  
  // Calculate normalized risk
  const normalizedRisk = (clampedAPY - baseAPY) / (maxAPY - baseAPY);
  
  // Apply formula with quadratic scaling and lambda
  const riskScore = Math.min(10000, lambda * Math.pow(normalizedRisk, 2) * 10000);
  
  return Math.round(riskScore);
};

/**
 * Calculate payout priority (higher priority = paid first)
 */
export const calculatePayoutPriority = (riskScore: number): number => {
  return 10000 - riskScore;
};

/**
 * Convert risk score to legacy risk level (0-100)
 */
export const riskScoreToLevel = (riskScore: number): number => {
  return Math.round((riskScore / 10000) * 100);
};

/**
 * Convert risk score to category
 */
export const riskScoreToCategory = (riskScore: number): 'Conservative' | 'Moderate' | 'Aggressive' => {
  const level = riskScoreToLevel(riskScore);
  if (level <= 33) return 'Conservative';
  if (level <= 66) return 'Moderate';
  return 'Aggressive';
};

/**
 * Get lock period based on risk score (updated to minimum 15 days)
 */
export const getLockPeriodFromRisk = (riskScore: number): number => {
  const level = riskScoreToLevel(riskScore);
  if (level <= 33) return 15; // 15 days for low risk (was 30)
  if (level <= 66) return 60; // 60 days for moderate risk (was 90)
  return 120; // 120 days for high risk (was 180)
};

/**
 * Calculate available pool capacity for a given risk level
 */
export const calculateAvailableCapacity = (
  riskScore: number,
  totalPoolValue: number,
  existingPositions: Array<{ riskScore: number; amount: number }>
): number => {
  // For demonstration - in reality this would be more complex
  // Higher risk = lower capacity due to concentration limits
  const riskLevel = riskScoreToLevel(riskScore);
  const maxRiskAllocation = riskLevel <= 33 ? 0.6 : riskLevel <= 66 ? 0.3 : 0.1;
  
  const usedCapacityInRiskRange = existingPositions
    .filter(p => Math.abs(p.riskScore - riskScore) < 1000)
    .reduce((sum, p) => sum + p.amount, 0);
  
  const maxCapacityForRisk = totalPoolValue * maxRiskAllocation;
  return Math.max(0, maxCapacityForRisk - usedCapacityInRiskRange);
};

export interface PayoutResult {
  positionId: string;
  expectedPayout: number;
  actualPayout: number;
  shortfall: number;
}

export const simulatePayoutDistribution = (
  positions: Array<{
    id: string;
    amount: number;
    desiredAPY: number;
    payoutPriority: number;
  }>,
  totalAvailableYield: number,
  daysSinceLastPayout: number = 1
): PayoutResult[] => {
  // Sort positions by priority (highest first)
  const sortedPositions = [...positions].sort((a, b) => b.payoutPriority - a.payoutPriority);
  
  let remainingYield = totalAvailableYield;
  const results: PayoutResult[] = [];
  
  for (const position of sortedPositions) {
    // Calculate expected daily payout
    const expectedDailyPayout = (position.amount * position.desiredAPY) / 365;
    const expectedPayout = expectedDailyPayout * daysSinceLastPayout;
    
    // Calculate actual payout (limited by available yield)
    const actualPayout = Math.min(expectedPayout, remainingYield);
    const shortfall = expectedPayout - actualPayout;
    
    results.push({
      positionId: position.id,
      expectedPayout,
      actualPayout,
      shortfall
    });
    
    remainingYield -= actualPayout;
    
    // If no yield left, remaining positions get nothing
    if (remainingYield <= 0) {
      break;
    }
  }
  
  // Add remaining positions with zero payouts
  const processedIds = new Set(results.map(r => r.positionId));
  for (const position of positions) {
    if (!processedIds.has(position.id)) {
      const expectedDailyPayout = (position.amount * position.desiredAPY) / 365;
      const expectedPayout = expectedDailyPayout * daysSinceLastPayout;
      
      results.push({
        positionId: position.id,
        expectedPayout,
        actualPayout: 0,
        shortfall: expectedPayout
      });
    }
  }
  
  return results;
};
