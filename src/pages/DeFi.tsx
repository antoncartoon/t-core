
import React from 'react';
import Header from '@/components/Header';
import PendleDepositCard from '@/components/PendleDepositCard';
import PTYTBalance from '@/components/PTYTBalance';
import FutureYieldChart from '@/components/FutureYieldChart';
import AAVEIntegrationCard from '@/components/AAVEIntegrationCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeFi = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-light mb-2">DeFi Yield Strategies</h1>
          <p className="text-muted-foreground">
            Enhance your T-Core positions with advanced DeFi integrations and composable yield strategies
          </p>
        </div>

        {/* DeFi Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-light mb-1">$127.5K</p>
              <p className="text-xs text-muted-foreground">Total DeFi TVL</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-light mb-1">2</p>
              <p className="text-xs text-muted-foreground">Active Integrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-light mb-1">4</p>
              <p className="text-xs text-muted-foreground">Available Protocols</p>
            </CardContent>
          </Card>
        </div>

        {/* Pendle Integration Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Pendle Yield Splitting
              </h2>
              <p className="text-muted-foreground">
                Split your TDD into Principal and Yield Tokens for advanced yield strategies
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Pendle Docs
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PendleDepositCard />
            <FutureYieldChart />
          </div>
          
          <div className="mt-8">
            <PTYTBalance />
          </div>
        </div>

        {/* AAVE Integration Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light mb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                AAVE Lending Protocol
              </h2>
              <p className="text-muted-foreground">
                Use your T-Core NFT positions as collateral to borrow assets and amplify your strategies
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              AAVE Docs
            </Button>
          </div>
          
          <AAVEIntegrationCard />
        </div>
      </main>
    </div>
  );
};

export default DeFi;
