import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingUp, Target, Users } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage } from '@/data/tcoreData';
import SurplusSimulator from './SurplusSimulator';
import WaterfallChart from './WaterfallChart';

const SurplusPoolDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
          <Droplets className="w-6 h-6 text-blue-500" />
          Surplus Pool Distribution
        </h2>
        <p className="text-muted-foreground">
          Post-minimum yield distribution to higher tiers
        </p>
      </div>

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

      {/* Interactive Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Surplus Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WaterfallChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Cash Flow Simulator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SurplusSimulator />
          </CardContent>
        </Card>
      </div>

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
            <h4 className="font-medium mb-2 text-sm">Distribution Formula</h4>
            <code className="text-xs text-muted-foreground block mb-2">
              f(i) = 1.03^(i - 25) for levels 26-100
            </code>
            <code className="text-xs text-muted-foreground block">
              Surplus_i = surplus × weight_i × stake_ratio_i
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Simulation shows Tier 4 captures ~75% of surplus, providing maximum upside for risk-takers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurplusPoolDashboard;