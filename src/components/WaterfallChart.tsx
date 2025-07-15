import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { simulateSurplusDistribution } from '@/utils/riskRangeCalculations';
import { formatCurrency } from '@/data/tcoreData';

const WaterfallChart = () => {
  const distribution = simulateSurplusDistribution();
  
  // Prepare data for waterfall visualization
  const data = [
    {
      name: 'Tier 1\n(Fixed)',
      value: distribution.tier1,
      percentage: '0%',
      color: '#22c55e',
      description: 'Guaranteed 6% fixed yield'
    },
    {
      name: 'Tier 2\n(Low Bonus)',
      value: distribution.tier2,
      percentage: '8%',
      color: '#3b82f6',
      description: 'Fixed + small surplus share'
    },
    {
      name: 'Tier 3\n(Medium Bonus)',
      value: distribution.tier3,
      percentage: '17%',
      color: '#f59e0b',
      description: 'Fixed + medium surplus share'
    },
    {
      name: 'Tier 4\n(High Bonus)',
      value: distribution.tier4,
      percentage: '75%',
      color: '#8b5cf6',
      description: 'Fixed + largest surplus share'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground mb-1">
            {data.description}
          </p>
          <p className="text-sm font-semibold">
            Surplus: {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-muted-foreground">
            Share: {data.percentage} of total surplus
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              interval={0}
              height={60}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Total Surplus</p>
          <p className="text-lg font-semibold">
            {formatCurrency(distribution.tier2 + distribution.tier3 + distribution.tier4)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Tier 4 Dominance</p>
          <p className="text-lg font-semibold text-purple-600">
            {formatCurrency(distribution.tier4)}
          </p>
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Surplus Distribution</p>
        <div className="space-y-1">
          {data.slice(1).map((tier, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
                <span>{tier.name.replace('\n', ' ')}</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{formatCurrency(tier.value)}</span>
                <span className="text-muted-foreground ml-2">({tier.percentage})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Note */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Formula:</strong> Dist_i = surplus × (f(i)/∑f(j&gt;1)) × (S_i / ∑S_higher)
          <br />
          Where f(i) = 1.03^(i - 25) creates exponential weighting for higher tiers.
        </p>
      </div>
    </div>
  );
};

export default WaterfallChart;