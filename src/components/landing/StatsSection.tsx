
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Shield } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage, formatGrowth } from '@/data/tcoreData';

const StatsSection = () => {
  // Performance stats using unified T-Core data
  const stats = [
    {
      icon: DollarSign,
      label: 'Total Value Locked',
      value: formatCurrency(TCORE_STATS.totalValueLocked),
      change: formatGrowth(TCORE_STATS.growthMetrics.tvlGrowth),
      period: 'Last 30 days'
    },
    {
      icon: TrendingUp,
      label: 'T-Core APY',
      value: formatPercentage(TCORE_STATS.protocolAPY28Days),
      change: formatGrowth(TCORE_STATS.growthMetrics.apyChange),
      period: 'Last 28 days'
    },
    {
      icon: Users,
      label: 'Active Stakers',
      value: TCORE_STATS.activeStakers.toLocaleString(),
      change: formatGrowth(TCORE_STATS.growthMetrics.stakersGrowth),
      period: 'This month'
    },
    {
      icon: Shield,
      label: 'Self-Insurance Pool',
      value: formatCurrency(TCORE_STATS.selfInsurancePool),
      change: formatGrowth(TCORE_STATS.growthMetrics.insuranceGrowth),
      period: 'T-Core HERO protection'
    }
  ];

  // T-Core yield sources (anti-ponzi breakdown)
  const yieldSources = TCORE_STATS.yieldSources.sources.map(source => ({
    name: source.name,
    allocation: Math.round(source.allocation * 100),
    apy: source.apy * 100
  }));

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Live Protocol Statistics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time insights into T-Core's performance and growth
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-border bg-card/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                    <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-green-600">
                      {stat.change} {stat.period}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* T-Core Yield Sources */}
        <Card className="border-border bg-card/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-center">Anti-Ponzi Yield Sources</h3>
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm font-medium text-green-700 dark:text-green-300 text-center">
                60% Fixed Yield + 40% Protocol Revenue
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1 text-center">
                Sustainable, non-ponzi yield structure
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {yieldSources.map((source, index) => (
                <div key={index} className="flex flex-col items-center text-center p-3 bg-muted/30 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mb-2 ${
                    source.name === 'T-Bills' ? 'bg-green-500' :
                    source.name === 'AAVE' ? 'bg-blue-500' :
                    source.name === 'JLP' ? 'bg-yellow-500' :
                    source.name === 'LP Farming' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`} />
                  <span className="text-sm font-medium">{source.name}</span>
                  <div className="text-xs font-medium text-primary mt-1">{source.allocation}%</div>
                  <div className="text-xs text-muted-foreground">{source.apy.toFixed(1)}% APY</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default StatsSection;
