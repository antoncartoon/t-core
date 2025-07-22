
export const TIER_DEFINITIONS = {
  SAFE: { min: 0, max: 9, name: 'Safe', targetAPY: 0 }, // Fixed rate: T-Bills × 1.2
  CONSERVATIVE: { min: 10, max: 29, name: 'Conservative', targetAPY: 0.07 },
  BALANCED: { min: 30, max: 59, name: 'Balanced', targetAPY: 0.09 },
  HERO: { min: 60, max: 99, name: 'Hero', targetAPY: 0 } // Residual yield
} as const;

export type TierKey = keyof typeof TIER_DEFINITIONS;

export interface TierBalance {
  currentWeight: number;
  targetWeight: number;
  bonusYield: number;
}

export const TIER_TARGET_WEIGHTS = {
  SAFE: 0.10,
  CONSERVATIVE: 0.20,
  BALANCED: 0.30,
  HERO: 0.40
};

export interface TierMetrics {
  utilization: number;
  bonusAPY: number;
  effectiveAPY: number;
  riskScore: number;
}
