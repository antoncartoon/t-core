
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Shield } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: DollarSign,
      label: "Total Value Locked",
      value: "$2.4M",
      change: "+18.2%",
      period: "this month"
    },
    {
      icon: Users,
      label: "Active Positions",
      value: "1,247",
      change: "+156",
      period: "this week"
    },
    {
      icon: TrendingUp,
      label: "Average APY",
      value: "10.5%",
      change: "+2.1%",
      period: "vs last quarter"
    },
    {
      icon: Shield,
      label: "Security Score",
      value: "AA+",
      change: "Excellent",
      period: "rating"
    }
  ];

  const protocols = [
    { name: "AAVE", allocation: "35%", apy: "4.2%" },
    { name: "Compound", allocation: "25%", apy: "3.8%" },
    { name: "Pendle", allocation: "20%", apy: "12.5%" },
    { name: "CEX Strategies", allocation: "15%", apy: "8.9%" },
    { name: "Treasury", allocation: "5%", apy: "5.1%" }
  ];

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

      </div>
    </section>
  );
};

export default StatsSection;
