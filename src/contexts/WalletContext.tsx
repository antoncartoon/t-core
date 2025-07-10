import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StakingPosition } from '@/types/staking';

interface Asset {
  symbol: string;
  balance: number;
  usdValue: number;
  change?: string;
}

interface WalletContextType {
  balances: Asset[];
  stakingPositions: StakingPosition[];
  addBalance: (symbol: string, amount: number) => void;
  mintTkchUSD: (usdcAmount: number) => boolean;
  getAvailableBalance: (symbol: string) => number;
  createStakingPosition: (amount: number, riskLevel: number) => string;
  withdrawPosition: (positionId: string) => boolean;
  getTotalStakedValue: () => number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // Start with zero balances for new users
  const [balances, setBalances] = useState<Asset[]>([
    { symbol: 'USDC', balance: 0, usdValue: 0, change: '+0.00%' },
    { symbol: 'tkchUSD', balance: 0, usdValue: 0, change: '+0.00%' },
  ]);

  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);

  const addBalance = (symbol: string, amount: number) => {
    setBalances(prev => prev.map(asset => 
      asset.symbol === symbol 
        ? { 
            ...asset, 
            balance: asset.balance + amount, 
            usdValue: (asset.balance + amount) * (asset.symbol === 'USDC' || asset.symbol === 'tkchUSD' ? 1 : 0.998)
          }
        : asset
    ));
  };

  const mintTkchUSD = (usdcAmount: number): boolean => {
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

    // Add tkchUSD balance (1:1 mint)
    addBalance('tkchUSD', usdcAmount);
    
    return true;
  };

  const getAvailableBalance = (symbol: string): number => {
    const asset = balances.find(b => b.symbol === symbol);
    return asset ? asset.balance : 0;
  };

  const createStakingPosition = (amount: number, riskLevel: number): string => {
    const tkchUSDBalance = getAvailableBalance('tkchUSD');
    if (amount > tkchUSDBalance) {
      return '';
    }

    // Reduce tkchUSD balance
    setBalances(prev => prev.map(asset => 
      asset.symbol === 'tkchUSD' 
        ? { 
            ...asset, 
            balance: asset.balance - amount, 
            usdValue: (asset.balance - amount) * 1
          }
        : asset
    ));

    const positionId = `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const calculateYield = (risk: number) => {
      return Math.pow(risk / 100, 1.5) * 25 + 2;
    };

    const getRiskCategory = (risk: number) => {
      if (risk <= 33) return 'Conservative';
      if (risk <= 66) return 'Moderate';
      return 'Aggressive';
    };

    const getLockPeriod = (risk: number) => {
      if (risk <= 33) return 30;
      if (risk <= 66) return 90;
      return 180;
    };

    const newPosition: StakingPosition = {
      id: positionId,
      amount: amount,
      originalTokenAmount: amount,
      currentValue: amount * 1.02, // Small initial gain
      earnedAmount: amount * 0.02,
      apy: calculateYield(riskLevel),
      riskLevel,
      riskCategory: getRiskCategory(riskLevel),
      lockPeriod: getLockPeriod(riskLevel),
      createdAt: new Date(),
      maturityDate: new Date(Date.now() + getLockPeriod(riskLevel) * 24 * 60 * 60 * 1000),
      status: 'active'
    };

    setStakingPositions(prev => [...prev, newPosition]);
    return positionId;
  };

  const withdrawPosition = (positionId: string): boolean => {
    const position = stakingPositions.find(p => p.id === positionId);
    if (!position || position.status !== 'active') {
      return false;
    }

    // Add back to tkchUSD balance
    addBalance('tkchUSD', position.currentValue);

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

  return (
    <WalletContext.Provider value={{
      balances,
      stakingPositions,
      addBalance,
      mintTkchUSD,
      getAvailableBalance,
      createStakingPosition,
      withdrawPosition,
      getTotalStakedValue,
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
