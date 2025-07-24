import React, { useState, useCallback, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, ReferenceArea, Tooltip, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Info } from 'lucide-react';
import { calculatePiecewiseAPY, getTierForSegment, calculatePredictedYield, calculateBonusYield, calculateComprehensiveAPY } from '@/utils/tzFormulas';
import { PROTOCOL_APY_28D, PERFORMANCE_FEE } from '@/utils/protocolConstants';

interface InteractiveLiquidityChartProps {
  selectedRange: [number, number];
  onRangeSelect: (range: [number, number]) => void;
  amount: number;
  liquidityData?: Array<{ bucket: number; liquidity: number }>;
}

// Use tier presets from unified formula library
const TIER_PRESETS = [
  { name: 'Safe', range: [0, 9] as [number, number], color: '#22c55e', bgColor: 'hsl(142, 76%, 36%)', description: 'Fixed 5.16% APY' },
  { name: 'Conservative', range: [10, 29] as [number, number], color: '#3b82f6', bgColor: 'hsl(221, 83%, 53%)', description: 'Linear 5.16% → 7%' },
  { name: 'Balanced', range: [30, 59] as [number, number], color: '#eab308', bgColor: 'hsl(48, 96%, 53%)', description: 'Quadratic 7% → 9.5%' },
  { name: 'Hero', range: [60, 99] as [number, number], color: '#ef4444', bgColor: 'hsl(0, 84%, 60%)', description: 'Exponential 9.5% × 1.03^(i-60)' }
];

const InteractiveLiquidityChart: React.FC<InteractiveLiquidityChartProps> = ({
  selectedRange,
  onRangeSelect,
  amount,
  liquidityData = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);

  // Generate yield curve data using the correct piecewise APY formula
  const yieldCurveData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 99; i += 1) {
      const apy = calculatePiecewiseAPY(i) * 100; // Convert to percentage
      const tier = getTierForSegment(i);
      const liquidity = liquidityData.find(l => Math.abs(l.bucket - i) <= 1)?.liquidity || 0;
      
      // Assign tier data for coloring based on correct ranges
      let tierIndex = 0;
      if (i >= 10 && i <= 29) tierIndex = 1;
      else if (i >= 30 && i <= 59) tierIndex = 2;
      else if (i >= 60 && i <= 99) tierIndex = 3;
      
      data.push({
        bucket: i,
        apy,
        liquidity,
        tierColor: TIER_PRESETS[tierIndex].color,
        tierName: TIER_PRESETS[tierIndex].name,
        tierIndex,
        isInRange: i >= selectedRange[0] && i <= selectedRange[1]
      });
    }
    return data;
  }, [selectedRange, liquidityData]);

  // Create separate data arrays for each tier
  const tierData = useMemo(() => {
    return TIER_PRESETS.map((preset, index) => ({
      ...preset,
      data: yieldCurveData.filter(d => d.tierIndex === index)
    }));
  }, [yieldCurveData]);

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
      const tier = getTierForSegment(label);
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Segment: ${label}`}</p>
          <p className="text-sm text-primary">
            {`APY: ${data.apy.toFixed(2)}%`}
          </p>
          <p className="text-sm" style={{ color: data.tierColor }}>
            {`Tier: ${data.tierName}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {`Formula: ${tier.formula}`}
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
            <CardTitle className="text-lg">Piecewise APY Curve & Quadratic Risk Model</CardTitle>
            <Badge variant="outline" className="text-xs">
              Selected: {selectedRange[0]}-{selectedRange[1]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Click or drag to select segments. Progressive formulas: Fixed → Linear → Quadratic → Exponential
          </p>
        </CardHeader>
        <CardContent>
          {/* Yield Curve with Colored Tiers */}
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
                  {/* Create gradients for each tier */}
                  {TIER_PRESETS.map((preset, index) => (
                    <React.Fragment key={preset.name}>
                      <linearGradient id={`${preset.name.toLowerCase()}Gradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={preset.bgColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={preset.bgColor} stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id={`${preset.name.toLowerCase()}Selected`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={preset.bgColor} stopOpacity={0.9}/>
                        <stop offset="95%" stopColor={preset.bgColor} stopOpacity={0.4}/>
                      </linearGradient>
                    </React.Fragment>
                  ))}
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
                
                {/* Background tier zones */}
                {TIER_PRESETS.map((preset, index) => (
                  <ReferenceArea
                    key={`bg-${preset.name}`}
                    x1={preset.range[0]}
                    x2={preset.range[1]}
                    fill={preset.bgColor}
                    fillOpacity={0.1}
                  />
                ))}

                {/* Main yield curve with tier-based coloring */}
                <Area
                  type="monotone"
                  dataKey="apy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#yieldGradient)"
                  fillOpacity={0.3}
                />

                {/* Tier boundary lines */}
                {[9.5, 29.5, 59.5].map((boundary, index) => (
                  <ReferenceLine 
                    key={`boundary-${index}`}
                    x={boundary} 
                    stroke="hsl(var(--border))" 
                    strokeDasharray="2 2"
                    strokeOpacity={0.6}
                  />
                ))}

                {/* Highlight selected range */}
                <ReferenceArea
                  x1={selectedRange[0]}
                  x2={selectedRange[1]}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
                
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

          {/* Tier Legend */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {TIER_PRESETS.map((preset, index) => (
              <div key={preset.name} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: preset.color }}
                />
                <span className="font-medium">{preset.name}</span>
                <span className="text-muted-foreground">({preset.range[0]}-{preset.range[1]})</span>
                {preset.name === 'Hero' && (
                  <Dialog open={isInsuranceDialogOpen} onOpenChange={setIsInsuranceDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="ml-0.5 p-0.5 hover:bg-muted rounded-full">
                        <Info 
                          size={14} 
                          className="text-red-500 animate-pulse cursor-pointer hover:text-red-600" 
                        />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          Hero Tier Insurance Mechanism
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Part of the protocol's 20% performance fee is continuously redirected to Hero tier (buckets 60-99) 
                          to provide insurance coverage for all participants.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Hero tier absorbs losses first but earns the highest yields, creating a waterfall protection 
                          system for lower-risk tiers.
                        </p>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground">
                            💡 This mechanism ensures that conservative investors are protected while rewarding 
                            risk-taking participants with premium yields.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
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
                <p className="font-semibold">{selectedRange[1] - selectedRange[0] + 1} segments</p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Avg APY</p>
                <p className="font-semibold text-green-600">
                  {calculateComprehensiveAPY(
                    amount || 1000, 
                    selectedRange
                  ).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Protocol Base</p>
                <p className="font-semibold text-blue-600">
                  {(PROTOCOL_APY_28D * 100).toFixed(1)}% (28d avg)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveLiquidityChart;
