
// STRESS TEST FORMULAS - Using quadratic risk model and proper waterfall logic

import { calculatePiecewiseAPY, getTierForSegment } from './piecewiseAPY';

/**
 * Quadratic risk function: Risk(i) = (i/99)^2
 */
export const calculateQuadraticRisk = (segment: number): number => {
  const i = Math.max(0, Math.min(99, segment));
  return Math.pow(i / 99, 2);
};

/**
 * Stress Loss Formula using quadratic risk model
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
 * Calculate stress scenarios using quadratic risk model and proper waterfall logic
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
  // Calculate average segment and its quadratic risk
  const avgSegment = (bucketRange[0] + bucketRange[1]) / 2;
  const quadraticRisk = calculateQuadraticRisk(avgSegment);
  
  // TVL loss scenarios
  const tvlLoss1 = totalTVL * 0.01; // -1% TVL
  const tvlLoss5 = totalTVL * 0.05; // -5% TVL  
  const tvlLoss10 = totalTVL * 0.10; // -10% TVL
  
  // Higher segments absorb more losses in waterfall model
  // Loss absorption scales with quadratic risk + exponential factor for hero tier
  let lossMultiplier = quadraticRisk;
  if (avgSegment >= 60) {
    // Hero tier gets exponential loss absorption
    lossMultiplier = quadraticRisk * Math.pow(1.2, (avgSegment - 60) / 10);
  }
  
  // Calculate actual losses based on waterfall model
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

/**
 * Calculate predicted yield using piecewise APY formula
 */
export const calculatePredictedYield = (
  amount: number,
  bucketRange: [number, number]
): { percentAPY: number; dollarYield: number } => {
  // Calculate average APY across the selected range using piecewise formula
  let totalAPY = 0;
  const rangeSize = bucketRange[1] - bucketRange[0] + 1;
  
  for (let segment = bucketRange[0]; segment <= bucketRange[1]; segment++) {
    totalAPY += calculatePiecewiseAPY(segment);
  }
  
  const avgAPY = totalAPY / rangeSize;
  const dollarYield = amount * avgAPY;
  
  return {
    percentAPY: avgAPY * 100,
    dollarYield
  };
};

/**
 * Get tier info for a segment (using piecewise implementation)
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

// Re-export the main piecewise APY function for consistency
export const calculatePiecewiseAPY = calculatePiecewiseAPY;
