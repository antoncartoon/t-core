
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import YieldSources from '@/components/YieldSources';

const DeFi = () => {
  const { isConnected } = useAuth();

  // This component is now wrapped in ProtectedRoute, so isConnected should always be true
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light mb-2">
                DeFi Strategies
              </h1>
              <p className="text-muted-foreground">
                Explore the underlying protocols and strategies powering T-Core yields
              </p>
            </div>
          </div>
        </div>

        <YieldSources />
      </main>
    </div>
  );
};

export default DeFi;
