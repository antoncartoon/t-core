
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Users, DollarSign, TrendingUp, PieChart } from 'lucide-react';

const FairDistributionDemo = () => {
  const [poolYield, setPoolYield] = useState([12]);
  
  // Tranche system showing different risk levels and capacity
  const tranches = [
    { 
      apy: 5, 
      maxCapacity: 1000000, 
      color: "bg-green-500", 
      risk: "Conservative",
      description: "Largest capacity, stable returns"
    },
    { 
      apy: 8, 
      maxCapacity: 500000, 
      color: "bg-blue-500", 
      risk: "Moderate",
      description: "Good balance of capacity and yield"
    },
    { 
      apy: 12, 
      maxCapacity: 250000, 
      color: "bg-yellow-500", 
      risk: "Balanced",
      description: "Medium capacity, attractive yields"
    },
    { 
      apy: 18, 
      maxCapacity: 100000, 
      color: "bg-orange-500", 
      risk: "Growth",
      description: "Limited capacity, high efficiency"
    },
    { 
      apy: 25, 
      maxCapacity: 50000, 
      color: "bg-red-500", 
      risk: "Maximum",
      description: "Smallest capacity, maximum efficiency"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalPoolValue = () => {
    return tranches.reduce((sum, tranche) => sum + tranche.maxCapacity, 0);
  };

  const getTrancheAllocation = (tranche: any) => {
    const totalPool = getTotalPoolValue();
    const currentYield = poolYield[0];
    
    // All tranches receive their promised APY when pool yield is sufficient
    if (currentYield >= tranche.apy) {
      return {
        receiving: true,
        actualYield: tranche.apy,
        annualReturn: (tranche.maxCapacity * tranche.apy) / 100,
        utilizationRate: 100
      };
    } else {
      // Even when pool yield is lower, tranches can still receive proportional returns
      const proportionalYield = Math.max(0, (currentYield / tranche.apy) * tranche.apy);
      return {
        receiving: proportionalYield > 0,
        actualYield: proportionalYield,
        annualReturn: (tranche.maxCapacity * proportionalYield) / 100,
        utilizationRate: Math.round((proportionalYield / tranche.apy) * 100)
      };
    }
  };

  return (
    <section id="fair-distribution" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Tranche-Based Distribution
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Like concentrated liquidity in AMM pools: higher yield requests have smaller capacity but greater capital efficiency. 
            Everyone gets paid, but position sizes vary based on risk appetite.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Interactive Demo */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Pool Yield Simulator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Current Pool Yield: {poolYield[0]}%
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
                <h4 className="font-medium">Tranche Performance:</h4>
                {tranches.map((tranche, index) => {
                  const allocation = getTrancheAllocation(tranche);
                  return (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${tranche.color}`} />
                          <span className="font-medium">{tranche.apy}% APY Tranche</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            allocation.receiving ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {allocation.receiving ? `${allocation.actualYield.toFixed(1)}%` : '0%'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                          <div>Max Capacity: {formatCurrency(tranche.maxCapacity)}</div>
                          <div>Annual Return: {formatCurrency(allocation.annualReturn)}</div>
                        </div>
                        <div>
                          <div>Utilization: {allocation.utilizationRate}%</div>
                          <div className="text-xs text-muted-foreground">{tranche.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium mb-1">Total Pool: {formatCurrency(getTotalPoolValue())}</div>
                  <div className="text-muted-foreground">
                    Higher APY = Smaller capacity but greater efficiency per dollar invested
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How Tranching Works */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <PieChart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Concentrated Liquidity Principle</h3>
                    <p className="text-sm text-muted-foreground">
                      Just like Uniswap V3, narrower ranges (higher APY) have less available space but earn more efficiently. 
                      Your capital works harder in smaller, more focused positions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Everyone Gets Paid</h3>
                    <p className="text-sm text-muted-foreground">
                      All tranches receive returns proportional to pool performance. Higher APY tranches get full payouts first, 
                      but even during lower yield periods, all positions receive proportional distributions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Risk = Efficiency Trade-off</h3>
                    <p className="text-sm text-muted-foreground">
                      Higher yields don't mean dangerous investments - they mean accepting smaller position sizes for better capital efficiency. 
                      All investments remain in stablecoins and proven DeFi protocols.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FairDistributionDemo;
