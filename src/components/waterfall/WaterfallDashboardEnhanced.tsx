
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, Info, Zap, ShieldAlert, BarChart3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WaterfallChart from '../WaterfallChart';
import WaterfallLegend from './WaterfallLegend';
import { Separator } from '@/components/ui/separator';
import BonusYieldHeatmap from './BonusYieldHeatmap';
import { DISTRIBUTION_PARAMS } from '@/utils/tcoreCalculations';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WaterfallDashboardEnhanced = () => {
  const bonusPoolAmount = 125000; // Example value in USD
  const totalPerformanceFee = bonusPoolAmount / DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS; // 25% goes to bonus
  
  // Calculated actual distribution values
  const actualDistribution = {
    BONUS: bonusPoolAmount,
    BUYBACK: totalPerformanceFee * DISTRIBUTION_PARAMS.FEE_ALLOCATION.BUYBACK,
    PROTOCOL: totalPerformanceFee * DISTRIBUTION_PARAMS.FEE_ALLOCATION.PROTOCOL,
    INSURANCE: totalPerformanceFee * DISTRIBUTION_PARAMS.FEE_ALLOCATION.INSURANCE
  };
  
  // Distribution data for the chart
  const feeDistributionData = [
    { name: 'Bonus Yield', value: DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100, amount: actualDistribution.BONUS, color: '#f59e0b' },
    { name: 'Buyback & Burn', value: DISTRIBUTION_PARAMS.FEE_ALLOCATION.BUYBACK * 100, amount: actualDistribution.BUYBACK, color: '#3b82f6' },
    { name: 'Protocol Revenue', value: DISTRIBUTION_PARAMS.FEE_ALLOCATION.PROTOCOL * 100, amount: actualDistribution.PROTOCOL, color: '#10b981' },
    { name: 'Insurance Buffer', value: DISTRIBUTION_PARAMS.FEE_ALLOCATION.INSURANCE * 100, amount: actualDistribution.INSURANCE, color: '#6366f1' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Waterfall Distribution Model
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-full p-1 hover:bg-muted">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p className="text-sm">
                  The Waterfall model prioritizes yield distribution from low to high risk tiers.
                  Safe Tier gets paid first, then Conservative, Balanced, and finally Hero tier gets any residual.
                  Similarly, losses cascade from high to low risk tiers (Hero absorbs first).
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <AlertDescription className="text-muted-foreground text-sm">
            <span className="font-medium text-primary">Waterfall Distribution:</span> Lower risk tiers receive yield first; higher risk tiers absorb losses first.
            This creates natural insurance where hero tiers protect lower tiers in exchange for higher potential yields.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="waterfall">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="waterfall">Yield Waterfall</TabsTrigger>
            <TabsTrigger value="bonus">Bonus Distribution</TabsTrigger>
            <TabsTrigger value="fee">Performance Fee</TabsTrigger>
          </TabsList>
          
          <TabsContent value="waterfall" className="space-y-4">
            <div className="aspect-[16/9]">
              <WaterfallChart />
            </div>
            <Separator />
            <WaterfallLegend />
            
            {/* Mathematical Note */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Formula:</strong> Dist_i = surplus × (f(i)/∑f(j&gt;1)) × stake
                <br />
                Where f(i) = {DISTRIBUTION_PARAMS.OPTIMAL_K}^(i - {DISTRIBUTION_PARAMS.TIER1_WIDTH}) for higher tiers, creating exponential bonus weighting.
              </p>
            </div>
            
            {/* Loss Cascading */}
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Loss Cascading Mechanism</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Losses are absorbed in reverse order: Hero tier first, then Balanced, Conservative, and finally Safe.
                This creates a natural protection mechanism for lower-risk positions.
              </p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Hero Tier (76-100)</span>
                    <span>First to absorb losses</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[80%]" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Balanced Tier (51-75)</span>
                    <span>Second to absorb</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[60%]" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Conservative Tier (26-50)</span>
                    <span>Third to absorb</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[20%]" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Safe Tier (1-25)</span>
                    <span>Protected by all higher tiers</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[5%]" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bonus" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <h3 className="font-medium">Bonus Yield Mechanism</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100}% of the {DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}% performance fee 
                ({(DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100).toFixed(1)}% of total yield) 
                is allocated to incentivize underweighted tiers.
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Bonus Pool: ${bonusPoolAmount.toLocaleString()}</span>
                  <span>Performance Fee: ${totalPerformanceFee.toLocaleString()}</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
            
            <BonusYieldHeatmap />
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Bonus Formula:</strong> bonus_i = (fee_pool * (target_weight_i - current_weight_i)) / sum_positive_deltas
                <br />
                Target distribution: Safe 10% / Conservative 20% / Balanced 30% / Hero 40%
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="fee" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {feeDistributionData.map((item, index) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm">{item.value}%</span>
                  </div>
                  <div className="mt-1 text-lg font-semibold">${item.amount.toLocaleString()}</div>
                  <div className="mt-1 w-full h-1 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
              ))}
            </div>
            
            <div className="aspect-[16/9] p-4">
              <h3 className="text-sm font-medium mb-4">Performance Fee Allocation</h3>
              <div className="flex items-center justify-around h-full">
                {feeDistributionData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-16 lg:w-24" 
                      style={{ 
                        height: `${item.value * 5}px`, 
                        backgroundColor: item.color,
                        borderRadius: '4px' 
                      }} 
                    />
                    <div className="text-xs mt-2 text-center">{item.name}</div>
                    <div className="text-xs font-medium">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Performance Fee:</strong> {DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}% of total yield
                <br />
                Allocated as: {DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100}% to bonus yield (enhancing higher tiers), 
                {DISTRIBUTION_PARAMS.FEE_ALLOCATION.BUYBACK * 100}% to buyback TDD from pools, 
                {DISTRIBUTION_PARAMS.FEE_ALLOCATION.PROTOCOL * 100}% as protocol revenue, and 
                {DISTRIBUTION_PARAMS.FEE_ALLOCATION.INSURANCE * 100}% to replenish high-risk tiers for insurance buffer.
              </p>
            </div>
            
            {/* Enhanced Performance Fee Visualization */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Performance Fee Visualization</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Protocol Yield</p>
                  <div className="h-6 w-full bg-muted rounded-md overflow-hidden">
                    <div className="h-full bg-blue-200 dark:bg-blue-700 w-full flex items-center px-2 text-xs">
                      100%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">After Performance Fee</p>
                  <div className="h-6 w-full bg-muted rounded-md overflow-hidden flex">
                    <div className="h-full bg-blue-300 dark:bg-blue-600 w-[80%] flex items-center px-2 text-xs">
                      80% (User Yield)
                    </div>
                    <div className="h-full bg-indigo-300 dark:bg-indigo-600 w-[20%] flex items-center justify-center text-xs">
                      20%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-1">Performance Fee Breakdown (20%)</p>
                <div className="h-6 w-full bg-muted rounded-md overflow-hidden flex">
                  <div className="h-full flex items-center justify-center px-1 text-xs text-white" 
                       style={{ width: '25%', backgroundColor: '#f59e0b' }}>
                    Bonus
                  </div>
                  <div className="h-full flex items-center justify-center px-1 text-xs text-white" 
                       style={{ width: '25%', backgroundColor: '#3b82f6' }}>
                    Buyback
                  </div>
                  <div className="h-full flex items-center justify-center px-1 text-xs text-white" 
                       style={{ width: '25%', backgroundColor: '#10b981' }}>
                    Protocol
                  </div>
                  <div className="h-full flex items-center justify-center px-1 text-xs text-white" 
                       style={{ width: '25%', backgroundColor: '#6366f1' }}>
                    Insurance
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WaterfallDashboardEnhanced;
