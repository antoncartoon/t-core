import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  DollarSign,
  Percent,
  Target,
  Activity,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface PerformanceData {
  date: string;
  portfolioValue: number;
  yield: number;
  pnl: number;
}

interface RiskMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
}

const mockPerformanceData: PerformanceData[] = [
  { date: '2024-01-01', portfolioValue: 10000, yield: 0, pnl: 0 },
  { date: '2024-01-15', portfolioValue: 10245, yield: 245, pnl: 2.45 },
  { date: '2024-02-01', portfolioValue: 10512, yield: 512, pnl: 5.12 },
  { date: '2024-02-15', portfolioValue: 10789, yield: 789, pnl: 7.89 },
  { date: '2024-03-01', portfolioValue: 11098, yield: 1098, pnl: 10.98 },
  { date: '2024-03-15', portfolioValue: 11445, yield: 1445, pnl: 14.45 },
];

const mockRiskMetrics: RiskMetrics = {
  sharpeRatio: 1.85,
  maxDrawdown: -3.2,
  volatility: 8.5,
  beta: 0.72
};

const allocationData = [
  { name: 'Tier 1 (Conservative)', value: 40, color: 'hsl(142, 76%, 36%)' },
  { name: 'Tier 2 (Moderate)', value: 35, color: 'hsl(45, 93%, 47%)' },
  { name: 'Tier 3 (Aggressive)', value: 20, color: 'hsl(25, 95%, 53%)' },
  { name: 'Tier 4 (Speculative)', value: 5, color: 'hsl(0, 84%, 60%)' }
];

const PerformanceDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('3M');
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleExport = () => {
    // Export logic would go here
    console.log('Exporting performance data...');
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const currentValue = mockPerformanceData[mockPerformanceData.length - 1]?.portfolioValue || 0;
  const totalReturn = currentValue - 10000;
  const returnPercentage = ((totalReturn / 10000) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Performance Dashboard</h2>
          <p className="text-muted-foreground">Advanced analytics for your portfolio</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant={timeRange === '1M' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1M')}
            >
              1M
            </Button>
            <Button
              variant={timeRange === '3M' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('3M')}
            >
              3M
            </Button>
            <Button
              variant={timeRange === '1Y' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('1Y')}
            >
              1Y
            </Button>
          </div>
          <Button onClick={handleExport} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(totalReturn)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-success">
                +{returnPercentage.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{mockRiskMetrics.sharpeRatio}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Risk-adjusted return</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-warning">{mockRiskMetrics.maxDrawdown}%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-warning" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Worst decline</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volatility</p>
                <p className="text-2xl font-bold">{mockRiskMetrics.volatility}%</p>
              </div>
              <Activity className="w-8 h-8 text-info" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Price variation</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Portfolio Value Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Portfolio Value']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="portfolioValue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Percent className="w-5 h-5" />
                <span>Monthly Returns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${(value as number).toFixed(2)}%`, 'Return']}
                  />
                  <Bar dataKey="pnl" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Risk Tier Allocation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allocation Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {allocationData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-bold">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Risk Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-semibold">{mockRiskMetrics.sharpeRatio}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Beta</span>
                    <span className="font-semibold">{mockRiskMetrics.beta}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volatility</span>
                    <span className="font-semibold">{mockRiskMetrics.volatility}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Max Drawdown</span>
                    <span className="font-semibold text-warning">{mockRiskMetrics.maxDrawdown}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Portfolio Risk Score</span>
                      <Badge variant="secondary">Moderate</Badge>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Based on volatility and risk tier allocation
                    </p>
                  </div>
                  
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="text-sm font-medium text-accent-foreground">
                      💡 Recommendation
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Consider rebalancing to reduce exposure to Tier 4 positions for better risk-adjusted returns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;