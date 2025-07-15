import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, TrendingUp, Users, Star, Shield, Filter, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Trader {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  followers: number;
  totalReturn: number;
  monthlyReturn: number;
  winRate: number;
  maxDrawdown: number;
  aum: number;
  risk: 'low' | 'medium' | 'high';
  strategy: string;
  copyFee: number;
  performanceHistory: Array<{ month: string; return: number }>;
}

interface CopyPosition {
  id: string;
  trader: Trader;
  amount: number;
  allocation: number;
  startDate: string;
  currentReturn: number;
  status: 'active' | 'paused' | 'stopped';
}

const CopyTradingPlatform: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('return');
  const [copiedTraders, setCopiedTraders] = useState<CopyPosition[]>([]);

  const topTraders: Trader[] = [
    {
      id: '1',
      name: 'DeFi Master',
      avatar: '/api/placeholder/32/32',
      verified: true,
      followers: 12500,
      totalReturn: 127.5,
      monthlyReturn: 8.2,
      winRate: 78,
      maxDrawdown: 15.2,
      aum: 2.8,
      risk: 'medium',
      strategy: 'Yield Farming + Liquidity Mining',
      copyFee: 2.5,
      performanceHistory: [
        { month: 'Jan', return: 5.2 },
        { month: 'Feb', return: 7.8 },
        { month: 'Mar', return: 12.4 },
        { month: 'Apr', return: 15.1 },
        { month: 'May', return: 18.7 },
        { month: 'Jun', return: 22.3 }
      ]
    },
    {
      id: '2',
      name: 'Yield Hunter',
      avatar: '/api/placeholder/32/32',
      verified: true,
      followers: 8900,
      totalReturn: 95.3,
      monthlyReturn: 6.8,
      winRate: 82,
      maxDrawdown: 12.8,
      aum: 1.9,
      risk: 'low',
      strategy: 'Conservative Staking',
      copyFee: 1.8,
      performanceHistory: [
        { month: 'Jan', return: 4.1 },
        { month: 'Feb', return: 6.2 },
        { month: 'Mar', return: 8.8 },
        { month: 'Apr', return: 11.5 },
        { month: 'May', return: 14.2 },
        { month: 'Jun', return: 16.9 }
      ]
    },
    {
      id: '3',
      name: 'Risk Optimizer',
      avatar: '/api/placeholder/32/32',
      verified: false,
      followers: 15600,
      totalReturn: 189.7,
      monthlyReturn: 12.5,
      winRate: 65,
      maxDrawdown: 28.5,
      aum: 4.2,
      risk: 'high',
      strategy: 'Aggressive Arbitrage',
      copyFee: 3.2,
      performanceHistory: [
        { month: 'Jan', return: 8.5 },
        { month: 'Feb', return: 12.3 },
        { month: 'Mar', return: 18.9 },
        { month: 'Apr', return: 25.1 },
        { month: 'May', return: 31.8 },
        { month: 'Jun', return: 38.7 }
      ]
    }
  ];

  const mockCopyPositions: CopyPosition[] = [
    {
      id: '1',
      trader: topTraders[0],
      amount: 5000,
      allocation: 25,
      startDate: '2024-01-15',
      currentReturn: 12.5,
      status: 'active'
    },
    {
      id: '2',
      trader: topTraders[1],
      amount: 3000,
      allocation: 15,
      startDate: '2024-02-01',
      currentReturn: 8.2,
      status: 'active'
    }
  ];

  const copyTrader = (trader: Trader) => {
    const newPosition: CopyPosition = {
      id: Date.now().toString(),
      trader,
      amount: 1000,
      allocation: 10,
      startDate: new Date().toISOString().split('T')[0],
      currentReturn: 0,
      status: 'active'
    };
    setCopiedTraders([...copiedTraders, newPosition]);
  };

  const stopCopy = (positionId: string) => {
    setCopiedTraders(prev => 
      prev.map(pos => 
        pos.id === positionId 
          ? { ...pos, status: 'stopped' as const }
          : pos
      )
    );
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'stopped': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredTraders = topTraders.filter(trader => {
    const matchesSearch = trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trader.strategy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || trader.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const sortedTraders = [...filteredTraders].sort((a, b) => {
    switch (sortBy) {
      case 'return': return b.totalReturn - a.totalReturn;
      case 'followers': return b.followers - a.followers;
      case 'winRate': return b.winRate - a.winRate;
      case 'aum': return b.aum - a.aum;
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Copy className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Copy Trading Platform</h2>
          <p className="text-muted-foreground">Copy successful traders automatically</p>
        </div>
      </div>

      <Tabs defaultValue="discover" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover Traders</TabsTrigger>
          <TabsTrigger value="my-copies">My Copies</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search traders or strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="return">Total Return</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="winRate">Win Rate</SelectItem>
                <SelectItem value="aum">AUM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {sortedTraders.map((trader) => (
              <Card key={trader.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={trader.avatar} />
                        <AvatarFallback>{trader.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{trader.name}</h3>
                          {trader.verified && (
                            <Shield className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{trader.strategy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getRiskColor(trader.risk)}`} />
                      <span className="text-sm capitalize">{trader.risk} Risk</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        +{trader.totalReturn.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Total Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {trader.winRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {trader.followers.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        ${trader.aum.toFixed(1)}M
                      </div>
                      <div className="text-xs text-muted-foreground">AUM</div>
                    </div>
                  </div>

                  <div className="h-32 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trader.performanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Line 
                          type="monotone" 
                          dataKey="return" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Copy Fee: {trader.copyFee}% • Max Drawdown: {trader.maxDrawdown}%
                    </div>
                    <Button onClick={() => copyTrader(trader)} size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Trader
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-copies" className="space-y-4">
          {copiedTraders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Copy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Copy Positions Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start copying successful traders to diversify your portfolio
                  </p>
                  <Button>Discover Traders</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {copiedTraders.map((position) => (
                <Card key={position.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={position.trader.avatar} />
                          <AvatarFallback>{position.trader.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{position.trader.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Started: {new Date(position.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(position.status)}>
                        {position.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          ${position.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Amount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {position.allocation}%
                        </div>
                        <div className="text-xs text-muted-foreground">Allocation</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${
                          position.currentReturn >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {position.currentReturn >= 0 ? '+' : ''}{position.currentReturn.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Current Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          ${(position.amount * (1 + position.currentReturn / 100)).toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Current Value</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={position.status === 'stopped'}
                      >
                        Adjust
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => stopCopy(position.id)}
                        disabled={position.status === 'stopped'}
                      >
                        Stop Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers This Month</CardTitle>
              <CardDescription>Ranked by monthly returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTraders
                  .sort((a, b) => b.monthlyReturn - a.monthlyReturn)
                  .map((trader, index) => (
                    <div key={trader.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <Avatar>
                          <AvatarImage src={trader.avatar} />
                          <AvatarFallback>{trader.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{trader.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {trader.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          +{trader.monthlyReturn.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          This month
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CopyTradingPlatform;