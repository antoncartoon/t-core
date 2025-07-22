
// Define the base values directly to avoid circular imports
const FIXED_BASE_RATE = 0.05;
const FIXED_BASE_MULTIPLIER = 1.2;
export const FIXED_BASE_APY = FIXED_BASE_RATE * FIXED_BASE_MULTIPLIER; // T-Bills × 1.2 (6%)
export const OPTIMAL_K = 1.03; // k=1.03 for f(i) calculation

// PRECISION COMPLIANT: Exact tier ranges from specification (0-9, 10-29, 30-59, 60-99)
export const TIER_DEFINITIONS = {
  SAFE: { 
    min: 0, 
    max: 9, 
    name: 'Safe', 
    baseAPY: FIXED_BASE_APY, // T-Bills × 1.2 (5.16% APY)
    targetAPY: 0.0516,
    isFixed: true 
  },
  CONSERVATIVE: { 
    min: 10, 
    max: 29, 
    name: 'Conservative',
    baseAPY: FIXED_BASE_APY,
    targetAPY: 0.07, // 7% APY target
    isFixed: false
  },
  BALANCED: { 
    min: 30, 
    max: 59, 
    name: 'Balanced',
    baseAPY: FIXED_BASE_APY,
    targetAPY: 0.09, // 9% APY target
    isFixed: false
  },
  HERO: { 
    min: 60, 
    max: 99, 
    name: 'Hero',
    baseAPY: FIXED_BASE_APY,
    targetAPY: 0.25, // Gets residual income
    isFixed: false
  }
} as const;

export type TierKey = keyof typeof TIER_DEFINITIONS;

export interface TierBalance {
  currentWeight: number;
  targetWeight: number;
  bonusYield: number;
}

// TARGET DISTRIBUTION: 10/20/30/40%
export const TIER_TARGET_WEIGHTS = {
  SAFE: 0.10, // 10% in Safe tier
  CONSERVATIVE: 0.20, // 20% in Conservative
  BALANCED: 0.30, // 30% in Balanced
  HERO: 0.40 // 40% in Hero tier
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
