
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
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock wallet address
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      
      // Sign up/in with Supabase using wallet address as identifier
      const { data, error } = await supabase.auth.signUp({
        email: `${mockAddress}@wallet.local`,
        password: mockAddress, // In real implementation, use proper wallet signature
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            wallet_address: mockAddress,
            wallet_provider: provider || 'unknown',
            display_name: `Wallet ${mockAddress.slice(0, 8)}...`
          }
        }
      });

      if (error) {
        // If user exists, try to sign in instead
        if (error.message.includes('already registered')) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: `${mockAddress}@wallet.local`,
            password: mockAddress
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
