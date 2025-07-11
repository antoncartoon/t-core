
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
    { symbol: 'USDC', balance: 0, usdValue: 0, change: '+0.00%' },
    { symbol: 'TDD', balance: 0, usdValue: 0, change: '+0.00%' },
  ]);

  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);
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
