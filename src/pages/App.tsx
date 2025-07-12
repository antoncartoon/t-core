
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import MobileStatsOverview from '@/components/MobileStatsOverview';
import DepositCard from '@/components/DepositCard';
import MobileDepositCard from '@/components/MobileDepositCard';
import StakingCard from '@/components/StakingCard';
import MobileStakingCard from '@/components/MobileStakingCard';
import WalletConnect from '@/components/WalletConnect';
import { RedeemCard } from '@/components/RedeemCard';
import { DistributionTimer } from '@/components/DistributionTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RedeemProvider } from '@/contexts/RedeemContext';
import { DistributionProvider } from '@/contexts/DistributionContext';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const isMobile = useIsMobile();

  const handleConnect = (provider?: string) => {
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef');
    }, 1500);
  };

  if (!isConnected) {
    return <WalletConnect onConnect={handleConnect} />;
  }

  return (
    <RedeemProvider>
      <DistributionProvider>
        <div className="min-h-screen bg-background">
          <Header 
            isConnected={isConnected} 
            onConnect={handleConnect}
            walletAddress={walletAddress}
          />
          
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-8 sm:mb-16 text-center">
          <h1 className="text-2xl sm:text-4xl font-light text-foreground mb-3 sm:mb-4 tracking-tight">
            T-Core Protocol
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
            Stake your stablecoins, mint TDD, and earn yield through optimized DeFi strategies
          </p>
        </div>

        {isMobile ? <MobileStatsOverview /> : <StatsOverview />}

        {/* Distribution Timer */}
        <div className="mb-6">
          <DistributionTimer />
        </div>

        <Tabs defaultValue="deposit" className="space-y-6 sm:space-y-12">
          <TabsList className="grid w-full grid-cols-2 max-w-xs sm:max-w-sm mx-auto bg-muted/50 h-10 sm:h-auto">
            <TabsTrigger value="deposit" className="text-xs sm:text-sm h-8 sm:h-auto">Deposit & Redeem</TabsTrigger>
            <TabsTrigger value="stake" className="text-xs sm:text-sm h-8 sm:h-auto">Stake & Yield</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-6 sm:space-y-12">
            {isMobile ? (
              <div className="space-y-6">
                <MobileDepositCard />
                {/* Mobile Redeem Card would go here */}
                <div className="px-4 space-y-4">
                  <h3 className="text-lg font-medium text-center">Deposit & Redeem</h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: "Mint TDD",
                        description: "Deposit USDC and receive TDD tokens 1:1"
                      },
                      {
                        step: 2,
                        title: "Instant Redeem",
                        description: "Convert TDD back to USDC instantly from protocol buffer"
                      },
                      {
                        step: 3,
                        title: "Queue Redeem",
                        description: "Large amounts can use the redemption queue with lower fees"
                      },
                      {
                        step: 4,
                        title: "Uniswap Route",
                        description: "Trade smaller amounts via DEX for immediate settlement"
                      }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-medium mb-1 text-sm">{item.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex justify-center">
                  <DepositCard />
                </div>
                <div className="flex justify-center">
                  <RedeemCard />
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium">Deposit & Redeem</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Mint TDD</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Convert USDC to TDD tokens at 1:1 ratio
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Instant Redeem</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Get USDC back instantly from protocol buffer
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Queue System</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Large redemptions use queue for better rates
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">DEX Routing</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Small amounts route through Uniswap automatically
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stake" className="space-y-6 sm:space-y-12">
            {isMobile ? (
              <div className="space-y-6">
                <MobileStakingCard />
                <div className="px-4 space-y-4">
                  <h3 className="text-lg font-medium text-center">Yield Earning</h3>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Daily Accrual",
                        description: "Yield accrues daily based on protocol performance",
                        info: "Real-time tracking",
                        color: "text-green-600"
                      },
                      {
                        name: "48H Distribution",
                        description: "Accumulated yield distributed every 48 hours",
                        info: "Predictable schedule",
                        color: "text-blue-600"
                      },
                      {
                        name: "Instant Unstake",
                        description: "Exit positions immediately without lock periods",
                        info: "No penalties",
                        color: "text-purple-600"
                      }
                    ].map((strategy) => (
                      <div key={strategy.name} className="p-4 border border-border rounded-lg">
                        <h4 className={`font-medium ${strategy.color} mb-2`}>{strategy.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {strategy.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {strategy.info}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <StakingCard />
                </div>
                
                <div className="space-y-6 sm:space-y-8">
                  <h3 className="text-xl font-medium text-center sm:text-left">Yield Mechanics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 border border-border rounded-lg">
                      <h4 className="font-medium text-green-600 mb-2">Daily Accrual</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Yield accrues daily based on protocol performance and your position risk level
                      </p>
                      <p className="text-xs text-muted-foreground">Real-time tracking</p>
                    </div>
                    <div className="p-4 sm:p-6 border border-border rounded-lg">
                      <h4 className="font-medium text-blue-600 mb-2">48H Distribution</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Accumulated yield is distributed every 48 hours to all eligible positions
                      </p>
                      <p className="text-xs text-muted-foreground">Predictable schedule</p>
                    </div>
                    <div className="p-4 sm:p-6 border border-border rounded-lg sm:col-span-2 lg:col-span-1">
                      <h4 className="font-medium text-purple-600 mb-2">Instant Unstake</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Exit positions immediately without lock periods. Unclaimed yield stays in pool.
                      </p>
                      <p className="text-xs text-muted-foreground">No penalties</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
          </main>
        </div>
      </DistributionProvider>
    </RedeemProvider>
  );
};

export default App;
