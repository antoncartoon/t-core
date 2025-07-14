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

const Index = () => {
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
            T-Core Finance
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
            Mathematical precision meets DeFi innovation. Choose your T-Core tier and earn sustainable yields.
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
                        title: "Mint tkchUSD",
                        description: "Receive tkchUSD tokens 1:1 for your deposited stablecoins"
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
                        <h4 className="font-medium mb-1">Mint tkchUSD</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Receive tkchUSD tokens 1:1 for your deposited stablecoins
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
                        name: "Safe",
                        description: "T-Bill +20% guaranteed, zero loss risk",
                        risk: "1-3",
                        apy: "6.0%",
                        color: "text-green-600"
                      },
                      {
                        name: "Conservative",
                        description: "Stable yield, minimal drawdown risk",
                        risk: "4-24",
                        apy: "9.0%",
                        color: "text-blue-600"
                      },
                      {
                        name: "Balanced",
                        description: "Optimal risk/reward, diversified exposure",
                        risk: "25-80",
                        apy: "16.0%",
                        color: "text-yellow-600"
                      },
                      {
                        name: "T-Core HERO",
                        description: "Pool insurance provider - maximum yield for heroes",
                        risk: "81-100",
                        apy: "35.0%",
                        color: "text-purple-600"
                      }
                    ].map((strategy) => (
                      <div key={strategy.name} className="p-4 border border-border rounded-lg">
                        <h4 className={`font-medium ${strategy.color} mb-2`}>
                          {strategy.name}
                          {strategy.name === 'T-Core HERO' && <span className="ml-2 text-yellow-500">⭐</span>}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {strategy.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tier: {strategy.risk} | APY: {strategy.apy}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 border border-border rounded-lg">
                      <h4 className="font-medium text-green-600 mb-2">Safe</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        T-Bill +20% guaranteed, zero loss risk
                      </p>
                      <p className="text-xs text-muted-foreground">Tier: 1-3 | APY: 6.0%</p>
                    </div>
                    <div className="p-4 sm:p-6 border border-border rounded-lg">
                      <h4 className="font-medium text-blue-600 mb-2">Conservative</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Stable yield, minimal drawdown risk
                      </p>
                      <p className="text-xs text-muted-foreground">Tier: 4-24 | APY: 9.0%</p>
                    </div>
                    <div className="p-4 sm:p-6 border border-border rounded-lg">
                      <h4 className="font-medium text-yellow-600 mb-2">Balanced</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Optimal risk/reward, diversified exposure
                      </p>
                      <p className="text-xs text-muted-foreground">Tier: 25-80 | APY: 16.0%</p>
                    </div>
                    <div className="p-4 sm:p-6 border border-border rounded-lg">
                      <h4 className="font-medium text-purple-600 mb-2">T-Core HERO ⭐</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        Pool insurance provider - maximum yield for heroes
                      </p>
                      <p className="text-xs text-muted-foreground">Tier: 81-100 | APY: 35.0%</p>
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

export default Index;
