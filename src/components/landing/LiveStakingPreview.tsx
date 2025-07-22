
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NavLink } from 'react-router-dom';
import { Calculator, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';
import { calculateTZCompliantAPY, getTierForBucket } from '@/utils/tzFormulas';

const LiveStakingPreview = () => {
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

  const currentAPY = calculateTZCompliantAPY(demoBucket);
  const tier = getTierForBucket(demoBucket);
  const annualYield = demoAmount * currentAPY;

  const tierExamples = [
    { bucket: 5, name: 'Safe', color: 'bg-green-100 text-green-800 border-green-200', icon: Shield },
    { bucket: 15, name: 'Conservative', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: TrendingUp },
    { bucket: 35, name: 'Balanced', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Calculator },
    { bucket: 75, name: 'Hero', color: 'bg-red-100 text-red-800 border-red-200', icon: Zap }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            LIVE DEMO
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-light mb-4">
            See T-Core Staking in Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch real-time APY calculations across different risk tiers. Click any tier to see instant calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Calculator Preview */}
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
            </CardContent>
          </Card>

          {/* Interactive Tier Selection */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Choose Your Risk Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {tierExamples.map((example) => {
                  const exampleAPY = calculateTZCompliantAPY(example.bucket);
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

              <NavLink to="/staking">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Calculator className="w-4 h-4 mr-2" />
                  Try Advanced Staking Interface
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </NavLink>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Click any tier above</strong> to see instant APY calculations. 
                  The full interface includes stress testing, bonus yield optimization, and waterfall distribution.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveStakingPreview;
