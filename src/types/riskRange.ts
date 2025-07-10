
export interface RiskRange {
  min: number; // 0-100
  max: number; // 0-100
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
  riskLevel: number; // 0-100
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
}

export interface RangeCalculationResult {
  estimatedAPR: number;
  capitalEfficiency: number;
  riskScore: number;
  potentialLoss: {
    at5Percent: number;
    at10Percent: number;
    at20Percent: number;
  };
}
