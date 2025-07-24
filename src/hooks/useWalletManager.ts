import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Wallet {
  id: string;
  address: string;
  provider: string;
  is_primary: boolean;
  chain_id: number;
  created_at: string;
}

export const useWalletManager = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, walletAddress } = useAuth();
  const { toast } = useToast();

  // Fetch user's wallets
  const fetchWallets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create wallet entry when user connects
  const createWallet = async (address: string, provider: string, chainId: number = 1) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          address: address,
          provider: provider,
          chain_id: chainId,
          is_primary: wallets.length === 0 // First wallet is primary
        })
        .select()
        .single();

      if (error) throw error;

      setWallets(prev => [data, ...prev]);
      
      toast({
        title: "Wallet Connected",
        description: `${provider} wallet connected successfully`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating wallet:', error);
      toast({
        title: "Wallet Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Set primary wallet
  const setPrimaryWallet = async (walletId: string) => {
    if (!user) return;

    try {
      // Remove primary flag from all wallets
      await supabase
        .from('wallets')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Set new primary wallet
      const { error } = await supabase
        .from('wallets')
        .update({ is_primary: true })
        .eq('id', walletId);

      if (error) throw error;

      // Update local state
      setWallets(prev => 
        prev.map(wallet => ({
          ...wallet,
          is_primary: wallet.id === walletId
        }))
      );

      toast({
        title: "Primary Wallet Updated",
        description: "Primary wallet has been changed successfully",
      });
    } catch (error: any) {
      console.error('Error setting primary wallet:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update primary wallet",
        variant: "destructive",
      });
    }
  };

  // Remove wallet
  const removeWallet = async (walletId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', walletId);

      if (error) throw error;

      setWallets(prev => prev.filter(wallet => wallet.id !== walletId));
      
      toast({
        title: "Wallet Removed",
        description: "Wallet has been removed successfully",
      });
    } catch (error: any) {
      console.error('Error removing wallet:', error);
      toast({
        title: "Removal Failed",
        description: error.message || "Failed to remove wallet",
        variant: "destructive",
      });
    }
  };

  // Get primary wallet
  const getPrimaryWallet = () => {
    return wallets.find(wallet => wallet.is_primary);
  };

  // Initialize wallet on first connection
  useEffect(() => {
    if (user && walletAddress && wallets.length === 0 && !isLoading) {
      // Create wallet entry for newly connected user
      createWallet(walletAddress, 'mock', 1);
    }
  }, [user, walletAddress, wallets.length, isLoading]);

  useEffect(() => {
    fetchWallets();
  }, [user]);

  return {
    wallets,
    isLoading,
    createWallet,
    setPrimaryWallet,
    removeWallet,
    getPrimaryWallet,
    refetch: fetchWallets
  };
};