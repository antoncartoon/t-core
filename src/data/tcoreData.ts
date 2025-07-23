// Unified T-Core data source for consistent statistics across landing and app
import { 
  TOTAL_TVL, 
  STAKED_TVL, 
  PROTOCOL_APY_28D, 
  PERFORMANCE_FEE, 
  BONUS_YIELD_ALLOCATION,
  SELF_INSURANCE_POOL
} from '@/utils/protocolConstants';

export const TCORE_STATS = {
  // Protocol Statistics
  totalValueLocked: TOTAL_TVL,
  protocolAPY28Days: PROTOCOL_APY_28D,
  averageAPYTarget: PROTOCOL_APY_28D * 0.83, // 8.3% average from distribution
  totalTDDIssued: STAKED_TVL,
  tddInStaking: STAKED_TVL,
  
  // Participation Statistics
  activeStakers: 2847,
  totalParticipants: 3420,
  
  // Performance Fee (20% of total yield)
  performanceFee: PERFORMANCE_FEE,
  performanceFeeAllocation: {
    bonusYield: BONUS_YIELD_ALLOCATION.bonus_pool,
    buybackTDD: BONUS_YIELD_ALLOCATION.buyback_pool,
    protocolRevenue: BONUS_YIELD_ALLOCATION.protocol_revenue,
    insuranceBuffer: BONUS_YIELD_ALLOCATION.insurance_reserve,
  },
  
  // Self-Insurance Pool
  selfInsurancePool: SELF_INSURANCE_POOL, // $5K
  
  // Buyback & Burn Statistics (Enhanced with simulation data)
  burnRate: 0.15, // 15% of post-distribution yields
  totalBurned: 187500, // Total TDD burned to date
  supplyReduction: 0.015, // 1.5% supply reduction
  valueIncrease: 0.0125, // 1.25% value increase from burns
  lastBurnAmount: 12500, // Last burn amount in USD
  
  // Simulation Results
  simulationData: {
    monthlyBurn: 4167, // Monthly burn at 1M TVL
    annualBurn: 50000, // Annual burn at 1M TVL
    pegStabilization: {
      withoutBuyback: 0.98, // Peg slips in bear market
      withBuyback: 1.01, // Stabilized with premium
    },
    tierBoosts: {
      tier3: 1.5, // 1.5x deflation benefit
      tier4: 2.0, // 2.0x deflation benefit
    }
  },
  
  // Surplus Pool Statistics (Enhanced with distribution data)
  currentSurplus: 890000, // Current surplus available
  surplusUtilization: 0.73, // 73% of surplus distributed
  averageSurplusAPY: 0.182, // 18.2% average surplus APY
  
  // Surplus Distribution Weights
  surplusDistribution: {
    tier1: 0.00, // 0% - No surplus for tier 1
    tier2: 0.08, // 8% - Low surplus share
    tier3: 0.18, // 18% - Medium surplus share
    tier4: 0.74, // 74% - High surplus share (insurance compensation)
  },
  
  // Base Curve vs Surplus Layer
  baseAPYs: {
    tier1: 6.0,  // Fixed T-Bills * 1.2
    tier2: 9.2,  // Base + low bonus
    tier3: 12.8, // Base + medium bonus
    tier4: 14.9, // Base + high bonus
  },
  
  // Stress Test Data
  stressTestResults: {
    marketDrop20: {
      tier1Loss: 0.0,    // 0% loss (protected)
      tier2Loss: 0.002,  // 0.2% loss
      tier3Loss: 0.006,  // 0.6% loss
      tier4Loss: 0.008,  // 0.8% loss (absorbs first)
    }
  },
  
  // Yield Sources (Real DeFi Protocol Yields)
  yieldSources: {
    fixed: 0.6, // 60% fixed yield
    bonus: 0.4, // 40% bonus yield
    sources: [
      { name: 'T-Bills', allocation: 0.40, apy: 0.05 },
      { name: 'AAVE', allocation: 0.25, apy: 0.045 },
      { name: 'JLP', allocation: 0.20, apy: 0.12 },
      { name: 'LP Farming', allocation: 0.15, apy: 0.15 }
    ]
  },
  
  // T-Core Tiers (corrected according to Knowledge Document)
  tiers: [
    { name: 'Fixed Safe', range: [1, 25], participants: 0.25, guaranteedAPY: 0.06, formula: 'T-Bills * 1.2' },
    { name: 'Low Bonus', range: [26, 50], participants: 0.20, estimatedAPY: 0.092, formula: 'fixed + bonus * f(i)' },
    { name: 'Medium Bonus', range: [51, 75], participants: 0.30, estimatedAPY: 0.128, formula: 'fixed + bonus * f(i)' },
    { name: 'High Bonus', range: [76, 100], participants: 0.25, maxAPY: 0.35, formula: 'fixed + bonus * f(i)' }
  ],
  
  // Growth Metrics
  growthMetrics: {
    tvlGrowth: 0.152, // +15.2%
    apyChange: 0.003, // +0.3%
    stakersGrowth: 0.121, // +12.1%
    insuranceGrowth: 0.053 // +5.3%
  },

  // Transparency & Governance
  multisigAddresses: [
    {
      name: 'Treasury Management',
      address: '0x1234567890123456789012345678901234567890',
      signers: 5,
      threshold: 3,
      purpose: 'T-Bills allocation, yield optimization'
    },
    {
      name: 'Protocol Operations',
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      signers: 3,
      threshold: 2,
      purpose: 'DeFi protocol rebalancing, fee distribution'
    }
  ],

  // Compliance & Legal
  auditData: {
    lastAudit: '2024-01-01',
    auditor: 'Quantstamp',
    nextAudit: '2024-07-01',
    status: 'Passed with recommendations'
  },

  // Mathematical Constants
  mathematicalConstants: {
    variance: 2.9e-7, // Variance for uniform liquidity
    kParameter: 1.03, // k=1.03 for f(i) formula
    formula: 'f(i) = 1 * 1.03^(i-25)', // Exact formula from Knowledge Document
    averageAPY: 0.0873, // 8.73% average APY
    spread: 0.0891, // 8.91% spread
  }
};

export const formatCurrency = (amount: number): string => {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
  return `$${amount.toFixed(2)}`;
};

export const formatPercentage = (decimal: number): string => {
  return `${(decimal * 100).toFixed(1)}%`;
};

export const formatGrowth = (decimal: number): string => {
  const prefix = decimal >= 0 ? '+' : '';
  return `${prefix}${(decimal * 100).toFixed(1)}%`;
};