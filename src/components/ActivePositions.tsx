import React from 'react';
import { Trophy, Target, Users, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { useDistribution } from '@/contexts/DistributionContext';
import NFTPositionCard from './NFTPositionCard';

const ActivePositions = () => {
  const { stakingPositions, getTotalStakedValue } = useWallet();
  const { getTotalUnclaimedYield, getFormattedTimeToNext } = useDistribution();

  const activePositions = stakingPositions.filter(p => p.status === 'active');
  const totalStaked = getTotalStakedValue();
  const totalUnclaimed = getTotalUnclaimedYield();
  const timeToNext = getFormattedTimeToNext();

  if (activePositions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Positions</h3>
          <p className="text-muted-foreground">
            Create your first liquidity position above to start earning yield.
          </p>
        </CardContent>
      </Card>
    );
  }

  const avgAPY = activePositions.reduce((sum, p) => sum + p.desiredAPY, 0) / activePositions.length;
  const totalEarned = activePositions.reduce((sum, p) => sum + p.earnedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Active Positions Overview</span>
            <Badge variant="secondary" className="ml-auto">
              {activePositions.length} Positions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">${totalStaked.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Staked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${totalEarned.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{(avgAPY * 100).toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Avg APY</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{totalUnclaimed.toFixed(4)}</p>
              <p className="text-sm text-muted-foreground">Unclaimed TDD</p>
            </div>
          </div>

          {totalUnclaimed > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Next distribution in {timeToNext}
                  </span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  +{totalUnclaimed.toFixed(4)} TDD pending
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activePositions.map((position) => (
          <NFTPositionCard key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
};

export default ActivePositions;