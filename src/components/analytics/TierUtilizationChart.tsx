
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { TIER_DEFINITIONS } from '@/types/riskTiers';

const COLORS = {
  SAFE: 'hsl(142.1 76.2% 36.3%)', // green-600
  CONSERVATIVE: 'hsl(221.2 83.2% 53.3%)', // blue-600
  BALANCED: 'hsl(35.5 91.7% 32.9%)', // yellow-600
  HERO: 'hsl(262.1 83.3% 57.8%)' // purple-600
};

export const TierUtilizationChart = () => {
  const data = [
    { name: 'Safe Tier', value: 4750000 },
    { name: 'Conservative', value: 2500000 },
    { name: 'Balanced', value: 3250000 },
    { name: 'Hero', value: 2000000 }
  ];

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${(data.value / 1000000).toFixed(2)}M TDD
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={Object.values(COLORS)[index]} 
              />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Object.entries(TIER_DEFINITIONS).map(([key, value], index) => (
          <div key={key} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: Object.values(COLORS)[index] }}
            />
            <span className="text-xs text-muted-foreground">
              {value.name} ({value.min}-{value.max})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
