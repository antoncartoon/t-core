
import React from 'react';
import Header from '@/components/Header';
import PendleDepositCard from '@/components/PendleDepositCard';
import PTYTBalance from '@/components/PTYTBalance';
import FutureYieldChart from '@/components/FutureYieldChart';
import AAVEIntegrationCard from '@/components/AAVEIntegrationCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Clock } from 'lucide-react';

const DeFi = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-light mb-2">DeFi Yield Strategies</h1>
          <p className="text-muted-foreground">
            Maximize your TDD yields with advanced DeFi integrations and leverage your NFT positions
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-light mb-1">12.8%</p>
              <p className="text-xs text-muted-foreground">Fixed APY Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-light mb-1">18.5%</p>
              <p className="text-xs text-muted-foreground">Variable APY Potential</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-light mb-1">365</p>
              <p className="text-xs text-muted-foreground">Days to Maturity</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Pendle Deposit */}
          <PendleDepositCard />
          
          {/* Future Yield Chart */}
          <FutureYieldChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* AAVE Integration */}
          <AAVEIntegrationCard />
          
          {/* PT/YT Balances */}
          <PTYTBalance />
        </div>
      </main>
    </div>
  );
};

export default DeFi;
