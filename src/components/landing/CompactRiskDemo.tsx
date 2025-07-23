
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';
import { Calculator, Shield, Star, Crown, ArrowRight, TrendingUp } from 'lucide-react';
import { 
  calculateTCoreAPY, 
  FIXED_BASE_APY,
} from '@/utils/riskRangeCalculations';

const CompactRiskDemo = () => {
  const [demoAmount] = useState(10000);
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');

  const strategies = [
    { 
      id: 'safe', 
      name: 'Safe', 
      bucket: 5, 
      icon: Shield, 
      color: 'bg-green-100 text-green-800 border-green-200',
      description: 'Guaranteed returns'
    },
    { 
      id: 'conservative', 
      name: 'Conservative', 
      bucket: 20, 
      icon: Shield, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Stable with bonus'
    },
    { 
      id: 'balanced', 
      name: 'Balanced', 
      bucket: 45, 
      icon: Star, 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      description: 'Optimal risk/reward'
    },
    { 
      id: 'hero', 
      name: 'Hero', 
      bucket: 80, 
      icon: Crown, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Maximum potential'
    }
  ];

  const selectedStrategyData = strategies.find(s => s.id === selectedStrategy) || strategies[2];
  const currentAPY = calculateTCoreAPY(selectedStrategyData.bucket);
  const annualYield = demoAmount * currentAPY;

  return (
    <section className="py-16 sm:py-20 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            LIVE DEMO
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-light mb-4">
            Choose Your Strategy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how different risk levels affect your returns with T-Core's precision staking
          </p>
        </div>

        <Card className="border-2 border-primary/20 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Risk Strategy Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Strategy Selection */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {strategies.map((strategy) => {
                const apy = calculateTCoreAPY(strategy.bucket);
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
                        {(apy * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Display */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-950/20 dark:to-purple-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Investment</div>
                  <div className="text-2xl font-bold">${demoAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">APY</div>
                  <div className="text-2xl font-bold text-primary">
                    {(currentAPY * 100).toFixed(2)}%
                  </div>
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
                <span className="font-medium text-sm">How T-Core Works</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Safe strategies get guaranteed {(FIXED_BASE_APY * 100).toFixed(0)}% base yield</div>
                <div>• Higher risk levels receive bonus yields from waterfall distribution</div>
                <div>• Hero levels absorb losses first but get maximum upside potential</div>
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
                No lock-up periods • Mathematical precision • Transparent formulas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompactRiskDemo;
