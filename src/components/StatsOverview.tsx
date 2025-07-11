
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield } from 'lucide-react';

const StatsOverview = () => {
  const stats = [
    { label: 'Total Value Locked', value: '$12.5M', change: '+15.2%' },
    { label: 'Average APY', value: '8.4%', change: '+0.3%' },
    { label: 'Active Stakers', value: '2,847', change: '+12.1%' },
    { label: 'Self-Insurance Pool', value: '$1.2M', change: '+5.3%', tooltip: 'Self-insurance pool. You are protected by yield generated.' }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border">
            <CardContent className="p-4 sm:p-6 text-center">
              {stat.tooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <p className="text-lg sm:text-2xl font-light">{stat.value}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 leading-tight">{stat.label}</p>
                      <p className="text-xs text-emerald-600">{stat.change}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <p className="text-lg sm:text-2xl font-light mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mb-1 leading-tight">{stat.label}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default StatsOverview;
