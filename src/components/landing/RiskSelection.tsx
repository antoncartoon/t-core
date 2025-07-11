import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Target, DollarSign } from 'lucide-react';

const RiskSelection = () => {
  const [riskLevel, setRiskLevel] = useState([50]); // 0-100 scale

  // Convert risk level to estimated APY
  const getAPY = (risk: number) => {
    const minAPY = 5;
    const maxAPY = 25;
    return (minAPY + (risk / 100) * (maxAPY - minAPY)).toFixed(1);
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 30) return 'Conservative';
    if (risk < 70) return 'Balanced';
    return 'Aggressive';
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-600';
    if (risk < 70) return 'text-blue-600';
    return 'text-purple-600';
  };

  const currentRisk = riskLevel[0];
  const currentAPY = getAPY(currentRisk);
  const currentLabel = getRiskLabel(currentRisk);
  const currentColor = getRiskColor(currentRisk);

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Customize Your Risk-Return Profile
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            One unified investment pool. Choose your position on the continuous risk-return curve. 
            Higher risk participants absorb more protocol risk, earning higher yields.
          </p>
        </div>

        <Card className="border-border bg-card/50 mb-8">
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Current Selection Display */}
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 ${currentColor} font-medium`}>
                  <Target className="w-4 h-4" />
                  {currentLabel} Position
                </div>
                <div className="mt-4">
                  <div className={`text-4xl font-bold ${currentColor}`}>
                    ~{currentAPY}% APY
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Estimated annual yield based on your risk position
                  </p>
                </div>
              </div>

              {/* Risk Slider */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Lower Risk</span>
                  <span>Higher Risk</span>
                </div>
                <Slider
                  value={riskLevel}
                  onValueChange={setRiskLevel}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>~5% APY</span>
                  <span>~15% APY</span>
                  <span>~25% APY</span>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center mx-auto">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-sm">Single Pool</h4>
                  <p className="text-xs text-muted-foreground">
                    All funds go into one optimized investment strategy
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-sm">Risk Distribution</h4>
                  <p className="text-xs text-muted-foreground">
                    Higher risk users absorb losses first, earn more
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center mx-auto">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-medium text-sm">Flexible Positioning</h4>
                  <p className="text-xs text-muted-foreground">
                    Adjust your risk level anytime
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" className="px-8">
            Start with {currentLabel.toLowerCase()} position
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join the unified pool and customize your risk-return profile
          </p>
        </div>
      </div>
    </section>
  );
};

export default RiskSelection;