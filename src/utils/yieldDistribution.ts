
import { TIER_DEFINITIONS, TIER_TARGET_WEIGHTS, TierBalance } from '@/types/riskTiers';

export const PERFORMANCE_FEE = 0.20; // 20%
export const BONUS_YIELD_ALLOCATION = 0.50; // 50% of performance fee
export const INSURANCE_POOL_ALLOCATION = 0.25; // 25% of performance fee

export interface YieldDistributionResult {
  tierYields: Map<number, number>;
  bonusYields: Map<number, number>;
  insurancePool: number;
  residualYield: number;
}

export const calculateBaseYield = (protocolYield: number): number => {
  return protocolYield * (1 - PERFORMANCE_FEE);
};

export const calculateTierBonuses = (
  performanceFee: number,
  tierBalances: Record<number, TierBalance>
): Map<number, number> => {
  const bonusPool = performanceFee * BONUS_YIELD_ALLOCATION;
  const bonuses = new Map<number, number>();
  let totalPositiveDeltas = 0;

  // Calculate total positive deltas for normalization
  Object.entries(tierBalances).forEach(([level, balance]) => {
    const delta = balance.targetWeight - balance.currentWeight;
    if (delta > 0) {
      totalPositiveDeltas += delta;
    }
  });

  // Distribute bonus yield proportionally to underweight tiers
  if (totalPositiveDeltas > 0) {
    Object.entries(tierBalances).forEach(([level, balance]) => {
      const delta = balance.targetWeight - balance.currentWeight;
      if (delta > 0) {
        bonuses.set(Number(level), (bonusPool * delta) / totalPositiveDeltas);
      } else {
        bonuses.set(Number(level), 0);
      }
    });
  }

  return bonuses;
};

export const distributeYield = (
  protocolYield: number,
  tierLiquidity: Record<number, number>
): YieldDistributionResult => {
  const baseYield = calculateBaseYield(protocolYield);
  const performanceFee = protocolYield * PERFORMANCE_FEE;
  const insurancePool = performanceFee * INSURANCE_POOL_ALLOCATION;
  
  const tierYields = new Map<number, number>();
  let remainingYield = baseYield;

  // Safe tier - fixed rate first
  for (let i = TIER_DEFINITIONS.SAFE.min; i <= TIER_DEFINITIONS.SAFE.max; i++) {
    const tBillRate = 0.05; // 5% T-Bills rate
    const fixedRate = tBillRate * 1.2; // T-Bills × 1.2
    const tierAmount = tierLiquidity[i] || 0;
    const requiredYield = tierAmount * fixedRate;
    
    tierYields.set(i, Math.min(requiredYield, remainingYield));
    remainingYield -= tierYields.get(i) || 0;
  }

  // Conservative & Balanced tiers - target rates if available
  const targetTiers = [
    { range: TIER_DEFINITIONS.CONSERVATIVE, target: 0.07 },
    { range: TIER_DEFINITIONS.BALANCED, target: 0.09 }
  ];

  for (const { range, target } of targetTiers) {
    for (let i = range.min; i <= range.max; i++) {
      const tierAmount = tierLiquidity[i] || 0;
      const requiredYield = tierAmount * target;
      
      tierYields.set(i, Math.min(requiredYield, remainingYield));
      remainingYield -= tierYields.get(i) || 0;
    }
  }

  // Hero tier - residual yield
  const heroTotalLiquidity = Object.entries(tierLiquidity)
    .filter(([level]) => {
      const num = Number(level);
      return num >= TIER_DEFINITIONS.HERO.min && num <= TIER_DEFINITIONS.HERO.max;
    })
    .reduce((sum, [_, amount]) => sum + amount, 0);

  if (heroTotalLiquidity > 0) {
    const heroYieldPerUnit = remainingYield / heroTotalLiquidity;
    
    for (let i = TIER_DEFINITIONS.HERO.min; i <= TIER_DEFINITIONS.HERO.max; i++) {
      const tierAmount = tierLiquidity[i] || 0;
      tierYields.set(i, tierAmount * heroYieldPerUnit);
    }
  }

  // Calculate bonus yields based on tier balance
  const tierBalances = calculateTierBalances(tierLiquidity);
  const bonusYields = calculateTierBonuses(performanceFee, tierBalances);

  return {
    tierYields,
    bonusYields,
    insurancePool,
    residualYield: remainingYield
  };
};

const calculateTierBalances = (
  tierLiquidity: Record<number, number>
): Record<number, TierBalance> => {
  const totalLiquidity = Object.values(tierLiquidity).reduce((sum, amount) => sum + amount, 0);
  const balances: Record<number, TierBalance> = {};

  for (let i = 0; i < 100; i++) {
    let tierKey: keyof typeof TIER_DEFINITIONS;
    
    if (i <= TIER_DEFINITIONS.SAFE.max) tierKey = 'SAFE';
    else if (i <= TIER_DEFINITIONS.CONSERVATIVE.max) tierKey = 'CONSERVATIVE';
    else if (i <= TIER_DEFINITIONS.BALANCED.max) tierKey = 'BALANCED';
    else tierKey = 'HERO';

    const liquidityInBucket = tierLiquidity[i] || 0;
    const currentWeight = totalLiquidity > 0 ? liquidityInBucket / totalLiquidity : 0;
    const targetWeight = TIER_TARGET_WEIGHTS[tierKey];

    balances[i] = {
      currentWeight,
      targetWeight,
      bonusYield: 0 // Will be filled by bonus calculation
    };
  }

  return balances;
};
