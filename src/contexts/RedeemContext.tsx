import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RedeemQueue, RedeemSettings, BufferState, UniswapRoute } from '@/types/redeem';

interface RedeemContextType {
  // Buffer management
  bufferState: BufferState;
  updateBufferState: (newState: Partial<BufferState>) => void;
  
  // Queue management
  redeemQueue: RedeemQueue[];
  addToQueue: (tddAmount: number) => string;
  removeFromQueue: (queueId: string) => boolean;
  getQueuePosition: (queueId: string) => number;
  
  // Instant redeem
  redeemInstant: (tddAmount: number) => Promise<boolean>;
  checkInstantRedeemAvailable: (amount: number) => boolean;
  
  // Uniswap integration
  getUniswapRoute: (tddAmount: number) => Promise<UniswapRoute>;
  redeemViaUniswap: (tddAmount: number) => Promise<boolean>;
  
  // Settings
  redeemSettings: RedeemSettings;
  updateSettings: (newSettings: Partial<RedeemSettings>) => void;
  
  // Fee calculation
  calculateRedeemFee: (amount: number, method: 'instant' | 'queue' | 'uniswap') => number;
}

const RedeemContext = createContext<RedeemContextType | undefined>(undefined);

export const RedeemProvider = ({ children }: { children: ReactNode }) => {
  const [redeemQueue, setRedeemQueue] = useState<RedeemQueue[]>([]);
  
  const [bufferState, setBufferState] = useState<BufferState>({
    totalUSDC: 100000,
    availableUSDC: 85000,
    reservedForQueue: 15000,
    utilizationPercent: 85,
    status: 'healthy',
    dailyInflow: 5000,
    dailyOutflow: 3200
  });

  const [redeemSettings, setRedeemSettings] = useState<RedeemSettings>({
    instantRedeemLimit: 10000,
    uniswapRedeemLimit: 5000,
    queueThreshold: 25000,
    baseFeePercent: 0.1, // 0.1%
    bufferLow: 0.3, // 30%
    bufferCritical: 0.15 // 15%
  });

  const updateBufferState = (newState: Partial<BufferState>) => {
    setBufferState(prev => {
      const updated = { ...prev, ...newState };
      
      // Update status based on utilization
      if (updated.utilizationPercent >= 85) {
        updated.status = 'critical';
      } else if (updated.utilizationPercent >= 60) {
        updated.status = 'low';
      } else {
        updated.status = 'healthy';
      }
      
      return updated;
    });
  };

  const addToQueue = (tddAmount: number): string => {
    const queueId = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fee = calculateRedeemFee(tddAmount, 'queue');
    const estimatedCompletionTime = new Date(Date.now() + (redeemQueue.length * 24 * 60 * 60 * 1000)); // 1 day per position
    
    const newQueueItem: RedeemQueue = {
      id: queueId,
      userId: 'user',
      tddAmount,
      usdcExpected: tddAmount - fee,
      fee,
      position: redeemQueue.length + 1,
      estimatedCompletionTime,
      status: 'pending',
      createdAt: new Date()
    };

    setRedeemQueue(prev => [...prev, newQueueItem]);
    return queueId;
  };

  const removeFromQueue = (queueId: string): boolean => {
    setRedeemQueue(prev => prev.filter(item => item.id !== queueId));
    return true;
  };

  const getQueuePosition = (queueId: string): number => {
    const item = redeemQueue.find(q => q.id === queueId);
    return item ? item.position : -1;
  };

  const checkInstantRedeemAvailable = (amount: number): boolean => {
    return amount <= redeemSettings.instantRedeemLimit && 
           amount <= bufferState.availableUSDC &&
           bufferState.status !== 'critical';
  };

  const redeemInstant = async (tddAmount: number): Promise<boolean> => {
    if (!checkInstantRedeemAvailable(tddAmount)) {
      return false;
    }

    // Simulate instant redemption
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fee = calculateRedeemFee(tddAmount, 'instant');
    const usdcAmount = tddAmount - fee;
    
    // Update buffer
    updateBufferState({
      availableUSDC: bufferState.availableUSDC - usdcAmount,
      utilizationPercent: ((bufferState.totalUSDC - bufferState.availableUSDC + usdcAmount) / bufferState.totalUSDC) * 100
    });
    
    return true;
  };

  const getUniswapRoute = async (tddAmount: number): Promise<UniswapRoute> => {
    // Simulate Uniswap quote
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const baseRate = 0.998; // 99.8% exchange rate
    const priceImpact = Math.min(tddAmount / 50000, 0.05); // Max 5% impact
    const slippage = 0.005; // 0.5% slippage
    
    return {
      tddAmount,
      expectedUSDC: tddAmount * baseRate * (1 - priceImpact - slippage),
      priceImpact,
      slippage,
      gasEstimate: 0.002, // ETH
      isAvailable: tddAmount <= redeemSettings.uniswapRedeemLimit
    };
  };

  const redeemViaUniswap = async (tddAmount: number): Promise<boolean> => {
    const route = await getUniswapRoute(tddAmount);
    if (!route.isAvailable) return false;

    // Simulate Uniswap swap
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  };

  const updateSettings = (newSettings: Partial<RedeemSettings>) => {
    setRedeemSettings(prev => ({ ...prev, ...newSettings }));
  };

  const calculateRedeemFee = (amount: number, method: 'instant' | 'queue' | 'uniswap'): number => {
    let feeMultiplier = 1;
    
    // Higher fees during low buffer
    if (bufferState.status === 'low') {
      feeMultiplier = 1.5;
    } else if (bufferState.status === 'critical') {
      feeMultiplier = 2.0;
    }
    
    // Method-specific fees
    switch (method) {
      case 'instant':
        return amount * redeemSettings.baseFeePercent * 0.01 * feeMultiplier;
      case 'queue':
        return amount * redeemSettings.baseFeePercent * 0.01 * 0.5; // 50% discount for queue
      case 'uniswap':
        return 0; // No protocol fee, just DEX fees
      default:
        return amount * redeemSettings.baseFeePercent * 0.01;
    }
  };

  return (
    <RedeemContext.Provider value={{
      bufferState,
      updateBufferState,
      redeemQueue,
      addToQueue,
      removeFromQueue,
      getQueuePosition,
      redeemInstant,
      checkInstantRedeemAvailable,
      getUniswapRoute,
      redeemViaUniswap,
      redeemSettings,
      updateSettings,
      calculateRedeemFee
    }}>
      {children}
    </RedeemContext.Provider>
  );
};

export const useRedeem = () => {
  const context = useContext(RedeemContext);
  if (context === undefined) {
    throw new Error('useRedeem must be used within a RedeemProvider');
  }
  return context;
};