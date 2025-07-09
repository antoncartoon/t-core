
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StakingPosition, TokenBalance } from '@/types/staking';

interface WalletContextType {
  balances: TokenBalance[];
  stakingPositions: StakingPosition[];
  updateBalance: (symbol: string, newBalance: number) => void;
  createStakingPosition: (amount: number, riskLevel: number) => string;
  withdrawPosition: (positionId: string) => boolean;
  getPositionById: (positionId: string) => StakingPosition | undefined;
  getTotalStakedValue: () => number;
  getAvailableBalance: (symbol: string) => number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [balances, setBalances] = useState<TokenBalance[]>([
    { symbol: 'USDT', balance: 5248.50, usdValue: 5248.50, change: '+0.01%' },
    { symbol: 'USDC', balance: 3156.25, usdValue: 3156.25, change: '+0.02%' },
    { symbol: 'tkchUSD', balance: 1250.00, usdValue: 1250.00, change: '+0.05%' },
  ]);

  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([
    {
      id: 'pos-001',
      amount: 3000,
      riskLevel: 15,
      riskCategory: 'Conservative',
      apy: 5.9,
      createdAt: new Date('2024-01-18'),
      maturityDate: new Date('2024-02-17'),
      lockPeriod: 30,
      status: 'active',
      earnedAmount: 178.45,
      currentValue: 3178.45,
      originalTokenAmount: 3000
    },
    {
      id: 'pos-002',
      amount: 4500.25,
      riskLevel: 45,
      riskCategory: 'Moderate',
      apy: 9.2,
      createdAt: new Date('2024-01-22'),
      maturityDate: new Date('2024-04-22'),
      lockPeriod: 90,
      status: 'active',
      earnedAmount: 412.67,
      currentValue: 4912.92,
      originalTokenAmount: 4500.25
    },
    {
      id: 'pos-003',
      amount: 1400,
      riskLevel: 78,
      riskCategory: 'Aggressive',
      apy: 16.8,
      createdAt: new Date('2024-01-25'),
      maturityDate: new Date('2024-07-23'),
      lockPeriod: 180,
      status: 'active',
      earnedAmount: 254.63,
      currentValue: 1654.63,
      originalTokenAmount: 1400
    }
  ]);

  const updateBalance = (symbol: string, newBalance: number) => {
    setBalances(prev => prev.map(balance => 
      balance.symbol === symbol 
        ? { ...balance, balance: newBalance, usdValue: newBalance }
        : balance
    ));
  };

  const createStakingPosition = (amount: number, riskLevel: number): string => {
    const getRiskCategory = (risk: number): 'Conservative' | 'Moderate' | 'Aggressive' => {
      if (risk <= 33) return 'Conservative';
      if (risk <= 66) return 'Moderate';
      return 'Aggressive';
    };

    const calculateYield = (risk: number) => {
      return Math.pow(risk / 100, 1.5) * 25 + 2;
    };

    const getLockPeriod = (risk: number) => {
      if (risk <= 33) return 30;
      if (risk <= 66) return 90;
      return 180;
    };

    const positionId = `pos-${Date.now()}`;
    const lockPeriod = getLockPeriod(riskLevel);
    const apy = calculateYield(riskLevel);
    const createdAt = new Date();
    const maturityDate = new Date(createdAt.getTime() + lockPeriod * 24 * 60 * 60 * 1000);

    const newPosition: StakingPosition = {
      id: positionId,
      amount,
      riskLevel,
      riskCategory: getRiskCategory(riskLevel),
      apy,
      createdAt,
      maturityDate,
      lockPeriod,
      status: 'active',
      earnedAmount: 0,
      currentValue: amount,
      originalTokenAmount: amount
    };

    setStakingPositions(prev => [...prev, newPosition]);
    
    // Обновляем баланс tkchUSD
    const currentBalance = getAvailableBalance('tkchUSD');
    updateBalance('tkchUSD', currentBalance - amount);

    return positionId;
  };

  const withdrawPosition = (positionId: string): boolean => {
    const position = stakingPositions.find(p => p.id === positionId);
    if (!position || position.status !== 'active') {
      return false;
    }

    setStakingPositions(prev => 
      prev.map(p => p.id === positionId ? { ...p, status: 'withdrawn' as const } : p)
    );

    // Возвращаем токены обратно в кошелек
    const currentBalance = getAvailableBalance('tkchUSD');
    updateBalance('tkchUSD', currentBalance + position.currentValue);

    return true;
  };

  const getPositionById = (positionId: string): StakingPosition | undefined => {
    return stakingPositions.find(p => p.id === positionId);
  };

  const getTotalStakedValue = (): number => {
    return stakingPositions
      .filter(p => p.status === 'active')
      .reduce((sum, p) => sum + p.currentValue, 0);
  };

  const getAvailableBalance = (symbol: string): number => {
    const balance = balances.find(b => b.symbol === symbol);
    return balance?.balance || 0;
  };

  return (
    <WalletContext.Provider value={{
      balances,
      stakingPositions,
      updateBalance,
      createStakingPosition,
      withdrawPosition,
      getPositionById,
      getTotalStakedValue,
      getAvailableBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
};
