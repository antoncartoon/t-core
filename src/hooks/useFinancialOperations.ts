import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFinancialOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mintTDD = async (amount: number, tokenSymbol: string = 'USDC') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mint-tdd', {
        body: { amount, tokenSymbol }
      });

      if (error) throw error;

      toast({
        title: "Minting Successful",
        description: `Successfully minted ${amount} TDD tokens`,
      });

      return data;
    } catch (error: any) {
      console.error('Mint TDD error:', error);
      toast({
        title: "Minting Failed",
        description: error.message || 'Failed to mint TDD tokens',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const redeemTDD = async (amount: number, tokenSymbol: string = 'TDD') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-tdd', {
        body: { amount, tokenSymbol }
      });

      if (error) throw error;

      toast({
        title: "Redemption Successful",
        description: `Successfully redeemed ${amount} TDD for USDC`,
      });

      return data;
    } catch (error: any) {
      console.error('Redeem TDD error:', error);
      toast({
        title: "Redemption Failed",
        description: error.message || 'Failed to redeem TDD tokens',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createStakingPosition = async (amount: number, desiredApy: number, riskScore: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-staking-position', {
        body: { amount, desiredApy, riskScore }
      });

      if (error) throw error;

      toast({
        title: "Staking Position Created",
        description: `Successfully created staking position with ${amount} TDD`,
      });

      return data;
    } catch (error: any) {
      console.error('Create staking position error:', error);
      toast({
        title: "Staking Failed",
        description: error.message || 'Failed to create staking position',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintTDD,
    redeemTDD,
    createStakingPosition,
    isLoading
  };
};