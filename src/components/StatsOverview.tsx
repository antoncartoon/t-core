
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const StatsOverview = () => {
  const stats = [
    { label: 'Total Value Locked', value: '$12.5M', change: '+15.2%' },
    { label: 'Average APY', value: '8.4%', change: '+0.3%' },
    { label: 'Active Stakers', value: '2,847', change: '+12.1%' },
    { label: 'TDD Minted', value: '8.9M', change: '+8.7%' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border">
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-lg sm:text-2xl font-light mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mb-1 leading-tight">{stat.label}</p>
            <p className="text-xs text-green-600">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
