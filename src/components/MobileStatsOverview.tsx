
import React from 'react';
import { TrendingUp, DollarSign, Users, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SELF_INSURANCE_POOL } from '@/utils/protocolConstants';

const MobileStatsOverview = () => {
  const stats = [
    {
      title: 'TVL',
      value: '$12.5M',
      change: '+8.2%',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'APY',
      value: '8.4%',
      change: '+0.3%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Insurance Pool',
      value: `$${(SELF_INSURANCE_POOL / 1000).toFixed(0)}K`,
      change: '+5.3%',
      icon: Shield,
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-0 bg-gradient-to-br from-background to-muted/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className={`text-xs font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change === 'Audited' ? 'text-emerald-600' : 'text-muted-foreground'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MobileStatsOverview;
