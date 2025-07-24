import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, Shield } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage } from '@/data/tcoreData';

const KeyStats = () => {
  const stats = [
    {
      icon: DollarSign,
      label: 'Total Value Locked',
      value: formatCurrency(TCORE_STATS.totalValueLocked),
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      label: 'Current APY',
      value: formatPercentage(TCORE_STATS.protocolAPY28Days),
      color: 'text-primary'
    },
    {
      icon: Users,
      label: 'Active Users',
      value: TCORE_STATS.activeStakers.toLocaleString(),
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      label: 'Safe Tier Guarantee',
      value: '5.16%',
      color: 'text-green-600'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="heading-section text-foreground mb-4">
            Platform Stats
          </h2>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto">
            Real numbers from our transparent, on-chain protocol.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className={`display-number mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="body-small text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="body-default text-muted-foreground">
            All yields backed by real assets including T-Bills, stablecoins, and verified DeFi protocols.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyStats;