
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WalletConnect from '@/components/WalletConnect';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isConnected, connect, isLoading } = useAuth();

  // Show loading state during initial connection check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Checking wallet connection...</p>
        </div>
      </div>
    );
  }

  // If not connected, show wallet connect screen
  if (!isConnected) {
    return <WalletConnect onConnect={connect} />;
  }

  // If connected, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
