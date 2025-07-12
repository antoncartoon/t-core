import React from 'react';
import { Trophy, Calendar, TrendingUp, Lock, Unlock, AlertTriangle, Users, Zap, Gift, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { StakingPosition } from '@/types/staking';
import { UnclaimedYieldDisplay } from './UnclaimedYieldDisplay';
import { useDistribution } from '@/contexts/DistributionContext';

interface NFTPositionCardProps {
  position: StakingPosition;
}

const NFTPositionCard = ({ position }: NFTPositionCardProps) => {
  const { toast } = useToast();
  const { withdrawPosition, addBalance } = useWallet();
  const { getFormattedTimeToNext, unclaimedYields } = useDistribution();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilNextPayout = () => {
    const now = new Date();
    const diffTime = position.nextPayoutDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getPayoutProgress = () => {
    const now = new Date();
    const lastPayoutDate = new Date(position.nextPayoutDate.getTime() - position.payoutFrequency * 24 * 60 * 60 * 1000);
    const totalDuration = position.nextPayoutDate.getTime() - lastPayoutDate.getTime();
    const elapsed = now.getTime() - lastPayoutDate.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const getPayoutFrequencyDisplay = () => {
    const days = position.payoutFrequency;
    if (days === 7) return 'Weekly';
    if (days === 14) return 'Bi-weekly';
    if (days === 30) return 'Monthly';
    return `Every ${days} days`;
  };

  // Instant unstake - no lock period
  const handleInstantUnstake = () => {
    const success = withdrawPosition(position.id);
    if (success) {
      // Add TDD back to balance (including any accumulated yield)
      addBalance('TDD', position.currentValue);
      
      toast({
        title: "Position Unstaked Instantly",
        description: `Received ${position.currentValue.toFixed(2)} TDD. Unclaimed yield remains in protocol pool.`,
      });
    } else {
      toast({
        title: "Unstake failed",
        description: "Unable to unstake position. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get unclaimed yield for this position
  const unclaimedYield = unclaimedYields.find(y => y.positionId === position.id);
  const timeToNext = getFormattedTimeToNext();
  
  // Calculate "if unstake now" preview
  const unstakeNowAmount = position.currentValue;

  const getRiskBadgeClass = () => {
    switch (position.riskCategory) {
      case 'Conservative':
        return 'text-green-600 border-green-600 bg-green-50';
      case 'Moderate':
        return 'text-yellow-600 border-yellow-600 bg-yellow-50';
      case 'Aggressive':
        return 'text-red-600 border-red-600 bg-red-50';
      default:
        return '';
    }
  };

  const getPriorityColor = () => {
    if (position.payoutPriority > 8000) return 'text-green-600';
    if (position.payoutPriority > 5000) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calculate APY performance
  const expectedReturn = (position.desiredAPY * position.originalTokenAmount);
  const actualReturn = position.earnedAmount;
  const performance = expectedReturn > 0 ? (actualReturn / expectedReturn) * 100 : 100;

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-16 h-16 ${
        position.riskCategory === 'Conservative' ? 'bg-green-100' :
        position.riskCategory === 'Moderate' ? 'bg-yellow-100' :
        'bg-red-100'
      } rounded-bl-full flex items-start justify-end p-2`}>
        <Trophy className={`w-4 h-4 ${
          position.riskCategory === 'Conservative' ? 'text-green-600' :
          position.riskCategory === 'Moderate' ? 'text-yellow-600' :
          'text-red-600'
        }`} />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold text-lg">#{position.id.slice(-6)}</h3>
              <Badge variant="outline" className={getRiskBadgeClass()}>
                {position.riskCategory}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(position.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${position.currentValue.toLocaleString()}</p>
            <p className={`text-sm ${position.earnedAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {position.earnedAmount >= 0 ? '+' : ''}${position.earnedAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Desired APY</p>
            <p className="font-semibold text-blue-600">{(position.desiredAPY * 100).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actual APY</p>
            <p className={`font-semibold ${
              position.actualAPY >= position.desiredAPY ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {(position.actualAPY * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Unclaimed Yield Display */}
        {unclaimedYield && (
          <div className="mb-4">
            <UnclaimedYieldDisplay positionId={position.id} />
          </div>
        )}

        {/* Instant Unstake Preview */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              If you unstake now
            </span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">You'll receive:</span>
              <span className="font-bold text-blue-600">{unstakeNowAmount.toFixed(2)} TDD</span>
            </div>
            {unclaimedYield && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unclaimed yield forfeited:</span>
                <span className="font-medium text-red-600">{unclaimedYield.amount.toFixed(4)} TDD</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Next distribution in:</span>
              <span className="font-medium">{timeToNext}</span>
            </div>
          </div>
        </div>

        {/* Priority and Risk Info */}
        <div className="bg-muted/30 p-3 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center">
                <Users className="w-3 h-3 mr-1" />
                Queue Priority:
              </span>
              <span className={`font-medium ${getPriorityColor()}`}>
                #{position.payoutPriority.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Score:</span>
              <span className="font-medium">{position.riskScore.toLocaleString()}</span>
            </div>
          </div>
          
          {position.missedPayouts > 0 && (
            <div className="mt-2 p-2 bg-red-50 rounded text-sm">
              <div className="flex items-center text-red-700">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Missed payouts: ${position.missedPayouts.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">
                Next payout in {getDaysUntilNextPayout()} days
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(position.nextPayoutDate)}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500 bg-blue-500"
              style={{ width: `${getPayoutProgress()}%` }}
            />
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Performance:</span>
            <span className={`font-medium ${
              performance >= 90 ? 'text-green-600' : 
              performance >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {performance.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payout Freq:</span>
            <span className="font-medium">{getPayoutFrequencyDisplay()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {unclaimedYield && (
            <Button 
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50"
              disabled
            >
              <Gift className="w-4 h-4 mr-1" />
              <span className="text-xs">Claim ({timeToNext})</span>
            </Button>
          )}
          <Button 
            onClick={handleInstantUnstake}
            size="sm"
            className={`${unclaimedYield ? '' : 'col-span-2'} bg-blue-600 hover:bg-blue-700`}
            disabled={position.status !== 'active'}
          >
            <Zap className="w-4 h-4 mr-2" />
            Instant Unstake
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTPositionCard;
