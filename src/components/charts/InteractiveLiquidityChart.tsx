
import React, { useState, useCallback, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculatePrecisionAPY, getTierForBucket } from '@/utils/tzFormulas';

interface InteractiveLiquidityChartProps {
  selectedRange: [number, number];
  onRangeSelect: (range: [number, number]) => void;
  amount: number;
  liquidityData?: Array<{ bucket: number; liquidity: number }>;
}

// Predefined tier ranges for quick selection
const TIER_PRESETS = [
  { name: 'Safe', range: [0, 9] as [number, number], color: '#22c55e', description: 'Guaranteed T-Bills yield' },
  { name: 'Conservative', range: [10, 29] as [number, number], color: '#3b82f6', description: 'Moderate risk, steady returns' },
  { name: 'Balanced', range: [30, 59] as [number, number], color: '#eab308', description: 'Higher yield potential' },
  { name: 'Hero', range: [60, 99] as [number, number], color: '#ef4444', description: 'Maximum yield, absorbs losses first' }
];

const InteractiveLiquidityChart: React.FC<InteractiveLiquidityChartProps> = ({
  selectedRange,
  onRangeSelect,
  amount,
  liquidityData = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);

  // Generate yield curve data
  const yieldCurveData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 99; i += 2) {
      const apy = calculatePrecisionAPY(i) * 100;
      const tier = getTierForBucket(i);
      const liquidity = liquidityData.find(l => Math.abs(l.bucket - i) <= 1)?.liquidity || 0;
      
      data.push({
        bucket: i,
        apy,
        liquidity,
        tierColor: tier.color,
        tierName: tier.name,
        isInRange: i >= selectedRange[0] && i <= selectedRange[1]
      });
    }
    return data;
  }, [selectedRange, liquidityData]);

  // Handle chart interactions
  const handleChartClick = useCallback((data: any) => {
    if (!data || !data.activePayload) return;
    
    const clickedBucket = data.activePayload[0]?.payload?.bucket;
    if (typeof clickedBucket === 'number') {
      // Simple click selects a 10-bucket range around the clicked point
      const rangeStart = Math.max(0, clickedBucket - 5);
      const rangeEnd = Math.min(99, clickedBucket + 5);
      onRangeSelect([rangeStart, rangeEnd]);
    }
  }, [onRangeSelect]);

  const handleMouseDown = useCallback((data: any) => {
    if (!data || !data.activePayload) return;
    
    const bucket = data.activePayload[0]?.payload?.bucket;
    if (typeof bucket === 'number') {
      setIsDragging(true);
      setDragStart(bucket);
    }
  }, []);

  const handleMouseMove = useCallback((data: any) => {
    if (!isDragging || dragStart === null || !data || !data.activePayload) return;
    
    const currentBucket = data.activePayload[0]?.payload?.bucket;
    if (typeof currentBucket === 'number') {
      const start = Math.min(dragStart, currentBucket);
      const end = Math.max(dragStart, currentBucket);
      onRangeSelect([start, end]);
    }
  }, [isDragging, dragStart, onRangeSelect]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Bucket: ${label}`}</p>
          <p className="text-sm text-primary">
            {`APY: ${data.apy.toFixed(2)}%`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Tier: ${data.tierName}`}
          </p>
          {data.liquidity > 0 && (
            <p className="text-sm text-muted-foreground">
              {`Liquidity: $${data.liquidity.toLocaleString()}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Tier Preset Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {TIER_PRESETS.map((preset) => {
          const isSelected = selectedRange[0] >= preset.range[0] && selectedRange[1] <= preset.range[1];
          return (
            <button
              key={preset.name}
              onClick={() => onRangeSelect(preset.range)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                isSelected 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: preset.color }}
                />
                <span className="font-medium text-sm">{preset.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{preset.description}</p>
              <div className="text-xs font-medium mt-1">
                Buckets {preset.range[0]}-{preset.range[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Yield Curve Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Yield Curve & Liquidity Distribution</CardTitle>
            <Badge variant="outline" className="text-xs">
              Selected: {selectedRange[0]}-{selectedRange[1]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Click or drag to select risk range. Higher buckets = higher yield + higher risk.
          </p>
        </CardHeader>
        <CardContent>
          {/* Yield Curve */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={yieldCurveData}
                onClick={handleChartClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="selectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                
                <XAxis 
                  dataKey="bucket" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Risk Level (Buckets)', position: 'insideBottom', offset: -5, style: { fontSize: 10 } }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'APY (%)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Base yield curve */}
                <Area
                  type="monotone"
                  dataKey="apy"
                  stroke="hsl(var(--primary))"
                  fill="url(#yieldGradient)"
                  strokeWidth={2}
                />

                {/* Highlight selected range */}
                <ReferenceLine 
                  x={selectedRange[0]} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <ReferenceLine 
                  x={selectedRange[1]} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Liquidity Histogram */}
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yieldCurveData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="bucket" 
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                />
                <YAxis hide />
                <Bar 
                  dataKey="liquidity" 
                  fill="hsl(var(--muted-foreground))"
                  opacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Range Info */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Selected Range</p>
                <p className="font-semibold">{selectedRange[0]} - {selectedRange[1]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Range Width</p>
                <p className="font-semibold">{selectedRange[1] - selectedRange[0] + 1} buckets</p>
              </div>
              <div>
                <p className="text-muted-foreground">Min APY</p>
                <p className="font-semibold text-green-600">
                  {(calculatePrecisionAPY(selectedRange[0]) * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Max APY</p>
                <p className="font-semibold text-blue-600">
                  {(calculatePrecisionAPY(selectedRange[1]) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Mechanism Explanation */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Hero Tier Insurance Mechanism</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Part of the protocol's 20% performance fee is continuously redirected to Hero tier (buckets 60-99) 
                to provide insurance coverage for all participants. Hero tier absorbs losses first but earns the highest yields, 
                creating a waterfall protection system for lower-risk tiers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveLiquidityChart;
