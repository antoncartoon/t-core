import { useState } from 'react';
import { toast } from 'sonner';

interface RebalancingState {
  isPending: boolean;
  lastRebalance: {
    tokenId: string;
    oldRange: { start: number; end: number };
    newRange: { start: number; end: number };
    expectedAPYChange: number;
  } | null;
}

export const usePositionRebalancing = () => {
  const [rebalancingState, setRebalancingState] = useState<RebalancingState>({
    isPending: false,
    lastRebalance: null
  });

  const handleRebalancing = async (
    tokenId: string,
    oldRange: { start: number; end: number },
    newRange: { start: number; end: number },
    expectedAPYChange: number
  ) => {
    setRebalancingState(prev => ({ ...prev, isPending: true }));
    
    try {
      // In a real implementation, this would call the contract
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // The specific message highlights the transparency about the performance fee
      toast.success(
        'Position rebalancing scheduled for next epoch. Performance fee will be applied to yields.'
      );
      
      setRebalancingState({
        isPending: false,
        lastRebalance: {
          tokenId,
          oldRange,
          newRange,
          expectedAPYChange
        }
      });
    } catch (error) {
      toast.error('Failed to rebalance position');
      setRebalancingState(prev => ({ ...prev, isPending: false }));
    }
  };

  return {
    rebalancingState,
    handleRebalancing
  };
};