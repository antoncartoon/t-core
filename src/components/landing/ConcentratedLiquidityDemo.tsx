
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Droplets, Target, BarChart3, ArrowDown, ArrowUp } from 'lucide-react';

const ConcentratedLiquidityDemo = () => {
  const [selectedRange, setSelectedRange] = useState<[number, number]>([20, 40]);
  const [animationStep, setAnimationStep] = useState(0);
  const [showWaterfall, setShowWaterfall] = useState('yield');

  // Generate more realistic liquidity distribution (1-100 scale)
  const liquidityData = Array.from({ length: 100 }, (_, i) => {
    const risk = i + 1;
    // More liquidity in mid-range risk levels (20-60)
    const baseAmount = Math.max(0, 100 - Math.abs(risk - 40) * 1.2);
    const randomVariation = Math.random() * 30;
    return {
      risk,
      liquidity: Math.max(5, baseAmount + randomVariation),
      yield: Math.max(0, (risk - 1) * 0.2 + Math.random() * 3) // Based on risk level
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getRangeEfficiency = (range: [number, number]) => {
    const size = range[1] - range[0];
    return Math.round(100 / Math.max(1, size / 5));
  };

  const getEstimatedAPR = (range: [number, number]) => {
    const avgRisk = (range[0] + range[1]) / 2;
    const efficiency = getRangeEfficiency(range);
    // T-Bill + 20% minimum (5%) to 25% maximum
    const baseAPR = 5 + ((avgRisk - 1) / 99) * 20; // 5% to 25%
    const efficiencyBonus = efficiency * 0.05;
    return Math.min(25, baseAPR + efficiencyBonus).toFixed(1);
  };

  const getCoverageLevel = () => {
    // Simulate the k level calculation - assume 70% coverage
    return Math.round(70 + Math.random() * 20);
  };

  const coverageLevel = getCoverageLevel();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light mb-6">
            Concentrated Liquidity for <span className="text-blue-600">Yield & Risk</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Just like Uniswap V3 revolutionized AMMs, T-Core brings concentrated liquidity to yield farming. 
            Choose your risk range (1-100), maximize capital efficiency with precision targeting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Demo */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-semibold">Interactive Risk Range</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={showWaterfall === 'yield' ? 'default' : 'outline'}
                      onClick={() => setShowWaterfall('yield')}
                    >
                      <ArrowUp className="w-3 h-3 mr-1" />
                      Yield
                    </Button>
                    <Button
                      size="sm"
                      variant={showWaterfall === 'loss' ? 'default' : 'outline'}
                      onClick={() => setShowWaterfall('loss')}
                    >
                      <ArrowDown className="w-3 h-3 mr-1" />
                      Loss
                    </Button>
                  </div>
                </div>

                {/* Current Selection Display */}
                <div className="text-center py-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {selectedRange[0]} - {selectedRange[1]}
                  </div>
                  <p className="text-sm text-muted-foreground">Risk Level Range (1-100)</p>
                </div>

                {/* Range Slider */}
                <div className="space-y-4">
                  <Slider
                    value={selectedRange}
                    onValueChange={(value) => setSelectedRange([value[0], value[1]])}
                    min={1}
                    max={100}
                    step={1}
                    minStepsBetweenThumbs={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 (T-Bill +20%)</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100 (Max Risk)</span>
                  </div>
                </div>

                {/* Waterfall Visualization */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {showWaterfall === 'yield' ? 'Yield Distribution (Bottom-Up)' : 'Loss Absorption (Top-Down)'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {showWaterfall === 'yield' ? `Coverage to level ${coverageLevel}` : 'High risk absorbs first'}
                    </span>
                  </div>
                  <div className="h-32 bg-muted rounded relative overflow-hidden">
                    {liquidityData.map((item, index) => {
                      const isInRange = item.risk >= selectedRange[0] && item.risk <= selectedRange[1];
                      const isActive = showWaterfall === 'yield' 
                        ? item.risk <= coverageLevel 
                        : item.risk >= (100 - 30); // Simulate 30% loss absorption
                      
                      return (
                        <div
                          key={index}
                          className={`absolute transition-all duration-1000 ${
                            isInRange
                              ? isActive 
                                ? showWaterfall === 'yield' ? 'bg-green-500' : 'bg-red-500'
                                : 'bg-blue-500'
                              : isActive
                                ? showWaterfall === 'yield' ? 'bg-green-300' : 'bg-red-300'
                                : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          style={{
                            left: `${item.risk}%`,
                            width: '1%',
                            height: `${Math.min(100, (item.liquidity / 150) * 100)}%`,
                            bottom: 0,
                            opacity: animationStep === 0 ? 0.7 : animationStep === 1 ? 1 : animationStep === 2 ? 0.9 : 0.8
                          }}
                        />
                      );
                    })}
                    
                    {/* Animated Waterfall Effect */}
                    {animationStep === 1 && (
                      <div className={`absolute inset-0 ${
                        showWaterfall === 'yield' 
                          ? 'bg-gradient-to-t from-green-500/30 to-transparent animate-pulse' 
                          : 'bg-gradient-to-b from-red-500/30 to-transparent animate-pulse'
                      }`} />
                    )}
                    
                    {/* Coverage Level Indicator */}
                    {showWaterfall === 'yield' && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 z-10"
                        style={{ left: `${coverageLevel}%` }}
                      >
                        <div className="absolute -top-6 -left-8 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          K={coverageLevel}
                        </div>
                      </div>
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
                    <p className="text-xs text-muted-foreground">28-day avg</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-xl font-bold text-purple-600">
                      {getRangeEfficiency(selectedRange)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Capital</p>
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
                    <h4 className="font-semibold mb-2">Choose Your Risk Range (1-100)</h4>
                    <p className="text-muted-foreground">
                      Select precision risk levels instead of fixed APY. Narrower ranges = higher capital efficiency.
                      Level 1 = T-Bill +20% guaranteed, Level 100 = maximum risk/reward.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Waterfall Yield Distribution</h4>
                    <p className="text-muted-foreground">
                      Protocol yield flows bottom-up using formula: r_i = r_min + (r_max - r_min) × (i-1)/99.
                      Coverage level K determined by 28-day historical APY.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-red-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Top-Down Loss Absorption</h4>
                    <p className="text-muted-foreground">
                      Losses absorbed starting from level 100 downward. Your risk = (avg_level - 1)/99.
                      Protocol fees flow to high-risk ranges for additional insurance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Mathematical Precision</h4>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Unlike traditional staking, T-Core uses <strong>exact mathematical formulas</strong> from the document: 
                yield distribution follows sum(S_i × r_i) ≤ Y_est to find coverage level K, 
                ensuring <strong>transparent and predictable</strong> returns based on your chosen risk position.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConcentratedLiquidityDemo;
