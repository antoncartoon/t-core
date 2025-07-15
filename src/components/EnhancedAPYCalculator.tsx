import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Calculator, TrendingUp, Shield, AlertTriangle, DollarSign, HelpCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
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

interface EnhancedAPYCalculatorProps {
  className?: string;
}

interface StressTestScenario {
  name: string;
  marketDrop: number;
  description: string;
  historical: string;
}

const STRESS_SCENARIOS: StressTestScenario[] = [
  {
    name: "Normal Market",
    marketDrop: 0,
    description: "Standard market conditions",
    historical: "2021-2023 average"
  },
  {
    name: "Minor Correction",
    marketDrop: 0.1,
    description: "10% market correction",
    historical: "2018 Q4, 2020 Q1"
  },
  {
    name: "Major Correction",
    marketDrop: 0.2,
    description: "20% market drop",
    historical: "2008 analog, COVID-19"
  },
  {
    name: "Severe Crisis",
    marketDrop: 0.35,
    description: "35% market crash",
    historical: "2008 Financial Crisis"
  }
];

const EnhancedAPYCalculator: React.FC<EnhancedAPYCalculatorProps> = ({ className }) => {
  const [amount, setAmount] = useState(10000);
  const [selectedRange, setSelectedRange] = useState({ min: 1, max: 25 });
  const [selectedStressScenario, setSelectedStressScenario] = useState(0);
  const [showAbsoluteLoss, setShowAbsoluteLoss] = useState(true);

  // Calculate stress test results
  const calculateStressTestResults = () => {
    const scenario = STRESS_SCENARIOS[selectedStressScenario];
    const baseAPY = calculateTCorePersonalAPY(amount, selectedRange);
    
    // Tier 1 (1-25) has 0% loss (guaranteed by T-Bills*1.2)
    const tier1Portion = Math.max(0, Math.min(TIER1_WIDTH - selectedRange.min + 1, selectedRange.max - selectedRange.min + 1));
    const totalRange = selectedRange.max - selectedRange.min + 1;
    const tier1Percentage = (tier1Portion / totalRange) * 100;
    
    // Higher tiers absorb losses via subordination
    const higherTierPortion = totalRange - tier1Portion;
    const higherTierPercentage = (higherTierPortion / totalRange) * 100;
    
    // Loss calculation: high tiers absorb first (subordination)
    let personalLoss = 0;
    if (higherTierPortion > 0) {
      // Exponential subordination: higher risk tiers absorb more
      const avgRiskLevel = (selectedRange.min + selectedRange.max) / 2;
      const subordinationFactor = Math.pow(avgRiskLevel / 100, 1.5);
      personalLoss = scenario.marketDrop * subordinationFactor * higherTierPercentage / 100;
    }
    
    const absoluteLoss = amount * personalLoss;
    const remainingValue = amount - absoluteLoss;
    const adjustedAPY = baseAPY * (1 - personalLoss);
    
    return {
      scenario,
      baseAPY,
      adjustedAPY,
      personalLoss,
      absoluteLoss,
      remainingValue,
      tier1Percentage,
      higherTierPercentage,
      isGuaranteed: tier1Percentage === 100
    };
  };

  const stressResults = calculateStressTestResults();
  const personalAPY = calculateTCorePersonalAPY(amount, selectedRange);

  // Generate APY curve with stress scenarios
  const generateStressTestCurve = () => {
    const data = [];
    for (let i = 1; i <= 100; i++) {
      const baseAPY = calculateTCoreAPY(i) * 100;
      const scenarios = STRESS_SCENARIOS.map(scenario => {
        const subordinationFactor = Math.pow(i / 100, 1.5);
        const loss = scenario.marketDrop * subordinationFactor;
        return baseAPY * (1 - loss);
      });
      
      data.push({
        riskLevel: i,
        baseAPY,
        normal: scenarios[0],
        minor: scenarios[1],
        major: scenarios[2],
        severe: scenarios[3],
        tier: i <= 25 ? 'Tier1' : i <= 50 ? 'Tier2' : i <= 75 ? 'Tier3' : 'Tier4'
      });
    }
    return data;
  };

  const stressCurveData = generateStressTestCurve();

  // Calculate absolute values breakdown
  const getAbsoluteBreakdown = () => {
    const fixedPortion = Math.min(selectedRange.max, TIER1_WIDTH) - selectedRange.min + 1;
    const bonusPortion = Math.max(0, selectedRange.max - TIER1_WIDTH);
    const totalRange = selectedRange.max - selectedRange.min + 1;
    
    const fixedAmount = amount * (fixedPortion / totalRange);
    const bonusAmount = amount * (bonusPortion / totalRange);
    const fixedAnnualYield = fixedAmount * FIXED_BASE_APY;
    const bonusAnnualYield = bonusAmount * (bonusPortion > 0 ? calculateTCoreAPY(selectedRange.max) : 0);
    
    return {
      fixedAmount,
      bonusAmount,
      fixedAnnualYield,
      bonusAnnualYield,
      totalAnnualYield: fixedAnnualYield + bonusAnnualYield
    };
  };

  const absoluteBreakdown = getAbsoluteBreakdown();

  // Preset selection
  const selectPreset = (preset: keyof typeof TIER_PRESETS) => {
    setSelectedRange({ 
      min: TIER_PRESETS[preset].range[0], 
      max: TIER_PRESETS[preset].range[1] 
    });
  };

  const getTierColor = (tier: string) => {
    const colors = {
      'Tier1': 'hsl(var(--tier1))',
      'Tier2': 'hsl(var(--tier2))',
      'Tier3': 'hsl(var(--tier3))',
      'Tier4': 'hsl(var(--tier4))'
    };
    return colors[tier as keyof typeof colors] || 'hsl(var(--muted))';
  };

  return (
    <TooltipProvider>
      <div className={className}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Enhanced T-Core APY Calculator
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md">
                    <p><strong>APY Formula:</strong> Tier1 = T-Bills × 1.2 (fixed {(FIXED_BASE_APY * 100).toFixed(1)}%)</p>
                    <p><strong>Higher Tiers:</strong> Fixed base + bonus × k^(i-25) where k={OPTIMAL_K}</p>
                    <p><strong>Subordination:</strong> Higher tiers absorb losses first, insuring Tier1</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-tier1">
                  Tier1 AAA-rated
                </Badge>
                <Badge variant="outline">
                  Avg {(AVERAGE_APY_TARGET * 100).toFixed(2)}%
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="stress">Stress Tests</TabsTrigger>
                <TabsTrigger value="education">Risk Education</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calculator" className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    Investment Amount (USD)
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Minimum: $1,000 • Maximum: $10,000,000</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
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
                  <Label>Risk Tier Selection</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TIER_PRESETS).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant={selectedRange.min === preset.range[0] && selectedRange.max === preset.range[1] ? "default" : "outline"}
                        onClick={() => selectPreset(key as keyof typeof TIER_PRESETS)}
                        className="text-sm h-auto py-3"
                      >
                        <div className="text-center">
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs opacity-80">[{preset.range[0]}-{preset.range[1]}]</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    Risk Range: {selectedRange.min} - {selectedRange.max}
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p><strong>Tier1 (1-25):</strong> Fixed 6% APY, 0% loss risk (T-Bills collateral)</p>
                        <p><strong>Higher Tiers:</strong> Fixed + bonus APY, but insure pool via subordination</p>
                        <p><strong>Narrow High Range:</strong> Higher APY but more insurance responsibility</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-12">Min:</span>
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
                      <span className="text-sm w-12">Max:</span>
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
                  <Card className="border-success">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">
                          {(personalAPY * 100).toFixed(2)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Personal APY</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-info">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-info">
                          ${absoluteBreakdown.totalAnnualYield.toFixed(0)}
                        </div>
                        <p className="text-sm text-muted-foreground">Annual Yield</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Absolute Values Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Absolute Values Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-tier1" />
                          <span className="font-medium">Fixed Portion</span>
                        </div>
                        <div className="text-lg font-bold">${absoluteBreakdown.fixedAmount.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">
                          Annual: ${absoluteBreakdown.fixedAnnualYield.toFixed(0)} 
                          ({(FIXED_BASE_APY * 100).toFixed(1)}%)
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-tier4" />
                          <span className="font-medium">Bonus Portion</span>
                        </div>
                        <div className="text-lg font-bold">${absoluteBreakdown.bonusAmount.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">
                          Annual: ${absoluteBreakdown.bonusAnnualYield.toFixed(0)} 
                          ({selectedRange.max > TIER1_WIDTH ? (calculateTCoreAPY(selectedRange.max) * 100).toFixed(1) : 0}%)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Stress Test Scenarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {STRESS_SCENARIOS.map((scenario, index) => (
                          <Button
                            key={index}
                            variant={selectedStressScenario === index ? "default" : "outline"}
                            onClick={() => setSelectedStressScenario(index)}
                            className="h-auto py-3"
                          >
                            <div className="text-center">
                              <div className="font-medium">{scenario.name}</div>
                              <div className="text-xs opacity-80">{scenario.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Scenario Impact</div>
                            <div className="text-lg font-bold">
                              {stressResults.scenario.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {stressResults.scenario.historical}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Personal Loss</div>
                            <div className="text-lg font-bold text-error">
                              {showAbsoluteLoss 
                                ? `$${stressResults.absoluteLoss.toFixed(0)}`
                                : `${(stressResults.personalLoss * 100).toFixed(2)}%`
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Remaining: ${stressResults.remainingValue.toFixed(0)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Show absolute values</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAbsoluteLoss(!showAbsoluteLoss)}
                            >
                              {showAbsoluteLoss ? 'Show %' : 'Show $'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stress Test Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">APY Under Stress Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stressCurveData}>
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
                          <RechartsTooltip 
                            formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                            labelFormatter={(label) => `Risk Level: ${label}`}
                          />
                          <ReferenceLine x={25} stroke="hsl(var(--border))" strokeDasharray="5 5" />
                          <ReferenceLine x={50} stroke="hsl(var(--border))" strokeDasharray="5 5" />
                          <ReferenceLine x={75} stroke="hsl(var(--border))" strokeDasharray="5 5" />
                          <Area 
                            type="monotone" 
                            dataKey="severe" 
                            stackId="1"
                            stroke="hsl(var(--error))" 
                            fill="hsl(var(--error))"
                            fillOpacity={0.3}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="major" 
                            stackId="1"
                            stroke="hsl(var(--warning))" 
                            fill="hsl(var(--warning))"
                            fillOpacity={0.3}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="normal" 
                            stackId="1"
                            stroke="hsl(var(--success))" 
                            fill="hsl(var(--success))"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p><strong>Subordination Model:</strong> Higher tiers absorb losses first, protecting Tier1 (T-Bills collateral)</p>
                      <p><strong>2008 Analog:</strong> Tier1 maintained 6% APY, Tier4 faced 15-25% losses</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      T-Core Risk Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">How T-Core Works</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="font-medium text-tier1">Tier1 (AAA-rated)</div>
                            <div className="text-sm text-muted-foreground">
                              Fixed 6% APY from T-Bills × 1.2. Zero loss risk due to government collateral.
                            </div>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="font-medium text-tier4">Higher Tiers</div>
                            <div className="text-sm text-muted-foreground">
                              Fixed base + bonus APY from DeFi protocols. Insure pool via subordination.
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold">Subordination Explained</h3>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <strong>Like MBS/CDO Structure:</strong>
                          </div>
                          <ul className="text-sm space-y-1 ml-4">
                            <li>• Senior tranches (Tier1): Protected, fixed coupon</li>
                            <li>• Junior tranches (Higher): Bonus spread, absorb losses first</li>
                            <li>• Waterfall payments: Fixed to senior, bonus to junior</li>
                            <li>• Stress tests: Based on historical market crashes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-warning/10 p-4 rounded-lg border border-warning">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <strong className="text-warning">Risk Disclosure</strong>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>• Tier1: Government-backed, minimal risk</p>
                        <p>• Higher Tiers: DeFi risks, smart contract risks, subordination losses</p>
                        <p>• Historical: 2008 analog saw 0% Tier1 loss, 15-25% Tier4 losses</p>
                        <p>• Not FDIC insured. Read documentation before investing.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedAPYCalculator;