import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculatePiecewiseAPY, calculateQuadraticRisk, getTierForSegment } from '@/utils/tzFormulas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DualAxisRiskYieldChartProps {
  selectedRange?: [number, number];
  className?: string;
}

const generateChartData = () => {
  const data = [];
  
  for (let i = 0; i <= 99; i++) {
    const apy = calculatePiecewiseAPY(i) * 100; // Convert to percentage
    const risk = calculateQuadraticRisk(i);
    const tier = getTierForSegment(i);
    
    data.push({
      segment: i,
      apy: apy,
      risk: risk,
      tier: tier.name,
      formula: tier.formula
    });
  }
  
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
        <p className="font-semibold">Segment {label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Tier: {data.tier}</p>
        <p className="text-sm text-blue-600">APY: {data.apy.toFixed(2)}%</p>
        <p className="text-sm text-red-600">Risk: {(data.risk * 100).toFixed(1)}%</p>
        <p className="text-xs text-gray-500 mt-1">{data.formula}</p>
      </div>
    );
  }
  return null;
};

export const DualAxisRiskYieldChart: React.FC<DualAxisRiskYieldChartProps> = ({ 
  selectedRange,
  className = '' 
}) => {
  const chartData = generateChartData();
  
  // Define tier colors
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Safe': return '#10B981'; // green
      case 'Conservative': return '#3B82F6'; // blue
      case 'Balanced': return '#F59E0B'; // amber
      case 'Hero': return '#8B5CF6'; // purple
      default: return '#6B7280'; // gray
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center">Risk & Yield Distribution Model</CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
          Quadratic Risk Function & Piecewise APY Model
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="segment" 
                label={{ value: 'Risk Segment (0-99)', position: 'insideBottom', offset: -5 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'APY (%)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax']}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                label={{ value: 'Risk Level', angle: 90, position: 'insideRight' }}
                tick={{ fontSize: 12 }}
                domain={[0, 1]}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Tier boundaries */}
              <ReferenceLine x={9} stroke="#10B981" strokeDasharray="2 2" />
              <ReferenceLine x={29} stroke="#3B82F6" strokeDasharray="2 2" />
              <ReferenceLine x={59} stroke="#F59E0B" strokeDasharray="2 2" />
              
              {/* Selected range highlight */}
              {selectedRange && (
                <>
                  <ReferenceLine x={selectedRange[0]} stroke="#EF4444" strokeWidth={2} />
                  <ReferenceLine x={selectedRange[1]} stroke="#EF4444" strokeWidth={2} />
                </>
              )}
              
              {/* APY Line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="apy"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
                name="Target APY"
              />
              
              {/* Risk Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="risk"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Risk Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>Target APY (Left Axis)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500 border-dashed border-t"></div>
            <span>Risk Level (Right Axis)</span>
          </div>
        </div>
        
        {/* Tier Legend */}
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Safe (0-9): Fixed 5.16%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Conservative (10-29): Linear → 7%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>Balanced (30-59): Quadratic → 9.5%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Hero (60-99): Exponential</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};