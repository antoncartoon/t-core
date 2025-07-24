
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isConnected: boolean;
  user: User | null;
  session: Session | null;
  walletAddress: string;
  userRole: 'admin' | 'user' | null;
  connect: (provider?: string) => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isConnected = !!session && !!user;

  // Fetch user role from database
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Extract wallet info from user metadata  
          const metadata = session.user.user_metadata;
          setWalletAddress(metadata?.wallet_address || '');
          
          // Fetch user role
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setWalletAddress('');
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setWalletAddress(metadata?.wallet_address || '');
        fetchUserRole(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const connect = async (provider?: string) => {
    setIsLoading(true);
    
    try {
      let walletAddress = '';
      
      // Real wallet connection based on provider
      if (provider === 'metamask') {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          walletAddress = accounts[0];
        } else {
          throw new Error('MetaMask not installed');
        }
      } else if (provider === 'walletconnect') {
        // For now, generate a mock address for WalletConnect (real implementation would use WalletConnect SDK)  
        walletAddress = '0x' + Math.random().toString(16).substr(2, 40);
      } else if (provider === 'coinbase') {
        // For now, generate a mock address for Coinbase (real implementation would use Coinbase SDK)
        walletAddress = '0x' + Math.random().toString(16).substr(2, 40);
      } else {
        // Social login fallback - generate anonymous session
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        return;
      }

      if (!walletAddress) {
        throw new Error('Failed to get wallet address');
      }

      // Create a message for the user to sign
      const message = `Sign this message to authenticate with TCore Finance.\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;
      
      let signature = '';
      if (provider === 'metamask' && window.ethereum) {
        try {
          signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, walletAddress],
          });
        } catch (signError) {
          console.error('Signature failed:', signError);
          throw new Error('User rejected signature request');
        }
      } else {
        // For other providers, use a mock signature for now
        signature = 'mock_signature_' + Math.random().toString(36);
      }

      // Authenticate with Supabase using wallet address
      const { data, error } = await supabase.auth.signUp({
        email: `${walletAddress.toLowerCase()}@wallet.local`,
        password: signature.slice(0, 32), // Use first 32 chars of signature as password
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            wallet_address: walletAddress,
            wallet_provider: provider || 'unknown',
            display_name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
            signature: signature
          }
        }
      });

      if (error) {
        // If user exists, try to sign in instead
        if (error.message.includes('already registered')) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: `${walletAddress.toLowerCase()}@wallet.local`,
            password: signature.slice(0, 32)
          });
          
          if (signInError) throw signInError;
        } else {
          throw error;
        }
      }
      
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isConnected,
      user,
      session,
      walletAddress,
      userRole,
      connect,
      disconnect,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
