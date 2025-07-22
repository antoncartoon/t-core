
import { FIXED_BASE_APY, OPTIMAL_K } from '@/utils/tcoreCalculations';

export const TIER_DEFINITIONS = {
  SAFE: { 
    min: 1, 
    max: 25, 
    name: 'Safe', 
    baseAPY: FIXED_BASE_APY, // T-Bills × 1.2 (6%)
    isFixed: true 
  },
  CONSERVATIVE: { 
    min: 26, 
    max: 50, 
    name: 'Conservative',
    baseAPY: FIXED_BASE_APY,
    isFixed: false
  },
  BALANCED: { 
    min: 51, 
    max: 75, 
    name: 'Balanced',
    baseAPY: FIXED_BASE_APY,
    isFixed: false
  },
  HERO: { 
    min: 76, 
    max: 100, 
    name: 'Hero',
    baseAPY: FIXED_BASE_APY,
    isFixed: false
  }
} as const;

export type TierKey = keyof typeof TIER_DEFINITIONS;

export interface TierBalance {
  currentWeight: number;
  targetWeight: number;
  bonusYield: number;
}

// Default tier target weights from T-Core spec
export const TIER_TARGET_WEIGHTS = {
  SAFE: 0.40, // 40% in Safe tier
  CONSERVATIVE: 0.25, // 25% in Conservative
  BALANCED: 0.20, // 20% in Balanced
  HERO: 0.15 // 15% in Hero tier
};

export interface TierMetrics {
  utilization: number;
  bonusAPY: number;
  effectiveAPY: number;
  riskScore: number;
  insuranceCoverage: number;
}

// Distribution parameters from T-Core spec
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

