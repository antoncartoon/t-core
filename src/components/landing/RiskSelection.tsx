import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Target, DollarSign, Eye, ArrowDown, ArrowUp, Shield } from 'lucide-react';

// Simple Uniswap V3-style risk band visualization
const RiskBandVisualization = ({ selectedRange, onRangeChange }) => {
  const getRiskZoneColor = (position) => {
    if (position < 30) return 'bg-green-500';
    if (position < 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getZoneOpacity = (position) => {
    if (position >= selectedRange[0] && position <= selectedRange[1]) {
      return 'opacity-80';
    }
    return 'opacity-20';
  };

  return (
    <div className="space-y-6">
      {/* Risk Band */}
      <div className="relative h-16 bg-muted/30 rounded-lg overflow-hidden">
        {/* Color zones */}
        <div className="absolute inset-0 flex">
          <div className="w-[30%] bg-green-500/20" />
          <div className="w-[40%] bg-yellow-500/20" />
          <div className="w-[30%] bg-orange-500/20" />
        </div>
        
        {/* Selected range highlight */}
        <div 
          className="absolute top-0 h-full bg-primary/30 border-2 border-primary"
          style={{
            left: `${selectedRange[0]}%`,
            width: `${selectedRange[1] - selectedRange[0]}%`
          }}
        />
        
        {/* Range markers */}
        <div 
          className="absolute top-0 w-1 h-full bg-primary"
          style={{ left: `${selectedRange[0]}%` }}
        />
        <div 
          className="absolute top-0 w-1 h-full bg-primary"
          style={{ left: `${selectedRange[1]}%` }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-green-600 font-medium">Conservative (1-30)</span>
        <span className="text-yellow-600 font-medium">Balanced (31-70)</span>
        <span className="text-orange-600 font-medium">Aggressive (71-100)</span>
      </div>
    </div>
  );
};

// APY Calculator
const calculateAPY = (riskLevel) => {
  const baseAPY = 5; // T-Bills rate
  const maxAPY = 25;
  const normalizedRisk = riskLevel / 100;
  return baseAPY + normalizedRisk * (maxAPY - baseAPY);
};

// Waterfall Distribution Component
const WaterfallDistribution = () => {
  const waterfallFlow = [
    { level: "Conservative", color: "green", allocation: "60%", yield: "5-8%" },
    { level: "Balanced", color: "yellow", allocation: "30%", yield: "8-15%" },
    { level: "Aggressive", color: "orange", allocation: "10%", yield: "15-25%" }
  ];

  return (
    <Card className="border-border bg-card/50 mb-8">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-medium">Waterfall Risk/Reward Distribution</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Protocol yields distributed bottom-up, losses absorbed top-down
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-emerald-600 mb-4 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Self-insurance pool. You are protected by yield generated.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Yield Flow */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-600">Yields (bottom-up)</span>
            </div>
            <div className="space-y-3">
              {waterfallFlow.map((level, index) => {
                const colors = {
                  green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-800',
                  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-200 dark:border-yellow-800', 
                  orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-200 dark:border-orange-800'
                };
                
                return (
                  <div key={index} className={`p-3 rounded-lg border ${colors[level.color as keyof typeof colors]}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{level.level}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{level.yield}</div>
                        <div className="text-xs opacity-75">{level.allocation} participants</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Loss Absorption */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ArrowDown className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-600">Losses (top-down)</span>
            </div>
            <div className="space-y-3">
              {[...waterfallFlow].reverse().map((level, index) => {
                const colors = {
                  orange: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-800',
                  yellow: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-200 dark:border-orange-800',
                  green: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-200 dark:border-yellow-800'
                };
                
                return (
                  <div key={index} className={`p-3 rounded-lg border ${colors[level.color as keyof typeof colors]}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{level.level}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {index === 0 ? 'First' : index === 1 ? 'Second' : 'Protected'}
                        </div>
                        <div className="text-xs opacity-75">
                          {index === 0 ? 'absorb' : index === 1 ? 'absorb' : 'from losses'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Mathematical transparency:</strong> All calculations based on precise formulas, 
            every transaction visible on-chain, fair distribution guaranteed by code.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const RiskSelection = () => {
  const [selectedRange, setSelectedRange] = useState([40, 60]);

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
    if (risk < 30) return 'text-green-600';
    if (risk < 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Choose Your Risk Position
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Select your position on the risk spectrum. Each level offers different rewards and responsibilities 
            in our waterfall distribution model.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Simple Visualization */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-6">Position Selector</h3>
              
              <RiskBandVisualization
                selectedRange={selectedRange}
                onRangeChange={setSelectedRange}
              />
              
              {/* Range Controls */}
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Range</label>
                  <Slider
                    value={selectedRange}
                    onValueChange={setSelectedRange}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{selectedRange[0]}</span>
                    <span>{selectedRange[1]}</span>
                  </div>
                </div>

                {/* Quick presets */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRange([5, 25])}
                    className="text-xs"
                  >
                    Conservative
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRange([35, 65])}
                    className="text-xs"
                  >
                    Balanced
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRange([75, 95])}
                    className="text-xs"
                  >
                    Aggressive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Position Info */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Current Selection */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 font-medium ${getRiskColorClass(avgRisk)}`}>
                    <Target className="w-4 h-4" />
                    {getRiskLabel(avgRisk)} Position
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

                {/* Metrics */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Rate (T-Bills)</span>
                    <span className="font-medium">5.0%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Risk Premium</span>
                    <span className="font-medium">
                      +{(estimatedAPY - 5).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Position Efficiency</span>
                    <span className="font-medium">
                      {rangeWidth < 20 ? 'High' : rangeWidth < 40 ? 'Medium' : 'Broad'}
                    </span>
                  </div>
                </div>

                {/* Position Description */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">{getRiskLabel(avgRisk)} Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    {avgRisk < 30 
                      ? 'Lower volatility, steady returns, protected from most losses'
                      : avgRisk < 70 
                      ? 'Balanced risk-reward, moderate volatility, shared loss protection'
                      : 'Higher returns potential, absorbs losses first, maximum risk exposure'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waterfall Distribution */}
        <WaterfallDistribution />

        {/* Features Grid */}
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
                  Waterfall model with priority-based payouts - higher risk positions absorb losses first
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