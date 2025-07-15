import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Calculator, TrendingUp, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { 
  calculateTCoreAPY, 
  calculateTCorePersonalAPY, 
  TIER_PRESETS,
  FIXED_BASE_APY,
  OPTIMAL_K,
  TIER1_WIDTH,
  AVERAGE_APY_TARGET,
  BONUS_SPREAD
} from '@/utils/riskRangeCalculations';
import SkeletonAPYCalculator from '@/components/SkeletonAPYCalculator';

interface APYCalculatorProps {
  className?: string;
}

const APYCalculator: React.FC<APYCalculatorProps> = ({ className }) => {
  const [amount, setAmount] = useState(10000);
  const [selectedRange, setSelectedRange] = useState({ min: 1, max: 25 });
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [multiSplitAllocations, setMultiSplitAllocations] = useState([
    { tier: 'TIER1', fraction: 0.5, range: [1, 25] },
    { tier: 'TIER4', fraction: 0.5, range: [76, 100] }
  ]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate APY data for chart
  const generateAPYCurve = () => {
    const data = [];
    for (let i = 1; i <= 100; i++) {
      const apy = calculateTCoreAPY(i);
      data.push({
        riskLevel: i,
        apy: apy * 100, // Convert to percentage
        tier: i <= 25 ? 'Tier1' : i <= 50 ? 'Tier2' : i <= 75 ? 'Tier3' : 'Tier4'
      });
    }
    return data;
  };

  const apyCurveData = generateAPYCurve();

  // Calculate personal APY
  const calculatePersonalAPY = () => {
    if (isAdvancedMode) {
      let totalAPY = 0;
      for (const allocation of multiSplitAllocations) {
        const rangeAPY = calculateTCorePersonalAPY(
          amount * allocation.fraction,
          { min: allocation.range[0], max: allocation.range[1] }
        );
        totalAPY += rangeAPY * allocation.fraction;
      }
      return totalAPY;
    } else {
      return calculateTCorePersonalAPY(amount, selectedRange);
    }
  };

  const personalAPY = calculatePersonalAPY();

  // Calculate risk and returns breakdown
  const getBreakdown = () => {
    const fixedPortion = Math.min(selectedRange.max, TIER1_WIDTH) - selectedRange.min + 1;
    const bonusPortion = Math.max(0, selectedRange.max - TIER1_WIDTH);
    const totalRange = selectedRange.max - selectedRange.min + 1;
    
    const fixedPercentage = (fixedPortion / totalRange) * 100;
    const bonusPercentage = (bonusPortion / totalRange) * 100;
    
    return {
      fixed: fixedPercentage,
      bonus: bonusPercentage,
      fixedAPY: FIXED_BASE_APY * 100,
      bonusAPY: bonusPortion > 0 ? calculateTCoreAPY(selectedRange.max) * 100 : 0
    };
  };

  const breakdown = getBreakdown();

  // Preset selection
  const selectPreset = (preset: keyof typeof TIER_PRESETS) => {
    setSelectedRange({ 
      min: TIER_PRESETS[preset].range[0], 
      max: TIER_PRESETS[preset].range[1] 
    });
  };

  if (isLoading) {
    return (
      <div className={className}>
        <SkeletonAPYCalculator />
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              T-Core APY Calculator
            </CardTitle>
            <Badge variant="outline">
              Simulation: k={OPTIMAL_K}, Avg {(AVERAGE_APY_TARGET * 100).toFixed(2)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple Mode</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Split</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple">
              <div className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="1000"
                    max="10000000"
                    step="1000"
                  />
                </div>

                {/* Tier Presets */}
                <div className="space-y-2">
                  <Label>Quick Tier Selection</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TIER_PRESETS).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant={selectedRange.min === preset.range[0] && selectedRange.max === preset.range[1] ? "default" : "outline"}
                        onClick={() => selectPreset(key as keyof typeof TIER_PRESETS)}
                        className="text-sm"
                      >
                        {preset.name}
                        <br />
                        [{preset.range[0]}-{preset.range[1]}]
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-4">
                  <Label>Risk Range: {selectedRange.min} - {selectedRange.max}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Min:</span>
                      <Slider
                        value={[selectedRange.min]}
                        onValueChange={(value) => setSelectedRange(prev => ({ ...prev, min: value[0] }))}
                        min={1}
                        max={Math.min(selectedRange.max, 100)}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-8">{selectedRange.min}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Max:</span>
                      <Slider
                        value={[selectedRange.max]}
                        onValueChange={(value) => setSelectedRange(prev => ({ ...prev, max: value[0] }))}
                        min={Math.max(selectedRange.min, 1)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm w-8">{selectedRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {(personalAPY * 100).toFixed(2)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Personal APY</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          ${(amount * personalAPY).toFixed(0)}
                        </div>
                        <p className="text-sm text-muted-foreground">Annual Yield</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Breakdown */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          Fixed Portion ({breakdown.fixed.toFixed(1)}%)
                        </span>
                        <span className="font-bold">{breakdown.fixedAPY.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          Bonus Portion ({breakdown.bonus.toFixed(1)}%)
                        </span>
                        <span className="font-bold">{breakdown.bonusAPY.toFixed(2)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Advanced mode allows splitting your investment across multiple tiers
                </div>
                
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount-advanced">Total Investment Amount (USD)</Label>
                  <Input
                    id="amount-advanced"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="1000"
                    max="10000000"
                    step="1000"
                  />
                </div>

                {/* Multi-split allocations */}
                <div className="space-y-4">
                  <Label>Allocation Splits</Label>
                  {multiSplitAllocations.map((allocation, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div>
                            <Label className="text-sm">Tier</Label>
                            <select
                              value={allocation.tier}
                              onChange={(e) => {
                                const newAllocations = [...multiSplitAllocations];
                                newAllocations[index].tier = e.target.value;
                                newAllocations[index].range = TIER_PRESETS[e.target.value as keyof typeof TIER_PRESETS].range;
                                setMultiSplitAllocations(newAllocations);
                              }}
                              className="w-full p-2 border rounded"
                            >
                              {Object.entries(TIER_PRESETS).map(([key, preset]) => (
                                <option key={key} value={key}>
                                  {preset.name} [{preset.range[0]}-{preset.range[1]}]
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label className="text-sm">Fraction</Label>
                            <Input
                              type="number"
                              value={allocation.fraction}
                              onChange={(e) => {
                                const newAllocations = [...multiSplitAllocations];
                                newAllocations[index].fraction = Number(e.target.value);
                                setMultiSplitAllocations(newAllocations);
                              }}
                              min="0"
                              max="1"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Amount</Label>
                            <div className="p-2 bg-muted rounded">
                              ${(amount * allocation.fraction).toFixed(0)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Advanced Results */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(personalAPY * 100).toFixed(2)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Weighted Average APY</p>
                      <div className="text-lg font-bold mt-2">
                        ${(amount * personalAPY).toFixed(0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Annual Yield</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* APY Curve Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">T-Core APY Curve (k={OPTIMAL_K})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={apyCurveData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="riskLevel" 
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      label={{ value: 'APY (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(2)}%`, 'APY']}
                      labelFormatter={(label) => `Risk Level: ${label}`}
                    />
                    <ReferenceLine x={25} stroke="hsl(var(--border))" strokeDasharray="5 5" />
                    <ReferenceLine x={50} stroke="hsl(var(--border))" strokeDasharray="5 5" />
                    <ReferenceLine x={75} stroke="hsl(var(--border))" strokeDasharray="5 5" />
                    <Line 
                      type="monotone" 
                      dataKey="apy" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>Formula:</strong> tier1 APY = {(FIXED_BASE_APY * 100).toFixed(1)}% (fixed), higher = fixed_base + bonus * k^(i-25)</p>
                <p><strong>Simulation:</strong> Average APY {(AVERAGE_APY_TARGET * 100).toFixed(2)}%, spread {(BONUS_SPREAD * 100).toFixed(2)}%, variance ~2.9e-07</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default APYCalculator;