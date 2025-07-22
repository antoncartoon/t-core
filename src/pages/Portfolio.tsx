
import React from 'react';
import Header from '@/components/Header';
import ActivePositions from '@/components/ActivePositions';
import LiquidityIncentives from '@/components/LiquidityIncentives';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light mb-2">
                Portfolio Management
              </h1>
              <p className="text-muted-foreground">
                Monitor your positions, track performance, and manage liquidity distribution
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="positions">Active Positions</TabsTrigger>
            <TabsTrigger value="incentives">Liquidity Incentives</TabsTrigger>
          </TabsList>

          <TabsContent value="positions">
            <ActivePositions />
          </TabsContent>

          <TabsContent value="incentives">
            <LiquidityIncentives />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Portfolio;
