
import { TIER_DEFINITIONS } from '@/types/riskTiers';

export interface LossDistributionResult {
  tierLosses: Map<number, number>;
  insuranceCoverage: Map<number, number>;
  remainingInsurancePool: number;
}

export const distributeLosses = (
  totalLoss: number,
  tierLiquidity: Record<number, number>,
  insurancePool: number
): LossDistributionResult => {
  const tierLosses = new Map<number, number>();
  const insuranceCoverage = new Map<number, number>();
  let remainingLoss = totalLoss;
  let remainingInsurance = insurancePool;

  // Start from Hero tier (highest risk) and move down
  for (let i = TIER_DEFINITIONS.HERO.max; i >= 0; i--) {
    const tierAmount = tierLiquidity[i] || 0;
    
    if (remainingLoss <= 0) {
      tierLosses.set(i, 0);
      insuranceCoverage.set(i, 0);
      continue;
    }

    // Calculate loss for this tier
    const tierLoss = Math.min(remainingLoss, tierAmount);
    
    // Try to cover with insurance (prioritize higher tiers)
    const coverage = Math.min(tierLoss, remainingInsurance);
    remainingInsurance -= coverage;
    
    // Record actual loss after insurance
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
