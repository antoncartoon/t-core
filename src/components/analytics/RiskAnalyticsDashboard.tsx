
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, TrendingDown, Shield, Activity, Zap, PieChart, AlertTriangle } from 'lucide-react';
import { TierUtilizationChart } from './TierUtilizationChart';
import { PositionHealthMonitor } from './PositionHealthMonitor';
import InsurancePoolStatus from '../waterfall/InsurancePoolStatus';
import RiskDistributionChart from './RiskDistributionChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TIER_DEFINITIONS } from '@/types/riskTiers';
import LossCascadeSimulator from './LossCascadeSimulator';

const RiskAnalyticsDashboard = () => {
  // Sample stress test data for visualization
  const stressScenarios = [
    { scenario: "Minor (-1%)", tvlImpact: -1, losses: { SAFE: 0, CONSERVATIVE: 0, BALANCED: 0.2, HERO: 1.8 } },
    { scenario: "Medium (-5%)", tvlImpact: -5, losses: { SAFE: 0, CONSERVATIVE: 0.5, BALANCED: 1.7, HERO: 8.5 } },
    { scenario: "Severe (-10%)", tvlImpact: -10, losses: { SAFE: 0, CONSERVATIVE: 1.2, BALANCED: 4.5, HERO: 17.5 } }
  ];

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        <AlertDescription className="text-muted-foreground">
          <span className="font-medium text-foreground">Risk Analysis:</span> Higher tier positions absorb losses first, protecting lower tiers. This visualization shows how the waterfall model works under stress.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="metrics">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="metrics">Protocol Metrics</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
          <TabsTrigger value="cascade">Loss Cascade</TabsTrigger>
          <TabsTrigger value="distribution">Risk Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Protocol Risk Metrics
                </CardTitle>
                <CardDescription>Current protocol health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <PositionHealthMonitor />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AreaChart className="w-5 h-5" />
                  Tier Utilization
                </CardTitle>
                <CardDescription>Current allocation across risk tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <TierUtilizationChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="stress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Stress Test Scenarios
                </CardTitle>
                <CardDescription>Estimated impact on different risk tiers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {stressScenarios.map((scenario, i) => (
                  <div key={i} className="space-y-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{scenario.scenario} TVL Impact</h4>
                      <span className="text-red-500 font-medium">{scenario.tvlImpact}%</span>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(scenario.losses).map(([tier, loss]) => (
                        <div key={tier} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{tier} Tier</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={loss === 0 ? "text-green-500" : "text-red-500"}>
                                    {loss === 0 ? "Protected" : `-${loss.toFixed(1)}%`}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">
                                    {loss === 0 
                                      ? "This tier is fully protected by higher tiers absorbing losses"
                                      : `This tier loses ${loss.toFixed(1)}% in this scenario`}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Progress 
                            value={loss === 0 ? 100 : 100 - (loss * 5)} 
                            className={`h-1.5 ${loss === 0 ? "bg-green-200 dark:bg-green-900" : ""}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Formula: Loss = min(residual_loss, user_position) / user_position
                </p>
              </CardContent>
            </Card>
            
            <InsurancePoolStatus 
              currentAmount={875000}
              targetAmount={1250000}
              coverageRatio={0.7}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="cascade" className="space-y-6">
          <LossCascadeSimulator />
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Risk Level Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <RiskDistributionChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Current Tier Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(TIER_DEFINITIONS).map(([key, tier]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            key === 'SAFE' ? 'bg-green-500' :
                            key === 'CONSERVATIVE' ? 'bg-blue-500' :
                            key === 'BALANCED' ? 'bg-yellow-500' : 'bg-purple-500'
                          }`} />
                          <span>{tier.name} ({tier.min}-{tier.max})</span>
                        </div>
                        <span className="font-medium">
                          {key === 'SAFE' ? '5.16%' : 
                           key === 'CONSERVATIVE' ? '7-9%' :
                           key === 'BALANCED' ? '9-15%' : '15%+'}
                        </span>
                      </div>
                      <Progress 
                        value={
                          key === 'SAFE' ? 45 : 
                          key === 'CONSERVATIVE' ? 25 :
                          key === 'BALANCED' ? 20 : 10
                        } 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {key === 'SAFE' ? 'Fixed guarantee by T-Bills (5.16% APY)' : 
                         key === 'CONSERVATIVE' ? 'Target: 7% APY' :
                         key === 'BALANCED' ? 'Target: 9% APY' : 'Residual yield (highest risk/reward)'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskAnalyticsDashboard;
