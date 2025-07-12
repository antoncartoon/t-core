import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DistributionState, UnclaimedYield } from '@/types/redeem';

interface DistributionContextType {
  distributionState: DistributionState;
  unclaimedYields: UnclaimedYield[];
  
  // Timer functions
  getTimeToNextDistribution: () => number; // milliseconds
  getFormattedTimeToNext: () => string;
  
  // Yield management
  addUnclaimedYield: (positionId: string, amount: number) => void;
  claimYield: (positionId: string) => number;
  getTotalUnclaimedYield: () => number;
  
  // Distribution operations
  processDistribution: () => void;
  forceDistribution: () => void; // For testing
}

const DistributionContext = createContext<DistributionContextType | undefined>(undefined);

export const DistributionProvider = ({ children }: { children: ReactNode }) => {
  const [distributionState, setDistributionState] = useState<DistributionState>({
    isActive: true,
    nextDistributionTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    lastDistributionTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    intervalHours: 48,
    totalPendingYield: 0,
    distributionHistory: []
  });

  const [unclaimedYields, setUnclaimedYields] = useState<UnclaimedYield[]>([]);

  // Update distribution timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now >= distributionState.nextDistributionTime) {
        processDistribution();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [distributionState.nextDistributionTime]);

  const getTimeToNextDistribution = (): number => {
    return Math.max(0, distributionState.nextDistributionTime.getTime() - Date.now());
  };

  const getFormattedTimeToNext = (): string => {
    const msLeft = getTimeToNextDistribution();
    const hours = Math.floor(msLeft / (1000 * 60 * 60));
    const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const addUnclaimedYield = (positionId: string, amount: number) => {
    setUnclaimedYields(prev => {
      const existing = prev.find(y => y.positionId === positionId);
      
      if (existing) {
        return prev.map(y => 
          y.positionId === positionId 
            ? { 
                ...y, 
                amount: y.amount + amount,
                lastAccrualDate: new Date()
              }
            : y
        );
      } else {
        const newYield: UnclaimedYield = {
          positionId,
          amount,
          lastAccrualDate: new Date(),
          nextDistributionDate: distributionState.nextDistributionTime,
          dailyAccrual: amount / distributionState.intervalHours * 24 // Daily rate
        };
        return [...prev, newYield];
      }
    });

    // Update total pending yield
    setDistributionState(prev => ({
      ...prev,
      totalPendingYield: prev.totalPendingYield + amount
    }));
  };

  const claimYield = (positionId: string): number => {
    const yieldData = unclaimedYields.find(y => y.positionId === positionId);
    if (!yieldData) return 0;

    const claimedAmount = yieldData.amount;
    
    // Remove from unclaimed yields
    setUnclaimedYields(prev => prev.filter(y => y.positionId !== positionId));
    
    // Update total pending yield
    setDistributionState(prev => ({
      ...prev,
      totalPendingYield: Math.max(0, prev.totalPendingYield - claimedAmount)
    }));

    return claimedAmount;
  };

  const getTotalUnclaimedYield = (): number => {
    return unclaimedYields.reduce((sum, y) => sum + y.amount, 0);
  };

  const processDistribution = () => {
    const now = new Date();
    const totalDistributed = distributionState.totalPendingYield;
    const recipientCount = unclaimedYields.length;

    if (totalDistributed > 0 && recipientCount > 0) {
      // Create distribution event
      const distributionEvent = {
        id: `dist_${Date.now()}`,
        timestamp: now,
        totalYieldDistributed: totalDistributed,
        recipientCount,
        avgYieldPerRecipient: totalDistributed / recipientCount
      };

      // Update distribution state
      setDistributionState(prev => ({
        ...prev,
        lastDistributionTime: now,
        nextDistributionTime: new Date(now.getTime() + prev.intervalHours * 60 * 60 * 1000),
        totalPendingYield: 0,
        distributionHistory: [distributionEvent, ...prev.distributionHistory.slice(0, 9)] // Keep last 10
      }));

      // Clear unclaimed yields (they become claimable)
      setUnclaimedYields([]);
    } else {
      // No yield to distribute, just update timer
      setDistributionState(prev => ({
        ...prev,
        nextDistributionTime: new Date(now.getTime() + prev.intervalHours * 60 * 60 * 1000)
      }));
    }
  };

  const forceDistribution = () => {
    processDistribution();
  };

  return (
    <DistributionContext.Provider value={{
      distributionState,
      unclaimedYields,
      getTimeToNextDistribution,
      getFormattedTimeToNext,
      addUnclaimedYield,
      claimYield,
      getTotalUnclaimedYield,
      processDistribution,
      forceDistribution
    }}>
      {children}
    </DistributionContext.Provider>
  );
};

export const useDistribution = () => {
  const context = useContext(DistributionContext);
  if (context === undefined) {
    throw new Error('useDistribution must be used within a DistributionProvider');
  }
  return context;
};