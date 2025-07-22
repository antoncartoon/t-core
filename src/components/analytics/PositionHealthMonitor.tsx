
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const PositionHealthMonitor = () => {
  const metrics = [
    {
      name: 'Tier 1 Coverage',
      value: 100,
      status: 'success',
      description: 'Fully protected by fixed guarantee'
    },
    {
      name: 'Insurance Pool Health',
      value: 85,
      status: 'success',
      description: 'Strong protection level'
    },
    {
      name: 'Risk Concentration',
      value: 45,
      status: 'warning',
      description: 'Moderate tier distribution'
    },
    {
      name: 'Subordination Level',
      value: 70,
      status: 'success',
      description: 'Healthy loss absorption capacity'
    }
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{metric.name}</span>
            <Badge variant={metric.status === 'success' ? 'default' : 'destructive'}>
              {metric.value}%
            </Badge>
          </div>
          <Progress value={metric.value} className="h-2" />
          <p className="text-xs text-muted-foreground">{metric.description}</p>
        </div>
      ))}
    </div>
  );
};
