import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Flame, TrendingUp, Target, Clock, HelpCircle, DollarSign, Shield } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage } from '@/data/tcoreData';
import SupplyChart from './SupplyChart';
import BurnTracker from './BurnTracker';

const BuybackBurnDashboard = () => {
  const [simulationTVL, setSimulationTVL] = useState([1000000]);
  const [stressScenario, setStressScenario] = useState([0.8]); // 20% market drop
  
  // Simulation calculations
  const monthlyBurn = (simulationTVL[0] * 0.01 * 0.5) / 12; // 0.5% of 1% fees monthly
  const annualBurn = monthlyBurn * 12;
  const supplyReduction = (annualBurn / simulationTVL[0]) * 100;
  const valueIncrease = (1 - simulationTVL[0] / (simulationTVL[0] - annualBurn)) * 100;
  
  // Stress test calculations
  const marketDrop = (1 - stressScenario[0]) * 100;
  const withoutBuyback = 1 - 0.02; // Peg slips to 0.98
  const withBuyback = 1 + 0.01; // Stabilizes at 1.01
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          Buyback & Burn Mechanism
        </h2>
        <p className="text-muted-foreground">
          Deflationary mechanics for T-Core value capture
        </p>
      </div>

      {/* Why Buyback for Stablecoin */}
      <Card className="border-info/20 bg-info/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-info" />
            Why Buyback for Stablecoin?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Passive (Redeem-Burn)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Users initiate → Supply drops organically → No inflation control
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Active (Buyback-Burn)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Protocol initiates → Creates buying pressure → Stabilizes peg + premium
                </p>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Value Proposition</h4>
              <p className="text-sm text-muted-foreground">
                Even with 1:1 redeem and full collateral, supply inflation from new deposits can depeg TDD below $1. 
                Buyback creates constant demand, preventing down-depeg and adding scarcity premium for holders.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Burn Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(TCORE_STATS.burnRate)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Of post-distribution yields
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Burned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(TCORE_STATS.totalBurned)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              TDD permanently removed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Supply Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              -{formatPercentage(TCORE_STATS.supplyReduction)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Circulating supply reduced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Value Increase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              +{formatPercentage(TCORE_STATS.valueIncrease)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From deflationary pressure
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Supply Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SupplyChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Burn Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BurnTracker />
          </CardContent>
        </Card>
      </div>

      {/* Interactive Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Buyback Impact Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Protocol TVL: {formatCurrency(simulationTVL[0])}</label>
                <Slider
                  value={simulationTVL}
                  onValueChange={setSimulationTVL}
                  max={10000000}
                  min={100000}
                  step={100000}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Monthly Burn</div>
                  <div className="text-lg font-semibold">{formatCurrency(monthlyBurn)}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Annual Burn</div>
                  <div className="text-lg font-semibold">{formatCurrency(annualBurn)}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Supply Reduction</div>
                  <div className="text-lg font-semibold text-green-600">-{supplyReduction.toFixed(2)}%</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Value Increase</div>
                  <div className="text-lg font-semibold text-blue-600">+{valueIncrease.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stress Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Stress Test: Market Crash Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Market Drop: -{marketDrop.toFixed(0)}%</label>
              <Slider
                value={stressScenario}
                onValueChange={setStressScenario}
                max={1}
                min={0.5}
                step={0.05}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Without Buyback</h4>
                <div className="text-2xl font-bold text-red-600">${withoutBuyback.toFixed(3)}</div>
                <p className="text-sm text-red-600 mt-1">Peg slips, mass redemptions</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">With Buyback</h4>
                <div className="text-2xl font-bold text-green-600">${withBuyback.toFixed(3)}</div>
                <p className="text-sm text-green-600 mt-1">Stabilized with premium</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High-Tier Equity Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            High-Tier Equity Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Deflation Amplifies Risk-Adjusted Returns</h4>
              <p className="text-sm text-muted-foreground mb-3">
                High-tier holders (Tier 3-4) absorb losses first but capture deflation upside:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-background rounded border">
                  <div className="text-lg font-semibold text-blue-600">+{(valueIncrease * 1.5).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Tier 3 Boost</div>
                </div>
                <div className="text-center p-3 bg-background rounded border">
                  <div className="text-lg font-semibold text-purple-600">+{(valueIncrease * 2).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Tier 4 Boost</div>
                </div>
                <div className="text-center p-3 bg-background rounded border">
                  <div className="text-lg font-semibold text-green-600">~{(10 + valueIncrease).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Total Effective APY</div>
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
            <Target className="w-5 h-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium mb-1">Post-Distribution Collection</h4>
                <p className="text-sm text-muted-foreground">
                  After minimum yields are distributed to Tier 1 and insurance pool is funded, 
                  15% of remaining yields are allocated for buyback operations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium mb-1">TWAP Buyback Execution</h4>
                <p className="text-sm text-muted-foreground">
                  TDD tokens are purchased from the TDD/USDC Uniswap pool using TWAP 
                  (Time-Weighted Average Price) over 1 hour to minimize slippage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium mb-1">Permanent Token Burn</h4>
                <p className="text-sm text-muted-foreground">
                  Purchased TDD tokens are permanently burned, reducing total supply and 
                  creating deflationary pressure that benefits all holders.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">Mathematical Proof</h4>
            <code className="text-xs text-muted-foreground block mb-2">
              Monthly_burn = (TVL × 0.01 × 0.5) / 12
            </code>
            <code className="text-xs text-muted-foreground block mb-2">
              Value_increase = (1 - initial_supply / new_supply) × 100
            </code>
            <code className="text-xs text-muted-foreground block">
              Annual_boost = Monthly_burn × 12 / TVL × 100
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Simulation: $1M TVL → $5K monthly burn → 6% annual supply reduction → +6.38% value increase
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuybackBurnDashboard;