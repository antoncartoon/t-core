
import React from 'react';
import Header from '@/components/Header';
import ProtocolAllocations from '@/components/ProtocolAllocations';
import AssetBreakdown from '@/components/AssetBreakdown';
import YieldSources from '@/components/YieldSources';
import RiskMetrics from '@/components/RiskMetrics';
import SelfInsuranceWidget from '@/components/SelfInsuranceWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, DollarSign, Activity } from 'lucide-react';

const Transparency = () => {
  const protocolStats = {
    totalValueLocked: 125600000,
    activePositions: 12847,
    averageYield: 8.4,
    lastUpdated: new Date(),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light mb-2">Protocol Transparency</h1>
              <p className="text-muted-foreground">
                Real-time data on protocol allocations, yield sources, and risk metrics
              </p>
            </div>
            <Badge variant="secondary" className="self-start sm:self-center">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-lg sm:text-2xl font-light mb-1">
                  ${(protocolStats.totalValueLocked / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Value Locked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-green-600" />
                <p className="text-lg sm:text-2xl font-light mb-1">{protocolStats.activePositions.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Positions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-lg sm:text-2xl font-light mb-1">{protocolStats.averageYield}%</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Average Yield</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-orange-600" />
                <p className="text-lg sm:text-2xl font-light mb-1">
                  {protocolStats.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Last Updated</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <ProtocolAllocations />
          <AssetBreakdown />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <YieldSources />
          <RiskMetrics />
        </div>

        {/* Protocol Self-Insurance Protection */}
        <div className="mb-8">
          <h2 className="text-xl font-light mb-6">Protocol Insurance Protection</h2>
          <SelfInsuranceWidget />
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              How T-Core Protects Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Protocol Fund Allocation Strategy</h4>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>T-Core protocol places its own funds in the highest risk tier (Risk Level 100) to absorb potential losses first.</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Protocol fees (0.5% of all transactions) automatically flow to Risk Level 100</li>
                <li>• Protocol treasury funds are allocated to highest risk positions</li>
                <li>• This creates a buffer that protects user funds by taking losses first</li>
                <li>• Users benefit from protocol's own capital being at risk before theirs</li>
                <li>• The more activity on T-Core, the stronger this protection becomes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Transparency;
