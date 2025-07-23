
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, Crown, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { 
  calculatePiecewiseAPY, 
  generatePiecewiseCurveData, 
  getTierForSegment,
  TARGET_APYS
} from '@/utils/piecewiseAPY';

const InteractiveRiskYieldChart = () => {
  const [riskLevel, setRiskLevel] = useState([45]);
  const [animationProgress, setAnimationProgress] = useState(0);

  const tierPositions = [
    { position: 5, name: 'Safe', icon: Shield, color: 'text-green-600', range: [0, 9] },
    { position: 20, name: 'Conservative', icon: Shield, color: 'text-blue-600', range: [10, 29] },
    { position: 45, name: 'Balanced', icon: Star, color: 'text-yellow-600', range: [30, 59] },
    { position: 80, name: 'Hero', icon: Crown, color: 'text-purple-600', range: [60, 99] }
  ];

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Generate new piecewise curve data
  const data = generatePiecewiseCurveData();
  const currentSegment = riskLevel[0];
  const currentAPY = calculatePiecewiseAPY(currentSegment);
  const currentTier = getTierForSegment(currentSegment);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{`Segment: ${label}`}</p>
          <p className="text-sm text-primary">
            {`APY: ${data.apy.toFixed(2)}%`}
          </p>
          <p className="text-xs text-muted-foreground">
            {`Tier: ${data.tier}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {`Formula: ${data.formula}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-16 px-4 sm:px-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="h-px bg-border flex-1" />
          <span className="px-6 text-sm text-muted-foreground bg-background">
            or choose your custom tier
          </span>
          <div className="h-px bg-border flex-1" />
        </div>
        <h3 className="text-2xl font-light text-foreground mb-2">
          Interactive Piecewise Yield Curve
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Updated model with quadratic risk function and simplified piecewise APY: Safe (5.16%), Conservative (7%), Balanced (9%), Hero (exponential)
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          {/* Current Selection Display */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {(currentAPY * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-muted-foreground">Current APY</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className={currentTier.color}>
                  {currentTier.name}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">{currentTier.formula}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-foreground">
                  Segment {currentSegment}
                </div>
                <div className="text-xs text-muted-foreground">Risk Level</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="piecewiseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="segment" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  label={{ 
                    value: 'Risk Segment', 
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
                    value: 'APY (%)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' } 
                  }}
                  domain={[5, 16]}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Piecewise curve area */}
                <Area 
                  type="monotone" 
                  dataKey="apy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#piecewiseGradient)"
                  fillOpacity={animationProgress}
                />
                
                {/* Tier boundary markers */}
                {[9.5, 29.5, 59.5].map((boundary, index) => (
                  <ReferenceLine 
                    key={index}
                    x={boundary} 
                    stroke="hsl(var(--border))" 
                    strokeDasharray="2 2"
                    strokeOpacity={0.7}
                  />
                ))}
                
                {/* Current selection line */}
                <ReferenceLine 
                  x={currentSegment} 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Level Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Segment</span>
              <span className="text-sm text-muted-foreground">{currentSegment}</span>
            </div>
            <Slider
              value={riskLevel}
              onValueChange={setRiskLevel}
              max={99}
              min={0}
              step={1}
              className="w-full"
            />
            
            {/* Tier Markers */}
            <div className="flex justify-between text-xs text-muted-foreground">
              {tierPositions.map((tier, index) => (
                <div key={index} className="flex flex-col items-center">
                  <tier.icon className={`w-3 h-3 ${tier.color} mb-1`} />
                  <span>{tier.name}</span>
                  <span className="text-[10px]">{tier.range[0]}-{tier.range[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Breakdown */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {tierPositions.map((tier, index) => {
              const isSelected = currentSegment >= tier.range[0] && currentSegment <= tier.range[1];
              const startAPY = calculatePiecewiseAPY(tier.range[0]);
              const endAPY = calculatePiecewiseAPY(tier.range[1]);
              
              return (
                <div
                  key={tier.name}
                  className={`p-3 rounded-lg border transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <tier.icon className={`w-4 h-4 ${tier.color}`} />
                    <span className="font-medium text-sm">{tier.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {tier.range[0]}-{tier.range[1]}
                  </div>
                  <div className="text-sm font-medium">
                    {tier.name === 'Safe' 
                      ? `${(startAPY * 100).toFixed(2)}%`
                      : `${(startAPY * 100).toFixed(1)}% → ${(endAPY * 100).toFixed(1)}%`
                    }
                  </div>
                </div>
              );
            })}
          </div>

          {/* Formula Explanation */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-purple-600 text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Piecewise Function Model</span>
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
              <div>• <strong>Safe (0-9):</strong> Fixed 5.16% = T-Bills × 1.2</div>
              <div>• <strong>Conservative (10-29):</strong> Flat 7% APY</div>
              <div>• <strong>Balanced (30-59):</strong> Flat 9% APY</div>
              <div>• <strong>Hero (60-99):</strong> Exponential 1.03^(i-25)%</div>
            </div>
          </div>

          {/* Disclaimer */}
          <Alert className="mt-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
              <strong>Updated Model:</strong> This new piecewise function provides fairer, more predictable yields with distinct tier characteristics. Each tier has its own growth logic for better transparency and user experience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveRiskYieldChart;
