
import React, { useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TCoreProvider } from '@/contexts/TCoreContext';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import DepositCard from '@/components/DepositCard';
import { RedeemCard } from '@/components/RedeemCard';
import ComprehensiveStakingDashboard from '@/components/ComprehensiveStakingDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, PlusCircle, ArrowRightLeft, BarChart3, Wallet } from 'lucide-react';

const App = () => {
  const { isConnected } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // This component is now wrapped in ProtectedRoute, so isConnected should always be true
  return (
    <TCoreProvider>
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
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                TDD Mint/Redeem
              </TabsTrigger>
              <TabsTrigger value="staking" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Staking
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
                  <DepositCard />
                  <RedeemCard />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-auto p-4"
                    onClick={() => handleTabChange('staking')}
                  >
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium">Start Staking</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Stake TDD in risk tiers to earn yield
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-auto p-4"
                    onClick={() => handleTabChange('portfolio')}
                  >
                    <div className="text-center">
                      <PlusCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium">View Positions</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Manage your positions and track performance
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Staking Tab */}
            <TabsContent value="staking" className="space-y-6">
              <ComprehensiveStakingDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TCoreProvider>
  );
};

export default App;
