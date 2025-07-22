
// Define the base values directly to avoid circular imports
const FIXED_BASE_RATE = 0.05;
const FIXED_BASE_MULTIPLIER = 1.2;
export const FIXED_BASE_APY = FIXED_BASE_RATE * FIXED_BASE_MULTIPLIER; // T-Bills × 1.2 (6%)
export const OPTIMAL_K = 1.03; // k=1.03 for f(i) calculation

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

// Import distribution parameters from tcoreCalculations to avoid circular imports
import { DISTRIBUTION_PARAMS } from '@/utils/tcoreCalculations';

