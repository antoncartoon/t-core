import { DISTRIBUTION_PARAMS, OPTIMAL_K } from '@/utils/tcoreCalculations';

export interface LossDistributionResult {
  tierLosses: Map<number, number>;
  insuranceCoverage: Map<number, number>;
  remainingInsurancePool: number;
}

/**
 * Calculate loss distribution using T-Core waterfall model
 */
export const distributeLosses = (
  totalLoss: number,
  tierLiquidity: Record<number, number>,
  insurancePool: number
): LossDistributionResult => {
  const tierLosses = new Map<number, number>();
  const insuranceCoverage = new Map<number, number>();
  let remainingLoss = totalLoss;
  let remainingInsurance = insurancePool;

  // Protect tier1 (1-25) completely
  for (let i = 1; i <= DISTRIBUTION_PARAMS.TIER1_WIDTH; i++) {
    tierLosses.set(i, 0);
    insuranceCoverage.set(i, 0);
  }

  // Distribute losses from highest risk down using f(i)
  for (let i = 100; i > DISTRIBUTION_PARAMS.TIER1_WIDTH; i--) {
    if (remainingLoss <= 0) break;

    const tierAmount = tierLiquidity[i] || 0;
    if (tierAmount <= 0) continue;

    // Calculate loss for this tier based on f(i)
    const bonusFactor = Math.pow(OPTIMAL_K, i - DISTRIBUTION_PARAMS.TIER1_WIDTH);
    const lossWeight = bonusFactor / 100; // Normalize to 0-1
    const tierLoss = Math.min(remainingLoss * lossWeight, tierAmount);

    // Try to cover with insurance
    const coverage = Math.min(tierLoss, remainingInsurance);
    remainingInsurance -= coverage;
    
    tierLosses.set(i, tierLoss - coverage);
    insuranceCoverage.set(i, coverage);
    remainingLoss -= tierLoss;
  }

  return {
    tierLosses,
    insuranceCoverage,
    remainingInsurancePool: remainingInsurance
  };
};

export const calculateStressScenarios = (
  position: {
    amount: number;
    riskRange: { min: number; max: number };
  },
  tierLiquidity: Record<number, number>,
  insurancePool: number
) => {
  const scenarios = [0.01, 0.05, 0.10]; // 1%, 5%, 10% TVL loss
  const totalTVL = Object.values(tierLiquidity).reduce((sum, amount) => sum + amount, 0);
  
  return scenarios.map(lossPercentage => {
    const totalLoss = totalTVL * lossPercentage;
    const distribution = distributeLosses(totalLoss, tierLiquidity, insurancePool);
    
    // Calculate position's loss
    let positionLoss = 0;
    for (let i = position.riskRange.min; i <= position.riskRange.max; i++) {
      const tierLoss = distribution.tierLosses.get(i) || 0;
      const tierAmount = tierLiquidity[i] || 1; // Avoid division by zero
      const lossRatio = tierLoss / tierAmount;
      positionLoss += (position.amount / (position.riskRange.max - position.riskRange.min + 1)) * lossRatio;
    }

    return {
      scenarioLoss: lossPercentage,
      positionLoss,
      lossPercentage: (positionLoss / position.amount) * 100
    };
  });
};
