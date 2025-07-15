import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TCORE_STATS } from '@/data/tcoreData';

const SupplyChart = () => {
  // Generate sample data showing supply reduction over time
  const generateSupplyData = () => {
    const initialSupply = TCORE_STATS.totalTDDIssued;
    const data = [];
    
    // Generate 12 months of data
    for (let i = 0; i <= 12; i++) {
      const monthlyBurnRate = 0.002; // 0.2% per month
      const cumulativeBurn = i * monthlyBurnRate;
      const currentSupply = initialSupply * (1 - cumulativeBurn);
      
      data.push({
        month: i === 0 ? 'Now' : `${i}M`,
        supply: currentSupply,
        burned: initialSupply - currentSupply,
        valueIncrease: (cumulativeBurn * 100).toFixed(2)
      });
    }
    
    return data;
  };

  const data = generateSupplyData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm text-muted-foreground">
            {`Supply: ${(data.supply / 1000000).toFixed(2)}M TDD`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Burned: ${(data.burned / 1000).toFixed(1)}K TDD`}
          </p>
          <p className="text-sm text-green-600">
            {`Value Increase: +${data.valueIncrease}%`}
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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={TCORE_STATS.totalTDDIssued} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              label="Initial Supply"
            />
            <Line 
              type="monotone" 
              dataKey="supply" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <p className="text-sm font-medium">Current Supply</p>
          <p className="text-lg font-semibold">
            {((TCORE_STATS.totalTDDIssued * (1 - TCORE_STATS.supplyReduction)) / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Burned Total</p>
          <p className="text-lg font-semibold text-orange-600">
            {(TCORE_STATS.totalBurned / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Projected 1Y</p>
          <p className="text-lg font-semibold text-green-600">
            -2.4%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplyChart;