import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ChevronRight, AlertTriangle, Info, PieChart, Calculator } from 'lucide-react';

const TutorialWalkthrough = () => {
  return (
    <Card className="border-2 border-blue-100 dark:border-blue-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          T-Core Staking Tutorial
        </CardTitle>
        <CardDescription>
          Learn how the T-Core staking system works with waterfall distribution, risk tiers, and bonus yields
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="waterfall">Waterfall Model</TabsTrigger>
            <TabsTrigger value="risk">Risk & Rewards</TabsTrigger>
            <TabsTrigger value="bonus">Bonus Yield</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mt-0.5">
                  <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">What is T-Core Staking?</h3>
                  <p className="text-sm text-muted-foreground">
                    T-Core is a risk-tranched yield protocol where you can stake TDD tokens and earn yields based on your selected risk level.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mt-0.5">
                  <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Risk Buckets (0-99)</h3>
                  <p className="text-sm text-muted-foreground">
                    The risk curve is divided into 100 buckets from 0 (safest) to 99 (highest risk). You choose which range to stake in.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mt-0.5">
                  <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Four Risk Tiers</h3>
                  <p className="text-sm text-muted-foreground">
                    Buckets are grouped into tiers: Safe (0-9), Conservative (10-29), Balanced (30-59), and Hero (60-99).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                APY Formula
              </h3>
              <div className="mt-2 p-2 bg-white dark:bg-blue-900/30 rounded border font-mono text-sm">
                APY(r) = APY_safe + (APY_protocol - APY_safe) × r^1.5
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Where r = (bucket number) / 99, and we use the average r for your selected range.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="waterfall" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 mt-0.5">
                  <PieChart className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium">Waterfall Distribution</h3>
                  <p className="text-sm text-muted-foreground">
                    Yields are distributed in a waterfall manner: Safe tier gets paid first (fixed T-Bills × 1.2 rate), 
                    then Conservative (7%), then Balanced (9%), and finally Hero tier gets all residual yield.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium">Loss Absorption</h3>
                  <p className="text-sm text-muted-foreground">
                    Losses are absorbed in reverse order: Hero tier takes losses first, then Balanced, 
                    Conservative, and finally Safe. Higher risk tiers protect lower risk tiers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-green-600" />
                Performance Fee Allocation
              </h3>
              <p className="text-sm mt-2">
                20% performance fee is split four ways:
              </p>
              <ul className="text-sm list-disc list-inside ml-2 mt-2 space-y-1">
                <li>25% to bonus yield (incentivize underweight tiers)</li>
                <li>25% to buyback TDD (reduce supply, increase value)</li>
                <li>25% as protocol revenue (operations)</li>
                <li>25% to insurance buffer (strengthen subordination)</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium">Stress Testing</h3>
                  <p className="text-sm text-muted-foreground">
                    We simulate protocol losses of -1%, -5%, and -10% TVL to show how each tier would be affected.
                    Formula: Loss = min(residual_loss, user_position) / user_position
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-2 mt-0.5">
                  <ChevronRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium">Risk-Return Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Higher risk tiers (higher bucket numbers) offer higher potential returns but are first to absorb losses. 
                    Safe tier offers guaranteed returns but limited upside.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bonus" className="space-y-4">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 mt-0.5">
                  <ChevronRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Bonus Yield Mechanism</h3>
                  <p className="text-sm text-muted-foreground">
                    To encourage optimal distribution, bonus yield is given to underweight tiers.
                    Target distribution is 10/20/30/40% across tiers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 mt-0.5">
                  <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Bonus Calculation</h3>
                  <p className="text-sm text-muted-foreground">
                    Formula: bonus_i = (fee_pool * (target_weight_i - current_weight_i)) / sum_positive_deltas
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-600" />
                Auto-Distribution
              </h3>
              <p className="text-sm mt-2">
                The "Auto-Distribute" feature helps optimize your deposit across underweight tiers for maximum bonus yield.
                The heatmap shows which buckets have the highest bonus potential.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TutorialWalkthrough;