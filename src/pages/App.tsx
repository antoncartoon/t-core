
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

        <Tabs defaultValue="deposit" className="space-y-6 sm:space-y-12">
          <TabsList className="grid w-full grid-cols-2 max-w-xs sm:max-w-sm mx-auto bg-muted/50 h-10 sm:h-auto">
            <TabsTrigger value="deposit" className="text-xs sm:text-sm h-8 sm:h-auto">Deposit</TabsTrigger>
            <TabsTrigger value="stake" className="text-xs sm:text-sm h-8 sm:h-auto">Stake</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-6 sm:space-y-12">
            {isMobile ? (
              <div className="space-y-6">
                <MobileDepositCard />
                <div className="px-4 space-y-4">
                  <h3 className="text-lg font-medium text-center">How it works</h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: "Deposit Stablecoins",
                        description: "Deposit your USDT or USDC to start earning yield"
                      },
                      {
                        step: 2,
                        title: "Mint TDD",
                        description: "Receive TDD tokens 1:1 for your deposited stablecoins"
                      },
                      {
                        step: 3,
                        title: "Auto-Deploy to DeFi",
                        description: "Your stablecoins are automatically deployed to optimal DeFi strategies"
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="flex justify-center lg:justify-start">
                  <DepositCard />
                </div>
                <div className="space-y-6 sm:space-y-8">
                  <h3 className="text-xl font-medium">How it works</h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Deposit Stablecoins</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Deposit your USDT or USDC to start earning yield
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Mint TDD</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Receive TDD tokens 1:1 for your deposited stablecoins
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Auto-Deploy to DeFi</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your stablecoins are automatically deployed to optimal DeFi strategies
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
                  <h3 className="text-lg font-medium text-center">Staking Strategies</h3>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Conservative",
                        description: "Low risk, stable returns through blue-chip DeFi protocols",
                        risk: "0-33%",
                        apy: "2-6%",
                        color: "text-green-600"
                      },
                      {
                        name: "Moderate",
                        description: "Balanced approach with diversified yield farming",
                        risk: "34-66%",
                        apy: "6-15%",
                        color: "text-yellow-600"
                      },
                      {
                        name: "Aggressive",
                        description: "High-yield strategies with elevated risk exposure",
                        risk: "67-100%",
                        apy: "15-25%",
                        color: "text-red-600"
                      }
                    ].map((strategy) => (
                      <div key={strategy.name} className="p-4 border border-border rounded-lg">
                        <h4 className={`font-medium ${strategy.color} mb-2`}>{strategy.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {strategy.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Risk: {strategy.risk} | APY: {strategy.apy}
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
                  <h3 className="text-xl font-medium text-center sm:text-left">Staking Strategies</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 border border-border rounded-lg">
                      <h4 className="font-medium text-green-600 mb-2">Conservative</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Low risk, stable returns through blue-chip DeFi protocols
                      </p>
                      <p className="text-xs text-muted-foreground">Risk: 0-33% | APY: 2-6%</p>
                    </div>
                    <div className="p-4 sm:p-6 border border-border rounded-lg">
                      <h4 className="font-medium text-yellow-600 mb-2">Moderate</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Balanced approach with diversified yield farming
                      </p>
                      <p className="text-xs text-muted-foreground">Risk: 34-66% | APY: 6-15%</p>
                    </div>
                    <div className="p-4 sm:p-6 border border-border rounded-lg sm:col-span-2 lg:col-span-1">
                      <h4 className="font-medium text-red-600 mb-2">Aggressive</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        High-yield strategies with elevated risk exposure
                      </p>
                      <p className="text-xs text-muted-foreground">Risk: 67-100% | APY: 15-25%</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default App;
