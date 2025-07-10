
export interface RiskRange {
  min: number; // 1-100
  max: number; // 1-100
}

export interface LiquidityPosition {
  id: string;
  amount: number; // TDD amount
  riskRange: RiskRange;
  createdAt: Date;
  currentValue: number;
  earnedAmount: number;
  actualAPR: number;
  status: 'active' | 'withdrawn';
}

export interface RiskTick {
  riskLevel: number; // 1-100
  totalLiquidity: number; // Total TDD in this tick
  availableYield: number; // Yield available for this tick
  apr: number; // Current APR at this tick
}

export interface ProtocolState {
  totalTVL: number;
  totalYieldGenerated: number; // Last 28 days
  guaranteedAPY: number; // T-Bills + 20%
  riskTicks: RiskTick[];
  lastUpdateTimestamp: Date;
  historicalYields: number[]; // 28-day history
  estimatedAPY: number; // Based on 28-day average
}

export interface RangeCalculationResult {
  estimatedAPR: number;
  capitalEfficiency: number;
  riskScore: number; // 0-100 normalized risk score
  potentialLoss: {
    at5Percent: number;
    at10Percent: number;
    at20Percent: number;
  };
}
