// Unified T-Core data source for consistent statistics across landing and app
import { PROTOCOL_TVL, PROTOCOL_APY_28_DAYS, TOTAL_TDD_ISSUED, TDD_IN_STAKING, AVERAGE_APY_TARGET } from '@/utils/riskRangeCalculations';

export const TCORE_STATS = {
  // Protocol Statistics
  totalValueLocked: PROTOCOL_TVL,
  protocolAPY28Days: PROTOCOL_APY_28_DAYS,
  averageAPYTarget: AVERAGE_APY_TARGET,
  totalTDDIssued: TOTAL_TDD_ISSUED,
  tddInStaking: TDD_IN_STAKING,
  
  // Participation Statistics
  activeStakers: 2847,
  totalParticipants: 3420,
  
  // Self-Insurance Pool
  selfInsurancePool: 1200000, // $1.2M
  
  // Yield Sources (Anti-Ponzi Breakdown)
  yieldSources: {
    fixed: 0.6, // 60% fixed yield
    bonus: 0.4, // 40% bonus from protocol revenue
    sources: [
      { name: 'T-Bills', allocation: 0.25, apy: 0.05 },
      { name: 'AAVE', allocation: 0.20, apy: 0.045 },
      { name: 'JLP', allocation: 0.15, apy: 0.12 },
      { name: 'LP Farming', allocation: 0.15, apy: 0.15 },
      { name: 'Protocol Revenue', allocation: 0.25, apy: 0.18 }
    ]
  },
  
  // T-Core Tiers
  tiers: [
    { name: 'Safe', range: [1, 3], participants: 0.25, guaranteedAPY: 0.06 },
    { name: 'Conservative', range: [4, 24], participants: 0.40, estimatedAPY: 0.09 },
    { name: 'Balanced', range: [25, 80], participants: 0.30, estimatedAPY: 0.16 },
    { name: 'T-Core HERO', range: [81, 100], participants: 0.05, maxAPY: 0.35 }
  ],
  
  // Growth Metrics
  growthMetrics: {
    tvlGrowth: 0.152, // +15.2%
    apyChange: 0.003, // +0.3%
    stakersGrowth: 0.121, // +12.1%
    insuranceGrowth: 0.053 // +5.3%
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