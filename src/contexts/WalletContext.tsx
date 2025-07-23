
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StakingPosition, PoolSettings } from '@/types/staking';
import { 
  calculateRiskScore, 
  calculatePayoutPriority, 
  riskScoreToLevel, 
  riskScoreToCategory, 
  calculateNextPayoutDate,
  getDefaultPayoutFrequency,
  DEFAULT_POOL_SETTINGS
} from '@/utils/riskCalculations';

interface Asset {
  symbol: string;
  balance: number;
  usdValue: number;
  change?: string;
}

interface WalletContextType {
  balances: Asset[];
  stakingPositions: StakingPosition[];
  poolSettings: PoolSettings;
  addBalance: (symbol: string, amount: number) => void;
  mintTDD: (usdcAmount: number) => boolean;
  getAvailableBalance: (symbol: string) => number;
  createStakingPosition: (amount: number, desiredAPY: number) => string;
  withdrawPosition: (positionId: string) => boolean;
  getTotalStakedValue: () => number;
  updatePoolSettings: (settings: Partial<PoolSettings>) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balances, setBalances] = useState<Asset[]>([
    { symbol: 'USDC', balance: 5000, usdValue: 5000, change: '+0.01%' },
    { symbol: 'TDD', balance: 2500, usdValue: 2500, change: '+2.34%' },
  ]);

  // Initialize with demo positions
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([
    {
      id: 'pos_demo_conservative_001',
      amount: 1000,
      originalTokenAmount: 1000,
      currentValue: 1045.50,
      earnedAmount: 45.50,
      desiredAPY: 0.12,
      riskScore: 2500,
      payoutPriority: 7500,
      baseAPY: 0.05,
      maxAPY: 0.25,
      apy: 12,
      riskLevel: 25,
      riskCategory: 'Conservative',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      nextPayoutDate: new Date(Date.now() + 33 * 60 * 60 * 1000), // 33 hours from now
      payoutFrequency: 7,
      status: 'active',
      missedPayouts: 0,
      actualAPY: 0.125
    },
    {
      id: 'pos_demo_moderate_002',
      amount: 2500,
      originalTokenAmount: 2500,
      currentValue: 2687.25,
      earnedAmount: 187.25,
      desiredAPY: 0.18,
      riskScore: 6000,
      payoutPriority: 4000,
      baseAPY: 0.05,
      maxAPY: 0.25,
      apy: 18,
      riskLevel: 60,
      riskCategory: 'Moderate',
      createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
      nextPayoutDate: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
      payoutFrequency: 7,
      status: 'active',
      missedPayouts: 12.5,
      actualAPY: 0.16
    },
    {
      id: 'pos_demo_aggressive_003',
      amount: 500,
      originalTokenAmount: 500,
      currentValue: 478.50,
      earnedAmount: -21.50,
      desiredAPY: 0.25,
      riskScore: 9200,
      payoutPriority: 800,
      baseAPY: 0.05,
      maxAPY: 0.25,
      apy: 25,
      riskLevel: 92,
      riskCategory: 'Aggressive',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      nextPayoutDate: new Date(Date.now() + 45 * 60 * 60 * 1000), // 45 hours from now
      payoutFrequency: 7,
      status: 'active',
      missedPayouts: 47.80,
      actualAPY: 0.08
    }
  ]);
  const [poolSettings, setPoolSettings] = useState<PoolSettings>(DEFAULT_POOL_SETTINGS);

  const addBalance = (symbol: string, amount: number) => {
    setBalances(prev => prev.map(asset => 
      asset.symbol === symbol 
        ? { 
            ...asset, 
            balance: asset.balance + amount, 
            usdValue: (asset.balance + amount) * (asset.symbol === 'USDC' || asset.symbol === 'TDD' ? 1 : 0.998)
          }
        : asset
    ));
  };

  const mintTDD = (usdcAmount: number): boolean => {
    const usdcBalance = getAvailableBalance('USDC');
    if (usdcAmount > usdcBalance) {
      return false;
    }

    // Reduce USDC balance
    setBalances(prev => prev.map(asset => 
      asset.symbol === 'USDC' 
        ? { 
            ...asset, 
            balance: asset.balance - usdcAmount, 
            usdValue: (asset.balance - usdcAmount) * 1
          }
        : asset
    ));

    // Add TDD balance (1:1 mint)
    addBalance('TDD', usdcAmount);
    
    return true;
  };

  const getAvailableBalance = (symbol: string): number => {
    const asset = balances.find(b => b.symbol === symbol);
    return asset ? asset.balance : 0;
  };

  const createStakingPosition = (amount: number, desiredAPY: number): string => {
    const tddBalance = getAvailableBalance('TDD');
    if (amount > tddBalance) {
      return '';
    }

    // Reduce TDD balance
    setBalances(prev => prev.map(asset => 
      asset.symbol === 'TDD' 
        ? { 
            ...asset, 
            balance: asset.balance - amount, 
            usdValue: (asset.balance - amount) * 1
          }
        : asset
    ));

    const positionId = `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate new risk-based values
    const riskScore = calculateRiskScore(desiredAPY, poolSettings);
    const payoutPriority = calculatePayoutPriority(riskScore);
    const riskLevel = riskScoreToLevel(riskScore);
    const riskCategory = riskScoreToCategory(riskScore);
    const payoutFrequency = getDefaultPayoutFrequency();
    const createdAt = new Date();

    const newPosition: StakingPosition = {
      id: positionId,
      amount: amount,
      originalTokenAmount: amount,
      currentValue: amount * 1.01, // Small initial gain
      earnedAmount: amount * 0.01,
      
      // New APY-based fields
      desiredAPY,
      riskScore,
      payoutPriority,
      baseAPY: poolSettings.baseAPY,
      maxAPY: poolSettings.maxAPY,
      
      // Legacy fields for backwards compatibility
      apy: desiredAPY * 100, // Convert to percentage
      riskLevel,
      riskCategory,
      
      createdAt,
      nextPayoutDate: calculateNextPayoutDate(createdAt, payoutFrequency),
      payoutFrequency,
      status: 'active',
      
      // New tracking fields
      missedPayouts: 0,
      actualAPY: desiredAPY // Start with desired, will be updated based on actual payouts
    };

    setStakingPositions(prev => [...prev, newPosition]);
    return positionId;
  };

  const withdrawPosition = (positionId: string): boolean => {
    const position = stakingPositions.find(p => p.id === positionId);
    if (!position || position.status !== 'active') {
      return false;
    }

    // Add back to TDD balance
    addBalance('TDD', position.currentValue);

    // Mark position as withdrawn
    setStakingPositions(prev => prev.map(p => 
      p.id === positionId ? { ...p, status: 'withdrawn' as const } : p
    ));

    return true;
  };

  const getTotalStakedValue = (): number => {
    return stakingPositions
      .filter(p => p.status === 'active')
      .reduce((sum, p) => sum + p.currentValue, 0);
  };

  const updatePoolSettings = (settings: Partial<PoolSettings>) => {
    setPoolSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <WalletContext.Provider value={{
      balances,
      stakingPositions,
      poolSettings,
      addBalance,
      mintTDD,
      getAvailableBalance,
      createStakingPosition,
      withdrawPosition,
      getTotalStakedValue,
      updatePoolSettings,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
