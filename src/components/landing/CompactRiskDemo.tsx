
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';
import { Calculator, Shield, Star, Crown, ArrowRight, TrendingUp } from 'lucide-react';
import { 
  calculatePiecewiseAPY, 
  getTierForSegment,
  calculateQuadraticRisk,
  TARGET_APYS
} from '@/utils/tzFormulas';

const CompactRiskDemo = () => {
  const [demoAmount] = useState(10000);
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');

  // Helper function to convert risk percentage to user-friendly label
  const getRiskLabel = (riskPercent: number) => {
    if (riskPercent <= 0.5) return 'Minimal Risk';
    if (riskPercent <= 2) return 'Low Risk';
    if (riskPercent <= 5) return 'Medium Risk';
    if (riskPercent <= 10) return 'High Risk';
    return 'Very High Risk';
  };

  const getRiskColor = (riskPercent: number) => {
    if (riskPercent <= 0.5) return 'text-green-600';
    if (riskPercent <= 2) return 'text-blue-600';
    if (riskPercent <= 5) return 'text-yellow-600';
    if (riskPercent <= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const strategies = [
    { 
      id: 'safe', 
      name: 'Safe', 
      segment: 5, 
      icon: Shield, 
      color: 'bg-green-100 text-green-800 border-green-200',
      description: 'Steady returns, fully protected'
    },
    { 
      id: 'conservative', 
      name: 'Conservative', 
      segment: 20, 
      icon: Shield, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Stable growth with safety'
    },
    { 
      id: 'balanced', 
      name: 'Balanced', 
      segment: 45, 
      icon: Star, 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      description: 'Enhanced returns, moderate risk'
    },
    { 
      id: 'hero', 
      name: 'Hero', 
      segment: 80, 
      icon: Crown, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Maximum growth potential'
    }
  ];

  const selectedStrategyData = strategies.find(s => s.id === selectedStrategy) || strategies[2];
  const currentAPY = calculatePiecewiseAPY(selectedStrategyData.segment);
  const currentRisk = calculateQuadraticRisk(selectedStrategyData.segment);
  const annualYield = demoAmount * currentAPY;
  const tierInfo = getTierForSegment(selectedStrategyData.segment);

  return (
    <section className="py-16 sm:py-20 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            QUADRATIC RISK & PIECEWISE YIELD MODEL
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-light mb-4">
            Choose Your Strategy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience T-Core's quadratic risk model with progressive piecewise formulas
          </p>
        </div>

        <Card className="border-2 border-primary/20 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Progressive Strategy Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Strategy Selection */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {strategies.map((strategy) => {
                const apy = calculatePiecewiseAPY(strategy.segment);
                const risk = calculateQuadraticRisk(strategy.segment);
                const isActive = selectedStrategy === strategy.id;
                
                return (
                  <div
                    key={strategy.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                      isActive 
                        ? `${strategy.color} border-current shadow-lg` 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedStrategy(strategy.id)}
                  >
                    <div className="text-center space-y-2">
                      <strategy.icon className="h-5 w-5 mx-auto" />
                      <div className="font-medium text-sm">{strategy.name}</div>
                      <div className="text-xs opacity-70">{strategy.description}</div>
                      <div className="font-bold text-lg">
                        {(apy * 100).toFixed(2)}%
                      </div>
                      <div className="text-[10px] opacity-60">
                        {getRiskLabel(risk * 100)}
                      </div>
                      <div className="text-[10px] opacity-60">
                        Segment {strategy.segment}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Display */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-950/20 dark:to-purple-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Investment</div>
                  <div className="text-2xl font-bold">${demoAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">APY</div>
                  <div className="text-2xl font-bold text-primary">
                    {(currentAPY * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{tierInfo.formula}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Protection Level</div>
                  <div className={`text-2xl font-bold ${getRiskColor(currentRisk * 100)}`}>
                    {getRiskLabel(currentRisk * 100)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Waterfall protected</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Annual Yield</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${annualYield.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Quadratic Risk & Piecewise Yield Model</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• <strong>Risk Function:</strong> Risk(i) = (i/99)² - quadratic increase</div>
                <div>• <strong>Safe (0-9):</strong> Fixed 5.16% (T-Bills × 1.2)</div>
                <div>• <strong>Conservative (10-29):</strong> Linear 5.16% → 7%</div>
                <div>• <strong>Balanced (30-59):</strong> Quadratic 7% → 9.5%</div>
                <div>• <strong>Hero (60-99):</strong> Exponential 9.5% × 1.03^(i-25)</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <NavLink to="/app">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Calculator className="w-4 h-4 mr-2" />
                  Start with {selectedStrategyData.name} Strategy
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </NavLink>
              <div className="text-xs text-muted-foreground mt-2">
                Quadratic risk • Progressive yields • Mathematical precision
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompactRiskDemo;
