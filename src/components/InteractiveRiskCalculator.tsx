import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Target,
  ArrowRight,
  Zap
} from 'lucide-react';
import { 
  calculateTCoreAPY, 
  TIER_PRESETS, 
  FIXED_BASE_APY,
  AVERAGE_APY_TARGET 
} from '@/utils/riskRangeCalculations';
import SkeletonInteractiveRiskCalculator from '@/components/SkeletonInteractiveRiskCalculator';

interface InteractiveRiskCalculatorProps {
  className?: string;
}

const InteractiveRiskCalculator: React.FC<InteractiveRiskCalculatorProps> = ({ className }) => {
  const [investment, setInvestment] = useState(25000);
  const [riskLevel, setRiskLevel] = useState(50);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const currentAPY = calculateTCoreAPY(riskLevel);
  const annualReturn = investment * currentAPY;
  const monthlyReturn = annualReturn / 12;

  // Determine risk category and colors
  const getRiskCategory = (level: number) => {
    if (level <= 25) return { name: 'Safe', color: 'bg-green-500', textColor: 'text-green-600' };
    if (level <= 50) return { name: 'Conservative', color: 'bg-blue-500', textColor: 'text-blue-600' };
    if (level <= 75) return { name: 'Balanced', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { name: 'T-Core HERO', color: 'bg-red-500', textColor: 'text-red-600' };
  };

  const riskCategory = getRiskCategory(riskLevel);

  // Animation trigger
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [riskLevel, investment]);

  // Preset selection
  const selectPreset = (preset: keyof typeof TIER_PRESETS) => {
    setActivePreset(preset);
    setRiskLevel(TIER_PRESETS[preset].range[1]); // Use max of range
  };

  // Investment amount presets
  const investmentPresets = [10000, 25000, 50000, 100000, 250000];

  if (isLoading) {
    return (
      <div className={className}>
        <SkeletonInteractiveRiskCalculator />
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Interactive Risk Calculator
            </CardTitle>
            <Badge variant="outline" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              Live Simulation
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls Section */}
            <div className="space-y-6">
              {/* Investment Amount */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Investment Amount</label>
                <div className="flex gap-2 flex-wrap">
                  {investmentPresets.map((preset) => (
                    <Button
                      key={preset}
                      variant={investment === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInvestment(preset)}
                      className="transition-all"
                    >
                      ${preset.toLocaleString()}
                    </Button>
                  ))}
                </div>
                <div className="text-lg font-bold">
                  ${investment.toLocaleString()}
                </div>
              </div>

              {/* Risk Level Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Risk Level</label>
                  <Badge variant="outline" className={riskCategory.textColor}>
                    {riskCategory.name}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <Slider
                    value={[riskLevel]}
                    onValueChange={(value) => setRiskLevel(value[0])}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  
                  {/* Risk Level Visualization */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                  
                  {/* Risk Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Risk Level: {riskLevel}</span>
                      <span className={riskCategory.textColor}>
                        {riskCategory.name}
                      </span>
                    </div>
                    <Progress value={riskLevel} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Tier Presets */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Quick Tiers</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TIER_PRESETS).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant={activePreset === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => selectPreset(key as keyof typeof TIER_PRESETS)}
                      className="text-xs p-2 h-auto flex flex-col"
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs opacity-70">
                        {preset.range[0]}-{preset.range[1]}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Results */}
              <div className="grid grid-cols-1 gap-4">
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-muted-foreground">APY</span>
                      </div>
                      <div className={`text-3xl font-bold transition-all duration-300 ${
                        isAnimating ? 'scale-110' : 'scale-100'
                      }`}>
                        {(currentAPY * 100).toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-muted-foreground">Annual</span>
                        </div>
                        <div className="text-lg font-bold">
                          ${annualReturn.toFixed(0)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-muted-foreground">Monthly</span>
                        </div>
                        <div className="text-lg font-bold">
                          ${monthlyReturn.toFixed(0)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Risk Breakdown */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Risk Breakdown</span>
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fixed Base APY</span>
                        <span className="font-medium">
                          {(FIXED_BASE_APY * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Risk Bonus</span>
                        <span className="font-medium">
                          {((currentAPY - FIXED_BASE_APY) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span className="font-medium">Total APY</span>
                        <span className="font-bold">
                          {(currentAPY * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button className="w-full" size="lg">
                Start with {riskCategory.name} Strategy
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Educational Note */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-medium">How T-Core Risk Works</div>
                <div className="text-xs text-muted-foreground">
                  Risk levels 1-25 get fixed {(FIXED_BASE_APY * 100).toFixed(1)}% APY. 
                  Higher levels add bonus yield from T-Core HERO protection. 
                  Average target APY: {(AVERAGE_APY_TARGET * 100).toFixed(1)}%.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveRiskCalculator;