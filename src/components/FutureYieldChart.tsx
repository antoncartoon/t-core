
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

const FutureYieldChart = () => {
  const data = [
    { month: 'Jan', ptYield: 12.8, ytYield: 8.2, impliedYield: 15.5 },
    { month: 'Feb', ptYield: 12.8, ytYield: 9.1, impliedYield: 16.2 },
    { month: 'Mar', ptYield: 12.8, ytYield: 10.5, impliedYield: 17.1 },
    { month: 'Apr', ptYield: 12.8, ytYield: 12.2, impliedYield: 18.0 },
    { month: 'May', ptYield: 12.8, ytYield: 14.8, impliedYield: 18.5 },
    { month: 'Jun', ptYield: 12.8, ytYield: 16.5, impliedYield: 19.2 },
    { month: 'Jul', ptYield: 12.8, ytYield: 15.2, impliedYield: 18.8 },
    { month: 'Aug', ptYield: 12.8, ytYield: 13.8, impliedYield: 18.1 },
    { month: 'Sep', ptYield: 12.8, ytYield: 14.5, impliedYield: 18.4 },
    { month: 'Oct', ptYield: 12.8, ytYield: 16.1, impliedYield: 19.0 },
    { month: 'Nov', ptYield: 12.8, ytYield: 17.8, impliedYield: 19.8 },
    { month: 'Dec', ptYield: 12.8, ytYield: 18.5, impliedYield: 20.2 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <span>Future Yield Projections</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === 'ptYield' ? 'PT Fixed Yield' :
                  name === 'ytYield' ? 'YT Current Yield' : 'Implied Future Yield'
                ]}
              />
              
              <Area
                type="monotone"
                dataKey="impliedYield"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="ptYield"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="ytYield"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span className="text-muted-foreground">PT Fixed</span>
            </div>
            <p className="font-medium text-blue-600">12.8% APY</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-muted-foreground">YT Current</span>
            </div>
            <p className="font-medium text-green-600">18.5% APY</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-0.5 bg-purple-500"></div>
              <span className="text-muted-foreground">Future Implied</span>
            </div>
            <p className="font-medium text-purple-600">20.2% APY</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FutureYieldChart;
