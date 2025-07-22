
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export const PositionHealthMonitor = () => {
  const metrics = [
    {
      name: 'Tier 1 Coverage',
      value: 100,
      status: 'success',
      description: 'Fully protected by fixed guarantee (T-Bills × 1.2)',
      formula: 'fixed_rate = t_bill_rate * 1.2 ≈ 5.16% APY'
    },
    {
      name: 'Insurance Pool Health',
      value: 85,
      status: 'success',
      description: 'Strong protection level from performance fees',
      formula: 'Insurance = 25% of performance fee (0.2 * total_yield * 0.25)'
    },
    {
      name: 'Risk Concentration',
      value: 45,
      status: 'warning',
      description: 'Moderate tier distribution vs target (10/20/30/40%)',
      formula: 'Concentration = sum(|current_tier_weight - target_tier_weight|)'
    },
    {
      name: 'Subordination Level',
      value: 70,
      status: 'success',
      description: 'Healthy loss absorption capacity from higher tiers',
      formula: 'Subordination = sum(liquidity in tiers > current_tier) / total_liquidity'
    }
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{metric.name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="rounded-full p-0.5 hover:bg-muted inline-flex items-center justify-center">
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <p className="text-xs">{metric.description}</p>
                    <div className="text-xs font-mono bg-muted p-1 rounded mt-1">
                      {metric.formula}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge variant={metric.status === 'success' ? 'default' : 'destructive'}>
              {metric.value}%
            </Badge>
          </div>
          <Progress 
            value={metric.value} 
            className={`h-2 ${
              metric.status === 'success' ? 'bg-green-100 dark:bg-green-900/20' : 
              'bg-yellow-100 dark:bg-yellow-900/20'
            }`} 
          />
          <p className="text-xs text-muted-foreground">{metric.description}</p>
        </div>
      ))}
    </div>
  );
};
