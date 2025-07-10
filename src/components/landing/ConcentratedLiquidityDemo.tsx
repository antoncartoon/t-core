
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Droplets, Target, BarChart3 } from 'lucide-react';

const ConcentratedLiquidityDemo = () => {
  const [selectedRange, setSelectedRange] = useState<[number, number]>([20, 40]);
  const [animationStep, setAnimationStep] = useState(0);

  // Simulate liquidity distribution
  const liquidityData = Array.from({ length: 21 }, (_, i) => ({
    risk: i * 5,
    liquidity: Math.max(0, 100 - Math.abs(i * 5 - 50) * 1.5 + Math.random() * 20),
    yield: Math.max(0, (i * 5) * 0.3 + Math.random() * 5)
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getRangeEfficiency = (range: [number, number]) => {
    const size = range[1] - range[0];
    return Math.round(200 / Math.max(1, size));
  };

  const getEstimatedAPR = (range: [number, number]) => {
    const avgRisk = (range[0] + range[1]) / 2;
    const efficiency = getRangeEfficiency(range);
    return (5 + avgRisk * 0.2 + efficiency * 0.1).toFixed(1);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light mb-6">
            Concentrated Liquidity for <span className="text-blue-600">Yield & Risk</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Just like Uniswap V3 revolutionized AMMs, T-Core brings concentrated liquidity to yield farming. 
            Choose your risk range, maximize capital efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Demo */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Interactive Risk Range</h3>
                </div>

                {/* Current Selection Display */}
                <div className="text-center py-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {selectedRange[0]} - {selectedRange[1]}
                  </div>
                  <p className="text-sm text-muted-foreground">Risk Level Range</p>
                </div>

                {/* Range Slider */}
                <div className="space-y-4">
                  <Slider
                    value={selectedRange}
                    onValueChange={(value) => setSelectedRange([value[0], value[1]])}
                    min={0}
                    max={100}
                    step={5}
                    minStepsBetweenThumbs={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 (Safe)</span>
                    <span>50</span>
                    <span>100 (Risky)</span>
                  </div>
                </div>

                {/* Liquidity Visualization */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Liquidity Distribution</span>
                  </div>
                  <div className="h-20 bg-muted rounded relative overflow-hidden">
                    {liquidityData.map((item, index) => (
                      <div
                        key={index}
                        className={`absolute transition-all duration-500 ${
                          item.risk >= selectedRange[0] && item.risk <= selectedRange[1]
                            ? 'bg-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{
                          left: `${item.risk}%`,
                          width: '4%',
                          height: `${item.liquidity}%`,
                          bottom: 0,
                          opacity: animationStep === 0 ? 0.7 : animationStep === 1 ? 1 : 0.9
                        }}
                      />
                    ))}
                    {/* Yield Flow Animation */}
                    {animationStep === 1 && (
                      <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded">
                    <p className="text-sm text-muted-foreground">Est. APR</p>
                    <p className="text-xl font-bold text-green-600">
                      {getEstimatedAPR(selectedRange)}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-xl font-bold text-purple-600">
                      {getRangeEfficiency(selectedRange)}%
                    </p>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Droplets className="w-4 h-4 mr-2" />
                  Add Liquidity to Range
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Explanation */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold mb-4">How Concentrated Liquidity Works</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Choose Your Risk Range</h4>
                    <p className="text-muted-foreground">
                      Instead of fixed APY, select a risk range (e.g., 20-40). 
                      Narrower ranges = higher capital efficiency.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Yield Flows Bottom-Up</h4>
                    <p className="text-muted-foreground">
                      Protocol yield is distributed starting from risk level 0. 
                      Lower risk positions get paid first, always.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-red-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Losses Flow Top-Down</h4>
                    <p className="text-muted-foreground">
                      In stress scenarios, losses are absorbed starting from the highest risk levels. 
                      Your downside is predictable and limited.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Capital Efficiency</h4>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                By concentrating your liquidity in a specific risk range, you can earn 
                <strong> 2-5x higher yields</strong> compared to spreading across the entire curve. 
                The narrower your range, the more efficient your capital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConcentratedLiquidityDemo;
