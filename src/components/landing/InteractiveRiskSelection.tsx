
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NavLink } from 'react-router-dom';
import { Calculator, TrendingUp, Shield, Zap, ArrowRight, Star, Crown } from 'lucide-react';
import { 
  calculateTCoreAPY, 
  FIXED_BASE_APY,
  TIER1_WIDTH
} from '@/utils/riskRangeCalculations';
import { TIER_PRESETS } from '@/utils/tzFormulas';
import TCoreWaterfallVisualization from './TCoreWaterfallVisualization';

const InteractiveRiskSelection = () => {
  const [demoAmount] = useState(10000);
  const [demoBucket, setDemoBucket] = useState(50);
  const [isAnimating, setIsAnimating] = useState(true);

  // Auto-cycle through different risk levels for demo
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setDemoBucket(prev => {
        const buckets = [5, 20, 45, 80]; // Representative buckets for each tier
        const currentIndex = buckets.indexOf(prev);
        return buckets[(currentIndex + 1) % buckets.length];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const currentAPY = calculateTCoreAPY(demoBucket);
  const annualYield = demoAmount * currentAPY;

  // T-Core tier definitions with proper boundaries
  const tierExamples = [
    { bucket: 5, name: 'Safe', color: 'bg-green-100 text-green-800 border-green-200', icon: Shield, range: '0-9' },
    { bucket: 20, name: 'Conservative', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Shield, range: '10-29' },
    { bucket: 45, name: 'Balanced', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Star, range: '30-59' },
    { bucket: 80, name: 'Hero', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Crown, range: '60-99' }
  ];

  // Get tier info for current bucket
  const getCurrentTier = (bucket: number) => {
    if (bucket <= 9) return { name: 'Safe', color: 'bg-green-100 text-green-800 border-green-200' };
    if (bucket <= 29) return { name: 'Conservative', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (bucket <= 59) return { name: 'Balanced', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { name: 'Hero', color: 'bg-purple-100 text-purple-800 border-purple-200' };
  };

  const currentTier = getCurrentTier(demoBucket);

  // Calculate APY breakdown
  const calculateAPYBreakdown = (bucket: number) => {
    const baseAPY = FIXED_BASE_APY;
    const totalAPY = calculateTCoreAPY(bucket);
    const bonusAPY = totalAPY - baseAPY;
    
    return { baseAPY, bonusAPY, totalAPY };
  };

  const apyBreakdown = calculateAPYBreakdown(demoBucket);

  return (
    <section className="py-16 sm:py-20 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            INTERACTIVE DEMO
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-light mb-4">
            Choose Your Risk Strategy
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience live APY calculations with T-Core's mathematical precision. 
            Uneven tier widths ensure fair distribution, while bonus yield incentivizes balanced liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Live Calculator */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Live APY Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Demo Input */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Demo Amount</div>
                <div className="text-2xl font-bold">${demoAmount.toLocaleString()} TDD</div>
              </div>

              {/* Current Tier Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Level:</span>
                  <Badge variant="outline" className={currentTier.color}>
                    Level {demoBucket} • {currentTier.name}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Level</span>
                    <span>{demoBucket}/99</span>
                  </div>
                  <Progress value={(demoBucket / 99) * 100} className="h-2" />
                </div>
              </div>

              {/* APY Breakdown */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-950/20 dark:to-purple-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {(apyBreakdown.totalAPY * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Total APY</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center border-t pt-3">
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {(apyBreakdown.baseAPY * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-green-700">Base APY</div>
                  </div>
                  <div>
                     <div className="text-lg font-semibold text-purple-600">
                       +{(apyBreakdown.bonusAPY * 100).toFixed(1)}%
                     </div>
                    <div className="text-xs text-purple-700">Risk Bonus</div>
                  </div>
                </div>
                
                <div className="text-center border-t pt-3">
                  <div className="text-xl font-semibold text-primary">
                    ${annualYield.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Expected Annual Yield</div>
                </div>
              </div>

              {/* T-Core Formula */}
              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                <strong>T-Core Formula:</strong> 
                {demoBucket <= TIER1_WIDTH ? (
                  ` Fixed guarantee: ${(FIXED_BASE_APY * 100).toFixed(1)}% APY`
                ) : (
                  ` f(i) = 1.03^(${demoBucket}-${TIER1_WIDTH}) = ${Math.pow(1.03, demoBucket - TIER1_WIDTH).toFixed(3)}`
                )}
              </div>

              {/* Interactive Tier Selection */}
              <div className="grid grid-cols-1 gap-3">
                {tierExamples.map((example) => {
                  const exampleAPY = calculateTCoreAPY(example.bucket);
                  const exampleYield = demoAmount * exampleAPY;
                  const isActive = demoBucket === example.bucket;
                  
                  return (
                    <div
                      key={example.bucket}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                        isActive 
                          ? `${example.color} border-current shadow-lg` 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setDemoBucket(example.bucket);
                        setIsAnimating(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <example.icon className="h-4 w-4" />
                          <span className="font-medium">{example.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {(exampleAPY * 100).toFixed(2)}%
                          </div>
                          <div className="text-xs opacity-70">
                            ${exampleYield.toLocaleString()}/year
                          </div>
                        </div>
                      </div>
                      <div className="text-xs opacity-70">
                        Levels {example.range} • Width: {example.range.split('-').map(Number).reduce((a, b) => b - a + 1)} levels
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right: Tier Structure Visualization */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                T-Core Tier Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Uneven Tier Widths Visualization */}
              <div className="space-y-4">
                <h4 className="font-medium">Uneven Tier Widths (Fair Distribution)</h4>
                <div className="relative h-32 bg-muted/20 rounded-lg overflow-hidden">
                  {tierExamples.map((tier, index) => {
                    const [start, end] = tier.range.split('-').map(Number);
                    const width = end - start + 1;
                    const leftPercent = tierExamples.slice(0, index).reduce((sum, t) => {
                      const [s, e] = t.range.split('-').map(Number);
                      return sum + (e - s + 1);
                    }, 0);
                    
                    const isActive = demoBucket >= start && demoBucket <= end;
                    
                    return (
                      <div
                        key={tier.name}
                        className={`absolute h-full transition-all duration-300 border-r-2 border-background cursor-pointer ${
                          isActive ? 'ring-2 ring-primary ring-inset' : ''
                        }`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${width}%`,
                          backgroundColor: `hsl(var(${tier.color.split(' ')[0].replace('bg-', '--')}))`
                        }}
                        onClick={() => {
                          setDemoBucket(tier.bucket);
                          setIsAnimating(false);
                        }}
                      >
                        <div className="flex flex-col items-center justify-center h-full text-white text-xs font-medium">
                          <tier.icon className="h-4 w-4 mb-1" />
                          <span>{tier.name}</span>
                          <span className="opacity-70">{tier.range}</span>
                          <span className="opacity-70 text-xs">{width} levels</span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Active level indicator */}
                  <div
                    className="absolute top-0 w-1 h-full bg-red-500 z-10 animate-pulse"
                    style={{ left: `${demoBucket}%` }}
                  />
                </div>
              </div>

              {/* Waterfall Explanation */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Waterfall Distribution</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-green-600 font-medium mb-2">Yield Flow ↑</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Safe: Fixed {(FIXED_BASE_APY * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Conservative: Base + bonus</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Balanced: Enhanced yield</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Hero: All residual</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-red-600 font-medium mb-2">Loss Protection ↓</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Hero: First absorption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Balanced: Secondary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Conservative: Tertiary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Safe: Protected (0% loss)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Fee Info */}
              <div className="p-3 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 text-purple-600 text-sm mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Performance Fee Distribution</span>
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <div>20% performance fee → 25% bonus yield (incentives)</div>
                  <div>25% buyback TDD → 25% protocol revenue → 25% insurance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Waterfall Visualization */}
        <div className="mb-12">
          <TCoreWaterfallVisualization />
        </div>

        {/* Single CTA */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-purple/5 border-primary/20">
            <CardContent className="p-0 space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Ready for Precision Staking?</h3>
                <p className="text-muted-foreground">
                  Launch the full interface with exact calculations, stress testing, and advanced features.
                </p>
              </div>
              
              <NavLink to="/app">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Calculator className="w-4 h-4 mr-2" />
                  Launch App
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </NavLink>
              
              <div className="text-xs text-muted-foreground">
                Connect wallet for exact calculations • No lock-up periods • Mathematical precision
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveRiskSelection;
