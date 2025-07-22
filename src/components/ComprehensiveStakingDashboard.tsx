
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, TrendingUp, Target, BarChart3, Flame, Calculator, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RangeStakingCard from './RangeStakingCard';
import { TCoreStakingCard } from './TCoreStakingCard';
import WaterfallDashboardEnhanced from './waterfall/WaterfallDashboardEnhanced';
import BonusYieldHeatmap from './waterfall/BonusYieldHeatmap';
import InsurancePoolStatus from './waterfall/InsurancePoolStatus';
import RiskAnalyticsDashboard from './analytics/RiskAnalyticsDashboard';
import { DISTRIBUTION_PARAMS } from '@/utils/tcoreCalculations';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileRiskAnalytics from './mobile/MobileRiskAnalytics';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import AutoDistributeButton from './waterfall/AutoDistributeButton';

const ComprehensiveStakingDashboard = () => {
  const [activeTab, setActiveTab] = useState('stake');
  const [showTutorial, setShowTutorial] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Sample staking amount for demo
  const [stakingAmount, setStakingAmount] = useState(1000);
  
  const handleTutorialToggle = () => {
    setShowTutorial(!showTutorial);
    if (!showTutorial) {
      toast({
        title: "Tutorial Mode Activated",
        description: "Follow the guided walkthrough to learn about the T-Core waterfall model and bonus yield mechanism.",
      });
    }
  };
  
  const handleAutoDistribute = (ranges: Array<{ range: [number, number]; weight: number }>) => {
    console.log("Auto-distributing to ranges:", ranges);
    toast({
      title: "Liquidity Auto-Distributed",
      description: `Your TDD has been optimally allocated to ${ranges.length} tier(s) based on current protocol needs.`,
      duration: 5000,
    });
    
    // In a real implementation, this would create the position with the distributed ranges
  };
  
  return (
    <div className="space-y-6">
      {/* Feature Notice with Tutorial Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <Alert variant="default" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 flex-1">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>T-Core Waterfall Model</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Try our new waterfall distribution model, bonus yield mechanism, and auto-distribution feature for optimized returns.
          </AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100"
          onClick={handleTutorialToggle}
        >
          <Calculator className="mr-2 h-4 w-4" />
          {showTutorial ? "Exit Tutorial" : "Learn How It Works"}
        </Button>
      </div>
      
      {/* Interactive Tutorial */}
      {showTutorial && (
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-primary">T-Core Waterfall Distribution Tutorial</CardTitle>
            <CardDescription>
              Learn how our innovative tranching model works to optimize yields and protect lower-risk positions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium">Step 1: Tiered Risk Structure</h3>
                  <p className="text-sm text-muted-foreground">Our model divides risk into 4 tiers across 100 levels:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• <span className="font-medium text-green-600 dark:text-green-400">Safe (1-25):</span> Fixed rate guarantee (T-Bills × 1.2 ≈ 5.16% APY)</li>
                    <li>• <span className="font-medium text-blue-600 dark:text-blue-400">Conservative (26-50):</span> Target 7% APY</li>
                    <li>• <span className="font-medium text-yellow-600 dark:text-yellow-400">Balanced (51-75):</span> Target 9% APY</li>
                    <li>• <span className="font-medium text-purple-600 dark:text-purple-400">Hero (76-100):</span> Highest risk with residual yield</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">Step 2: Waterfall Yield Distribution</h3>
                  <p className="text-sm text-muted-foreground">Yield flows from lowest to highest risk:</p>
                  <ol className="text-sm mt-2 space-y-1">
                    <li>1. Safe tier gets paid first (guaranteed)</li>
                    <li>2. Conservative tier next</li>
                    <li>3. Balanced tier after that</li>
                    <li>4. Hero tier gets any remaining yield (highest potential)</li>
                  </ol>
                  <div className="text-xs mt-2 font-mono bg-muted p-2 rounded">
                    APY(r) = APY_safe + (APY_protocol - APY_safe) * r^1.5
                    <br />
                    where r = (bucket number) / 99
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                <Target className="h-6 w-6 text-red-500 mt-1" />
                <div>
                  <h3 className="font-medium">Step 3: Loss Absorption (Reverse Waterfall)</h3>
                  <p className="text-sm text-muted-foreground">Losses flow from highest to lowest risk:</p>
                  <ol className="text-sm mt-2 space-y-1">
                    <li>1. Hero tier absorbs losses first</li>
                    <li>2. Then Balanced tier</li>
                    <li>3. Then Conservative tier</li>
                    <li>4. Safe tier is protected by all others</li>
                  </ol>
                  <div className="text-xs mt-2 font-mono bg-muted p-2 rounded">
                    Loss = min(residual_loss, user_position) / user_position
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                <Flame className="h-6 w-6 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-medium">Step 4: Bonus Yield Mechanism</h3>
                  <p className="text-sm text-muted-foreground">
                    25% of the performance fee (20% of total yield) is used to incentivize underweighted tiers:
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Target distribution: 10/20/30/40% across tiers</li>
                    <li>• Orange zones in the heatmap receive bonus yield</li>
                    <li>• Auto-distribution places your funds in optimal buckets</li>
                  </ul>
                  <div className="text-xs mt-2 font-mono bg-muted p-2 rounded">
                    bonus_i = (fee_pool * (target_weight_i - current_weight_i)) / sum_positive_deltas
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="default" size="sm" onClick={() => setActiveTab('waterfall')}>
                Explore Waterfall Model <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
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
          <TabsTrigger value="bonus" className="flex items-center gap-2 relative">
            <Flame className="h-4 w-4" />
            <span className="hidden md:inline">Bonus Yield</span>
            <span className="md:hidden">Bonus</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
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
                  <CardDescription>
                    Stake your TDD across multiple risk tiers for optimized yield
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RangeStakingCard />
                </CardContent>
              </Card>
              
              {/* Auto-distribution section */}
              <Card className="border-t-4 border-t-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span>Optimize Your Position</span>
                  </CardTitle>
                  <CardDescription>
                    Let the protocol automatically distribute your TDD to underweighted tiers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AutoDistributeButton 
                    amount={stakingAmount} 
                    onDistribute={handleAutoDistribute}
                  />
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Benefits of Auto-Distribution:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Maximizes bonus yield opportunities</li>
                      <li>• Optimizes risk-reward balance</li>
                      <li>• Helps maintain protocol stability</li>
                      <li>• Targets underweight tiers (orange heat zones)</li>
                    </ul>
                  </div>
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
