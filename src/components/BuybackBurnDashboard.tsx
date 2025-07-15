import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingUp, Target, Clock } from 'lucide-react';
import { TCORE_STATS, formatCurrency, formatPercentage } from '@/data/tcoreData';
import SupplyChart from './SupplyChart';
import BurnTracker from './BurnTracker';

const BuybackBurnDashboard = () => {
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
            <h4 className="font-medium mb-2 text-sm">Value Calculation Formula</h4>
            <code className="text-xs text-muted-foreground">
              Value_increase = (1 - initial_supply / new_supply) × 100
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Simulation shows 0.5-5% annual value increase depending on protocol revenue and burn rate.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuybackBurnDashboard;