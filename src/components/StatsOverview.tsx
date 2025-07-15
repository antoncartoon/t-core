
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Shield } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage, formatGrowth } from '@/data/tcoreData';
import SkeletonStatsOverview from '@/components/SkeletonStatsOverview';

const StatsOverview = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonStatsOverview />;
  }

  const stats = [
    { 
      label: 'Total Value Locked', 
      value: formatCurrency(TCORE_STATS.totalValueLocked), 
      change: formatGrowth(TCORE_STATS.growthMetrics.tvlGrowth) 
    },
    { 
      label: 'T-Core APY 28 Days', 
      value: `${formatPercentage(TCORE_STATS.protocolAPY28Days)} APY`, 
      change: formatGrowth(TCORE_STATS.growthMetrics.apyChange) 
    },
    { 
      label: 'Active Stakers', 
      value: TCORE_STATS.activeStakers.toLocaleString(), 
      change: formatGrowth(TCORE_STATS.growthMetrics.stakersGrowth) 
    },
    { 
      label: 'Self-Insurance Pool', 
      value: formatCurrency(TCORE_STATS.selfInsurancePool), 
      change: formatGrowth(TCORE_STATS.growthMetrics.insuranceGrowth), 
      tooltip: 'T-Core HERO tier protects lower tiers. You are protected by yield generated.' 
    }
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
