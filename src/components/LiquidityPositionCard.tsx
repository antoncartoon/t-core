
import React from 'react';
import { Target, TrendingUp, BarChart3, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRiskRange } from '@/contexts/RiskRangeContext';
import { LiquidityPosition } from '@/types/riskRange';

interface LiquidityPositionCardProps {
  position: LiquidityPosition;
}

const LiquidityPositionCard = ({ position }: LiquidityPositionCardProps) => {
  const { toast } = useToast();
  const { withdrawPosition } = useRiskRange();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRangeCategory = (min: number, max: number) => {
    const avg = (min + max) / 2;
    if (avg <= 25) return { name: 'Conservative', color: 'bg-green-100 text-green-700' };
    if (avg <= 60) return { name: 'Moderate', color: 'bg-yellow-100 text-yellow-700' };
    return { name: 'Aggressive', color: 'bg-red-100 text-red-700' };
  };

  const getCapitalEfficiency = () => {
    const rangeSize = position.riskRange.max - position.riskRange.min;
    return Math.round(100 / Math.max(1, rangeSize / 5));
  };

  const handleWithdraw = () => {
    const success = withdrawPosition(position.id);
    if (success) {
      toast({
        title: "Position Withdrawn",
        description: `Successfully withdrew ${position.currentValue.toFixed(2)} TDD from range ${position.riskRange.min}-${position.riskRange.max}`,
      });
    } else {
      toast({
        title: "Withdrawal Failed",
        description: "Unable to withdraw from this position.",
        variant: "destructive",
      });
    }
  };

  const category = getRangeCategory(position.riskRange.min, position.riskRange.max);
  const efficiency = getCapitalEfficiency();

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-bl-full flex items-start justify-end p-2">
        <Target className="w-4 h-4 text-blue-600" />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold text-lg">#{position.id.slice(-6)}</h3>
              <Badge className={category.color}>
                {category.name}
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

        {/* Risk Range Display */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Risk Range</span>
            <span className="text-lg font-bold text-blue-600">
              {position.riskRange.min} - {position.riskRange.max}
            </span>
          </div>
          
          {/* Range Visualization */}
          <div className="w-full h-2 bg-muted rounded relative">
            <div
              className="absolute h-full bg-blue-500 rounded"
              style={{
                left: `${position.riskRange.min}%`,
                width: `${position.riskRange.max - position.riskRange.min}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Current APR</p>
            <p className="font-semibold text-green-600">{(position.actualAPR * 100).toFixed(2)}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Efficiency</p>
            <p className="font-semibold text-purple-600">{efficiency}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Range Size</p>
            <p className="font-semibold">{position.riskRange.max - position.riskRange.min}</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center">
              <DollarSign className="w-3 h-3 mr-1" />
              Principal:
            </span>
            <span className="font-medium">${position.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Performance:
            </span>
            <span className={`font-medium ${position.earnedAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {((position.currentValue / position.amount - 1) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Rebalance
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleWithdraw}
            disabled={position.status !== 'active'}
          >
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiquidityPositionCard;
