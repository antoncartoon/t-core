
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const YieldSources = () => {
  const yieldData = [
    { source: 'T-Bills', current: 5.2, target: 5.4, volume: 56.5 },
    { source: 'Corp Bonds', current: 4.8, target: 5.0, volume: 37.5 },
    { source: 'Municipal', current: 4.2, target: 4.5, volume: 12.5 },
    { source: 'Cash', current: 2.1, target: 2.2, volume: 8.5 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">Current Yield: {data.current}%</p>
          <p className="text-sm text-muted-foreground">Target Yield: {data.target}%</p>
          <p className="text-sm text-muted-foreground">Volume: ${data.volume}M</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yield Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yieldData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="source" 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="current" fill="#10b981" name="Current Yield" />
              <Bar dataKey="target" fill="#3b82f6" name="Target Yield" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Weighted Average Yield</p>
            <p className="text-lg font-bold text-green-600">8.4%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total AUM</p>
            <p className="text-lg font-bold">$125.6M</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YieldSources;
