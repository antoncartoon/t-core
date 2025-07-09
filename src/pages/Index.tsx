
import React, { useState } from 'react';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import DepositCard from '@/components/DepositCard';
import StakingCard from '@/components/StakingCard';
import WalletConnect from '@/components/WalletConnect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

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
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-light text-foreground mb-4 tracking-tight">
            Tolkachyield Finance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stake your stablecoins, mint tkchUSD, and earn yield through optimized DeFi strategies
          </p>
        </div>

        <StatsOverview />

        <Tabs defaultValue="deposit" className="space-y-12">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto bg-muted/50">
            <TabsTrigger value="deposit" className="text-sm">Deposit</TabsTrigger>
            <TabsTrigger value="stake" className="text-sm">Stake</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <DepositCard />
              <div className="space-y-8">
                <h3 className="text-xl font-medium">How it works</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium mt-1">
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
                    <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium mt-1">
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
                    <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium mt-1">
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
          </TabsContent>
          
          <TabsContent value="stake" className="space-y-12">
            <StakingCard />
            
            <div className="space-y-8">
              <h3 className="text-xl font-medium">Staking Strategies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-border rounded-lg">
                  <h4 className="font-medium text-green-600 mb-2">Conservative</h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    Low risk, stable returns through blue-chip DeFi protocols
                  </p>
                  <p className="text-xs text-muted-foreground">Risk: 0-33% | APY: 2-6%</p>
                </div>
                <div className="p-6 border border-border rounded-lg">
                  <h4 className="font-medium text-yellow-600 mb-2">Moderate</h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    Balanced approach with diversified yield farming
                  </p>
                  <p className="text-xs text-muted-foreground">Risk: 34-66% | APY: 6-15%</p>
                </div>
                <div className="p-6 border border-border rounded-lg">
                  <h4 className="font-medium text-red-600 mb-2">Aggressive</h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    High-yield strategies with elevated risk exposure
                  </p>
                  <p className="text-xs text-muted-foreground">Risk: 67-100% | APY: 15-25%</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
