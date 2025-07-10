
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Users, DollarSign, TrendingUp, PieChart, ArrowDown } from 'lucide-react';
import { calculateRiskScore, calculatePayoutPriority, simulatePayoutDistribution } from '@/utils/riskCalculations';

const FairDistributionDemo = () => {
  const [poolYield, setPoolYield] = useState([12]);
  
  // Total pool value
  const totalPoolValue = 1900000; // $1.9M
  
  // Sample NFT positions with different APY targets
  const samplePositions = [
    { id: '1', amount: 100000, desiredAPY: 0.05, user: 'Conservative Alice' },
    { id: '2', amount: 80000, desiredAPY: 0.08, user: 'Balanced Bob' },
    { id: '3', amount: 150000, desiredAPY: 0.05, user: 'Safe Sarah' },
    { id: '4', amount: 50000, desiredAPY: 0.12, user: 'Growth Gary' },
    { id: '5', amount: 30000, desiredAPY: 0.18, user: 'Risk Rachel' },
    { id: '6', amount: 75000, desiredAPY: 0.08, user: 'Moderate Mike' },
    { id: '7', amount: 25000, desiredAPY: 0.25, user: 'Max Maya' },
    { id: '8', amount: 200000, desiredAPY: 0.05, user: 'Whale William' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Calculate risk scores and priorities for all positions
  const enrichedPositions = samplePositions.map(pos => {
    const riskScore = calculateRiskScore(pos.desiredAPY);
    const payoutPriority = calculatePayoutPriority(riskScore);
    return {
      ...pos,
      riskScore,
      payoutPriority
    };
  });

  // Calculate total pool earnings and simulate distribution
  const currentYield = poolYield[0] / 100;
  const totalYieldGenerated = totalPoolValue * currentYield;
  const annualYieldGenerated = totalYieldGenerated; // For annual calculation
  
  // Simulate payout distribution
  const payoutResults = simulatePayoutDistribution(
    enrichedPositions,
    annualYieldGenerated,
    365 // Annual calculation
  );

  // Sort positions by priority for display
  const sortedPositions = [...enrichedPositions].sort((a, b) => b.payoutPriority - a.payoutPriority);

  const getRiskCategory = (riskScore: number) => {
    const level = (riskScore / 10000) * 100;
    if (level <= 33) return { name: 'Conservative', color: 'bg-green-500' };
    if (level <= 66) return { name: 'Moderate', color: 'bg-blue-500' };
    return { name: 'Aggressive', color: 'bg-red-500' };
  };

  const getPayoutStatus = (positionId: string) => {
    const result = payoutResults.find(r => r.positionId === positionId);
    if (!result) return { status: 'none', percentage: 0 };
    
    const percentage = (result.actualPayout / result.expectedPayout) * 100;
    if (percentage >= 100) return { status: 'full', percentage: 100 };
    if (percentage > 0) return { status: 'partial', percentage };
    return { status: 'none', percentage: 0 };
  };

  return (
    <section id="fair-distribution" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Priority-Based Distribution
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Higher APY means higher priority and smaller position sizes. Pool earnings are distributed as a waterfall - 
            high priority positions get paid first from the total pool yield.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Pool Overview & Controls */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Pool Distribution Simulator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total Pool Value:</span>
                    <span className="font-medium">{formatCurrency(totalPoolValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Pool Yield:</span>
                    <span className="font-medium">{formatPercent(currentYield)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Yield Generated:</span>
                    <span className="font-medium text-green-600">{formatCurrency(annualYieldGenerated)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Pool Yield: {poolYield[0]}%
                </label>
                <Slider
                  value={poolYield}
                  onValueChange={setPoolYield}
                  max={30}
                  min={3}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3%</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center space-x-2">
                  <ArrowDown className="w-4 h-4" />
                  <span>Waterfall Distribution</span>
                </h4>
                <div className="text-sm text-muted-foreground">
                  Earnings flow from top priority to bottom until the pool is exhausted.
                  Higher APY = Higher priority = Gets paid first.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Position Distribution */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>NFT Positions (by Priority)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {sortedPositions.map((position, index) => {
                const category = getRiskCategory(position.riskScore);
                const payout = getPayoutStatus(position.id);
                const result = payoutResults.find(r => r.positionId === position.id);
                
                return (
                  <div 
                    key={position.id}
                    className="p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        <div>
                          <div className="font-medium text-sm">{position.user}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(position.amount)} @ {formatPercent(position.desiredAPY)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${
                          payout.status === 'full' ? 'text-green-600' :
                          payout.status === 'partial' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {payout.status === 'full' ? '✓ Full' :
                           payout.status === 'partial' ? `${payout.percentage.toFixed(0)}%` : '✗ None'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Priority: {position.payoutPriority}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Expected: {formatCurrency(result?.expectedPayout || 0)}</div>
                      <div>Received: {formatCurrency(result?.actualPayout || 0)}</div>
                    </div>
                    
                    {result && result.shortfall > 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        Shortfall: {formatCurrency(result.shortfall)}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Single Pool, Multiple Priorities</h3>
                  <p className="text-sm text-muted-foreground">
                    All capital goes into one pool. Earnings are distributed by priority order, not separate accounts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Higher APY = Higher Priority</h3>
                  <p className="text-sm text-muted-foreground">
                    Risk score determines priority. Higher desired APY means you get paid first when yields are available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Capital Efficiency</h3>
                  <p className="text-sm text-muted-foreground">
                    Like concentrated liquidity - smaller positions at higher APY get more efficient returns per dollar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FairDistributionDemo;
