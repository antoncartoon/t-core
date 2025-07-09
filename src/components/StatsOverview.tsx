
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const StatsOverview = () => {
  const stats = [
    { label: 'Total Value Locked', value: '$12.5M', change: '+15.2%' },
    { label: 'Average APY', value: '8.4%', change: '+0.3%' },
    { label: 'Active Stakers', value: '2,847', change: '+12.1%' },
    { label: 'tkchUSD Minted', value: '8.9M', change: '+8.7%' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border">
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-light mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-xs text-green-600">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
