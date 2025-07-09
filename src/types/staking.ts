
export interface StakingPosition {
  id: string;
  amount: number;
  riskLevel: number;
  riskCategory: 'Conservative' | 'Moderate' | 'Aggressive';
  apy: number;
  createdAt: Date;
  maturityDate: Date;
  lockPeriod: number; // в днях
  status: 'active' | 'matured' | 'withdrawn';
  earnedAmount: number;
  currentValue: number;
  originalTokenAmount: number; // изначальная сумма tkchUSD
}

export interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
  change?: string;
}
