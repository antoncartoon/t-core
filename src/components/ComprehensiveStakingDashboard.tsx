
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, TrendingUp, Target, BarChart3, Flame, Calculator, ChevronRight, Sparkles, Zap } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

const ComprehensiveStakingDashboard = () => {
  // Start with waterfall tab active to show new features immediately
  const [activeTab, setActiveTab] = useState('waterfall');
  const [showTutorial, setShowTutorial] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Sample staking amount for demo
  const [stakingAmount, setStakingAmount] = useState(10000);
  
  const handleTutorialToggle = () => {
    setShowTutorial(!showTutorial);
    if (!showTutorial) {
      toast({
        title: "Waterfall Tutorial Activated",
        description: "Learn how T-Core's innovative waterfall model protects your capital while maximizing returns.",
      });
    }
  };
  
  const handleAutoDistribute = (ranges: Array<{ range: [number, number]; weight: number }>) => {
    console.log("Auto-distributing to ranges:", ranges);
    toast({
      title: "🎯 Liquidity Auto-Distributed!",
      description: `Your ${stakingAmount.toLocaleString()} TDD has been optimally allocated to ${ranges.length} underweight tier(s) for maximum bonus yield.`,
      duration: 6000,
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Enhanced Feature Notice */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-orange-500/20 rounded-lg blur-xl opacity-50"></div>
        <Card className="relative border-2 border-primary/50 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-orange-50/80 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-orange-950/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                </div>
                <div>
                  <CardTitle className="text-xl">🚀 NEW: T-Core Waterfall Model</CardTitle>
                  <CardDescription className="text-base">
                    Advanced risk-tranched yields with bonus distribution & loss protection
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Live
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary/50 bg-white/50 hover:bg-primary/10"
                  onClick={handleTutorialToggle}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  {showTutorial ? "Exit Tutorial" : "Learn Waterfall"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-green-600">5.16%</div>
                <div className="text-xs text-muted-foreground">Safe Tier Guarantee</div>
              </div>
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">+3.5%</div>
                <div className="text-xs text-muted-foreground">Bonus Yield Available</div>
              </div>
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">74%</div>
                <div className="text-xs text-muted-foreground">Goes to Hero Tier</div>
              </div>
              <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">20%</div>
                <div className="text-xs text-muted-foreground">Performance Fee</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Interactive Tutorial */}
      {showTutorial && (
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-orange/5">
            <CardTitle className="text-primary flex items-center gap-2">
              <Target className="h-5 w-5" />
              T-Core Waterfall Distribution Tutorial
            </CardTitle>
            <CardDescription>
              Master our revolutionary risk-tranched yield system in 4 simple steps
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">Safe Tier (0-9)</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Fixed 5.16% APY guaranteed by T-Bills × 1.2. Always paid first.
                    </p>
                    <div className="text-xs font-mono mt-1 bg-green-100 dark:bg-green-900/50 p-1 rounded">
                      APY = T_bills × 1.2 = 4.3% × 1.2 = 5.16%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Conservative (10-29)</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Target 7% APY. Gets paid after Safe tier.
                    </p>
                    <div className="text-xs font-mono mt-1 bg-blue-100 dark:bg-blue-900/50 p-1 rounded">
                      Target APY = 7.0%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Balanced (30-59)</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Target 9% APY. Higher risk, higher reward.
                    </p>
                    <div className="text-xs font-mono mt-1 bg-yellow-100 dark:bg-yellow-900/50 p-1 rounded">
                      Target APY = 9.0%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200">Hero (60-99)</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Gets ALL residual yield. Absorbs losses first.
                    </p>
                    <div className="text-xs font-mono mt-1 bg-purple-100 dark:bg-purple-900/50 p-1 rounded">
                      APY = Total_residual / Hero_liquidity
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <h4 className="font-semibold text-orange-800 dark:text-orange-200">Bonus Yield Mechanism</h4>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                25% of performance fee incentivizes underweight tiers. Orange zones in heatmap = bonus yield!
              </p>
              <div className="text-xs font-mono bg-orange-100 dark:bg-orange-900/50 p-2 rounded">
                bonus_i = (fee_pool × (target_weight_i - current_weight_i)) / sum_positive_deltas
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => setActiveTab('waterfall')}
                className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90"
              >
                Explore Live Waterfall Model <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="waterfall" className="flex items-center gap-2 relative">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden md:inline">Waterfall Model</span>
            <span className="md:hidden">Waterfall</span>
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
              NEW
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="stake" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Stake TDD</span>
            <span className="md:hidden">Stake</span>
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
        
        <TabsContent value="waterfall" className="mt-6">
          <div className="space-y-6">
            {/* Quick Demo Section */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Sparkles className="h-5 w-5" />
                  Try the Waterfall Model
                </CardTitle>
                <CardDescription className="text-orange-700 dark:text-orange-300">
                  Test auto-distribution and see bonus yields in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Demo Amount</label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setStakingAmount(5000)}
                        className={stakingAmount === 5000 ? "bg-orange-100" : ""}
                      >
                        $5K
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setStakingAmount(10000)}
                        className={stakingAmount === 10000 ? "bg-orange-100" : ""}
                      >
                        $10K
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setStakingAmount(25000)}
                        className={stakingAmount === 25000 ? "bg-orange-100" : ""}
                      >
                        $25K
                      </Button>
                    </div>
                    <div className="text-lg font-bold">${stakingAmount.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <AutoDistributeButton 
                      amount={stakingAmount} 
                      onDistribute={handleAutoDistribute}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Expected Results</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Est. APY:</span>
                        <span className="font-bold text-green-600">12.3%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bonus Yield:</span>
                        <span className="font-bold text-orange-600">+2.1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Annual Return:</span>
                        <span className="font-bold">${(stakingAmount * 0.144).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
                    Performance Fee Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}%</div>
                    <div className="text-sm text-muted-foreground">Total Performance Fee</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(DISTRIBUTION_PARAMS.FEE_ALLOCATION).map(([key, value]) => (
                      <div key={key} className="text-center p-3 rounded-lg"
                           style={{ 
                             backgroundColor: 
                               key === 'BONUS' ? '#fef3c7' : 
                               key === 'BUYBACK' ? '#dbeafe' : 
                               key === 'PROTOCOL' ? '#d1fae5' : 
                               '#e0e7ff'
                           }}>
                        <div className="text-lg font-bold">{(value * 100)}%</div>
                        <div className="text-xs">{key.charAt(0) + key.slice(1).toLowerCase()}</div>
                        <div className="text-xs text-muted-foreground">
                          {(DISTRIBUTION_PARAMS.PERFORMANCE_FEE * value * 100).toFixed(1)}% of yield
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stake" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-6">
              <RangeStakingCard />
            </div>
            
            <div className="space-y-6">
              <TCoreStakingCard />
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
            {/* Enhanced Bonus Explanation */}
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Flame className="h-6 w-6" />
                  Live Bonus Yield Distribution
                </CardTitle>
                <CardDescription className="text-orange-700 dark:text-orange-300">
                  Real-time heatmap showing which buckets receive bonus yield from liquidity imbalance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {(DISTRIBUTION_PARAMS.PERFORMANCE_FEE * DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-orange-700">Of Total Yield</div>
                  </div>
                  <div className="text-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">$125K</div>
                    <div className="text-sm text-orange-700">Current Bonus Pool</div>
                  </div>
                  <div className="text-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">+3.5%</div>
                    <div className="text-sm text-orange-700">Max Bonus APY</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <BonusYieldHeatmap />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-orange-500" />
                  <span>Bonus Yield Mathematics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-3">Step-by-step bonus calculation:</div>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">1</span>
                      <span>Performance fee: <code>{DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}% × total_yield = fee_pool</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">2</span>
                      <span>Bonus allocation: <code>{DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100}% × fee_pool = bonus_pool</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">3</span>
                      <span>Imbalance: <code>delta_i = target_weight_i - current_weight_i</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">4</span>
                      <span>Only positive deltas get bonus (underweight tiers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center mt-0.5">5</span>
                      <span>Final bonus: <code>bonus_i = bonus_pool × delta_i ÷ sum(positive_deltas)</code></span>
                    </li>
                  </ol>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2 text-green-800 dark:text-green-200">Target Distribution</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Safe (0-9)</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Conservative (10-29)</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Balanced (30-59)</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Hero (60-99)</span>
                        <span className="font-medium">40%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2 text-orange-800 dark:text-orange-200">Current (Example)</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Safe: 45% <span className="text-blue-600">(+35% over)</span></span>
                        <span className="font-medium">No bonus</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Conservative: 25% <span className="text-blue-600">(+5% over)</span></span>
                        <span className="font-medium">No bonus</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Balanced: 20% <span className="text-orange-600">(-10% under)</span></span>
                        <span className="font-medium text-orange-600">+1.2% bonus</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Hero: 10% <span className="text-orange-600">(-30% under)</span></span>
                        <span className="font-medium text-orange-600">+3.5% bonus</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-xs text-muted-foreground">
                  💡 The bonus yield mechanism uses {(DISTRIBUTION_PARAMS.PERFORMANCE_FEE * DISTRIBUTION_PARAMS.FEE_ALLOCATION.BONUS * 100).toFixed(1)}% 
                  of total yield to automatically rebalance liquidity across risk tiers
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
