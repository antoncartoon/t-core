import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Clock, DollarSign, BarChart, Activity } from 'lucide-react';
import { NFTPosition } from '@/types/tcore';
import { Separator } from '@/components/ui/separator';
import AnimatedCounter from '../AnimatedCounter';

interface PositionValueMetrics {
  initialValue: number;
  currentValue: number;
  projectedValue: number;
  apr: number;
  timeRemaining: string;
  performanceFee: number;
  riskScore: number;
}

interface Props {
  position: NFTPosition;
  metrics?: PositionValueMetrics;
}

const PositionValueTracker: React.FC<Props> = ({ 
  position,
  metrics = {
    initialValue: position.amount,
    currentValue: position.currentValue,
    projectedValue: position.currentValue * 1.08, // Sample projection
    apr: 0.087, // 8.7% APR (sample)
    timeRemaining: '26 days',
    performanceFee: position.earnedAmount * 0.2, // 20% fee on earned amount
    riskScore: ((position.riskRange.start + position.riskRange.end) / 2) / 100 // Normalized risk score
  }
}) => {
  const percentChange = ((metrics.currentValue - metrics.initialValue) / metrics.initialValue) * 100;
  const isPositive = percentChange >= 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Position Value Tracker
        </CardTitle>
        <CardDescription>
          Real-time monitoring of position #{position.tokenId.slice(0, 8)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Value Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Current Value</h3>
            <Badge 
              variant={isPositive ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(percentChange).toFixed(2)}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-muted/40 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Initial</p>
              <p className="font-medium flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <AnimatedCounter 
                  end={metrics.initialValue}
                  decimals={2}
                />
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Current</p>
              <p className="font-medium flex items-center text-primary">
                <DollarSign className="h-3 w-3 mr-1" />
                <AnimatedCounter 
                  end={metrics.currentValue}
                  decimals={2}
                />
              </p>
            </div>
            <div className="p-3 bg-muted/40 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Projected</p>
              <p className="font-medium flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <AnimatedCounter 
                  end={metrics.projectedValue}
                  decimals={2}
                />
              </p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Performance Metrics */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Performance Metrics</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs flex items-center gap-1">
                  <BarChart className="h-3.5 w-3.5" />
                  APR
                </span>
                <span className="text-sm font-medium">
                  {(metrics.apr * 100).toFixed(2)}%
                </span>
              </div>
              <Progress value={metrics.apr * 100} max={30} className="h-1.5" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Time Remaining (Epoch)
                </span>
                <span className="text-sm font-medium">{metrics.timeRemaining}</span>
              </div>
              <Progress 
                value={26 - parseInt(metrics.timeRemaining.split(' ')[0])} 
                max={28} 
                className="h-1.5" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Performance Fee (20%)
                </span>
                <span className="text-sm font-medium">
                  ${metrics.performanceFee.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Risk & Position Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Risk Profile</h3>
            <div className="flex items-center gap-1">
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    metrics.riskScore < 0.33 
                      ? 'bg-green-500' 
                      : metrics.riskScore < 0.66 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${metrics.riskScore * 100}%` }}
                />
              </div>
              <span className="text-xs min-w-8 text-right">
                {Math.round(metrics.riskScore * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Range: {position.riskRange.start}-{position.riskRange.end}
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Position Details</h3>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{position.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="text-[10px] h-4">
                  {position.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionValueTracker;