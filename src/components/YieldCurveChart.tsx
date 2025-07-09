
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';

interface YieldCurveChartProps {
  riskLevel: number;
  yieldLevel: number;
}

const YieldCurveChart = ({ riskLevel, yieldLevel }: YieldCurveChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  
  const periods = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' }
  ];

  // Generate yield curve data based on selected period
  const generateCurveData = (period: string) => {
    const data = [];
    const multiplier = period === '1M' ? 0.8 : period === '3M' ? 1.0 : period === '6M' ? 1.1 : 1.2;
    
    for (let i = 0; i <= 100; i += 5) {
      const risk = i;
      // Exponential yield curve with diminishing returns, adjusted by period
      const baseYield = Math.pow(i / 100, 1.5) * 25 * multiplier;
      const volatility = period === '1Y' ? Math.random() * 4 : Math.random() * 2;
      const yieldValue = baseYield + volatility;
      data.push({ risk, yieldValue: Math.max(0, yieldValue) });
    }
    return data;
  };

  const data = generateCurveData(selectedPeriod);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Risk: ${label}%`}</p>
          <p className="text-sm text-blue-600">
            {`Yield: ${payload[0].value.toFixed(2)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 bg-muted/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-medium text-foreground">Risk-Yield Curve</h4>
          <p className="text-xs text-muted-foreground">
            Current: {yieldLevel.toFixed(1)}% yield at {riskLevel}% risk
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {periods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
              className="text-xs h-7 px-2"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="risk" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            label={{ 
              value: 'Risk Level (%)', 
              position: 'insideBottom', 
              offset: -5, 
              style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' } 
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            label={{ 
              value: 'Yield (%)', 
              angle: -90, 
              position: 'insideLeft', 
              style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' } 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="yieldValue" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
          />
          <ReferenceLine 
            x={riskLevel} 
            stroke="hsl(var(--destructive))" 
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <ReferenceLine 
            y={yieldLevel} 
            stroke="hsl(var(--destructive))" 
            strokeDasharray="5 5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YieldCurveChart;
