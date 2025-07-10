
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Building } from 'lucide-react';

const AssetBreakdown = () => {
  const assets = [
    {
      category: 'Treasury Bills',
      icon: Shield,
      items: [
        { name: '6-Month T-Bills', allocation: 25, yield: 5.2, rating: 'AAA' },
        { name: '12-Month T-Bills', allocation: 20, yield: 5.4, rating: 'AAA' },
      ]
    },
    {
      category: 'Corporate Bonds',
      icon: Building,
      items: [
        { name: 'Apple Inc. Bonds', allocation: 15, yield: 4.8, rating: 'AA+' },
        { name: 'Microsoft Corp. Bonds', allocation: 10, yield: 4.9, rating: 'AAA' },
        { name: 'Berkshire Hathaway', allocation: 5, yield: 4.6, rating: 'AA+' },
      ]
    },
    {
      category: 'Stable Yields',
      icon: TrendingUp,
      items: [
        { name: 'High-Grade Municipal', allocation: 10, yield: 4.2, rating: 'AA' },
        { name: 'Investment Grade Corp', allocation: 5, yield: 5.1, rating: 'A+' },
      ]
    }
  ];

  const getRatingColor = (rating: string) => {
    if (rating === 'AAA') return 'text-green-600 border-green-600';
    if (rating.startsWith('AA')) return 'text-blue-600 border-blue-600';
    if (rating.startsWith('A')) return 'text-purple-600 border-purple-600';
    return 'text-gray-600 border-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {assets.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.category}>
              <div className="flex items-center space-x-2 mb-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">{category.category}</h3>
              </div>
              
              <div className="space-y-2 ml-6">
                {category.items.map((item) => (
                  <div key={item.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 rounded bg-muted/30">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.allocation}% allocation</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={`text-xs ${getRatingColor(item.rating)}`}>
                        {item.rating}
                      </Badge>
                      <span className="text-sm font-medium text-green-600">
                        {item.yield}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AssetBreakdown;
