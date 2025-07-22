
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface RiskDataPoint {
  level: string;
  value: number;
  color: string;
}

const RiskDistributionChart = () => {
  // Sample data - in a real implementation, this would come from the protocol state
  const riskData: RiskDataPoint[] = [
    { level: '1-25', value: 45, color: 'hsl(142.1 76.2% 36.3%)' }, // Safe Tier (green)
    { level: '26-50', value: 25, color: 'hsl(221.2 83.2% 53.3%)' }, // Conservative (blue)
    { level: '51-75', value: 20, color: 'hsl(35.5 91.7% 32.9%)' },  // Balanced (yellow)
    { level: '76-100', value: 10, color: 'hsl(262.1 83.3% 57.8%)' } // Hero (purple)
  ];

  // Calculate total for percentage display
  const total = riskData.reduce((sum, item) => sum + item.value, 0);

  // Chart configuration
  const chartConfig = {
    safe: { 
      color: 'hsl(142.1 76.2% 36.3%)', // green-600
      label: 'Safe Tier (1-25)' 
    },
    conservative: { 
      color: 'hsl(221.2 83.2% 53.3%)', // blue-600
      label: 'Conservative (26-50)' 
    },
    balanced: { 
      color: 'hsl(35.5 91.7% 32.9%)', // yellow-600
      label: 'Balanced (51-75)' 
    },
    hero: { 
      color: 'hsl(262.1 83.3% 57.8%)', // purple-600
      label: 'Hero (76-100)' 
    }
  };

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.level} Risk Level</p>
          <p className="text-sm text-muted-foreground">
            {data.value}% of total liquidity ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ChartContainer className="h-full" config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riskData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="level" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              fill="url(#colorUv)"
            >
              {riskData.map((entry, index) => (
                <Bar 
                  key={`bar-${index}`} 
                  dataKey="value" 
                  fill={entry.color} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </Bar>
            <ChartTooltip content={renderTooltip} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {riskData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">
              {item.level} ({((item.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDistributionChart;
