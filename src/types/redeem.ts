export interface RedeemQueue {
  id: string;
  userId: string;
  tddAmount: number;
  usdcExpected: number;
  fee: number;
  position: number;
  estimatedCompletionTime: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

export interface DistributionState {
  isActive: boolean;
  nextDistributionTime: Date;
  lastDistributionTime: Date;
  intervalHours: number; // 48 hours
  totalPendingYield: number;
  distributionHistory: DistributionEvent[];
}

export interface DistributionEvent {
  id: string;
  timestamp: Date;
  totalYieldDistributed: number;
  recipientCount: number;
  avgYieldPerRecipient: number;
}

export interface UnclaimedYield {
  positionId: string;
  amount: number;
  lastAccrualDate: Date;
  nextDistributionDate: Date;
  dailyAccrual: number;
}

export interface RedeemSettings {
  instantRedeemLimit: number; // Max amount for instant redeem via buffer
  uniswapRedeemLimit: number; // Max amount for Uniswap routing
  queueThreshold: number; // Amount above which goes to queue
  baseFeePercent: number; // Base fee for redemption
  bufferLow: number; // Buffer threshold for higher fees
  bufferCritical: number; // Critical buffer threshold
}

export interface BufferState {
  totalUSDC: number;
  availableUSDC: number;
  reservedForQueue: number;
  utilizationPercent: number;
  status: 'healthy' | 'low' | 'critical';
  dailyInflow: number;
  dailyOutflow: number;
}

export interface UniswapRoute {
  tddAmount: number;
  expectedUSDC: number;
  priceImpact: number;
  slippage: number;
  gasEstimate: number;
  isAvailable: boolean;
}