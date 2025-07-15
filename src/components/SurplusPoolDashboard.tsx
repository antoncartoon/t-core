import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Droplets, TrendingUp, Target, Users, Layers, Calculator, AlertTriangle, ExternalLink } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage } from '@/data/tcoreData';

const SurplusPoolDashboard = () => {
  const [totalYield, setTotalYield] = useState([87300]);
  const [tier1Stake, setTier1Stake] = useState([25]);
  
  // Base curve vs surplus calculations
  const minYield = 60000; // Fixed tier 1 minimum (6% on 25% of 1M)
  const surplus = totalYield[0] - minYield;
  const tier4SurplusShare = surplus * 0.74; // 74% to tier 4
  const tier4BaseYield = 14.91; // From base curve
  const tier4SurplusBonus = (tier4SurplusShare / 250000) * 100; // On 25% stake
  const tier4TotalAPY = tier4BaseYield + tier4SurplusBonus;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
          <Droplets className="w-6 h-6 text-blue-500" />
          Bonus Rewards System
        </h2>
        <p className="text-muted-foreground">
          Extra yield distribution to higher tier stakeholders
        </p>
      </div>

      {/* Base Curve vs Surplus Layer */}
      <Card className="border-info/20 bg-info/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-info" />
            Base Curve vs Surplus Layer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="bull">Bull Market</TabsTrigger>
              <TabsTrigger value="bear">Bear Market</TabsTrigger>
            </TabsList>
            
            <TabsContent value="comparison" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg border">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Base Curve (Predictable)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Static allocation proportional to risk (f(i) = 1.03^(i-25))
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Tier 1:</span>
                      <span className="font-medium">6.0% (Fixed)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tier 4:</span>
                      <span className="font-medium">14.9% (Max)</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-background rounded-lg border border-primary/20">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Surplus Layer (Upside)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Dynamic residual after minimums, higher tiers only
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Tier 1:</span>
                      <span className="font-medium text-muted-foreground">0% (None)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tier 4:</span>
                      <span className="font-medium text-primary">+{tier4SurplusBonus.toFixed(1)}% (Surplus)</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bull" className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Bull Market: High Surplus</h4>
                <p className="text-sm text-green-600 mb-3">
                  Excess yield creates large surplus → Higher tiers capture upside
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">~6%</div>
                    <div className="text-xs text-green-600">Tier 1 (Fixed)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">~18%</div>
                    <div className="text-xs text-green-600">Tier 3 (Base+Surplus)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">~27%</div>
                    <div className="text-xs text-green-600">Tier 4 (Max Upside)</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bear" className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Bear Market: Minimal Surplus</h4>
                <p className="text-sm text-red-600 mb-3">
                  Low yields → Surplus ~0 → Base curve only
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">6%</div>
                    <div className="text-xs text-red-600">Tier 1 (Protected)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">~8%</div>
                    <div className="text-xs text-red-600">Tier 3 (Base Only)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">~15%</div>
                    <div className="text-xs text-red-600">Tier 4 (Base Only)</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Surplus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(TCORE_STATS.currentSurplus)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for distribution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilization Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(TCORE_STATS.surplusUtilization)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Of surplus distributed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Surplus APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPercentage(TCORE_STATS.averageSurplusAPY)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For higher tiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Tier Bonus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ~75%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tier 4 surplus share
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Link */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Advanced Analytics & Simulators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Access detailed surplus distribution charts, cash flow simulators, and Monte Carlo analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.open('/transparency?tab=analytics', '_blank')}
            >
              <Target className="w-4 h-4" />
              Surplus Analytics
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.open('/transparency?tab=risk-tools', '_blank')}
            >
              <TrendingUp className="w-4 h-4" />
              Risk Simulators
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simplified Distribution Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Surplus Distribution Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Current Surplus</div>
                <div className="text-lg font-semibold">{formatCurrency(TCORE_STATS.currentSurplus)}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Tier 1 Share</div>
                <div className="text-lg font-semibold text-muted-foreground">0%</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Tier 2-3 Share</div>
                <div className="text-lg font-semibold text-blue-600">26%</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Tier 4 Share</div>
                <div className="text-lg font-semibold text-purple-600">74%</div>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Distribution Logic</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Tier 1: Fixed 6% APY from guaranteed yield</p>
                <p>• Tier 2-4: Base curve + proportional surplus share</p>
                <p>• Higher tiers earn more surplus as compensation for risk</p>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => window.open('/transparency?tab=analytics', '_blank')}
              >
                <Calculator className="w-4 h-4" />
                Advanced Calculator
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Compensation Logic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risk-Return Insurance Compensation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Why High Tiers Earn Most Surplus</h4>
              <p className="text-sm text-yellow-600 mb-3">
                Higher tiers absorb losses first (subordination) → Deserve upside compensation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Risk Absorption (20% Market Drop)</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Tier 1:</span>
                      <span className="font-medium">$0 loss (0%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tier 4:</span>
                      <span className="font-medium text-red-600">$800 loss (0.8%)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Surplus Compensation</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Tier 1:</span>
                      <span className="font-medium">0% surplus</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tier 4:</span>
                      <span className="font-medium text-green-600">74% surplus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mechanism Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            How Surplus Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium mb-1">Minimum Yield First</h4>
                <p className="text-sm text-muted-foreground">
                  Tier 1 (levels 1-25) receives guaranteed 6% fixed yield from T-Bills + 20% buffer.
                  This ensures zero-risk returns for conservative participants.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium mb-1">Surplus Calculation</h4>
                <p className="text-sm text-muted-foreground">
                  Surplus = Total_Yield - (Fixed_Base × Tier1_Stake). All remaining protocol yield 
                  after minimum guarantees becomes available for higher tier distribution.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium mb-1">Proportional Distribution</h4>
                <p className="text-sm text-muted-foreground">
                  Higher tiers receive surplus proportionally based on risk level and stake size.
                  Formula: Dist_i = surplus × (f(i)/∑f(j&gt;1)) × (S_i / ∑S_higher)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">Mathematical Proof</h4>
            <code className="text-xs text-muted-foreground block mb-2">
              f(i) = 1.03^(i - 25) for levels 26-100
            </code>
            <code className="text-xs text-muted-foreground block mb-2">
              Surplus_i = surplus × (f(i)/∑f(j&gt;1)) × (S_i / ∑S_higher)
            </code>
            <code className="text-xs text-muted-foreground block">
              Total_APY_i = Base_APY_i + Surplus_i / Stake_i
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Simulation: $87.3K yield - $60K minimum = $27.3K surplus → Tier 4 gets $20.2K (74%) → +{tier4SurplusBonus.toFixed(1)}% APY boost
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default SurplusPoolDashboard;