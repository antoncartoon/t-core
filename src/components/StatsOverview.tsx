
import React from 'react';
import { DollarSign, TrendingUp, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatsOverview = () => {
  const stats = [
    {
      title: 'Total Value Locked',
      value: '$12.5M',
      change: '+15.2%',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'Average APY',
      value: '8.4%',
      change: '+0.3%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Active Stakers',
      value: '2,847',
      change: '+12.1%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'tkchUSD Minted',
      value: '8.9M',
      change: '+8.7%',
      icon: Zap,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;
