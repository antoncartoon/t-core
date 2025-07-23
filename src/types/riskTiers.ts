
// Define the base values directly to avoid circular imports
const FIXED_BASE_RATE = 0.05;
const FIXED_BASE_MULTIPLIER = 1.2;
export const FIXED_BASE_APY = FIXED_BASE_RATE * FIXED_BASE_MULTIPLIER; // T-Bills × 1.2 (5.16%)

// NEW PIECEWISE FUNCTION: Exact tier ranges from specification (0-9, 10-29, 30-59, 60-99)
export const TIER_DEFINITIONS = {
  SAFE: { 
    min: 0, 
    max: 9, 
    name: 'Safe', 
    baseAPY: 0.0516, // Fixed 5.16% (T-Bills × 1.2)
    targetAPY: 0.0516,
    isFixed: true,
    formula: 'Fixed 5.16%'
  },
  CONSERVATIVE: { 
    min: 10, 
    max: 29, 
    name: 'Conservative',
    baseAPY: 0.0516,
    targetAPY: 0.07, // Linear to 7%
    isFixed: false,
    formula: 'Linear: 5.16% → 7%'
  },
  BALANCED: { 
    min: 30, 
    max: 59, 
    name: 'Balanced',
    baseAPY: 0.07,
    targetAPY: 0.095, // Quadratic to 9.5%
    isFixed: false,
    formula: 'Quadratic: 7% → 9.5%'
  },
  HERO: { 
    min: 60, 
    max: 99, 
    name: 'Hero',
    baseAPY: 0.095,
    targetAPY: 0.15, // Exponential to ~15%
    isFixed: false,
    formula: 'Exponential: 9.5% → 15%'
  }
} as const;

export type TierKey = keyof typeof TIER_DEFINITIONS;

export interface TierBalance {
  currentWeight: number;
  targetWeight: number;
  bonusYield: number;
}

// NEW TARGET DISTRIBUTION: 10/20/30/40%
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
