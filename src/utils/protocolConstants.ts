/**
 * T-Core Protocol Constants - Single Source of Truth
 * All demonstration parameters and hardcoded values for the protocol
 */

// =============================================================================
// CORE PROTOCOL PARAMETERS (Demonstration Values)
// =============================================================================

// TDD Token Supply and Staking
export const TOTAL_TDD_SUPPLY = 1_000_000; // 1M TDD tokens issued
export const STAKED_TDD_AMOUNT = 900_000;  // 900K TDD tokens staked (90% staking rate)

// Protocol USD Values (demonstration)
export const PROTOCOL_USD_TVL = 900_000; // $900K actual USD value in protocol

export const PROTOCOL_APY_28D = 0.10; // 10% base protocol APY
export const PERFORMANCE_FEE = 0.20;  // 20% performance fee

// =============================================================================
// DERIVED CALCULATIONS
// =============================================================================

export const GROSS_YIELD_USD = PROTOCOL_USD_TVL * PROTOCOL_APY_28D; // $85K gross yield
export const SUCCESS_FEE_POOL = GROSS_YIELD_USD * PERFORMANCE_FEE; // $17K performance fee
export const NET_YIELD_USD = GROSS_YIELD_USD - SUCCESS_FEE_POOL; // $68K net yield to users

// Staking participation rate
export const STAKING_PARTICIPATION_RATE = STAKED_TDD_AMOUNT / TOTAL_TDD_SUPPLY; // 90%

// =============================================================================
// TIER DEFINITIONS (Risk Segment Ranges)
// =============================================================================

export const TIER_BREAKPOINTS = {
  safe: [0, 9],
  conservative: [10, 29], 
  balanced: [30, 59],
  hero: [60, 99]
};

// Legacy constants for backward compatibility
export const TIER_BREAKPOINTS_LEGACY = {
  SAFE_START: 0,
  SAFE_END: 9,
  CONSERVATIVE_START: 10,
  CONSERVATIVE_END: 29,
  BALANCED_START: 30,
  BALANCED_END: 59,
  HERO_START: 60,
  HERO_END: 99
};

// =============================================================================
// LIQUIDITY DISTRIBUTION (Separate from Tier Breakpoints)
// =============================================================================

// Target allocation goals for liquidity among tiers
export const TARGET_DISTRIBUTION = {
  safe: 0.10,      // 10% target allocation
  conservative: 0.20, // 20% target allocation  
  balanced: 0.30,     // 30% target allocation
  hero: 0.40          // 40% target allocation
};

// Current actual distribution (for bonus yield calculations)
export const CURRENT_LIQUIDITY_DISTRIBUTION = {
  safe: 0.15,      // 15% currently staked
  conservative: 0.25, // 25% currently staked
  balanced: 0.35,     // 35% currently staked  
  hero: 0.25          // 25% currently staked
};

// TDD distribution by tier (for stress testing)
export const TIER_TDD_DISTRIBUTION = {
  safe: 0.15,
  conservative: 0.25,
  balanced: 0.35,
  hero: 0.25
};

// =============================================================================
// PERFORMANCE FEE ALLOCATION (25% each)
// =============================================================================

export const BONUS_YIELD_ALLOCATION = {
  bonus_pool: 0.25,      // 25% for bonus yield distribution
  buyback_pool: 0.25,    // 25% for token buybacks
  protocol_revenue: 0.25, // 25% for protocol revenue
  insurance_reserve: 0.25 // 25% for insurance reserve
};

// =============================================================================
// APY AND YIELD PARAMETERS
// =============================================================================

export const T_BILLS_RATE = 0.05; // 5% risk-free rate
export const MIN_RISK_LEVEL = 0;
export const MAX_RISK_LEVEL = 99;
export const FIXED_BASE_APY = 0.06; // 6% base APY (T-Bills × 1.2)
export const SELF_INSURANCE_POOL = 5000; // $5K self-insurance pool

// Target APYs by tier
export const TARGET_APYS = {
  safe: 0.06,        // 6% target APY (T-Bills × 1.2)
  conservative: 0.12, // 12% target APY
  balanced: 0.18,     // 18% target APY  
  hero: 0.28          // 28% target APY
};

// =============================================================================
// DISTRIBUTION AND CALCULATION PARAMETERS
// =============================================================================

export const DISTRIBUTION_PARAMS = {
  FIXED_BASE_MULTIPLIER: 1.5,
  OPTIMAL_K: 2.0,
  TIER1_WIDTH: 10,
  INSURANCE_POOL_TARGET: 0.05,
  PERFORMANCE_FEE: PERFORMANCE_FEE
};

// Category distribution for risk range calculations  
export const CATEGORY_DISTRIBUTION = {
  SAFE: {
    range: [0, 9],
    tddAllocation: 0.10,
    description: "Capital preservation focused"
  },
  CONSERVATIVE: {
    range: [10, 29], 
    tddAllocation: 0.20,
    description: "Low-risk yield generation"
  },
  BALANCED: {
    range: [30, 59],
    tddAllocation: 0.30, 
    description: "Moderate risk-reward balance"
  },
  HERO: {
    range: [60, 99],
    tddAllocation: 0.40,
    description: "High-yield seeking"
  }
};

// =============================================================================
// BONUS YIELD CALCULATION PARAMETERS
// =============================================================================

export const BONUS_YIELD_PARAMS = {
  // Pool available for bonus distribution (25% of performance fees)
  AVAILABLE_POOL: SUCCESS_FEE_POOL * BONUS_YIELD_ALLOCATION.bonus_pool, // $4.5K
  
  // Incentive multipliers for reaching target allocations
  INCENTIVE_MULTIPLIERS: {
    safe: 2.0,        // 2x bonus when safe tier is under-allocated
    conservative: 1.8, // 1.8x bonus when conservative tier is under-allocated
    balanced: 1.5,     // 1.5x bonus when balanced tier is under-allocated
    hero: 1.2          // 1.2x bonus when hero tier is under-allocated
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const getTierForSegment = (segment: number): 'safe' | 'conservative' | 'balanced' | 'hero' => {
  if (segment >= TIER_BREAKPOINTS.safe[0] && segment <= TIER_BREAKPOINTS.safe[1]) return 'safe';
  if (segment >= TIER_BREAKPOINTS.conservative[0] && segment <= TIER_BREAKPOINTS.conservative[1]) return 'conservative';
  if (segment >= TIER_BREAKPOINTS.balanced[0] && segment <= TIER_BREAKPOINTS.balanced[1]) return 'balanced';
  if (segment >= TIER_BREAKPOINTS.hero[0] && segment <= TIER_BREAKPOINTS.hero[1]) return 'hero';
  return 'safe'; // fallback
};

export const getTierTDDAmount = (tier: 'safe' | 'conservative' | 'balanced' | 'hero'): number => {
  return STAKED_TDD_AMOUNT * TIER_TDD_DISTRIBUTION[tier];
};

export const getTierUSDValue = (tier: 'safe' | 'conservative' | 'balanced' | 'hero'): number => {
  return PROTOCOL_USD_TVL * TIER_TDD_DISTRIBUTION[tier];
};

export const getCurrentTierAllocation = (tier: 'safe' | 'conservative' | 'balanced' | 'hero'): number => {
  return CURRENT_LIQUIDITY_DISTRIBUTION[tier];
};

export const getTargetTierAllocation = (tier: 'safe' | 'conservative' | 'balanced' | 'hero'): number => {
  return TARGET_DISTRIBUTION[tier];
};

// =============================================================================
// VALIDATION
// =============================================================================

// Validate that distributions sum to 100%
const validateDistributions = () => {
  const targetSum = Object.values(TARGET_DISTRIBUTION).reduce((sum, val) => sum + val, 0);
  const currentSum = Object.values(CURRENT_LIQUIDITY_DISTRIBUTION).reduce((sum, val) => sum + val, 0);  
  const bonusSum = Object.values(BONUS_YIELD_ALLOCATION).reduce((sum, val) => sum + val, 0);
  
  if (Math.abs(targetSum - 1.0) > 0.01) {
    console.warn('TARGET_DISTRIBUTION does not sum to 1.0:', targetSum);
  }
  if (Math.abs(currentSum - 1.0) > 0.01) {
    console.warn('CURRENT_LIQUIDITY_DISTRIBUTION does not sum to 1.0:', currentSum);
  }
  if (Math.abs(bonusSum - 1.0) > 0.01) {
    console.warn('BONUS_YIELD_ALLOCATION does not sum to 1.0:', bonusSum);
  }
};

// Run validation in development
if (import.meta.env.DEV) {
  validateDistributions();
}