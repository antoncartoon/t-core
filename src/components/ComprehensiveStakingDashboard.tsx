
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, TrendingUp, Target, BarChart3, Flame } from 'lucide-react';
import RangeStakingCard from './RangeStakingCard';
import { TCoreStakingCard } from './TCoreStakingCard';
import WaterfallDashboardEnhanced from './waterfall/WaterfallDashboardEnhanced';
import BonusYieldHeatmap from './waterfall/BonusYieldHeatmap';
import InsurancePoolStatus from './waterfall/InsurancePoolStatus';
import RiskAnalyticsDashboard from './analytics/RiskAnalyticsDashboard';
import { DISTRIBUTION_PARAMS } from '@/utils/tcoreCalculations';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileRiskAnalytics from './mobile/MobileRiskAnalytics';

const ComprehensiveStakingDashboard = () => {
  const [activeTab, setActiveTab] = useState('stake');
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="stake" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Stake TDD</span>
            <span className="md:hidden">Stake</span>
          </TabsTrigger>
          <TabsTrigger value="waterfall" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden md:inline">Waterfall Model</span>
            <span className="md:hidden">Model</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Risk Analytics</span>
            <span className="md:hidden">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="bonus" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span className="hidden md:inline">Bonus Yield</span>
            <span className="md:hidden">Bonus</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stake" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    <span>Range Staking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RangeStakingCard />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <TCoreStakingCard />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="waterfall" className="mt-6">
          <div className="space-y-6">
            <WaterfallDashboardEnhanced />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InsurancePoolStatus 
                currentAmount={875000}
                targetAmount={1250000}
                coverageRatio={0.7}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Performance Fee Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Performance Fee</div>
                      <div className="text-xl font-bold">{DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}%</div>
                      <div className="text-xs text-muted-foreground">of total yield</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Bonus Allocation</div>
                      <div className="text-xl font-bold text-orange-500">
                        {DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(DISTRIBUTION_PARAMS.PERFORMANCE_FEE * DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100).toFixed(1)}% of total yield
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(DISTRIBUTION_PARAMS.FEE_ALLOCATION).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="w-full h-10 rounded-md flex items-center justify-center text-white text-xs font-medium"
                             style={{ 
                               backgroundColor: 
                                 key === 'BONUS' ? '#f59e0b' : 
                                 key === 'BUYBACK' ? '#3b82f6' : 
                                 key === 'PROTOCOL' ? '#10b981' : 
                                 '#6366f1'
                             }}>
                          {(value * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs mt-1">{key.charAt(0) + key.slice(1).toLowerCase()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          {isMobile ? (
            <MobileRiskAnalytics />
          ) : (
            <RiskAnalyticsDashboard />
          )}
        </TabsContent>
        
        <TabsContent value="bonus" className="mt-6">
          <div className="space-y-6">
            <BonusYieldHeatmap />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span>Bonus Yield Formula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-2">How bonus yield is calculated:</div>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. {DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}% of total protocol yield is taken as performance fee</li>
                    <li>2. {DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100}% of this fee goes to the bonus yield pool</li>
                    <li>3. Calculate liquidity imbalance: <code>delta_i = target_weight_i - current_weight_i</code></li>
                    <li>4. Only positive deltas (underweight tiers) receive bonus</li>
                    <li>5. Bonus for tier i: <code>bonus_i = bonus_pool * delta_i / sum(positive_deltas)</code></li>
                    <li>6. The bonus increases APY for all positions in underweight tiers</li>
                  </ol>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Target Distribution</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Safe (1-25)</span>
                        <span>10%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Conservative (26-50)</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Balanced (51-75)</span>
                        <span>30%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Hero (76-100)</span>
                        <span>40%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Benefits of Bonus Yield</div>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                      <li>Naturally balances protocol liquidity</li>
                      <li>Rewards early adopters of underweight tiers</li>
                      <li>Increases capital efficiency</li>
                      <li>Optimizes risk distribution</li>
                      <li>Creates market-driven yield incentives</li>
                    </ul>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  The bonus yield mechanism uses {(DISTRIBUTION_PARAMS.PERFORMANCE_FEE * DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100).toFixed(1)}% 
                  of total yield to create an automatic rebalancing incentive
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveStakingDashboard;
