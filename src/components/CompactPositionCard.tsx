import React, { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Zap, Gift, Users, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { useDistribution } from '@/contexts/DistributionContext';
import { StakingPosition } from '@/types/staking';
import { UnclaimedYieldDisplay } from './UnclaimedYieldDisplay';

interface CompactPositionCardProps {
  position: StakingPosition;
}

const CompactPositionCard = ({ position }: CompactPositionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { withdrawPosition, addBalance } = useWallet();
  const { getFormattedTimeToNext, unclaimedYields } = useDistribution();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getRiskBadgeClass = () => {
    switch (position.riskCategory) {
      case 'Conservative':
        return 'text-green-600 border-green-600 bg-green-50 dark:bg-green-950/20';
      case 'Moderate':
        return 'text-yellow-600 border-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
      case 'Aggressive':
        return 'text-red-600 border-red-600 bg-red-50 dark:bg-red-950/20';
      default:
        return '';
    }
  };

  const handleInstantUnstake = () => {
    const success = withdrawPosition(position.id);
    if (success) {
      addBalance('TDD', position.currentValue);
      toast({
        title: "Position Unstaked",
        description: `Received ${position.currentValue.toFixed(2)} TDD`,
      });
    } else {
      toast({
        title: "Unstake failed",
        description: "Unable to unstake position. Please try again.",
        variant: "destructive",
      });
    }
  };

  const unclaimedYield = unclaimedYields.find(y => y.positionId === position.id);
  const timeToNext = getFormattedTimeToNext();

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-semibold">#{position.id.slice(-6)}</span>
            </div>
            <Badge variant="outline" className={`text-xs ${getRiskBadgeClass()}`}>
              {position.riskCategory}
            </Badge>
          </div>
          <div className="text-right">
            <p className="font-bold">${position.currentValue.toLocaleString()}</p>
            <p className={`text-xs ${position.earnedAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {position.earnedAmount >= 0 ? '+' : ''}${position.earnedAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">APY</p>
            <p className="font-semibold text-primary">{(position.desiredAPY * 100).toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Performance</p>
            <p className={`font-semibold ${
              position.actualAPY >= position.desiredAPY ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {((position.actualAPY / position.desiredAPY) * 100).toFixed(0)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Priority</p>
            <p className="font-semibold text-xs">#{position.payoutPriority.toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-3">
          {unclaimedYield && (
            <Button 
              variant="outline"
              size="sm"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 text-xs"
              disabled
            >
              <Gift className="w-3 h-3 mr-1" />
              Claim ({timeToNext})
            </Button>
          )}
          <Button 
            onClick={handleInstantUnstake}
            size="sm"
            className={`${unclaimedYield ? 'flex-1' : 'w-full'} bg-blue-600 hover:bg-blue-700 text-xs`}
            disabled={position.status !== 'active'}
          >
            <Zap className="w-3 h-3 mr-1" />
            Unstake
          </Button>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground">
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  View Details
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 pt-3">
            {/* Unclaimed Yield Display */}
            {unclaimedYield && (
              <UnclaimedYieldDisplay positionId={position.id} />
            )}

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(position.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Risk Score</p>
                <p className="font-medium">{position.riskScore.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actual APY</p>
                <p className={`font-medium ${
                  position.actualAPY >= position.desiredAPY ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {(position.actualAPY * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Payout</p>
                <p className="font-medium">{formatDate(position.nextPayoutDate)}</p>
              </div>
            </div>

            {/* Instant Unstake Preview */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Unstake Preview
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You'll receive:</span>
                  <span className="font-bold text-blue-600">{position.currentValue.toFixed(2)} TDD</span>
                </div>
                {unclaimedYield && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yield forfeited:</span>
                    <span className="font-medium text-red-600">{unclaimedYield.amount.toFixed(4)} TDD</span>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default CompactPositionCard;