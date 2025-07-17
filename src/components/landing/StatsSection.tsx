import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Shield } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage, formatGrowth } from '@/data/tcoreData';
import AnimatedCounter from '@/components/AnimatedCounter';
const StatsSection = () => {
  // Performance stats using unified T-Core data
  const stats = [{
    icon: DollarSign,
    label: 'Total Value Locked',
    value: formatCurrency(TCORE_STATS.totalValueLocked),
    change: formatGrowth(TCORE_STATS.growthMetrics.tvlGrowth),
    period: 'Last 30 days'
  }, {
    icon: TrendingUp,
    label: 'T-Core APY',
    value: formatPercentage(TCORE_STATS.protocolAPY28Days),
    change: formatGrowth(TCORE_STATS.growthMetrics.apyChange),
    period: 'Last 28 days'
  }, {
    icon: Users,
    label: 'Active Stakers',
    value: TCORE_STATS.activeStakers.toLocaleString(),
    change: formatGrowth(TCORE_STATS.growthMetrics.stakersGrowth),
    period: 'This month'
  }, {
    icon: Shield,
    label: 'Self-Insurance Pool',
    value: formatCurrency(TCORE_STATS.selfInsurancePool),
    change: formatGrowth(TCORE_STATS.growthMetrics.insuranceGrowth),
    period: 'T-Core HERO protection'
  }];

  // T-Core yield sources (anti-ponzi breakdown)
  const yieldSources = TCORE_STATS.yieldSources.sources.map(source => ({
    name: source.name,
    allocation: Math.round(source.allocation * 100),
    apy: source.apy * 100
  }));
  return <section className="py-16 sm:py-24 bg-muted/20">
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
          return <Card key={index} className="border-border bg-card/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                    <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {stat.label === 'Total Value Locked' ? <AnimatedCounter end={TCORE_STATS.totalValueLocked / 1000000} prefix="$" suffix="M" decimals={1} /> : stat.label === 'T-Core APY' ? <AnimatedCounter end={TCORE_STATS.protocolAPY28Days * 100} suffix="%" decimals={2} /> : stat.label === 'Active Stakers' ? <AnimatedCounter end={TCORE_STATS.activeStakers} decimals={0} /> : stat.label === 'Self-Insurance Pool' ? <AnimatedCounter end={TCORE_STATS.selfInsurancePool / 1000000} prefix="$" suffix="M" decimals={1} /> : stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-green-600">
                      {stat.change} {stat.period}
                    </div>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* T-Core Yield Sources */}
        <Card className="border-border bg-card/50">
          
        </Card>

      </div>
    </section>;
};
export default StatsSection;