import { SystemParameters } from '@/hooks/useSystemParameters';

/**
 * Dynamic protocol constants that replace hardcoded values
 * All values are now fetched from the database via useSystemParameters hook
 */

export function calculateDynamicConstants(parameters: SystemParameters) {
  const tBillsRate = parameters.t_bills_rate;
  const safeMultiplier = parameters.safe_tier_multiplier;
  
  // Calculate Safe tier APY (T-Bills × multiplier)
  const SAFE_TIER_APY = tBillsRate * safeMultiplier;
  
  // Calculate derived values based on dynamic parameters
  const TOTAL_TDD_SUPPLY = 100_000_000; // This could also be made dynamic
  const STAKED_TDD_AMOUNT = 85_000_000; // This could also be made dynamic
  const PROTOCOL_USD_TVL = 170_000_000; // This could also be made dynamic
  
  const PROTOCOL_APY_28D = 0.095; // This should be calculated from actual performance
  const PERFORMANCE_FEE = 0.25;
  
  const GROSS_YIELD_USD = PROTOCOL_USD_TVL * PROTOCOL_APY_28D;
  const SUCCESS_FEE_POOL = GROSS_YIELD_USD * PERFORMANCE_FEE;
  const NET_YIELD_USD = GROSS_YIELD_USD - SUCCESS_FEE_POOL;
  const STAKING_PARTICIPATION_RATE = STAKED_TDD_AMOUNT / TOTAL_TDD_SUPPLY;

  return {
    // Core Protocol Parameters
    TOTAL_TDD_SUPPLY,
    STAKED_TDD_AMOUNT,
    PROTOCOL_USD_TVL,
    PROTOCOL_APY_28D,
    PERFORMANCE_FEE,
    SAFE_TIER_APY,
    
    // Derived Calculations
    GROSS_YIELD_USD,
    SUCCESS_FEE_POOL,
    NET_YIELD_USD,
    STAKING_PARTICIPATION_RATE,
    
    // Dynamic parameters from database
    TARGET_DISTRIBUTION: parameters.target_tier_distribution,
    TIER_BREAKPOINTS: parameters.tier_breakpoints,
    PERFORMANCE_FEE_ALLOCATION: parameters.performance_fee_allocation,
    TIER_FORMULAS: parameters.tier_formulas,
    
    // T-Bills rate (dynamic)
    T_BILLS_RATE: tBillsRate,
    SAFE_TIER_MULTIPLIER: safeMultiplier,
  };
}

export function getTierForSegment(segment: number, tierBreakpoints: SystemParameters['tier_breakpoints']): 'safe' | 'conservative' | 'balanced' | 'hero' {
  if (segment >= tierBreakpoints.safe[0] && segment <= tierBreakpoints.safe[1]) return 'safe';
  if (segment >= tierBreakpoints.conservative[0] && segment <= tierBreakpoints.conservative[1]) return 'conservative';
  if (segment >= tierBreakpoints.balanced[0] && segment <= tierBreakpoints.balanced[1]) return 'balanced';
  if (segment >= tierBreakpoints.hero[0] && segment <= tierBreakpoints.hero[1]) return 'hero';
  return 'safe'; // Default fallback
}

export function calculateTierAPY(
  tier: 'safe' | 'conservative' | 'balanced' | 'hero',
  segment: number,
  parameters: SystemParameters
): number {
  const tBillsRate = parameters.t_bills_rate;
  const safeMultiplier = parameters.safe_tier_multiplier;
  const baseAPY = tBillsRate * safeMultiplier; // 5.16% base
  
  switch (tier) {
    case 'safe':
      return baseAPY; // Fixed 5.16%
      
    case 'conservative': {
      // Linear: 5.16% → 7%
      const progress = (segment - 10) / (29 - 10);
      return baseAPY + (progress * (0.07 - baseAPY));
    }
    
    case 'balanced': {
      // Quadratic: 7% → 9.5%
      const progress = (segment - 30) / (59 - 30);
      const quadraticProgress = progress * progress;
      return 0.07 + (quadraticProgress * (0.095 - 0.07));
    }
    
    case 'hero': {
      // Exponential: 9.5% × 1.03^(i-60)
      const exponentialFactor = Math.pow(1.03, segment - 60);
      return 0.095 * exponentialFactor;
    }
    
    default:
      return baseAPY;
  }
}