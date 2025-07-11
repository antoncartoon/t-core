import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Target, DollarSign, Activity, BarChart3 } from 'lucide-react';

// Risk Curve Visualization Component
const RiskCurveVisualization = ({ selectedRange, onRangeChange, isAnimating }) => {
  const svgRef = useRef(null);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 300);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Nonlinear risk curve function f(i) = i^k
  const getRiskCurvePoint = (i, k = 1.5) => {
    return Math.pow(i / 100, k) * 100;
  };

  // Generate curve points
  const curvePoints = Array.from({ length: 101 }, (_, i) => ({
    x: (i / 100) * 400,
    y: 200 - (getRiskCurvePoint(i) / 100) * 180,
    risk: i,
    apy: 5 + (getRiskCurvePoint(i) / 100) * 20
  }));

  // Generate liquidity distribution (uneven)
  const getLiquidityAtLevel = (level) => {
    // Simulate uneven distribution - more liquidity at lower risk levels
    if (level < 30) return 60 + Math.random() * 40;
    if (level < 70) return 30 + Math.random() * 30;
    return 10 + Math.random() * 20;
  };

  const getRiskZoneColor = (risk) => {
    if (risk < 30) return 'hsl(120, 60%, 50%)'; // Green
    if (risk < 70) return 'hsl(50, 80%, 55%)'; // Yellow
    return 'hsl(20, 80%, 55%)'; // Orange
  };

  const getZoneColorClass = (risk) => {
    if (risk < 30) return 'text-green-500';
    if (risk < 70) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="space-y-6">
      {/* Risk Curve Visualization */}
      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          height="250"
          viewBox="0 0 450 250"
          className="border border-border rounded-lg bg-card/30"
        >
          {/* Background zones */}
          <defs>
            <linearGradient id="conservativeZone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(120, 60%, 50%)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(120, 60%, 50%)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="balancedZone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(50, 80%, 55%)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(50, 80%, 55%)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="aggressiveZone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(20, 80%, 55%)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(20, 80%, 55%)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Zone backgrounds */}
          <rect x="0" y="0" width="120" height="220" fill="url(#conservativeZone)" />
          <rect x="120" y="0" width="160" height="220" fill="url(#balancedZone)" />
          <rect x="280" y="0" width="120" height="220" fill="url(#aggressiveZone)" />
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(i => (
            <g key={i}>
              <line
                x1={(i / 100) * 400}
                y1="20"
                x2={(i / 100) * 400}
                y2="220"
                stroke="hsl(var(--muted-foreground))"
                strokeOpacity="0.2"
                strokeDasharray="2,2"
              />
              <text
                x={(i / 100) * 400}
                y="240"
                textAnchor="middle"
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
              >
                {i}
              </text>
            </g>
          ))}

          {/* Risk curve */}
          <path
            d={`M ${curvePoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
            className="animate-fade-in"
          />

          {/* Liquidity bars */}
          {Array.from({ length: 20 }, (_, i) => {
            const level = i * 5;
            const height = getLiquidityAtLevel(level) * 0.8;
            const x = (level / 100) * 400;
            return (
              <rect
                key={i}
                x={x - 8}
                y={220 - height}
                width="16"
                height={height}
                fill={getRiskZoneColor(level)}
                opacity="0.6"
                rx="2"
              />
            );
          })}

          {/* Selected range highlight */}
          {selectedRange && (
            <rect
              x={(selectedRange[0] / 100) * 400}
              y="20"
              width={((selectedRange[1] - selectedRange[0]) / 100) * 400}
              height="200"
              fill="hsl(var(--primary))"
              opacity="0.2"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              className="animate-fade-in"
            />
          )}

          {/* Animated indicator */}
          {isAnimating && (
            <circle
              cx={(animationStep / 300) * 400}
              cy={200 - (getRiskCurvePoint(animationStep / 3) / 100) * 180}
              r="6"
              fill="hsl(var(--primary))"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Zone labels */}
        <div className="absolute top-4 left-4 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-green-500 opacity-70"></div>
            <span className="text-green-500 font-medium">Conservative (1-30)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-yellow-500 opacity-70"></div>
            <span className="text-yellow-500 font-medium">Balanced (31-70)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-orange-500 opacity-70"></div>
            <span className="text-orange-500 font-medium">Aggressive (71-100)</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Risk Level</span>
        <span>APY increases non-linearly</span>
        <span>Liquidity Distribution (bars)</span>
      </div>
    </div>
  );
};

// Enhanced APY Calculator
const calculateAPY = (riskLevel, k = 1.5) => {
  const baseAPY = 5; // T-Bills rate
  const maxAPY = 25;
  const normalizedRisk = riskLevel / 100;
  const riskMultiplier = Math.pow(normalizedRisk, k);
  return baseAPY + riskMultiplier * (maxAPY - baseAPY);
};

const RiskSelection = () => {
  const [selectedRange, setSelectedRange] = useState([40, 60]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLiquidity, setShowLiquidity] = useState(true);

  // Calculate metrics for selected range
  const avgRisk = (selectedRange[0] + selectedRange[1]) / 2;
  const estimatedAPY = calculateAPY(avgRisk);
  const rangeWidth = selectedRange[1] - selectedRange[0];
  
  const getRiskLabel = (risk) => {
    if (risk < 30) return 'Conservative';
    if (risk < 70) return 'Balanced';
    return 'Aggressive';
  };

  const getRiskColorClass = (risk) => {
    if (risk < 30) return 'text-green-500';
    if (risk < 70) return 'text-yellow-500';
    return 'text-orange-500';
  };

  // Auto-animate on mount
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Navigate the Risk-Return Curve
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Our protocol features a nonlinear risk curve with 100 distinct levels. Choose your position 
            on the curve where liquidity is distributed unevenly, creating unique opportunities across 
            different risk zones.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Interactive Visualization */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Risk Curve Visualization</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="text-xs"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    {isAnimating ? 'Pause' : 'Animate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLiquidity(!showLiquidity)}
                    className="text-xs"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Liquidity
                  </Button>
                </div>
              </div>
              
              <RiskCurveVisualization
                selectedRange={selectedRange}
                onRangeChange={setSelectedRange}
                isAnimating={isAnimating}
              />
            </CardContent>
          </Card>

          {/* Right: Controls & Metrics */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Current Selection */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 font-medium ${getRiskColorClass(avgRisk)}`}>
                    <Target className="w-4 h-4" />
                    {getRiskLabel(avgRisk)} Range
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className={`text-3xl font-bold ${getRiskColorClass(avgRisk)}`}>
                      ~{estimatedAPY.toFixed(1)}% APY
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Range: {selectedRange[0]}-{selectedRange[1]} 
                      <span className="mx-2">•</span>
                      Width: {rangeWidth} levels
                    </div>
                  </div>
                </div>

                {/* Range Selector */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">Conservative</span>
                    <span className="text-yellow-500">Balanced</span>
                    <span className="text-orange-500">Aggressive</span>
                  </div>
                  
                  {/* Dual Range Slider */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Range Start</div>
                    <Slider
                      value={[selectedRange[0]]}
                      onValueChange={(value) => setSelectedRange([value[0], selectedRange[1]])}
                      max={selectedRange[1] - 1}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Range End</div>
                    <Slider
                      value={[selectedRange[1]]}
                      onValueChange={(value) => setSelectedRange([selectedRange[0], value[0]])}
                      max={100}
                      min={selectedRange[0] + 1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Quick presets */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRange([5, 25])}
                    className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Conservative
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRange([35, 65])}
                    className="text-xs text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                  >
                    Balanced
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRange([75, 95])}
                    className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Aggressive
                  </Button>
                </div>

                {/* Metrics */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Concentration Bonus</span>
                    <span className="font-medium">
                      {rangeWidth < 20 ? '+0.5%' : rangeWidth < 40 ? '+0.2%' : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lock Period</span>
                    <span className="font-medium">
                      {avgRisk < 30 ? '15 days' : avgRisk < 70 ? '60 days' : '120 days'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className="font-medium">
                      {Math.round(avgRisk * 100)}/10000
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid - Enhanced */}
        <Card className="border-border bg-card/50 mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium">Single Pool</h4>
                <p className="text-sm text-muted-foreground">
                  All funds go into one optimized investment strategy with T-Bills as the base layer
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium">Risk Distribution</h4>
                <p className="text-sm text-muted-foreground">
                  Nonlinear curve with priority-based payouts - higher risk positions absorb losses first
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium">Flexible Positioning</h4>
                <p className="text-sm text-muted-foreground">
                  Choose ranges instead of single points - concentrate or diversify across 100 levels
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" className="px-8">
            Start with {getRiskLabel(avgRisk).toLowerCase()} position
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join the unified pool and navigate your optimal risk-return position
          </p>
        </div>
      </div>
    </section>
  );
};

export default RiskSelection;