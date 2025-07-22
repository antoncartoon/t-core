
// ТЗ COMPLIANT FORMULAS - Exact implementation from specification

/**
 * ТЗ Main APY Formula: APY(r) = APY_safe + (APY_protocol - APY_safe) × r^1.5
 * where r = (bucket number) / 99
 */
export const calculateTZCompliantAPY = (bucketNumber: number): number => {
  const APY_SAFE = 0.0516; // T-bills × 1.2 = 5.16%
  const APY_PROTOCOL = 0.10; // Protocol average 10% APY
  
  // Ensure bucket is in range 0-99
  const clampedBucket = Math.max(0, Math.min(99, bucketNumber));
  
  // Calculate r = bucket / 99
  const r = clampedBucket / 99;
  
  // Apply ТЗ formula: APY(r) = APY_safe + (APY_protocol - APY_safe) × r^1.5
  const result = APY_SAFE + (APY_PROTOCOL - APY_SAFE) * Math.pow(r, 1.5);
  
  return result;
};

/**
 * ТЗ Stress Loss Formula: Loss = min(residual_loss, user_position) / user_position
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
 * Calculate stress scenarios: -1%, -5%, -10% TVL
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
  // Calculate average risk position
  const avgBucket = (bucketRange[0] + bucketRange[1]) / 2;
  const riskFactor = avgBucket / 99; // Normalize to 0-1
  
  // TVL loss scenarios
  const tvlLoss1 = totalTVL * 0.01; // -1% TVL
  const tvlLoss5 = totalTVL * 0.05; // -5% TVL  
  const tvlLoss10 = totalTVL * 0.10; // -10% TVL
  
  // User bears losses proportional to risk position (higher buckets absorb more)
  const userRiskShare = Math.pow(riskFactor, 2); // Quadratic risk scaling
  
  return {
    scenario1: {
      lossPercent: calculateStressLoss(userPosition, tvlLoss1 * userRiskShare) * 100,
      dollarLoss: Math.min(tvlLoss1 * userRiskShare, userPosition)
    },
    scenario5: {
      lossPercent: calculateStressLoss(userPosition, tvlLoss5 * userRiskShare) * 100,
      dollarLoss: Math.min(tvlLoss5 * userRiskShare, userPosition)
    },
    scenario10: {
      lossPercent: calculateStressLoss(userPosition, tvlLoss10 * userRiskShare) * 100,
      dollarLoss: Math.min(tvlLoss10 * userRiskShare, userPosition)
    }
  };
};

/**
 * Calculate predicted yield using ТЗ formula
 */
export const calculatePredictedYield = (
  amount: number,
  bucketRange: [number, number]
): { percentAPY: number; dollarYield: number } => {
  // Calculate average APY across the selected range
  let totalAPY = 0;
  const rangeSize = bucketRange[1] - bucketRange[0] + 1;
  
  for (let bucket = bucketRange[0]; bucket <= bucketRange[1]; bucket++) {
    totalAPY += calculateTZCompliantAPY(bucket);
  }
  
  const avgAPY = totalAPY / rangeSize;
  const dollarYield = amount * avgAPY;
  
  return {
    percentAPY: avgAPY * 100,
    dollarYield
  };
};

/**
 * Get tier info for a bucket
 */
export const getTierForBucket = (bucket: number): {
  name: string;
  range: string;
  color: string;
} => {
  if (bucket >= 0 && bucket <= 9) {
    return { name: 'Safe', range: '0-9', color: 'text-green-600' };
  } else if (bucket >= 10 && bucket <= 29) {
    return { name: 'Conservative', range: '10-29', color: 'text-blue-600' };
  } else if (bucket >= 30 && bucket <= 59) {
    return { name: 'Balanced', range: '30-59', color: 'text-yellow-600' };
  } else if (bucket >= 60 && bucket <= 99) {
    return { name: 'Hero', range: '60-99', color: 'text-red-600' };
  }
  return { name: 'Unknown', range: '?', color: 'text-gray-600' };
};
