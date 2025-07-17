import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Star, Crown, TrendingUp } from 'lucide-react';

const InteractiveRiskYieldChart = () => {
  const [riskLevel, setRiskLevel] = useState([25]);
  const [animationProgress, setAnimationProgress] = useState(0);

  const tierPositions = [
    { position: 5, name: 'Safe', icon: Shield, color: 'text-green-600' },
    { position: 25, name: 'Conservative', icon: Shield, color: 'text-blue-600' },
    { position: 50, name: 'Balanced', icon: Star, color: 'text-yellow-600' },
    { position: 85, name: 'Hero', icon: Crown, color: 'text-purple-600' }
  ];

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Generate yield curve data
  const generateCurveData = () => {
    const data = [];
    for (let i = 0; i <= 100; i += 2) {
      const risk = i;
      // Base exponential curve: 6% to 35%
      const baseYield = 6 + (Math.pow(i / 100, 1.3) * 29);
      
      // Liquidity depth bonus (higher for mid-range risks)
      const liquidityMultiplier = 1 + (Math.sin((i / 100) * Math.PI) * 0.4);
      
      // Risk multiplier with diminishing returns
      const riskMultiplier = 1 + (Math.pow(i / 100, 0.8) * 0.3);
      
      const finalYield = baseYield * liquidityMultiplier * riskMultiplier;
      
      data.push({ 
        risk, 
        yield: Math.min(finalYield, 45), // Cap at 45%
        baseYield: Math.min(baseYield, 35),
        bonusYield: Math.min(finalYield - baseYield, 10)
      });
    }
    return data;
  };

  const data = generateCurveData();
  const currentRisk = riskLevel[0];
  const currentData = data.find(d => d.risk === Math.round(currentRisk / 2) * 2) || data[0];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{`Risk: ${label}%`}</p>
          <p className="text-sm text-primary">
            {`Total Yield: ${data.yield.toFixed(1)}%`}
          </p>
          <p className="text-xs text-muted-foreground">
            {`Base: ${data.baseYield.toFixed(1)}% + Bonus: ${data.bonusYield.toFixed(1)}%`}
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
          Interactive Risk-Yield Curve
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Adjust the risk level to see how your potential yield changes with liquidity depth bonuses
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          {/* Current Selection Display */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {currentData.yield.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Total APY</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-foreground">
                  {currentData.baseYield.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Base Yield</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-yellow-600">
                  +{currentData.bonusYield.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Bonus Yield</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#yieldGradient)"
                  fillOpacity={animationProgress}
                />
                
                {/* Tier Position Markers */}
                {tierPositions.map((tier, index) => (
                  <ReferenceLine 
                    key={index}
                    x={tier.position} 
                    stroke="hsl(var(--border))" 
                    strokeDasharray="2 2"
                    strokeOpacity={0.5}
                  />
                ))}
                
                {/* Current Selection Line */}
                <ReferenceLine 
                  x={currentRisk} 
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
              <span className="text-sm font-medium">Risk Level</span>
              <span className="text-sm text-muted-foreground">{currentRisk}%</span>
            </div>
            <Slider
              value={riskLevel}
              onValueChange={setRiskLevel}
              max={100}
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
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-purple-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">
                Liquidity Depth Bonus: Higher yields available at optimal risk ranges due to concentrated liquidity
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveRiskYieldChart;