
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ProtocolAllocations = () => {
  const allocations = [
    { name: 'T-Bills (6M)', value: 45, color: '#10b981' },
    { name: 'Corporate Bonds', value: 30, color: '#3b82f6' },
    { name: 'Stable Yields', value: 15, color: '#8b5cf6' },
    { name: 'Liquidity Reserve', value: 10, color: '#f59e0b' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border p-2 rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.value}% of protocol</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocol Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocations}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {allocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {allocations.map((allocation) => (
            <div key={allocation.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: allocation.color }}
                />
                <span>{allocation.name}</span>
              </div>
              <span className="font-medium">{allocation.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtocolAllocations;
