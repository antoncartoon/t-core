
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import NFTPositionCard from '@/components/NFTPositionCard';
import { PositionHealthMonitor } from '@/components/analytics/PositionHealthMonitor';
import LossCascadeSimulator from '@/components/analytics/LossCascadeSimulator';
import { useTCore } from '@/contexts/TCoreContext';
import { useWallet } from '@/contexts/WalletContext';

export const UserPositionsAndHealth = () => {
  const { tcoreState } = useTCore();
  const { stakingPositions } = useWallet();

  const activeNFTPositions = stakingPositions.filter(pos => pos.status === 'active');
  const totalStakedValue = activeNFTPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalEarnings = activeNFTPositions.reduce((sum, pos) => sum + pos.earnedAmount, 0);

  // Calculate portfolio health metrics
  const portfolioHealth = () => {
    if (activeNFTPositions.length === 0) return { status: 'no-positions', color: 'text-muted-foreground' };
    
    const avgPerformance = activeNFTPositions.reduce((sum, pos) => {
      const expectedReturn = pos.desiredAPY * pos.originalTokenAmount;
      return sum + (expectedReturn > 0 ? (pos.actualAPY / pos.desiredAPY) : 1);
    }, 0) / activeNFTPositions.length;

    if (avgPerformance >= 0.9) return { status: 'healthy', color: 'text-green-600' };
    if (avgPerformance >= 0.7) return { status: 'moderate', color: 'text-yellow-600' };
    return { status: 'at-risk', color: 'text-red-600' };
  };

  const health = portfolioHealth();

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Staked</p>
              <p className="text-xl font-bold">${totalStakedValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{activeNFTPositions.length} positions</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className={`text-xl font-bold ${totalEarnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalEarnings >= 0 ? '+' : ''}${totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">All time</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Health Status</p>
              <div className="flex items-center justify-center gap-2">
                <Shield className={`h-4 w-4 ${health.color}`} />
                <p className={`text-lg font-bold capitalize ${health.color}`}>
                  {health.status.replace('-', ' ')}
                </p>
              </div>
              {health.status === 'no-positions' && (
                <p className="text-xs text-muted-foreground">No active positions</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active NFT Positions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Active NFT Positions
            </div>
            <Badge variant="outline">
              {activeNFTPositions.length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeNFTPositions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">No Active Positions</h3>
              <p className="text-muted-foreground mb-4">
                Start staking to see your NFT positions here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeNFTPositions.map((position) => (
                <NFTPositionCard key={position.id} position={position} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Position Health Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Position Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PositionHealthMonitor />
        </CardContent>
      </Card>

      {/* Loss Cascade Simulator - Updated to account for user position size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Personal Loss Impact Simulator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            See how protocol losses would affect your specific positions
          </p>
        </CardHeader>
        <CardContent>
          <LossCascadeSimulator userPositions={activeNFTPositions} />
        </CardContent>
      </Card>
    </div>
  );
};
