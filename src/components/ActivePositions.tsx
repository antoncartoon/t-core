import React, { useState } from 'react';
import { Trophy, Target, Users, TrendingUp, Clock, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useWallet } from '@/contexts/WalletContext';
import { useDistribution } from '@/contexts/DistributionContext';
import CompactPositionCard from './CompactPositionCard';
import NFTPositionCard from './NFTPositionCard';

const ActivePositions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const { stakingPositions, getTotalStakedValue } = useWallet();
  const { getTotalUnclaimedYield, getFormattedTimeToNext } = useDistribution();

  const activePositions = stakingPositions.filter(p => p.status === 'active');
  const totalStaked = getTotalStakedValue();
  const totalUnclaimed = getTotalUnclaimedYield();
  const timeToNext = getFormattedTimeToNext();

  if (activePositions.length === 0) {
    return null; // Don't show anything when no positions exist
  }

  const avgAPY = activePositions.reduce((sum, p) => sum + p.desiredAPY, 0) / activePositions.length;
  const totalEarned = activePositions.reduce((sum, p) => sum + p.earnedAmount, 0);

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-0">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Active Positions</span>
                <Badge variant="secondary">
                  {activePositions.length}
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            {isExpanded && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'compact' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('compact')}
                  className="text-xs"
                >
                  <Grid className="w-3 h-3 mr-1" />
                  Compact
                </Button>
                <Button
                  variant={viewMode === 'detailed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('detailed')}
                  className="text-xs"
                >
                  <List className="w-3 h-3 mr-1" />
                  Detailed
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Quick Overview Stats */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-primary">${totalStaked.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Staked</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">${totalEarned.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Earned</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">{(avgAPY * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Avg APY</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-600">{totalUnclaimed.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground">Unclaimed TDD</p>
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

      <CollapsibleContent className="space-y-4">
        {viewMode === 'compact' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activePositions.map((position) => (
              <CompactPositionCard key={position.id} position={position} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePositions.map((position) => (
              <NFTPositionCard key={position.id} position={position} />
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ActivePositions;