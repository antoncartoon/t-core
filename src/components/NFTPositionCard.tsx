
import React from 'react';
import { Trophy, Calendar, TrendingUp, Lock, Unlock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { StakingPosition } from '@/types/staking';

interface NFTPositionCardProps {
  position: StakingPosition;
}

const NFTPositionCard = ({ position }: NFTPositionCardProps) => {
  const { toast } = useToast();
  const { withdrawPosition } = useWallet();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isMatured = () => {
    return new Date() >= position.maturityDate;
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const diffTime = position.maturityDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = () => {
    const now = new Date();
    const totalDuration = position.maturityDate.getTime() - position.createdAt.getTime();
    const elapsed = now.getTime() - position.createdAt.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const handleWithdraw = () => {
    const success = withdrawPosition(position.id);
    if (success) {
      toast({
        title: "Position Withdrawn",
        description: `Successfully withdrew ${position.currentValue.toFixed(2)} tkchUSD from position #${position.id.slice(-6)}`,
      });
    } else {
      toast({
        title: "Withdrawal Failed",
        description: "Unable to withdraw from this position.",
        variant: "destructive",
      });
    }
  };

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
            <p className="text-sm text-green-600">+${position.earnedAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Original Amount</p>
            <p className="font-semibold">${position.originalTokenAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">APY</p>
            <p className="font-semibold text-blue-600">{position.apy.toFixed(2)}%</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {isMatured() ? (
                <Unlock className="w-4 h-4 text-green-600" />
              ) : (
                <Lock className="w-4 h-4 text-gray-600" />
              )}
              <span className="text-sm font-medium">
                {isMatured() ? 'Matured' : `${getDaysRemaining()} days remaining`}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Maturity: {formatDate(position.maturityDate)}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isMatured() ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Risk Level:</span>
            <span className="font-medium">{position.riskLevel}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lock Period:</span>
            <span className="font-medium">{position.lockPeriod} days</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            disabled={!isMatured()}
          >
            Use in DeFi
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleWithdraw}
            disabled={position.status !== 'active'}
          >
            {isMatured() ? 'Withdraw' : 'Early Withdraw'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTPositionCard;
