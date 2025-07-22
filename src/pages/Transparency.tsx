
import React from 'react';
import Header from '@/components/Header';
import TransparencyDashboard from '@/components/TransparencyDashboard';
import SecurityDashboard from '@/components/SecurityDashboard';
import BuybackBurnDashboard from '@/components/BuybackBurnDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Transparency = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light mb-2">
                Protocol Transparency
              </h1>
              <p className="text-muted-foreground">
                Real-time insights into T-Core's operations, fees, security measures, and TDD mechanics
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deflationary">TDD Deflationary Engine</TabsTrigger>
            <TabsTrigger value="security">Security Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TransparencyDashboard />
          </TabsContent>

          <TabsContent value="deflationary">
            <BuybackBurnDashboard />
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Transparency;
