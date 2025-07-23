import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, Crown, TrendingUp, Calculator, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { calculatePiecewiseAPY, getTierForBucket } from '@/utils/tzFormulas';

const UnifiedRiskSelection = () => {
  const [activeTier, setActiveTier] = useState(0);
  const [animationCycle, setAnimationCycle] = useState(0);

  // Define tiers with accurate bucket ranges as tuples
  const tiers = [
    {
      name: 'Safe',
      bucketRange: [0, 9] as [number, number],
      description: 'T-Bills × 1.2 guarantee',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      riskLevel: 'Zero Loss'
    },
    {
      name: 'Conservative', 
      bucketRange: [10, 29] as [number, number],
      description: 'Stable yield strategy',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      riskLevel: 'Low Risk'
    },
    {
      name: 'Balanced',
      bucketRange: [30, 59] as [number, number],
      description: 'Optimized risk/reward',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      riskLevel: 'Medium Risk'
    },
    {
      name: 'Hero',
      bucketRange: [60, 99] as [number, number],
      description: 'Maximum yield potential',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      riskLevel: 'High Reward',
      isHero: true
    }
  ];

  // Calculate APY using precision formulas
  const calculateTierAPY = (bucketRange: [number, number]) => {
    const [min, max] = bucketRange;
    const samples = Math.min(10, max - min + 1); // Sample up to 10 points
    let totalAPY = 0;
    
    for (let i = 0; i < samples; i++) {
      const bucket = min + Math.floor(i * (max - min) / (samples - 1));
      totalAPY += calculatePiecewiseAPY(bucket);
    }
    
    return totalAPY / samples;
  };

  // Auto-cycle through tiers for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationCycle(prev => (prev + 1) % 4);
      setActiveTier(prev => (prev + 1) % tiers.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tiers.length]);

  // Generate curve data points using precision formulas
  const generateCurveData = () => {
    const points = [];
    for (let bucket = 0; bucket <= 99; bucket += 2) {
      const apy = calculatePiecewiseAPY(bucket);
      points.push({
        bucket,
        apy,
        tier: getTierForBucket(bucket).name
      });
    }
    return points;
  };

  const curveData = generateCurveData();
  const activeTierData = tiers[activeTier];
  const activeTierAPY = calculateTierAPY(activeTierData.bucketRange);

  // Create relative performance indicators
  const getRelativePerformance = (tier: typeof tiers[0]) => {
    const apy = calculateTierAPY(tier.bucketRange);
    const safeAPY = calculateTierAPY(tiers[0].bucketRange);
    const multiplier = apy / safeAPY;
    
    if (multiplier < 1.2) return 'Similar';
    if (multiplier < 1.5) return 'Higher';
    if (multiplier < 2) return 'Much Higher';
    return 'Maximum';
  };

  return (
    <section className="py-16 sm:py-20 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
            Interactive Risk-Yield Selection
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Four risk tiers with mathematical precision. Quadratic risk function Risk(i) = (i/99)² combined with progressive piecewise APY formulas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Tier Cards */}
          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`border-2 hover:shadow-lg transition-all duration-500 cursor-pointer ${
                  activeTier === index 
                    ? `${tier.borderColor} ${tier.bgColor} shadow-lg scale-105` 
                    : 'border-border bg-card hover:bg-muted/10'
                }`}
                onMouseEnter={() => setActiveTier(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tier.isHero ? 'bg-gradient-to-r from-purple-500 to-yellow-500' : 'bg-muted/30'
                      }`}>
                        <tier.icon className={`w-6 h-6 ${tier.isHero ? 'text-white' : tier.color}`} />
                      </div>
                      
                      <div>
                        <h3 className={`text-xl font-bold ${tier.color}`}>
                          {tier.name}
                          {tier.isHero && <span className="ml-2 text-yellow-500">⭐</span>}
                        </h3>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        Buckets {tier.bucketRange[0]}-{tier.bucketRange[1]}
                      </Badge>
                      <div className={`text-sm font-medium ${tier.color}`}>
                        {getRelativePerformance(tier)} Yield
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tier.riskLevel}
                      </div>
                    </div>
                  </div>
                  
                  {activeTier === index && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg animate-fade-in">
                      <div className="text-sm text-muted-foreground">
                        <strong>Risk Range:</strong> Levels {tier.bucketRange[0]} to {tier.bucketRange[1]} 
                        ({tier.bucketRange[1] - tier.bucketRange[0] + 1} buckets)
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <strong>Strategy:</strong> {tier.name === 'Safe' ? 'Fixed guarantee' : 
                        tier.name === 'Hero' ? 'Waterfall residuals' : 'Balanced distribution'}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right: Interactive Graph */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Interactive Risk Curve</h3>
                <Badge variant="outline" className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${activeTierData.color.replace('text-', 'bg-')}`} />
                  {activeTierData.name} Active
                </Badge>
              </div>

              {/* Risk curve visualization */}
              <div className="relative h-64 bg-muted/20 rounded-lg mb-6 overflow-hidden">
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
                    x={`${(activeTierData.bucketRange[0] / 99) * 100}%`}
                    y="0%"
                    width={`${((activeTierData.bucketRange[1] - activeTierData.bucketRange[0]) / 99) * 100}%`}
                    height="100%"
                    fill="hsl(var(--primary))"
                    fillOpacity="0.2"
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

              {/* Active tier info */}
              <div className={`p-4 rounded-lg border ${activeTierData.borderColor} ${activeTierData.bgColor} transition-all duration-500`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <activeTierData.icon className={`w-5 h-5 ${activeTierData.color}`} />
                    <span className={`font-bold ${activeTierData.color}`}>
                      {activeTierData.name} Tier
                      {activeTierData.isHero && ' ⭐'}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {getRelativePerformance(activeTierData)} vs Safe
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Risk Segments: {activeTierData.bucketRange[0]} to {activeTierData.bucketRange[1]} (of 0-99 total)</div>
                  <div>Risk Function: Risk(i) = (i/99)² - quadratic increase with segment</div>
                  <div>APY Formula: Progressive piecewise function with tier-specific curves</div>
                  <div className="text-xs opacity-75">
                    Segment {activeTierData.bucketRange[1]} has risk = {((activeTierData.bucketRange[1]/99)**2 * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waterfall explanation */}
        <Card className="bg-gradient-to-r from-primary/5 to-purple/5 border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Waterfall Distribution System</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Yield Flow (Bottom → Top)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Safe: Fixed 5.16% (Segments 0-9)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Conservative: Linear 5.16% → 7% (Segments 10-29)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Balanced: Quadratic 7% → 9.5% (Segments 30-59)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Hero: Exponential 9.5% × 1.03^(i-60) (Segments 60-99)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">Loss Absorption (Top → Bottom)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Hero: Absorbs losses first</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Balanced: Secondary absorption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Conservative: Tertiary protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Safe: Maximum protection</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-purple/5 border-primary/20">
            <CardContent className="p-0 space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Ready for Precision Staking?</h3>
                <p className="text-muted-foreground">
                  Experience the full interface with exact calculations, bonus yield optimization, and stress testing.
                </p>
              </div>
              
              <NavLink to="/app">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Calculator className="w-4 h-4 mr-2" />
                  Launch Staking Interface
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

export default UnifiedRiskSelection;
