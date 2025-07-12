import React from 'react';
import { TrendingUp, Clock, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDistribution } from '@/contexts/DistributionContext';
import { useToast } from '@/hooks/use-toast';

interface UnclaimedYieldDisplayProps {
  positionId: string;
  className?: string;
}

export const UnclaimedYieldDisplay = ({ positionId, className }: UnclaimedYieldDisplayProps) => {
  const { unclaimedYields, claimYield, distributionState, getFormattedTimeToNext } = useDistribution();
  const { toast } = useToast();

  const yieldData = unclaimedYields.find(y => y.positionId === positionId);
  
  if (!yieldData) {
    return null;
  }

  const handleClaim = () => {
    const claimedAmount = claimYield(positionId);
    if (claimedAmount > 0) {
      toast({
        title: "Yield Claimed!",
        description: `Successfully claimed ${claimedAmount.toFixed(4)} TDD yield`,
      });
    }
  };

  const timeToNext = getFormattedTimeToNext();
  const canClaim = new Date() >= yieldData.nextDistributionDate;

  return (
    <Card className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-green-800 dark:text-green-200">Unclaimed Yield</span>
          <Badge variant={canClaim ? "default" : "outline"} className="text-xs">
            {canClaim ? "Ready" : "Pending"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Yield Amount */}
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {yieldData.amount.toFixed(4)} TDD
          </p>
          <p className="text-xs text-muted-foreground">
            ≈ ${yieldData.amount.toFixed(2)} USD
          </p>
        </div>

        {/* Yield Details */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Daily accrual:</span>
            <span className="font-medium">{yieldData.dailyAccrual.toFixed(4)} TDD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last accrual:</span>
            <span className="font-medium">
              {yieldData.lastAccrualDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Next distribution:</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-blue-500" />
              <span className="font-medium text-blue-600">{timeToNext}</span>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        {canClaim ? (
          <Button 
            onClick={handleClaim}
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Gift className="w-4 h-4 mr-2" />
            Claim Yield
          </Button>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded text-center">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Yield will be available for claiming after the next distribution
            </p>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> If you unstake before the next distribution, 
            unclaimed yield will remain in the protocol pool.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};