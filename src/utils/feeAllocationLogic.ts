/**
 * Performance Fee Allocation Logic
 * Based on T-Core Finance Knowledge Document
 * Performance fee = 20% of total yield, allocated as:
 * - 25% to bonus yield (enhancing higher tiers)
 * - 25% to buyback TDD for supply regulation and peg stability
 * - 25% as protocol revenue (operations/team)
 * - 25% to replenish high-risk tiers for insurance buffer
 */

import { PERFORMANCE_FEE, BONUS_YIELD_ALLOCATION } from '@/utils/protocolConstants';

// Re-export for backward compatibility  
export { PERFORMANCE_FEE } from '@/utils/protocolConstants';

// Fee allocation breakdown (use global constants)
export const FEE_ALLOCATION = BONUS_YIELD_ALLOCATION;

/**
 * Calculate performance fee from total yield
 */
export const calculatePerformanceFee = (totalYield: number): number => {
  return totalYield * PERFORMANCE_FEE;
};

/**
 * Calculate fee allocation breakdown
 */
export const calculateFeeAllocation = (totalYield: number) => {
  const performanceFee = calculatePerformanceFee(totalYield);
  
  return {
    totalYield,
    performanceFee,
    bonusYield: performanceFee * FEE_ALLOCATION.bonus_pool,
    buybackTDD: performanceFee * FEE_ALLOCATION.buyback_pool,
    protocolRevenue: performanceFee * FEE_ALLOCATION.protocol_revenue,
    insuranceBuffer: performanceFee * FEE_ALLOCATION.insurance_reserve,
    netYieldToUsers: totalYield - performanceFee,
  };
};

/**
 * Calculate buyback value increase from supply reduction
 * Formula: value_increase = (1 - old_supply/new_supply) * 100
 */
export const calculateBuybackValueIncrease = (
  oldSupply: number,
  burnedAmount: number,
  currentPrice: number = 1.0
): number => {
  const burnedTokens = burnedAmount / currentPrice;
  const newSupply = oldSupply - burnedTokens;
  if (newSupply <= 0) return 0;
  
  return (1 - oldSupply / newSupply) * 100; // Percentage increase
};

/**
 * Calculate monthly burn amount from performance fee
 */
export const calculateMonthlyBurn = (
  totalYield: number,
  monthsPerYear: number = 12
): number => {
  const feeAllocation = calculateFeeAllocation(totalYield);
  return feeAllocation.buybackTDD / monthsPerYear;
};

/**
 * Calculate net APY after performance fee deduction
 */
export const calculateNetAPY = (grossAPY: number): number => {
  return grossAPY * (1 - PERFORMANCE_FEE);
};

/**
 * Get fee allocation summary for display
 */
export const getFeeAllocationSummary = () => {
  return [
    {
      name: 'Bonus Yield',
      percentage: FEE_ALLOCATION.bonus_pool * 100,
      description: 'Enhances higher tier yields',
      color: 'success',
    },
    {
      name: 'TDD Buyback',
      percentage: FEE_ALLOCATION.buyback_pool * 100,
      description: 'Supply regulation & peg stability',
      color: 'info',
    },
    {
      name: 'Protocol Revenue',
      percentage: FEE_ALLOCATION.protocol_revenue * 100,
      description: 'Operations & team funding',
      color: 'primary',
    },
    {
      name: 'Hero Buffer',
      percentage: FEE_ALLOCATION.insurance_reserve * 100,
      description: 'High-risk tier protection',
      color: 'warning',
    },
  ];
};

/**
 * Validate fee allocation totals to 100%
 */
export const validateFeeAllocation = (): boolean => {
  const total = Object.values(FEE_ALLOCATION).reduce((sum, val) => sum + val, 0);
  return Math.abs(total - 1.0) < 0.0001; // Account for floating point precision
};