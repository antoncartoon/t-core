// T-CORE Protocol Types
export type RiskLevel = number; // 1-100

export interface RiskRange {
  start: number; // a
  end: number;   // b
}

export interface NFTPosition {
  tokenId: string;
  owner: string;
  amount: number; // s - total TDD staked
  riskRange: RiskRange; // [a, b]
  createdAt: Date;
  currentValue: number;
  earnedAmount: number;
  status: 'active' | 'unstaked';
  expectedAPY: number;
  tier: string;
  metadata: {
    contractAddress: string;
    tokenURI: string;
    description: string;
  };
}

export interface LiquidityTick {
  riskLevel: RiskLevel; // i
  totalLiquidity: number; // S_i - sum of all positions at this level
  yieldGenerated: number; // Y_i - yield at this level
  utilizationRate: number; // percentage of available capacity used
}

export interface ProtocolParams {
  rMin: number; // guaranteed minimum rate for level 1
  k: number; // dynamic curve parameter for f(i) = i^k
  totalYield: number; // Y - total protocol yield
  reserveAmount: number; // R - self-insurance reserve
  protocolFees: number; // fees going to risk levels 95-100
}

export interface TCoreState {
  liquidityTicks: LiquidityTick[]; // Array of 100 ticks (levels 1-100)
  totalTVL: number; // S - total liquidity across all levels
  protocolParams: ProtocolParams;
  highRiskLiquidity: number; // S_high - liquidity in levels 51-100
  lastUpdateTimestamp: Date;
  oracleData: {
    chainlinkTBillRate: number;
    lastUpdated: Date;
  };
}

export type StakingMode = 'lite' | 'pro';

export interface LiteTemplate {
  name: 'Conservative' | 'Balanced' | 'Aggressive';
  description: string;
  riskRange: RiskRange;
  expectedAPY: number;
  riskDescription: string;
}

export interface ProModeSelection {
  ranges: RiskRange[];
  customAnalytics: boolean;
  advancedCharts: boolean;
}

export interface YieldDistribution {
  level: RiskLevel;
  userShare: number; // s_i for user
  totalLiquidity: number; // S_i for level
  yieldShare: number; // Y_i for level
  userYield: number; // user's portion of Y_i
}

export interface LossDistribution {
  level: RiskLevel;
  userStake: number; // s_i
  totalLiquidity: number; // S_i
  lossShare: number; // user's portion of losses at this level
  remainingStake: number; // after loss absorption
}

export interface SimulationScenario {
  name: string;
  totalYield: number;
  totalLoss: number;
  description: string;
}

export interface SimulationResult {
  scenario: SimulationScenario;
  userInput: {
    amount: number;
    riskRange: RiskRange;
  };
  yieldDistribution: YieldDistribution[];
  lossDistribution: LossDistribution[];
  finalAPY: number;
  totalReturn: number;
  riskMetrics: {
    maxLoss: number;
    lossProtection: number; // from reserve R
    concentrationRisk: number;
  };
}

// Composability types for DeFi integrations
export interface AaveIntegration {
  nftTokenId: string;
  collateralValue: number;
  borrowedAmount: number;
  healthFactor: number;
  liquidationThreshold: number;
}

export interface PendleNFTTrade {
  nftTokenId: string;
  listingPrice: number;
  buyer: string;
  seller: string;
  yieldPremium: number;
  timeToMaturity: number;
}

export interface ComposabilityStrategy {
  name: string;
  description: string;
  protocols: string[];
  estimatedAPY: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  requiredNFTs: number;
}

export const LITE_TEMPLATES: LiteTemplate[] = [
  {
    name: 'Conservative',
    description: 'Low risk with stable returns',
    riskRange: { start: 1, end: 20 },
    expectedAPY: 0.06, // 6%
    riskDescription: 'Protected by guarantee on level 1, minimal loss exposure'
  },
  {
    name: 'Balanced',
    description: 'Moderate risk with balanced returns',
    riskRange: { start: 30, end: 70 },
    expectedAPY: 0.12, // 12%
    riskDescription: 'Diversified across mid-risk levels, moderate protection'
  },
  {
    name: 'Aggressive',
    description: 'High risk with maximum yield potential',
    riskRange: { start: 80, end: 100 },
    expectedAPY: 0.25, // 25%
    riskDescription: 'High yield potential but first to absorb losses'
  }
];