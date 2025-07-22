
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isConnected: boolean;
  walletAddress: string;
  connect: (provider?: string) => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing connection on load
  useEffect(() => {
    const savedConnection = localStorage.getItem('tcore_wallet_connected');
    const savedAddress = localStorage.getItem('tcore_wallet_address');
    
    if (savedConnection === 'true' && savedAddress) {
      setIsConnected(true);
      setWalletAddress(savedAddress);
    }
    
    setIsLoading(false);
  }, []);

  const connect = async (provider?: string) => {
    setIsLoading(true);
    
    try {
      // Simulate connection delay (replace with real Dynamic.xyz integration)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock wallet address generation
      const mockAddress = '0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef';
      
      setIsConnected(true);
      setWalletAddress(mockAddress);
      
      // Save connection state
      localStorage.setItem('tcore_wallet_connected', 'true');
      localStorage.setItem('tcore_wallet_address', mockAddress);
      localStorage.setItem('tcore_wallet_provider', provider || 'unknown');
      
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    
    // Clear saved connection state
    localStorage.removeItem('tcore_wallet_connected');
    localStorage.removeItem('tcore_wallet_address');
    localStorage.removeItem('tcore_wallet_provider');
  };

  return (
    <AuthContext.Provider value={{
      isConnected,
      walletAddress,
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
