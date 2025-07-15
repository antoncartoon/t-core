import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Flame, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage } from '@/data/tcoreData';

const BurnTracker = () => {
  // Mock recent burn events
  const recentBurns = [
    {
      id: 1,
      date: '2024-01-15',
      amount: 12500,
      tddBurned: 12500,
      valueIncrease: 0.0008,
      txHash: '0x742d35...73ae26'
    },
    {
      id: 2,
      date: '2024-01-08',
      amount: 11200,
      tddBurned: 11200,
      valueIncrease: 0.0007,
      txHash: '0x8f1a29...84bd15'
    },
    {
      id: 3,
      date: '2024-01-01',
      amount: 13800,
      tddBurned: 13800,
      valueIncrease: 0.0009,
      txHash: '0x5c4e71...92cf38'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Last Burn Summary */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Last Burn</span>
          </div>
          <Badge variant="outline" className="text-xs">
            15 Jan 2024
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Amount Burned</p>
            <p className="text-lg font-semibold">{formatCurrency(TCORE_STATS.lastBurnAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Value Impact</p>
            <p className="text-lg font-semibold text-green-600">+0.08%</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
        <div className="space-y-3">
          {recentBurns.map((burn, index) => (
            <div key={burn.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{formatCurrency(burn.amount)}</p>
                  <p className="text-xs text-muted-foreground">{burn.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  +{formatPercentage(burn.valueIncrease)}
                </p>
                <p className="text-xs text-muted-foreground">{burn.txHash}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Weekly Avg</p>
          <p className="text-sm font-semibold">{formatCurrency(12400)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Monthly Impact</p>
          <p className="text-sm font-semibold text-green-600">+0.31%</p>
        </div>
      </div>

      {/* Next Burn Prediction */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">Next Burn Estimate</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Based on current yield: ~{formatCurrency(13200)} expected in 7 days
        </p>
      </div>
    </div>
  );
};

export default BurnTracker;