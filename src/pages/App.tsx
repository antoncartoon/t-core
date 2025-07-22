
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import DepositCard from '@/components/DepositCard';
import { RedeemCard } from '@/components/RedeemCard';
import { Button } from '@/components/ui/button';
import { TrendingUp, PlusCircle, ArrowRightLeft } from 'lucide-react';

const App = () => {
  const { isConnected } = useAuth();

  // This component is now wrapped in ProtectedRoute, so isConnected should always be true
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">T-Core Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your TDD tokens and staking positions
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <NavLink to="/staking">
              <Button className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Go to Staking
              </Button>
            </NavLink>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Mint/Redeem Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Mint & Redeem TDD</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            First step: Convert USDC to TDD tokens for staking, or redeem TDD back to USDC
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
            <DepositCard />
            <RedeemCard />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-muted/30 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NavLink to="/staking">
              <Button variant="outline" className="w-full h-auto p-4">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-medium">Start Staking</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Stake TDD in risk tiers to earn yield
                  </div>
                </div>
              </Button>
            </NavLink>
            
            <NavLink to="/portfolio">
              <Button variant="outline" className="w-full h-auto p-4">
                <div className="text-center">
                  <PlusCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-medium">View Portfolio</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Manage your positions and track performance
                  </div>
                </div>
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
