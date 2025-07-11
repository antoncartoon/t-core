
import React from 'react';
import Header from '@/components/Header';
import ProtocolAllocations from '@/components/ProtocolAllocations';
import AssetBreakdown from '@/components/AssetBreakdown';
import YieldSources from '@/components/YieldSources';
import RiskMetrics from '@/components/RiskMetrics';
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

        {/* Self-Insurance Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Self-Insurance Pool Mechanics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                <Shield className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-medium mb-2">Pool Size</h3>
                <p className="text-2xl font-light text-emerald-600">$1.2M</p>
                <p className="text-xs text-muted-foreground">Current Insurance Reserve</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium mb-2">Growth Rate</h3>
                <p className="text-2xl font-light text-blue-600">+5.3%</p>
                <p className="text-xs text-muted-foreground">Weekly Pool Growth</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium mb-2">Protection</h3>
                <p className="text-2xl font-light text-purple-600">9.6%</p>
                <p className="text-xs text-muted-foreground">Coverage Ratio</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">How It Works</h4>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Self-insurance pool. You are protected by yield generated.</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Protocol fees (0.5% of all transactions) automatically flow to Level 100 risk tier</li>
                <li>• This creates a community-funded insurance buffer that protects all stakers</li>
                <li>• In case of losses, the self-insurance pool absorbs damage before affecting user funds</li>
                <li>• The more activity on the protocol, the stronger the protection becomes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Transparency;
