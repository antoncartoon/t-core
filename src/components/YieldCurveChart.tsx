
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

interface YieldCurveChartProps {
  riskLevel: number;
  yieldLevel: number;
}

const YieldCurveChart = ({ riskLevel, yieldLevel }: YieldCurveChartProps) => {
  // Generate yield curve data
  const generateCurveData = () => {
    const data = [];
    for (let i = 0; i <= 100; i += 5) {
      const risk = i;
      // Exponential yield curve with diminishing returns
      const yieldValue = Math.pow(i / 100, 1.5) * 25 + Math.random() * 2;
      data.push({ risk, yieldValue });
    }
    return data;
  };

  const data = generateCurveData();

  return (
    <div className="w-full h-64 bg-gray-50 rounded-lg p-4">
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-700">Risk-Yield Curve</h4>
        <p className="text-xs text-gray-500">
          Current selection: {yieldLevel.toFixed(1)}% yield at {riskLevel}% risk
        </p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis 
            dataKey="risk" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            label={{ value: 'Risk Level (%)', position: 'insideBottom', offset: -5, style: { fontSize: 10 } }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
          />
          <Line 
            type="monotone" 
            dataKey="yieldValue" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine 
            x={riskLevel} 
            stroke="#EF4444" 
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <ReferenceLine 
            y={yieldLevel} 
            stroke="#EF4444" 
            strokeDasharray="5 5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YieldCurveChart;
