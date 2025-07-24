import { SystemParameters } from '@/hooks/useSystemParameters';
import { RiskRange } from '@/types/riskRange';

/**
 * Dynamic calculation utilities that replace hardcoded protocolConstants
 * All calculations now use parameters from the database
 */

export function calculateDynamicAPY(
  riskLevel: number,
  parameters: SystemParameters
): number {
  const tBillsRate = parameters.t_bills_rate;
  const safeMultiplier = parameters.safe_tier_multiplier;
  const breakpoints = parameters.tier_breakpoints;
  
  // Determine tier
  let tier: 'safe' | 'conservative' | 'balanced' | 'hero' = 'safe';
  if (riskLevel >= breakpoints.safe[0] && riskLevel <= breakpoints.safe[1]) {
    tier = 'safe';
  } else if (riskLevel >= breakpoints.conservative[0] && riskLevel <= breakpoints.conservative[1]) {
    tier = 'conservative';
  } else if (riskLevel >= breakpoints.balanced[0] && riskLevel <= breakpoints.balanced[1]) {
    tier = 'balanced';
  } else if (riskLevel >= breakpoints.hero[0] && riskLevel <= breakpoints.hero[1]) {
    tier = 'hero';
  }

  const baseAPY = tBillsRate * safeMultiplier; // Dynamic Safe tier base

  switch (tier) {
    case 'safe':
      return baseAPY; // Fixed base APY (T-Bills × multiplier)

    case 'conservative': {
      // Linear: baseAPY → 7%
      const progress = (riskLevel - breakpoints.conservative[0]) / 
                      (breakpoints.conservative[1] - breakpoints.conservative[0]);
      return baseAPY + (progress * (0.07 - baseAPY));
    }

    case 'balanced': {
      // Quadratic: 7% → 9.5%
      const progress = (riskLevel - breakpoints.balanced[0]) / 
                      (breakpoints.balanced[1] - breakpoints.balanced[0]);
      const quadraticProgress = progress * progress;
      return 0.07 + (quadraticProgress * (0.095 - 0.07));
    }

    case 'hero': {
      // Exponential: 9.5% × 1.03^(i-60)
      const exponentialFactor = Math.pow(1.03, riskLevel - breakpoints.hero[0]);
      return 0.095 * exponentialFactor;
    }

    default:
      return baseAPY;
  }
}

export function calculateDynamicRiskLevelAPR(
  riskLevel: number,
  parameters: SystemParameters
): number {
  return calculateDynamicAPY(riskLevel, parameters);
}

export function analyzeRiskRange(
  riskRange: RiskRange,
  amount: number,
  parameters: SystemParameters
) {
  if (!parameters) {
    return {
      estimatedAPR: 0,
      capitalEfficiency: 0,
      riskScore: 0,
      bonusYield: 0
    };
  }

  const min = riskRange.min;
  const max = riskRange.max;
  const rangeSize = max - min + 1;
  
  // Calculate weighted average APY across the range
  let totalAPY = 0;
  for (let i = min; i <= max; i++) {
    totalAPY += calculateDynamicAPY(i, parameters);
  }
  const avgAPY = totalAPY / rangeSize;

  // Calculate risk score (quadratic based on average risk level)
  const avgRisk = (min + max) / 2;
  const riskScore = Math.pow(avgRisk / 100, 2) * 100;

  // Calculate capital efficiency (inverse of range size)
  const capitalEfficiency = Math.max(0, (100 - rangeSize) / 100);

  // Calculate bonus yield based on tier distribution target vs current
  const targetDistribution = parameters.target_tier_distribution;
  let bonusYield = 0;
  
  // Simple bonus calculation - more sophisticated logic would check actual liquidity distribution
  if (avgRisk >= parameters.tier_breakpoints.hero[0]) {
    bonusYield = 0.02; // 2% bonus for hero tier
  } else if (avgRisk >= parameters.tier_breakpoints.balanced[0]) {
    bonusYield = 0.01; // 1% bonus for balanced tier
  }

  return {
    estimatedAPR: avgAPY,
    capitalEfficiency,
    riskScore,
    bonusYield
  };
}

export function calculateExpectedReturn(
  amount: number,
  riskRange: RiskRange,
  parameters: SystemParameters
): number {
  if (!parameters) return 0;
  
  const analysis = analyzeRiskRange(riskRange, amount, parameters);
  const totalAPY = analysis.estimatedAPR + analysis.bonusYield;
  
  return amount * totalAPY;
}

export function calculateLossScenarios(
  amount: number,
  riskRange: RiskRange,
  parameters: SystemParameters
) {
  if (!parameters) {
    return {
      scenario_5_decline: { loss: 0, remaining: amount },
      scenario_15_decline: { loss: 0, remaining: amount },
      scenario_30_decline: { loss: 0, remaining: amount }
    };
  }

  const min = riskRange.min;
  const max = riskRange.max;
  const avgRisk = (min + max) / 2;
  
  // Risk-based loss calculations
  const riskFactor = avgRisk / 100;
  
  return {
    scenario_5_decline: {
      loss: amount * riskFactor * 0.05,
      remaining: amount * (1 - riskFactor * 0.05)
    },
    scenario_15_decline: {
      loss: amount * riskFactor * 0.15,
      remaining: amount * (1 - riskFactor * 0.15)
    },
    scenario_30_decline: {
      loss: amount * riskFactor * 0.30,
      remaining: amount * (1 - riskFactor * 0.30)
    }
  };
}