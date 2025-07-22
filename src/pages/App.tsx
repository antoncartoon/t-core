
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import DepositCard from '@/components/DepositCard';
import MobileDepositCard from '@/components/MobileDepositCard';
import StakingCard from '@/components/StakingCard';
import MobileStakingCard from '@/components/MobileStakingCard';
import RangeStakingCard from '@/components/RangeStakingCard';
import RedeemCard from '@/components/RedeemCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const isMobile = useIsMobile();
  const walletAddress = isConnected ? "0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" : "";

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isConnected={isConnected} 
        onConnect={handleConnect} 
        walletAddress={walletAddress}
      />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <StatsOverview />
        </div>

        <Tabs defaultValue="deposit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {isMobile ? <MobileDepositCard /> : <DepositCard />}
              <RedeemCard />
            </div>
          </TabsContent>

          <TabsContent value="stake" className="space-y-6">
            <div className="space-y-6">
              {/* Main Staking Interface */}
              <RangeStakingCard />
              
              {/* Key Features Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Daily Accrual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Yields accrue daily based on protocol performance and your risk tier. 
                      Higher risk tiers earn residual yields after lower tiers are paid.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      Instant Unstake
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Withdraw your position instantly at any time. No lock-up periods, 
                      giving you full control over your liquidity.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      48H Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Yields are distributed every 48 hours using the waterfall model. 
                      Lower risk tiers receive guaranteed yields first.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* AI Portfolio Optimization - In Development */}
              <Card className="border-dashed border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      AI Portfolio Optimization
                    </CardTitle>
                    <Badge variant="outline" className="border-purple-500 text-purple-600">
                      В разработке
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      AI-powered portfolio optimization будет доступен в следующих версиях. 
                      Функция будет анализировать ваши позиции и предлагать оптимальные стратегии распределения ликвидности.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default App;
