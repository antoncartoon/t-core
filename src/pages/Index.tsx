
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        isConnected={isConnected} 
        onConnect={handleConnect}
        walletAddress={walletAddress}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Tolkachyield Finance
          </h1>
          <p className="text-gray-600">
            Stake your stablecoins, mint tkchUSD, and earn yield through optimized DeFi strategies
          </p>
        </div>

        <StatsOverview />

        <Tabs defaultValue="deposit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <DepositCard />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">How it works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Deposit Stablecoins</h4>
                        <p className="text-sm text-gray-600">
                          Deposit your USDT or USDC to start earning yield
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Mint tkchUSD</h4>
                        <p className="text-sm text-gray-600">
                          Receive tkchUSD tokens 1:1 for your deposited stablecoins
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Auto-Deploy to DeFi</h4>
                        <p className="text-sm text-gray-600">
                          Your stablecoins are automatically deployed to optimal DeFi strategies
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stake" className="space-y-6">
            <StakingCard />
            
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Staking Strategies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-green-600 mb-2">Conservative</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Low risk, stable returns through blue-chip DeFi protocols
                  </p>
                  <p className="text-xs text-gray-500">Risk: 0-33% | APY: 2-6%</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-yellow-600 mb-2">Moderate</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Balanced approach with diversified yield farming
                  </p>
                  <p className="text-xs text-gray-500">Risk: 34-66% | APY: 6-15%</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-600 mb-2">Aggressive</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    High-yield strategies with elevated risk exposure
                  </p>
                  <p className="text-xs text-gray-500">Risk: 67-100% | APY: 15-25%</p>
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
