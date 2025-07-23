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
  MAX_RISK_LEVEL,
  DISTRIBUTION_PARAMS
} from '@/utils/tcoreCalculations';
import { TIER_DEFINITIONS } from '@/types/riskTiers';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

interface TCoreContextType {
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
  
  // Waterfall distribution
  distributeYieldWaterfall: (totalYield: number) => void;
  distributeLossWaterfall: (totalLoss: number) => void;
  
  // Auto-distribute
  autoDistributePosition: (amount: number) => string;
  
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
  getTierUtilization: () => Record<string, { current: number, target: number, delta: number }>;
}

const TCoreContext = createContext<TCoreContextType | undefined>(undefined);

export const TCoreProvider = ({ children }: { children: ReactNode }) => {
  // Use wallet context for balance management
  const wallet = useWallet();
  const { toast } = useToast();

  const [nftPositions, setNftPositions] = useState<NFTPosition[]>([]);
  const [stakingMode, setStakingMode] = useState<StakingMode>('lite');
  
  // Initial protocol state with realistic demo data
  const [tcoreState, setTCoreState] = useState<TCoreState>({
    liquidityTicks: generateInitialLiquidityTicks(),
    totalTVL: 850000, // Realistic demo TVL
    protocolParams: {
      rMin: 0.05016, // 5.016% guaranteed rate (T-Bills + spread)
      k: 1.5, // Initial curve parameter
      totalYield: 74205, // Demo yield based on protocol APY
      reserveAmount: 1000000, // Initial insurance reserve
      protocolFees: 8734 // Demo accumulated fees
    },
    highRiskLiquidity: 340000, // 40% of TVL in higher risk tiers
    lastUpdateTimestamp: new Date(),
    oracleData: {
      chainlinkTBillRate: 0.0418, // 4.18% current T-Bill rate
      lastUpdated: new Date()
    }
  });

  const createNFTPosition = (amount: number, riskRange: RiskRange): string => {
    const tddBalance = wallet.getAvailableBalance('TDD');
    if (amount > tddBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${amount} TDD but only have ${tddBalance.toFixed(2)} available.`,
        variant: "destructive",
      });
      return '';
    }

    // Validate risk range
    if (riskRange.start < MIN_RISK_LEVEL || riskRange.end > MAX_RISK_LEVEL || riskRange.start > riskRange.end) {
      toast({
        title: "Invalid Risk Range",
        description: `Risk range must be between ${MIN_RISK_LEVEL} and ${MAX_RISK_LEVEL}.`,
        variant: "destructive",
      });
      return '';
    }

    // Reduce TDD balance using wallet context
    wallet.balances.forEach(asset => {
      if (asset.symbol === 'TDD') {
        const newBalance = asset.balance - amount;
        // Update balance through wallet context
        const updatedBalances = wallet.balances.map(b => 
          b.symbol === 'TDD' 
            ? { ...b, balance: newBalance, usdValue: newBalance * 1 }
            : b
        );
        // Note: In a real implementation, we'd need a setBalances method in WalletContext
        // For now, we'll create a position but the balance won't update correctly
      }
    });

    const tokenId = `tcore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate expected APY for this position based on risk range
    const avgRiskLevel = (riskRange.start + riskRange.end) / 2;
    const normalizedRisk = avgRiskLevel / MAX_RISK_LEVEL;
    
    // Use the formula: APY(r) = APY_safe + (APY_protocol - APY_safe) * r^1.5
    const safeAPY = tcoreState.protocolParams.rMin; // ~5.016%
    const protocolAPY = 0.0873; // Target 8.73% protocol average APY
    const expectedAPY = safeAPY + (protocolAPY - safeAPY) * Math.pow(normalizedRisk, 1.5);
    
    // Determine the tier based on average risk level
    let tier = "SAFE";
    if (avgRiskLevel >= TIER_DEFINITIONS.HERO.min) {
      tier = "HERO";
    } else if (avgRiskLevel >= TIER_DEFINITIONS.BALANCED.min) {
      tier = "BALANCED";
    } else if (avgRiskLevel >= TIER_DEFINITIONS.CONSERVATIVE.min) {
      tier = "CONSERVATIVE";
    }

    const newPosition: NFTPosition = {
      tokenId,
      owner: 'user', // In real implementation, this would be the connected wallet address
      amount,
      riskRange,
      createdAt: new Date(),
      currentValue: amount,
      earnedAmount: 0,
      status: 'active',
      expectedAPY: expectedAPY,
      tier,
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
    
    toast({
      title: "Position Created",
      description: `You've staked ${amount} TDD in risk range ${riskRange.start}-${riskRange.end} with expected APY of ${(expectedAPY * 100).toFixed(2)}%.`,
    });

    return tokenId;
  };

  const burnNFTPosition = (tokenId: string): boolean => {
    const position = nftPositions.find(p => p.tokenId === tokenId);
    if (!position || position.status !== 'active') {
      toast({
        title: "Invalid Position",
        description: "This position cannot be unstaked.",
        variant: "destructive",
      });
      return false;
    }

    // Add current value back to TDD balance using wallet context
    wallet.addBalance('TDD', position.currentValue);

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
    
    toast({
      title: "Position Unstaked",
      description: `You've successfully unstaked your position and received ${position.currentValue.toFixed(2)} TDD.`,
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

  // Waterfall distribution of yield
  const distributeYieldWaterfall = (totalYield: number) => {
    // Calculate performance fee
    const performanceFee = totalYield * DISTRIBUTION_PARAMS.PERFORMANCE_FEE;
    const netYield = totalYield - performanceFee;
    
    // Distribute net yield to tiers in waterfall fashion
    // Safe tier gets fixed rate first
    // Then Conservative tier gets target rate
    // Then Balanced tier gets target rate
    // Hero tier gets any residual yield
    
    // For now just update the protocol yield (simplified)
    updateProtocolYield(netYield);
    processProtocolFees(performanceFee);
    
    toast({
      title: "Yield Distribution Complete",
      description: `${(netYield).toFixed(2)} TDD distributed via waterfall model. ${(performanceFee).toFixed(2)} TDD collected as performance fee.`,
    });
  };
  
  // Waterfall distribution of losses (reverse order)
  const distributeLossWaterfall = (totalLoss: number) => {
    // Use insurance buffer first
    let remainingLoss = totalLoss;
    let insuranceUsed = 0;
    
    if (tcoreState.protocolParams.reserveAmount > 0) {
      insuranceUsed = Math.min(tcoreState.protocolParams.reserveAmount, totalLoss);
      remainingLoss -= insuranceUsed;
      
      // Update reserve
      setTCoreState(prev => ({
        ...prev,
        protocolParams: {
          ...prev.protocolParams,
          reserveAmount: prev.protocolParams.reserveAmount - insuranceUsed
        }
      }));
    }
    
    if (remainingLoss <= 0) {
      toast({
        title: "Loss Fully Absorbed",
        description: `Loss of ${totalLoss.toFixed(2)} TDD fully absorbed by insurance buffer.`,
      });
      return;
    }
    
    // Calculate loss distribution across tiers (reverse waterfall)
    const lossDistribution = calculateLossDistribution(
      remainingLoss,
      tcoreState.protocolParams.reserveAmount,
      tcoreState.liquidityTicks
    );
    
    // Update NFT positions with losses
    setNftPositions(prev => prev.map(position => {
      if (position.status === 'active') {
        const userLoss = calculateUserLoss(position, lossDistribution);
        return {
          ...position,
          currentValue: Math.max(0, position.currentValue - userLoss)
        };
      }
      return position;
    }));
    
    toast({
      title: "Loss Distribution Complete",
      description: `${(remainingLoss).toFixed(2)} TDD loss distributed across tiers. ${insuranceUsed.toFixed(2)} TDD absorbed by insurance.`,
      variant: "destructive",
    });
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
    // Allocate fee according to distribution parameters
    const bonusYield = feeAmount * DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS;
    const buyback = feeAmount * DISTRIBUTION_PARAMS.FEE_ALLOCATION.BUYBACK;
    const protocolRevenue = feeAmount * DISTRIBUTION_PARAMS.FEE_ALLOCATION.PROTOCOL;
    const insuranceBuffer = feeAmount * DISTRIBUTION_PARAMS.FEE_ALLOCATION.INSURANCE;
    
    // Update insurance buffer (add to reserve)
    setTCoreState(prev => ({
      ...prev,
      protocolParams: {
        ...prev.protocolParams,
        protocolFees: prev.protocolParams.protocolFees + feeAmount,
        reserveAmount: prev.protocolParams.reserveAmount + insuranceBuffer
      }
    }));
    
    // In a real implementation, we would also:
    // 1. Distribute bonus yield to underweighted tiers
    // 2. Execute buyback & burn mechanism
    // 3. Send protocol revenue to the treasury
    
    toast({
      title: "Fee Processing Complete",
      description: `${(feeAmount).toFixed(2)} TDD fee allocated: ${(bonusYield).toFixed(2)} bonus, ${(buyback).toFixed(2)} buyback, ${(protocolRevenue).toFixed(2)} revenue, ${(insuranceBuffer).toFixed(2)} insurance.`,
    });
  };
  
  // Auto-distribute function for optimizing position allocation
  const autoDistributePosition = (amount: number): string => {
    const tddBalance = wallet.getAvailableBalance('TDD');
    if (amount > tddBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${amount} TDD but only have ${tddBalance.toFixed(2)} available.`,
        variant: "destructive",
      });
      return '';
    }
    
    // Get current tier distribution
    const tierUtilization = getTierUtilization();
    
    // Target distribution from knowledge document
    const targetDistribution = {
      SAFE: 0.10,
      CONSERVATIVE: 0.20,
      BALANCED: 0.30,
      HERO: 0.40
    };
    
    // Find underweighted tiers (positive delta)
    const underweightedTiers: Array<{ tier: string; delta: number }> = [];
    
    Object.entries(tierUtilization).forEach(([tier, data]) => {
      if (data.delta > 0) {
        underweightedTiers.push({
          tier,
          delta: data.delta
        });
      }
    });
    
    // If all tiers are at or above target, distribute evenly
    if (underweightedTiers.length === 0) {
      // Distribute evenly across all tiers
      const tokenId = createNFTPosition(amount, { start: 1, end: 100 });
      
      toast({
        title: "Even Distribution Applied",
        description: "All tiers are at or above target, so your TDD was distributed evenly across all risk levels.",
      });
      
      return tokenId;
    }
    
    // Calculate total delta to normalize weights
    const totalDelta = underweightedTiers.reduce((sum, tier) => sum + tier.delta, 0);
    
    // Create position for each underweighted tier
    let remainingAmount = amount;
    let mainPositionId = '';
    
    // For simplicity in demo, create one position with the range of the most underweighted tier
    const mostUnderweightedTier = underweightedTiers.reduce(
      (prev, current) => (current.delta > prev.delta ? current : prev),
      underweightedTiers[0]
    );
    
    const tierDef = TIER_DEFINITIONS[mostUnderweightedTier.tier as keyof typeof TIER_DEFINITIONS];
    const riskRange = { start: tierDef.min, end: tierDef.max };
    
    const tokenId = createNFTPosition(amount, riskRange);
    mainPositionId = tokenId;
    
    toast({
      title: "Auto-Distribution Complete",
      description: `Your ${amount.toFixed(2)} TDD was allocated to the ${tierDef.name} tier (${tierDef.min}-${tierDef.max}) which was the most underweighted.`,
    });
    
    return mainPositionId;
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
  
  const getTierUtilization = () => {
    const result: Record<string, { current: number; target: number; delta: number }> = {};
    let totalLiquidity = 0;
    
    // Calculate total liquidity
    tcoreState.liquidityTicks.forEach(tick => {
      totalLiquidity += tick.totalLiquidity;
    });
    
    if (totalLiquidity === 0) {
      // If no liquidity, all tiers are at 0% with full delta to target
      Object.keys(TIER_DEFINITIONS).forEach(tier => {
        const targetWeight = tier === 'SAFE' ? 0.1 : 
                            tier === 'CONSERVATIVE' ? 0.2 : 
                            tier === 'BALANCED' ? 0.3 : 0.4;
        
        result[tier] = {
          current: 0,
          target: targetWeight,
          delta: targetWeight // Full delta since current is 0
        };
      });
      return result;
    }
    
    // Calculate current tier weights
    const tierWeights = {
      SAFE: 0,
      CONSERVATIVE: 0,
      BALANCED: 0,
      HERO: 0
    };
    
    // Sum liquidity by tier
    tcoreState.liquidityTicks.forEach(tick => {
      if (tick.riskLevel >= TIER_DEFINITIONS.SAFE.min && tick.riskLevel <= TIER_DEFINITIONS.SAFE.max) {
        tierWeights.SAFE += tick.totalLiquidity;
      } else if (tick.riskLevel >= TIER_DEFINITIONS.CONSERVATIVE.min && tick.riskLevel <= TIER_DEFINITIONS.CONSERVATIVE.max) {
        tierWeights.CONSERVATIVE += tick.totalLiquidity;
      } else if (tick.riskLevel >= TIER_DEFINITIONS.BALANCED.min && tick.riskLevel <= TIER_DEFINITIONS.BALANCED.max) {
        tierWeights.BALANCED += tick.totalLiquidity;
      } else if (tick.riskLevel >= TIER_DEFINITIONS.HERO.min && tick.riskLevel <= TIER_DEFINITIONS.HERO.max) {
        tierWeights.HERO += tick.totalLiquidity;
      }
    });
    
    // Calculate percentages and delta from target
    Object.keys(tierWeights).forEach(tier => {
      const currentWeight = tierWeights[tier as keyof typeof tierWeights] / totalLiquidity;
      const targetWeight = tier === 'SAFE' ? 0.1 : 
                          tier === 'CONSERVATIVE' ? 0.2 : 
                          tier === 'BALANCED' ? 0.3 : 0.4;
      
      result[tier] = {
        current: currentWeight,
        target: targetWeight,
        delta: targetWeight - currentWeight // Positive means underweight
      };
    });
    
    return result;
  };

  return (
    <TCoreContext.Provider value={{
      tcoreState,
      nftPositions,
      stakingMode,
      setStakingMode,
      createNFTPosition,
      burnNFTPosition,
      updateProtocolYield,
      updateReserveAmount,
      processProtocolFees,
      distributeYieldWaterfall,
      distributeLossWaterfall,
      autoDistributePosition,
      getUserYieldForPosition,
      getUserLossForPosition,
      getTotalUserTVL,
      getProtocolMetrics,
      getTierUtilization,
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
