
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LiquidityPosition, ProtocolState, RiskTick } from '@/types/riskRange';
import { 
  generateInitialRiskTicks, 
  distributeYieldBottomUp,
  calculateHistoricalAPY,
  MIN_GUARANTEED_APY,
  RISK_SCALE_MIN,
  RISK_SCALE_MAX
} from '@/utils/riskRangeCalculations';

interface Asset {
  symbol: string;
  balance: number;
  usdValue: number;
  change?: string;
}

interface RiskRangeContextType {
  balances: Asset[];
  liquidityPositions: LiquidityPosition[];
  protocolState: ProtocolState;
  addBalance: (symbol: string, amount: number) => void;
  mintTDD: (usdcAmount: number) => boolean;
  getAvailableBalance: (symbol: string) => number;
  createLiquidityPosition: (amount: number, riskMin: number, riskMax: number) => string;
  withdrawPosition: (positionId: string) => boolean;
  updateProtocolYield: (newYield: number) => void;
  getTotalTVL: () => number;
}

const RiskRangeContext = createContext<RiskRangeContextType | undefined>(undefined);

export const RiskRangeProvider = ({ children }: { children: ReactNode }) => {
  const [balances, setBalances] = useState<Asset[]>([
    { symbol: 'USDC', balance: 0, usdValue: 0, change: '+0.00%' },
    { symbol: 'TDD', balance: 0, usdValue: 0, change: '+0.00%' },
  ]);

  const [liquidityPositions, setLiquidityPositions] = useState<LiquidityPosition[]>([]);
  
  // Generate mock 28-day historical yields (8-12% range)
  const mockHistoricalYields = Array.from({ length: 28 }, () => 0.08 + Math.random() * 0.04);
  
  const [protocolState, setProtocolState] = useState<ProtocolState>({
    totalTVL: 0,
    totalYieldGenerated: 50000, // $50k yield in last 28 days (example)
    guaranteedAPY: MIN_GUARANTEED_APY, // T-Bills + 20%
    riskTicks: generateInitialRiskTicks(),
    lastUpdateTimestamp: new Date(),
    historicalYields: mockHistoricalYields,
    estimatedAPY: calculateHistoricalAPY(mockHistoricalYields)
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

  const createLiquidityPosition = (amount: number, riskMin: number, riskMax: number): string => {
    const tddBalance = getAvailableBalance('TDD');
    if (amount > tddBalance) {
      return '';
    }

    // Validate risk range
    if (riskMin < RISK_SCALE_MIN || riskMax > RISK_SCALE_MAX || riskMin >= riskMax) {
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

    const positionId = `range_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newPosition: LiquidityPosition = {
      id: positionId,
      amount: amount,
      riskRange: { min: riskMin, max: riskMax },
      createdAt: new Date(),
      currentValue: amount * 1.005, // Small initial gain
      earnedAmount: amount * 0.005,
      actualAPR: 0.15, // Will be calculated based on range
      status: 'active'
    };

    setLiquidityPositions(prev => [...prev, newPosition]);

    // Update protocol state with new liquidity
    updateRiskTicks(amount, riskMin, riskMax);
    
    return positionId;
  };

  const updateRiskTicks = (amount: number, riskMin: number, riskMax: number) => {
    setProtocolState(prev => {
      const newTicks = [...prev.riskTicks];
      const rangeSize = riskMax - riskMin + 1;
      const amountPerLevel = amount / rangeSize;

      // Add liquidity to relevant ticks (1-100 scale)
      for (let risk = riskMin; risk <= riskMax; risk++) {
        const tickIndex = newTicks.findIndex(t => t.riskLevel === risk);
        if (tickIndex >= 0) {
          newTicks[tickIndex] = {
            ...newTicks[tickIndex],
            totalLiquidity: newTicks[tickIndex].totalLiquidity + amountPerLevel
          };
        }
      }

      // Redistribute yield using waterfall model
      const updatedTicks = distributeYieldBottomUp(prev.totalYieldGenerated, newTicks);

      return {
        ...prev,
        totalTVL: prev.totalTVL + amount,
        riskTicks: updatedTicks,
        lastUpdateTimestamp: new Date()
      };
    });
  };

  const withdrawPosition = (positionId: string): boolean => {
    const position = liquidityPositions.find(p => p.id === positionId);
    if (!position || position.status !== 'active') {
      return false;
    }

    // Add back to TDD balance
    addBalance('TDD', position.currentValue);

    // Mark position as withdrawn
    setLiquidityPositions(prev => prev.map(p => 
      p.id === positionId ? { ...p, status: 'withdrawn' as const } : p
    ));

    return true;
  };

  const updateProtocolYield = (newYield: number) => {
    setProtocolState(prev => {
      // Update historical yields (rolling 28-day window)
      const newHistoricalYields = [...prev.historicalYields.slice(1), newYield / prev.totalTVL];
      const updatedEstimatedAPY = calculateHistoricalAPY(newHistoricalYields);
      
      const updatedTicks = distributeYieldBottomUp(newYield, prev.riskTicks);
      
      return {
        ...prev,
        totalYieldGenerated: newYield,
        historicalYields: newHistoricalYields,
        estimatedAPY: updatedEstimatedAPY,
        riskTicks: updatedTicks,
        lastUpdateTimestamp: new Date()
      };
    });
  };

  const getTotalTVL = (): number => {
    return protocolState.totalTVL;
  };

  return (
    <RiskRangeContext.Provider value={{
      balances,
      liquidityPositions,
      protocolState,
      addBalance,
      mintTDD,
      getAvailableBalance,
      createLiquidityPosition,
      withdrawPosition,
      updateProtocolYield,
      getTotalTVL,
    }}>
      {children}
    </RiskRangeContext.Provider>
  );
};

export const useRiskRange = () => {
  const context = useContext(RiskRangeContext);
  if (context === undefined) {
    throw new Error('useRiskRange must be used within a RiskRangeProvider');
  }
  return context;
};
