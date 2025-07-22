
import { TIER_DEFINITIONS } from '@/types/riskTiers';

// Grid template with 100 columns for heatmap
export const getGridTemplateColumns = (): string => {
  return 'repeat(100, 1fr)';
};

// Get tier color for visualization
export const getTierColor = (tier: keyof typeof TIER_DEFINITIONS | string): string => {
  switch(tier) {
    case 'SAFE':
      return 'bg-green-600 dark:bg-green-500';
    case 'CONSERVATIVE':
      return 'bg-blue-600 dark:bg-blue-500';
    case 'BALANCED':
      return 'bg-yellow-600 dark:bg-yellow-500';
    case 'HERO':
      return 'bg-purple-600 dark:bg-purple-500';
    default:
      return 'bg-gray-600 dark:bg-gray-500';
  }
};

// Get color for APY visualization
export const getAPYColor = (apy: number): string => {
  if (apy <= 0.06) return 'text-green-600 dark:text-green-500';
  if (apy <= 0.12) return 'text-blue-600 dark:text-blue-500';
  if (apy <= 0.20) return 'text-yellow-600 dark:text-yellow-500';
  return 'text-purple-600 dark:text-purple-500';
};

// Get bonus background color based on amount
export const getBonusBackgroundColor = (bonusAmount: number): string => {
  if (bonusAmount <= 0) return 'bg-transparent';
  if (bonusAmount <= 0.5) return 'bg-orange-100 dark:bg-orange-900/20';
  if (bonusAmount <= 1.5) return 'bg-orange-200 dark:bg-orange-800/30';
  if (bonusAmount <= 3) return 'bg-orange-300 dark:bg-orange-700/40';
  return 'bg-orange-400 dark:bg-orange-600/50';
};

// Get risk level color (from low to high risk)
export const getRiskLevelColor = (level: number): string => {
  // From green (safe) to red (risky)
  if (level <= 25) return 'text-green-600 dark:text-green-500';
  if (level <= 50) return 'text-blue-600 dark:text-blue-500';
  if (level <= 75) return 'text-yellow-600 dark:text-yellow-500';
  return 'text-red-600 dark:text-red-500';
};
