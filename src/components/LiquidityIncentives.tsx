import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Users, 
  DollarSign, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

interface LiquidityIncentivesProps {
  className?: string;
}

const LiquidityIncentives: React.FC<LiquidityIncentivesProps> = ({ className }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  
  // Simulated real-time data
  const [currentDistribution, setCurrentDistribution] = useState({
    tier1: 45,
    tier2: 25,
    tier3: 20,
    tier4: 10
  });

  const targetDistribution = {
    tier1: 35,
    tier2: 25,
    tier3: 25,
    tier4: 15
  };

  const incentiveData = {
    totalIncentivePool: 2500000,
    weeklyDistribution: 125000,
    nextRebalance: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    activeIncentives: [
      {
        tier: 'Tier4',
        currentAPY: 12.5,
        bonusAPY: 3.2,
        totalAPY: 15.7,
        reason: 'Under-liquidity (10% vs 15% target)',
        timeRemaining: '4 days',
        status: 'active'
      },
      {
        tier: 'Tier3',
        currentAPY: 9.8,
        bonusAPY: 1.5,
        totalAPY: 11.3,
        reason: 'Slight under-liquidity (20% vs 25% target)',
        timeRemaining: '4 days',
        status: 'active'
      },
      {
        tier: 'Tier1',
        currentAPY: 6.0,
        bonusAPY: -0.5,
        totalAPY: 5.5,
        reason: 'Over-liquidity (45% vs 35% target)',
        timeRemaining: '4 days',
        status: 'penalty'
      }
    ]
  };

  const historicalData = [
    { date: '2024-01-01', tier1: 52, tier2: 23, tier3: 18, tier4: 7 },
    { date: '2024-01-08', tier1: 48, tier2: 24, tier3: 20, tier4: 8 },
    { date: '2024-01-15', tier1: 45, tier2: 25, tier3: 20, tier4: 10 },
    { date: '2024-01-22', tier1: 42, tier2: 26, tier3: 22, tier4: 10 },
    { date: '2024-01-29', tier1: 38, tier2: 26, tier3: 24, tier4: 12 },
    { date: '2024-02-05', tier1: 36, tier2: 25, tier3: 25, tier4: 14 },
    { date: '2024-02-12', tier1: 35, tier2: 25, tier3: 25, tier4: 15 }
  ];

  const distributionData = [
    { name: 'Tier1', value: currentDistribution.tier1, target: targetDistribution.tier1, color: 'hsl(var(--tier1))' },
    { name: 'Tier2', value: currentDistribution.tier2, target: targetDistribution.tier2, color: 'hsl(var(--tier2))' },
    { name: 'Tier3', value: currentDistribution.tier3, target: targetDistribution.tier3, color: 'hsl(var(--tier3))' },
    { name: 'Tier4', value: currentDistribution.tier4, target: targetDistribution.tier4, color: 'hsl(var(--tier4))' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'hsl(var(--success))';
      case 'penalty': return 'hsl(var(--error))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="h-4 w-4" />;
      case 'penalty': return <TrendingDown className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateVariance = () => {
    const variance = Object.keys(currentDistribution).reduce((acc, tier) => {
      const current = currentDistribution[tier as keyof typeof currentDistribution];
      const target = targetDistribution[tier as keyof typeof targetDistribution];
      return acc + Math.pow(current - target, 2);
    }, 0);
    return Math.sqrt(variance / 4);
  };

  const variance = calculateVariance();
  const balanceScore = Math.max(0, 100 - variance * 5);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Liquidity Incentives & Balancing
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-success">
                <Target className="h-3 w-3 mr-1" />
                Balance Score: {balanceScore.toFixed(0)}%
              </Badge>
              <Badge variant="outline" className="border-info">
                <Clock className="h-3 w-3 mr-1" />
                Next Rebalance: {Math.ceil((incentiveData.nextRebalance.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Status</TabsTrigger>
              <TabsTrigger value="incentives">Active Incentives</TabsTrigger>
              <TabsTrigger value="historical">Historical Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {distributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Target vs Current</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {distributionData.map((tier, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{tier.name}</span>
                            <span className="text-muted-foreground">
                              {tier.value}% / {tier.target}%
                            </span>
                          </div>
                          <div className="space-y-1">
                            <Progress value={tier.value} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Current</span>
                              <span className={tier.value > tier.target ? 'text-warning' : tier.value < tier.target ? 'text-info' : 'text-success'}>
                                {tier.value > tier.target ? '+' : tier.value < tier.target ? '-' : ''}
                                {Math.abs(tier.value - tier.target).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Incentive Pool Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        ${(incentiveData.totalIncentivePool / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-muted-foreground">Total Pool</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        ${(incentiveData.weeklyDistribution / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-muted-foreground">Weekly Distribution</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-info">
                        {incentiveData.activeIncentives.filter(i => i.status === 'active').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Incentives</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">
                        {balanceScore.toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Balance Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incentives" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Incentive Adjustments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incentiveData.activeIncentives.map((incentive, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{incentive.tier}</div>
                            <Badge 
                              variant="outline" 
                              className={incentive.status === 'active' ? 'border-success' : 'border-error'}
                            >
                              {getStatusIcon(incentive.status)}
                              {incentive.status === 'active' ? 'Bonus' : 'Penalty'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {incentive.timeRemaining} remaining
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Base APY</div>
                            <div className="text-lg font-bold">{incentive.currentAPY.toFixed(1)}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              {incentive.status === 'active' ? 'Bonus APY' : 'Penalty APY'}
                            </div>
                            <div className={`text-lg font-bold ${incentive.status === 'active' ? 'text-success' : 'text-error'}`}>
                              {incentive.bonusAPY > 0 ? '+' : ''}{incentive.bonusAPY.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Total APY</div>
                            <div className="text-lg font-bold text-primary">{incentive.totalAPY.toFixed(1)}%</div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <strong>Reason:</strong> {incentive.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How Incentives Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-success/10 rounded-lg border border-success">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <strong className="text-success">Bonus Incentives</strong>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>• Applied to under-liquidity tiers (below target %)</p>
                        <p>• Bonus APY = base_bonus × (target - current)²</p>
                        <p>• Funded from 10% of protocol fees</p>
                        <p>• Rebalanced weekly to maintain optimal distribution</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-error/10 rounded-lg border border-error">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-error" />
                        <strong className="text-error">Penalty Adjustments</strong>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>• Applied to over-liquidity tiers (above target %)</p>
                        <p>• Reduction APY = base_penalty × (current - target)²</p>
                        <p>• Encourages rebalancing to higher-risk tiers</p>
                        <p>• Funds redirect to bonus pool</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribution Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          fontSize={12}
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          fontSize={12}
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          label={{ value: 'Distribution %', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="tier1" 
                          stroke="hsl(var(--tier1))" 
                          strokeWidth={2}
                          name="Tier1"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tier2" 
                          stroke="hsl(var(--tier2))" 
                          strokeWidth={2}
                          name="Tier2"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tier3" 
                          stroke="hsl(var(--tier3))" 
                          strokeWidth={2}
                          name="Tier3"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tier4" 
                          stroke="hsl(var(--tier4))" 
                          strokeWidth={2}
                          name="Tier4"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p><strong>Trend Analysis:</strong> Incentives successfully reducing Tier1 concentration from 52% to 35%</p>
                    <p><strong>Target Achievement:</strong> Tier3 and Tier4 liquidity improved by 39% and 114% respectively</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Incentive Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Success Metrics</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Variance Reduction</span>
                          <span className="text-sm font-medium text-success">-67%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Target Achievement</span>
                          <span className="text-sm font-medium text-success">78%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">User Participation</span>
                          <span className="text-sm font-medium text-success">+45%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Cost Efficiency</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Cost per % Balance</span>
                          <span className="text-sm font-medium">$12.5K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">ROI on Incentives</span>
                          <span className="text-sm font-medium text-success">+234%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Sustainability Score</span>
                          <span className="text-sm font-medium text-success">A+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiquidityIncentives;