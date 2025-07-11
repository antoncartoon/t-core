import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NFTPosition, TCoreState, StakingMode, RiskRange, ProtocolParams } from '@/types/tcore';
import { 
  generateInitialLiquidityTicks,
  updateLiquidityDistribution,
  calculateTotalLiquidity,
  calculateHighRiskLiquidity,
  calculateDynamicK,
  calculateYieldDistribution,
  calculateUserYield,
  calculateLossDistribution,
  calculateUserLoss,
  MIN_RISK_LEVEL,
  MAX_RISK_LEVEL
} from '@/utils/tcoreCalculations';

interface Asset {
  symbol: string;
  balance: number;
  usdValue: number;
  change?: string;
}

interface TCoreContextType {
  // Asset management
  balances: Asset[];
  addBalance: (symbol: string, amount: number) => void;
  mintTDD: (usdcAmount: number) => boolean;
  getAvailableBalance: (symbol: string) => number;
  
  // T-CORE Protocol state
  tcoreState: TCoreState;
  nftPositions: NFTPosition[];
  stakingMode: StakingMode;
  setStakingMode: (mode: StakingMode) => void;
  
  // Position management
  createNFTPosition: (amount: number, riskRange: RiskRange) => string;
  burnNFTPosition: (tokenId: string) => boolean;
  
  // Protocol operations
  updateProtocolYield: (newYield: number) => void;
  updateReserveAmount: (newReserve: number) => void;
  processProtocolFees: (feeAmount: number) => void;
  
  // Analytics
  getUserYieldForPosition: (tokenId: string) => number;
  getUserLossForPosition: (tokenId: string) => number;
  getTotalUserTVL: () => number;
  getProtocolMetrics: () => {
    totalTVL: number;
    highRiskRatio: number;
    currentK: number;
    reserveCoverage: number;
  };
}

const TCoreContext = createContext<TCoreContextType | undefined>(undefined);

export const TCoreProvider = ({ children }: { children: ReactNode }) => {
  const [balances, setBalances] = useState<Asset[]>([
    { symbol: 'USDC', balance: 0, usdValue: 0, change: '+0.00%' },
    { symbol: 'TDD', balance: 0, usdValue: 0, change: '+0.00%' },
  ]);

  const [nftPositions, setNftPositions] = useState<NFTPosition[]>([]);
  const [stakingMode, setStakingMode] = useState<StakingMode>('lite');
  
  // Initial protocol state
  const [tcoreState, setTCoreState] = useState<TCoreState>({
    liquidityTicks: generateInitialLiquidityTicks(),
    totalTVL: 0,
    protocolParams: {
      rMin: 0.05, // 5% guaranteed rate (T-Bills + spread)
      k: 2.0, // Initial curve parameter
      totalYield: 0,
      reserveAmount: 0,
      protocolFees: 0
    },
    highRiskLiquidity: 0,
    lastUpdateTimestamp: new Date(),
    oracleData: {
      chainlinkTBillRate: 0.045, // 4.5% current T-Bill rate
      lastUpdated: new Date()
    }
  });

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

  const createNFTPosition = (amount: number, riskRange: RiskRange): string => {
    const tddBalance = getAvailableBalance('TDD');
    if (amount > tddBalance) {
      return '';
    }

    // Validate risk range
    if (riskRange.start < MIN_RISK_LEVEL || riskRange.end > MAX_RISK_LEVEL || riskRange.start > riskRange.end) {
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

    const tokenId = `tcore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newPosition: NFTPosition = {
      tokenId,
      owner: 'user', // In real implementation, this would be the connected wallet address
      amount,
      riskRange,
      createdAt: new Date(),
      currentValue: amount,
      earnedAmount: 0,
      status: 'active',
      metadata: {
        contractAddress: '0x...', // Would be actual contract address
        tokenURI: `https://api.tcore.finance/nft/${tokenId}`,
        description: `T-CORE Liquidity Position: ${amount} TDD in risk levels ${riskRange.start}-${riskRange.end}`
      }
    };

    setNftPositions(prev => [...prev, newPosition]);

    // Update protocol state
    setTCoreState(prev => {
      const updatedTicks = updateLiquidityDistribution(prev.liquidityTicks, amount, riskRange);
      const newTotalTVL = calculateTotalLiquidity(updatedTicks);
      const newHighRiskLiquidity = calculateHighRiskLiquidity(updatedTicks);
      const newK = calculateDynamicK(newTotalTVL, newHighRiskLiquidity);

      return {
        ...prev,
        liquidityTicks: updatedTicks,
        totalTVL: newTotalTVL,
        highRiskLiquidity: newHighRiskLiquidity,
        protocolParams: {
          ...prev.protocolParams,
          k: newK
        },
        lastUpdateTimestamp: new Date()
      };
    });

    return tokenId;
  };

  const burnNFTPosition = (tokenId: string): boolean => {
    const position = nftPositions.find(p => p.tokenId === tokenId);
    if (!position || position.status !== 'active') {
      return false;
    }

    // Add current value back to TDD balance
    addBalance('TDD', position.currentValue);

    // Mark position as unstaked
    setNftPositions(prev => prev.map(p => 
      p.tokenId === tokenId ? { ...p, status: 'unstaked' as const } : p
    ));

    // Update protocol state (remove liquidity)
    setTCoreState(prev => {
      const updatedTicks = prev.liquidityTicks.map(tick => {
        if (tick.riskLevel >= position.riskRange.start && tick.riskLevel <= position.riskRange.end) {
          const effectiveStake = position.amount / (position.riskRange.end - position.riskRange.start + 1);
          return {
            ...tick,
            totalLiquidity: Math.max(0, tick.totalLiquidity - effectiveStake)
          };
        }
        return tick;
      });

      const newTotalTVL = calculateTotalLiquidity(updatedTicks);
      const newHighRiskLiquidity = calculateHighRiskLiquidity(updatedTicks);
      const newK = calculateDynamicK(newTotalTVL, newHighRiskLiquidity);

      return {
        ...prev,
        liquidityTicks: updatedTicks,
        totalTVL: newTotalTVL,
        highRiskLiquidity: newHighRiskLiquidity,
        protocolParams: {
          ...prev.protocolParams,
          k: newK
        },
        lastUpdateTimestamp: new Date()
      };
    });

    return true;
  };

  const updateProtocolYield = (newYield: number) => {
    setTCoreState(prev => {
      const yieldDistribution = calculateYieldDistribution(
        newYield,
        prev.liquidityTicks,
        prev.protocolParams.rMin,
        prev.protocolParams.k
      );

      // Update ticks with new yield
      const updatedTicks = prev.liquidityTicks.map(tick => {
        const yieldData = yieldDistribution.find(y => y.level === tick.riskLevel);
        return {
          ...tick,
          yieldGenerated: yieldData ? yieldData.yieldShare : 0
        };
      });

      return {
        ...prev,
        liquidityTicks: updatedTicks,
        protocolParams: {
          ...prev.protocolParams,
          totalYield: newYield
        },
        lastUpdateTimestamp: new Date()
      };
    });

    // Update NFT positions with new yields
    setNftPositions(prev => prev.map(position => {
      if (position.status === 'active') {
        const yieldDistribution = calculateYieldDistribution(
          newYield,
          tcoreState.liquidityTicks,
          tcoreState.protocolParams.rMin,
          tcoreState.protocolParams.k
        );
        
        const userYield = calculateUserYield(position, yieldDistribution);
        return {
          ...position,
          earnedAmount: position.earnedAmount + userYield,
          currentValue: position.amount + position.earnedAmount + userYield
        };
      }
      return position;
    }));
  };

  const updateReserveAmount = (newReserve: number) => {
    setTCoreState(prev => ({
      ...prev,
      protocolParams: {
        ...prev.protocolParams,
        reserveAmount: newReserve
      }
    }));
  };

  const processProtocolFees = (feeAmount: number) => {
    // Protocol fees go to risk levels 95-100
    const feeRange = { start: 95, end: 100 };
    
    setTCoreState(prev => {
      const updatedTicks = updateLiquidityDistribution(prev.liquidityTicks, feeAmount, feeRange);
      const newTotalTVL = calculateTotalLiquidity(updatedTicks);
      const newHighRiskLiquidity = calculateHighRiskLiquidity(updatedTicks);
      const newK = calculateDynamicK(newTotalTVL, newHighRiskLiquidity);

      return {
        ...prev,
        liquidityTicks: updatedTicks,
        totalTVL: newTotalTVL,
        highRiskLiquidity: newHighRiskLiquidity,
        protocolParams: {
          ...prev.protocolParams,
          k: newK,
          protocolFees: prev.protocolParams.protocolFees + feeAmount,
          reserveAmount: prev.protocolParams.reserveAmount + feeAmount // Fees also increase reserve
        },
        lastUpdateTimestamp: new Date()
      };
    });
  };

  const getUserYieldForPosition = (tokenId: string): number => {
    const position = nftPositions.find(p => p.tokenId === tokenId);
    if (!position) return 0;

    const yieldDistribution = calculateYieldDistribution(
      tcoreState.protocolParams.totalYield,
      tcoreState.liquidityTicks,
      tcoreState.protocolParams.rMin,
      tcoreState.protocolParams.k
    );

    return calculateUserYield(position, yieldDistribution);
  };

  const getUserLossForPosition = (tokenId: string): number => {
    const position = nftPositions.find(p => p.tokenId === tokenId);
    if (!position) return 0;

    // Assume some loss for demo purposes
    const mockLoss = tcoreState.protocolParams.totalYield * 0.1; // 10% of yield as potential loss
    
    const lossDistribution = calculateLossDistribution(
      mockLoss,
      tcoreState.protocolParams.reserveAmount,
      tcoreState.liquidityTicks
    );

    return calculateUserLoss(position, lossDistribution);
  };

  const getTotalUserTVL = (): number => {
    return nftPositions
      .filter(p => p.status === 'active')
      .reduce((sum, p) => sum + p.currentValue, 0);
  };

  const getProtocolMetrics = () => {
    const totalTVL = tcoreState.totalTVL;
    const highRiskRatio = totalTVL > 0 ? tcoreState.highRiskLiquidity / totalTVL : 0;
    const reserveCoverage = totalTVL > 0 ? tcoreState.protocolParams.reserveAmount / totalTVL : 0;

    return {
      totalTVL,
      highRiskRatio,
      currentK: tcoreState.protocolParams.k,
      reserveCoverage
    };
  };

  return (
    <TCoreContext.Provider value={{
      balances,
      addBalance,
      mintTDD,
      getAvailableBalance,
      tcoreState,
      nftPositions,
      stakingMode,
      setStakingMode,
      createNFTPosition,
      burnNFTPosition,
      updateProtocolYield,
      updateReserveAmount,
      processProtocolFees,
      getUserYieldForPosition,
      getUserLossForPosition,
      getTotalUserTVL,
      getProtocolMetrics,
    }}>
      {children}
    </TCoreContext.Provider>
  );
};

export const useTCore = () => {
  const context = useContext(TCoreContext);
  if (context === undefined) {
    throw new Error('useTCore must be used within a TCoreProvider');
  }
  return context;
};