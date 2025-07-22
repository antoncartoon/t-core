import { NFTPosition, ProtocolParams, YieldDistribution } from '@/types/tcore';

// Define constants that were imported from riskTiers
export const DISTRIBUTION_PARAMS = {
  FIXED_BASE_MULTIPLIER: 1.2, // T-Bills × 1.2
  OPTIMAL_K: 1.03, // k=1.03 for f(i) calculation
  VARIANCE_TARGET: 2.9e-7, // Target variance for liquidity uniformity
  TIER1_WIDTH: 25, // Width of tier1 (levels 1-25)
  INSURANCE_POOL_TARGET: 0.05, // 5% of TVL target for insurance pool
  PERFORMANCE_FEE: 0.20, // 20% performance fee
  FEE_ALLOCATION: {
    BONUS: 0.25, // 25% to bonus yield
    BUYBACK: 0.25, // 25% to buyback
    PROTOCOL: 0.25, // 25% as protocol revenue
    INSURANCE: 0.25 // 25% to insurance buffer
  }
};

// Define LossDistribution interface
export interface LossDistribution {
  level: number;
  userStake: number;
  totalLiquidity: number;
  lossShare: number;
  remainingStake: number;
}

// Constants
export const MIN_RISK_LEVEL = 1;
export const MAX_RISK_LEVEL = 100;
export const FIXED_BASE_APY = 0.05 * DISTRIBUTION_PARAMS.FIXED_BASE_MULTIPLIER; // T-Bills × 1.2
export const OPTIMAL_K = DISTRIBUTION_PARAMS.OPTIMAL_K;

/**
 * Calculate bonus yield factor using T-Core formula: f(i) = 1 * k^(i-25)
 */
export const calculateBonusFactor = (riskLevel: number): number => {
  if (riskLevel <= DISTRIBUTION_PARAMS.TIER1_WIDTH) return 0;
  return Math.pow(OPTIMAL_K, riskLevel - DISTRIBUTION_PARAMS.TIER1_WIDTH);
};

/**
 * Calculate APY for a risk level using T-Core formula
 */
export const calculateRiskLevelAPY = (riskLevel: number): number => {
  // Tier1 (1-25): guaranteed fixed APY
  if (riskLevel <= DISTRIBUTION_PARAMS.TIER1_WIDTH) {
    return FIXED_BASE_APY;
  }
  
  // Higher tiers: fixed_base + bonus using f(i)
  const bonusFactor = calculateBonusFactor(riskLevel);
  return FIXED_BASE_APY + (bonusFactor - 1) * FIXED_BASE_APY * 0.5;
};

/**
 * Calculate surplus distribution to higher tiers using waterfall model
 */
export const calculateSurplusDistribution = (
  totalYield: number,
  tier1Stake: number
): number => {
  const guaranteedYield = tier1Stake * FIXED_BASE_APY;
  return Math.max(0, totalYield - guaranteedYield);
};

import { LiquidityTick, RiskRange } from '@/types/tcore';

// Protocol fees go to levels 95-100

/**
 * Calculate effective stake per level: s_i = s/(b-a+1)
 */
export const calculateEffectiveStake = (
  totalAmount: number,
  riskRange: RiskRange
): number => {
  const rangeLevels = riskRange.end - riskRange.start + 1;
  return totalAmount / rangeLevels;
};

/**
 * Calculate dynamic k parameter for nonlinear curve f(i) = i^k
 * Formula: k = 2 + (S_high / S) * 0.5
 */
export const calculateDynamicK = (
  totalLiquidity: number,
  highRiskLiquidity: number
): number => {
  if (totalLiquidity === 0) return 2;
  const highRiskRatio = highRiskLiquidity / totalLiquidity;
  return 2 + highRiskRatio * 0.5;
};

/**
 * Calculate risk factor for level i: f(i) = i^k
 */
export const calculateRiskFactor = (
  riskLevel: number,
  k: number
): number => {
  return Math.pow(riskLevel, k);
};

/**
 * Update liquidity distribution when new position is created
 */
export const updateLiquidityDistribution = (
  existingTicks: LiquidityTick[],
  amount: number,
  riskRange: RiskRange
): LiquidityTick[] => {
  const effectiveStake = calculateEffectiveStake(amount, riskRange);
  
  return existingTicks.map(tick => {
    if (tick.riskLevel >= riskRange.start && tick.riskLevel <= riskRange.end) {
      return {
        ...tick,
        totalLiquidity: tick.totalLiquidity + effectiveStake
      };
    }
    return tick;
  });
};

/**
 * Calculate yield distribution using waterfall model
 */
export const calculateYieldDistribution = (
  totalYield: number,
  liquidityTicks: LiquidityTick[],
  guaranteedRate: number,
  k: number
): YieldDistribution[] => {
  const level1Tick = liquidityTicks.find(t => t.riskLevel === 1);
  if (!level1Tick) throw new Error('Level 1 tick not found');

  // Step 1: Calculate guaranteed yield for level 1
  const guaranteedYield = level1Tick.totalLiquidity * guaranteedRate;
  
  // If total yield is less than guaranteed, distribute proportionally to level 1 only
  if (totalYield <= guaranteedYield) {
    return liquidityTicks.map(tick => ({
      level: tick.riskLevel,
      userShare: 0, // Will be calculated per user
      totalLiquidity: tick.totalLiquidity,
      yieldShare: tick.riskLevel === 1 ? totalYield : 0,
      userYield: 0 // Will be calculated per user
    }));
  }

  // Step 2: Distribute remaining yield across levels 2-100
  const remainingYield = totalYield - guaranteedYield;
  const level2Plus = liquidityTicks.filter(t => t.riskLevel >= 2);
  
  // Calculate total weighted liquidity for levels 2-100
  const totalWeightedLiquidity = level2Plus.reduce((sum, tick) => {
    const riskFactor = calculateRiskFactor(tick.riskLevel, k);
    return sum + (tick.totalLiquidity * riskFactor);
  }, 0);

  return liquidityTicks.map(tick => {
    let yieldShare = 0;
    
    if (tick.riskLevel === 1) {
      yieldShare = guaranteedYield;
    } else if (totalWeightedLiquidity > 0) {
      const riskFactor = calculateRiskFactor(tick.riskLevel, k);
      const proportion = (tick.totalLiquidity * riskFactor) / totalWeightedLiquidity;
      yieldShare = proportion * remainingYield;
    }

    return {
      level: tick.riskLevel,
      userShare: 0, // Will be calculated per user
      totalLiquidity: tick.totalLiquidity,
      yieldShare,
      userYield: 0 // Will be calculated per user
    };
  });
};

/**
 * Calculate user's yield from a position
 */
export const calculateUserYield = (
  position: NFTPosition,
  yieldDistribution: YieldDistribution[]
): number => {
  const effectiveStake = calculateEffectiveStake(position.amount, position.riskRange);
  
  let totalUserYield = 0;
  
  for (let level = position.riskRange.start; level <= position.riskRange.end; level++) {
    const levelYield = yieldDistribution.find(y => y.level === level);
    if (levelYield && levelYield.totalLiquidity > 0) {
      const userProportion = effectiveStake / levelYield.totalLiquidity;
      totalUserYield += userProportion * levelYield.yieldShare;
    }
  }
  
  return totalUserYield;
};

/**
 * Calculate loss distribution (waterfall from level 100 down to level 2)
 */
export const calculateLossDistribution = (
  totalLoss: number,
  reserveAmount: number,
  liquidityTicks: LiquidityTick[]
): LossDistribution[] => {
  // Step 1: Use reserve first
  let remainingLoss = Math.max(0, totalLoss - reserveAmount);
  
  const lossDistribution: LossDistribution[] = liquidityTicks.map(tick => ({
    level: tick.riskLevel,
    userStake: 0, // Will be calculated per user
    totalLiquidity: tick.totalLiquidity,
    lossShare: 0,
    remainingStake: tick.totalLiquidity
  }));

  // Step 2: Absorb losses from level 100 down to level 2
  for (let level = MAX_RISK_LEVEL; level >= 2 && remainingLoss > 0; level--) {
    const tickIndex = lossDistribution.findIndex(l => l.level === level);
    if (tickIndex >= 0) {
      const tick = lossDistribution[tickIndex];
      const availableLiquidity = tick.totalLiquidity;
      
      if (availableLiquidity > 0) {
        const lossAtThisLevel = Math.min(remainingLoss, availableLiquidity);
        
        lossDistribution[tickIndex] = {
          ...tick,
          lossShare: lossAtThisLevel,
          remainingStake: availableLiquidity - lossAtThisLevel
        };
        
        remainingLoss -= lossAtThisLevel;
      }
    }
  }

  return lossDistribution;
};

/**
 * Calculate user's losses from a position
 */
export const calculateUserLoss = (
  position: NFTPosition,
  lossDistribution: LossDistribution[]
): number => {
  const effectiveStake = calculateEffectiveStake(position.amount, position.riskRange);
  
  let totalUserLoss = 0;
  
  for (let level = position.riskRange.start; level <= position.riskRange.end; level++) {
    const levelLoss = lossDistribution.find(l => l.level === level);
    if (levelLoss && levelLoss.totalLiquidity > 0) {
      const userProportion = effectiveStake / levelLoss.totalLiquidity;
      totalUserLoss += userProportion * levelLoss.lossShare;
    }
  }
  
  return totalUserLoss;
};

/**
 * Generate initial liquidity ticks (100 levels, all starting with 0 liquidity)
 */
export const generateInitialLiquidityTicks = (): LiquidityTick[] => {
  const ticks: LiquidityTick[] = [];
  
  for (let i = MIN_RISK_LEVEL; i <= MAX_RISK_LEVEL; i++) {
    ticks.push({
      riskLevel: i,
      totalLiquidity: 0,
      yieldGenerated: 0,
      utilizationRate: 0
    });
  }
  
  return ticks;
};

/**
 * Calculate high-risk liquidity (levels 51-100)
 */
export const calculateHighRiskLiquidity = (liquidityTicks: LiquidityTick[]): number => {
  return liquidityTicks
    .filter(tick => tick.riskLevel >= 51)
    .reduce((sum, tick) => sum + tick.totalLiquidity, 0);
};

/**
 * Calculate total liquidity across all levels
 */
export const calculateTotalLiquidity = (liquidityTicks: LiquidityTick[]): number => {
  return liquidityTicks.reduce((sum, tick) => sum + tick.totalLiquidity, 0);
};

/**
 * Simulate yield/loss scenarios for UI
 */
export const simulateScenarios = (
  amount: number,
  riskRange: RiskRange,
  currentTicks: LiquidityTick[],
  protocolParams: ProtocolParams
) => {
  const scenarios = [
    { name: 'Bull Market', yieldMultiplier: 1.5, lossMultiplier: 0 },
    { name: 'Normal Market', yieldMultiplier: 1.0, lossMultiplier: 0 },
    { name: 'Bear Market', yieldMultiplier: 0.3, lossMultiplier: 0.1 },
    { name: 'Crisis', yieldMultiplier: 0, lossMultiplier: 0.3 }
  ];

  return scenarios.map(scenario => {
    const simulatedYield = protocolParams.totalYield * scenario.yieldMultiplier;
    const simulatedLoss = protocolParams.totalYield * scenario.lossMultiplier;
    
    // Create mock position for simulation
    const mockPosition: NFTPosition = {
      tokenId: 'simulation',
      owner: 'user',
      amount,
      riskRange,
      createdAt: new Date(),
      currentValue: amount,
      earnedAmount: 0,
      status: 'active',
      expectedAPY: 0.08, // Default 8% for simulation
      tier: 'BALANCED', // Default tier for simulation
      metadata: {
        contractAddress: '',
        tokenURI: '',
        description: ''
      }
    };

    // Update ticks with simulated position
    const updatedTicks = updateLiquidityDistribution(currentTicks, amount, riskRange);
    const k = calculateDynamicK(
      calculateTotalLiquidity(updatedTicks),
      calculateHighRiskLiquidity(updatedTicks)
    );

    // Calculate yield and loss for this scenario
    const yieldDist = calculateYieldDistribution(
      simulatedYield,
      updatedTicks,
      protocolParams.rMin,
      k
    );
    const lossDist = calculateLossDistribution(
      simulatedLoss,
      protocolParams.reserveAmount,
      updatedTicks
    );

    const userYield = calculateUserYield(mockPosition, yieldDist);
    const userLoss = calculateUserLoss(mockPosition, lossDist);
    const netReturn = userYield - userLoss;
    const finalAPY = (netReturn / amount) * (365 / 28); // Annualized

    return {
      scenario: scenario.name,
      expectedReturn: netReturn,
      finalAPY,
      maxLoss: userLoss,
      netAmount: amount + netReturn
    };
  });
};

/**
 * Calculate concentration risk for a position
 */
export const calculateConcentrationRisk = (
  riskRange: RiskRange,
  totalRiskLevels: number = MAX_RISK_LEVEL
): number => {
  const rangeSize = riskRange.end - riskRange.start + 1;
  const concentration = rangeSize / totalRiskLevels;
  
  // Inverse concentration = higher risk for narrower ranges
  return 1 - concentration;
};
