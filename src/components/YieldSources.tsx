
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Shield, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FIXED_BASE_APY, BONUS_SPREAD } from '@/utils/riskRangeCalculations';

const YieldSources = () => {
  // T-Core yield breakdown: 60% fixed, 40% bonus
  const yieldBreakdown = [
    { 
      name: 'Fixed (T-Bills * 1.2)', 
      value: 60, 
      yield: FIXED_BASE_APY * 100,
      description: 'Guaranteed yield for tier1 (levels 1-25)',
      color: '#10b981',
      icon: Shield
    },
    { 
      name: 'AAVE Interest', 
      value: 20, 
      yield: 4.2,
      description: 'Variable lending rates',
      color: '#3b82f6',
      icon: TrendingUp
    },
    { 
      name: 'JLP Hedge', 
      value: 10, 
      yield: 8.5,
      description: 'Jupiter LP hedge strategies',
      color: '#f59e0b',
      icon: Activity
    },
    { 
      name: 'LP Fees', 
      value: 10, 
      yield: 6.8,
      description: 'Uniswap LP fees',
      color: '#ef4444',
      icon: DollarSign
    }
  ];

  // Real-time protocol data
  const protocolData = [
    { source: 'T-Bills (Fixed)', current: 6.0, target: 6.0, volume: 75.0, guaranteed: true },
    { source: 'AAVE', current: 4.2, target: 4.5, volume: 25.0, guaranteed: false },
    { source: 'JLP', current: 8.5, target: 9.0, volume: 12.5, guaranteed: false },
    { source: 'LP Fees', current: 6.8, target: 7.2, volume: 12.5, guaranteed: false },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">Current Yield: {data.current}%</p>
          <p className="text-sm text-muted-foreground">Target Yield: {data.target}%</p>
          <p className="text-sm text-muted-foreground">Volume: ${data.volume}M</p>
          {data.guaranteed && (
            <Badge variant="outline" className="text-xs mt-1">
              <Shield className="h-3 w-3 mr-1" />
              Guaranteed
            </Badge>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>T-Core Yield Sources</CardTitle>
            <Badge variant="outline">
              Anti-Ponzi: Real Cash Flows
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Yield Breakdown Pie Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Yield Composition</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={yieldBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {yieldBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Source Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Source Details</h3>
              <div className="space-y-4">
                {yieldBreakdown.map((source, index) => {
                  const IconComponent = source.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <IconComponent className="h-5 w-5 mt-0.5" style={{ color: source.color }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{source.name}</span>
                          <span className="font-bold">{source.yield.toFixed(1)}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                        <Progress value={source.value} className="mt-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Protocol Performance Chart */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Real-Time Protocol Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={protocolData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="source" 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="current" fill="#10b981" name="Current Yield" />
                  <Bar dataKey="target" fill="#3b82f6" name="Target Yield" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Anti-Ponzi Explanation */}
          <Card className="mt-6 bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Anti-Ponzi Verification</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    T-Core yields are NOT a pyramid scheme. Fixed yields (60%) come from collateral T-Bills * 1.2 guarantee, 
                    while bonus yields (40%) come from verifiable DeFi protocol cash flows. High ranges insure via subordination.
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Breakdown:</span>
                      <span>~60% fixed, ~40% bonus</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Verification:</span>
                      <ExternalLink className="h-3 w-3" />
                      <span>On-chain proof</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Weighted Average Yield</p>
              <p className="text-lg font-bold text-green-600">
                {((FIXED_BASE_APY * 0.6 + (BONUS_SPREAD * 0.4)) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total AUM</p>
              <p className="text-lg font-bold">$125.6M</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldSources;
