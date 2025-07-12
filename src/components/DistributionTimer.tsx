import React from 'react';
import { Clock, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDistribution } from '@/contexts/DistributionContext';

export const DistributionTimer = () => {
  const { 
    distributionState, 
    getFormattedTimeToNext, 
    getTotalUnclaimedYield,
    unclaimedYields 
  } = useDistribution();

  const timeToNext = getFormattedTimeToNext();
  const totalUnclaimed = getTotalUnclaimedYield();
  const recipientCount = unclaimedYields.length;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Next Distribution
            </span>
          </div>
          <Badge variant="outline" className="bg-white/50 text-blue-700 border-blue-300">
            {timeToNext}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-3 h-3 text-green-600" />
              <span className="text-xs text-muted-foreground">Pending Yield</span>
            </div>
            <p className="text-sm font-bold text-green-600">
              ${totalUnclaimed.toFixed(2)}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="w-3 h-3 text-purple-600" />
              <span className="text-xs text-muted-foreground">Recipients</span>
            </div>
            <p className="text-sm font-bold text-purple-600">
              {recipientCount}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last distribution:</span>
            <span>
              {distributionState.lastDistributionTime.toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Distribution frequency:</span>
            <span>Every {distributionState.intervalHours}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};