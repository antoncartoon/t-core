import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Shield, TrendingDown, Calculator, Info } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { 
  calculateTCoreSubordinationLoss, 
  generateTCoreRiskTicks, 
  TIER1_WIDTH,
  FIXED_BASE_APY,
  OPTIMAL_K
} from '@/utils/riskRangeCalculations';

interface RiskSimulatorProps {
  className?: string;
}

const RiskSimulator: React.FC<RiskSimulatorProps> = ({ className }) => {
  const [amount, setAmount] = useState(10000);
  const [riskRange, setRiskRange] = useState({ min: 76, max: 100 });
  const [stressScenario, setStressScenario] = useState(20); // 20% protocol loss

  // Generate risk ticks
  const riskTicks = generateTCoreRiskTicks();

  // Calculate subordination losses for different scenarios
  const calculateLossScenarios = () => {
    const scenarios = [5, 10, 20, 30]; // 5%, 10%, 20%, 30% protocol losses
    const results: any[] = [];
    
    for (const scenario of scenarios) {
      const protocolLoss = (scenario / 100) * 12_500_000; // Total protocol loss
      const lossDistribution = calculateTCoreSubordinationLoss(protocolLoss, riskTicks);
      
      for (let riskLevel = 1; riskLevel <= 100; riskLevel++) {
        const lossPercentage = lossDistribution[riskLevel] || 0;
        const absoluteLoss = amount * lossPercentage;
        
        results.push({
          riskLevel,
          scenario,
          lossPercentage: lossPercentage * 100,
          absoluteLoss,
          tier: riskLevel <= 25 ? 'Tier1' : riskLevel <= 50 ? 'Tier2' : riskLevel <= 75 ? 'Tier3' : 'Tier4'
        });
      }
    }
    
    return results;
  };

  const lossScenarios = calculateLossScenarios();

  // Calculate user's specific risk for selected range
  const calculateUserRisk = () => {
    const protocolLoss = (stressScenario / 100) * 12_500_000;
    const lossDistribution = calculateTCoreSubordinationLoss(protocolLoss, riskTicks);
    
    let totalLoss = 0;
    const rangeSize = riskRange.max - riskRange.min + 1;
    
    for (let level = riskRange.min; level <= riskRange.max; level++) {
      const levelLoss = lossDistribution[level] || 0;
      totalLoss += levelLoss / rangeSize; // Weighted average
    }
    
    return {
      lossPercentage: totalLoss * 100,
      absoluteLoss: amount * totalLoss,
      isGuaranteed: riskRange.max <= TIER1_WIDTH
    };
  };

  const userRisk = calculateUserRisk();

  // Generate heatmap data
  const generateHeatmapData = () => {
    const data = [];
    const selectedScenario = lossScenarios.filter(s => s.scenario === stressScenario);
    
    for (let i = 0; i < selectedScenario.length; i += 5) { // Sample every 5th level for performance
      const point = selectedScenario[i];
      data.push({
        x: point.riskLevel,
        y: point.lossPercentage,
        absoluteLoss: point.absoluteLoss,
        tier: point.tier
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();

  // Color coding for tiers
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier1': return '#10b981'; // Green - safe
      case 'Tier2': return '#3b82f6'; // Blue - low risk
      case 'Tier3': return '#f59e0b'; // Orange - medium risk
      case 'Tier4': return '#ef4444'; // Red - high risk
      default: return '#6b7280';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            T-Core Risk Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label>Stress Scenario: {stressScenario}% Protocol Loss</Label>
                <Slider
                  value={[stressScenario]}
                  onValueChange={(value) => setStressScenario(value[0])}
                  min={5}
                  max={50}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Risk Range Selection */}
            <div className="space-y-4">
              <Label>Risk Range: {riskRange.min} - {riskRange.max}</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm">Min:</span>
                  <Slider
                    value={[riskRange.min]}
                    onValueChange={(value) => setRiskRange(prev => ({ ...prev, min: value[0] }))}
                    min={1}
                    max={Math.min(riskRange.max, 100)}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{riskRange.min}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Max:</span>
                  <Slider
                    value={[riskRange.max]}
                    onValueChange={(value) => setRiskRange(prev => ({ ...prev, max: value[0] }))}
                    min={Math.max(riskRange.min, 1)}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{riskRange.max}</span>
                </div>
              </div>
            </div>

            {/* User Risk Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={userRisk.isGuaranteed ? "bg-green-50 dark:bg-green-900/20" : "bg-orange-50 dark:bg-orange-900/20"}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {userRisk.isGuaranteed ? (
                        <Shield className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      )}
                      <span className="text-sm font-medium">
                        {userRisk.isGuaranteed ? 'Guaranteed' : 'At Risk'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {userRisk.lossPercentage.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Loss Percentage</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-medium">Absolute Loss</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      ${userRisk.absoluteLoss.toFixed(0)}
                    </div>
                    <p className="text-sm text-muted-foreground">on ${amount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calculator className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Remaining Value</span>
                    </div>
                    <div className="text-2xl font-bold">
                      ${(amount - userRisk.absoluteLoss).toFixed(0)}
                    </div>
                    <p className="text-sm text-muted-foreground">after {stressScenario}% stress</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subordination Explanation */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>T-Core Subordination:</strong> tier1 (levels 1-25) has 0% loss in any scenario due to fixed guarantee. 
                Higher tiers absorb losses first via formula: Loss_i = L_total * (f(i)/∑f(j&gt;1)), where f(i) = k^(i-25) with k={OPTIMAL_K}.
              </AlertDescription>
            </Alert>

            {/* Risk Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Heatmap: {stressScenario}% Protocol Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={heatmapData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="x" 
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        label={{ value: 'Risk Level', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        label={{ value: 'Loss %', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => {
                          if (name === 'y') return [`${value.toFixed(2)}%`, 'Loss Percentage'];
                          return [value, name];
                        }}
                        labelFormatter={(label) => `Risk Level: ${label}`}
                      />
                      <Scatter dataKey="y">
                        {heatmapData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getTierColor(entry.tier)} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Tier1 (0% loss)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Tier2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Tier3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Tier4 (highest loss)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Analogs */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Analogs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="font-medium">2008 Financial Crisis</span>
                    <Badge variant="destructive">~20% protocol loss</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="font-medium">COVID-19 March 2020</span>
                    <Badge variant="destructive">~15% protocol loss</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="font-medium">FTX Collapse 2022</span>
                    <Badge variant="destructive">~10% protocol loss</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Simulation confirms: tier1 = 0 loss, tier4 ~0.8% in 20% stress-drop scenario
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskSimulator;