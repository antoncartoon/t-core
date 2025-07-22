
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, BarChart3, ArrowUp, ArrowDown, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import MobileGestureHandler from '../MobileGestureHandler';
import AnimatedCounter from '../AnimatedCounter';
import { DISTRIBUTION_PARAMS } from '@/utils/tcoreCalculations';

const MobileRiskAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Handle swipe gestures
  const handleSwipeLeft = () => {
    if (activeTab === 'overview') setActiveTab('insurance');
    else if (activeTab === 'insurance') setActiveTab('tiers');
  };
  
  const handleSwipeRight = () => {
    if (activeTab === 'tiers') setActiveTab('insurance');
    else if (activeTab === 'insurance') setActiveTab('overview');
  };
  
  // Sample data for the risk metrics
  const insurancePool = {
    current: 875000,
    target: 1250000,
    percentage: 70,
  };
  
  const riskMetrics = {
    tvl: 12500000,
    overcollateralization: 105.2,
    protocolRisk: 18.4,
    userPositionRisk: 12.3,
  };
  
  const tierDistribution = [
    { name: 'Tier 1', value: 40, color: 'hsl(142.1, 76.2%, 36.3%)' },
    { name: 'Tier 2', value: 25, color: 'hsl(221.2, 83.2%, 53.3%)' },
    { name: 'Tier 3', value: 20, color: 'hsl(35.5, 91.7%, 32.9%)' },
    { name: 'Tier 4', value: 15, color: 'hsl(346.8, 77.2%, 49.8%)' },
  ];
  
  // Performance fee allocation data
  const feeAllocation = [
    { name: 'Bonus Yield', value: 25, color: 'hsl(262.1, 83.3%, 57.8%)' },
    { name: 'Buyback', value: 25, color: 'hsl(221.2, 83.2%, 53.3%)' },
    { name: 'Protocol', value: 25, color: 'hsl(346.8, 77.2%, 49.8%)' },
    { name: 'Insurance', value: 25, color: 'hsl(142.1, 76.2%, 36.3%)' },
  ];

  return (
    <MobileGestureHandler
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
    >
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Analytics
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="tiers">Tiers</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">TVL</p>
                  <p className="font-medium flex items-center">
                    $<AnimatedCounter 
                      end={riskMetrics.tvl} 
                      decimals={0}
                    />
                  </p>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Overcoll.</p>
                  <p className="font-medium flex items-center text-green-600">
                    <AnimatedCounter 
                      end={riskMetrics.overcollateralization} 
                      decimals={1}
                    />%
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Protocol Risk</span>
                    <span className="text-xs font-medium">{riskMetrics.protocolRisk}%</span>
                  </div>
                  <Progress value={riskMetrics.protocolRisk} max={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Your Position Risk</span>
                    <span className="text-xs font-medium">{riskMetrics.userPositionRisk}%</span>
                  </div>
                  <Progress value={riskMetrics.userPositionRisk} max={100} className="h-2" />
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Performance Fee</span>
                  <span className="text-sm">{DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}%</span>
                </div>
                
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={feeAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {feeAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                      <Tooltip formatter={(value) => `${value}%`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            {/* Insurance Tab */}
            <TabsContent value="insurance" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Insurance Pool</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">
                  {insurancePool.percentage}% Funded
                </Badge>
              </div>
              
              <Progress 
                value={insurancePool.percentage} 
                max={100} 
                className="h-3 mb-2" 
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Current</p>
                  <p className="font-medium">
                    ${(insurancePool.current / 1000).toFixed(0)}K
                  </p>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Target</p>
                  <p className="font-medium">
                    ${(insurancePool.target / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md space-y-2">
                <h3 className="text-sm font-medium">Insurance Protection</h3>
                <p className="text-xs text-muted-foreground">
                  The insurance pool is funded by 25% of the performance fee and provides first-loss protection to positions in case of market stress events.
                </p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Fee to Insurance</span>
                    <span className="font-medium">
                      {DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 25}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span>Coverage Ratio</span>
                    <span className="font-medium text-green-600">
                      {(insurancePool.current / riskMetrics.tvl * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs flex items-center gap-1 text-muted-foreground">
                  <ArrowDown className="h-3 w-3 text-green-600" />
                  <span>Next replenishment in 3 days</span>
                </div>
                
                <div className="text-xs flex items-center gap-1 text-muted-foreground">
                  <ArrowUp className="h-3 w-3 text-primary" />
                  <span>+$25K this week</span>
                </div>
              </div>
            </TabsContent>
            
            {/* Tiers Tab */}
            <TabsContent value="tiers" className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Tier Distribution</span>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {tierDistribution.length} Tiers
                </Badge>
              </div>
              
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={tierDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {tierDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {tierDistribution.map((tier, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-md flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }}></div>
                      <span className="text-xs">{tier.name}</span>
                    </div>
                    <span className="text-xs font-medium">{tier.value}%</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">Risk Distribution</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Higher tiers (3-4) absorb losses first in exchange for higher returns. 
                  Tier 1 is protected by T-Bill backing and remains fixed in all scenarios.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MobileGestureHandler>
  );
};

export default MobileRiskAnalytics;
