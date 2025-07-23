
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NavLink } from 'react-router-dom';
import { Calculator, TrendingUp, Shield, Zap, ArrowRight, Star, Crown } from 'lucide-react';
import { calculatePrecisionAPY, getTierForBucket } from '@/utils/tzFormulas';

const InteractiveRiskSelection = () => {
  const [demoAmount] = useState(10000);
  const [demoBucket, setDemoBucket] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Auto-cycle through different risk levels for demo
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setDemoBucket(prev => {
        const buckets = [5, 15, 35, 75]; // Representative buckets for each tier
        const currentIndex = buckets.indexOf(prev);
        return buckets[(currentIndex + 1) % buckets.length];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const currentAPY = calculatePrecisionAPY(demoBucket);
  const tier = getTierForBucket(demoBucket);
  const annualYield = demoAmount * currentAPY;

  const tierExamples = [
    { bucket: 5, name: 'Safe', color: 'bg-green-100 text-green-800 border-green-200', icon: Shield },
    { bucket: 15, name: 'Conservative', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Shield },
    { bucket: 35, name: 'Balanced', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Star },
    { bucket: 75, name: 'Hero', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Crown }
  ];

  // Generate curve data points for visualization
  const generateCurveData = () => {
    const points = [];
    for (let bucket = 0; bucket <= 99; bucket += 2) {
      const apy = calculatePrecisionAPY(bucket);
      points.push({
        bucket,
        apy,
        tier: getTierForBucket(bucket).name
      });
    }
    return points;
  };

  const curveData = generateCurveData();

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
            Experience live APY calculations across four risk tiers. Click any strategy to see instant results with mathematical precision.
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
                  <span className="text-sm text-muted-foreground">Current Tier:</span>
                  <Badge variant="outline" className={tier.color}>
                    Bucket {demoBucket} • {tier.name}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Level</span>
                    <span>{((demoBucket / 99) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(demoBucket / 99) * 100} className="h-2" />
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {(currentAPY * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-green-700">Annual APY</div>
                </div>
                
                <div className="text-center border-t border-green-200 dark:border-green-800 pt-3">
                  <div className="text-xl font-semibold text-green-600">
                    ${annualYield.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-700">Expected Annual Yield</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                <strong>Live Formula:</strong> APY(r) = 5.16% + (10% - 5.16%) × r^1.5
                <br />
                where r = {demoBucket}/99 = {(demoBucket/99).toFixed(3)}
              </div>

              {/* Interactive Tier Selection */}
              <div className="grid grid-cols-1 gap-3">
                {tierExamples.map((example) => {
                  const exampleAPY = calculatePrecisionAPY(example.bucket);
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
                        Bucket {example.bucket} • Risk: {((example.bucket/99)*100).toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right: Interactive Graph & Waterfall */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Risk Curve Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk curve visualization */}
              <div className="relative h-64 bg-muted/20 rounded-lg overflow-hidden">
                {/* Background grid */}
                <div className="absolute inset-0">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="absolute border-t border-muted" style={{ top: `${i * 10}%`, width: '100%' }} />
                  ))}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="absolute border-l border-muted h-full" style={{ left: `${i * 25}%` }} />
                  ))}
                </div>

                {/* APY curve */}
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                      <stop offset="30%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                      <stop offset="60%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  
                  {/* Generate curve path */}
                  <path
                    d={curveData.map((point, index) => {
                      const x = (point.bucket / 99) * 100;
                      const y = 100 - ((point.apy - 0.05) / (0.12 - 0.05)) * 100;
                      return `${index === 0 ? 'M' : 'L'} ${x}% ${Math.max(0, Math.min(100, y))}%`;
                    }).join(' ')}
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    fill="none"
                    className="transition-all duration-500"
                  />
                  
                  {/* Fill area */}
                  <path
                    d={curveData.map((point, index) => {
                      const x = (point.bucket / 99) * 100;
                      const y = 100 - ((point.apy - 0.05) / (0.12 - 0.05)) * 100;
                      return `${index === 0 ? 'M' : 'L'} ${x}% ${Math.max(0, Math.min(100, y))}%`;
                    }).join(' ') + ' L 100% 100% L 0% 100% Z'}
                    fill="url(#curveGradient)"
                    className="transition-all duration-500"
                  />

                  {/* Active tier highlight */}
                  <rect
                    x={`${(demoBucket / 99) * 100 - 2}%`}
                    y="0%"
                    width="4%"
                    height="100%"
                    fill="hsl(var(--primary))"
                    fillOpacity="0.4"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </svg>

                {/* Tier labels */}
                <div className="absolute bottom-2 left-2 text-xs text-green-600 font-medium">Safe</div>
                <div className="absolute bottom-2 left-1/4 text-xs text-blue-600 font-medium">Conservative</div>
                <div className="absolute bottom-2 left-1/2 text-xs text-yellow-600 font-medium">Balanced</div>
                <div className="absolute bottom-2 right-2 text-xs text-purple-600 font-medium">Hero</div>
              </div>

              {/* Waterfall Distribution Explanation */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Waterfall Distribution</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-green-600 font-medium mb-2">Yield Flow ↑</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Safe: Fixed guarantee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Conservative: Stable yield</span>
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
                        <span>Safe: Protected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Mathematical Precision:</strong> All calculations use verified formulas. 
                  Higher tiers earn more yield but provide insurance for lower tiers.
                </p>
              </div>
            </CardContent>
          </Card>
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
