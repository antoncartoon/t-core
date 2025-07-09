
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

const Portfolio = () => {
  const portfolioData = {
    totalDeposited: 12500.50,
    totalStaked: 8900.25,
    totalEarned: 847.32,
    totalValue: 22247.82,
    deposits: [
      { id: 1, token: 'USDT', amount: 5000, earned: 245.50, apy: 4.9, date: '2024-01-15' },
      { id: 2, token: 'USDC', amount: 7500.50, earned: 387.25, apy: 5.2, date: '2024-01-20' }
    ],
    stakings: [
      { id: 1, strategy: 'Conservative', amount: 3000, earned: 78.45, apy: 2.6, risk: 15, date: '2024-01-18' },
      { id: 2, strategy: 'Moderate', amount: 4500.25, earned: 112.67, apy: 8.4, risk: 45, date: '2024-01-22' },
      { id: 3, strategy: 'Aggressive', amount: 1400, earned: 23.45, apy: 16.8, risk: 78, date: '2024-01-25' }
    ]
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-light mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Track your deposits, stakings, and earnings</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-light mb-1">{formatCurrency(portfolioData.totalValue)}</p>
              <p className="text-xs text-muted-foreground">Total Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-light mb-1">{formatCurrency(portfolioData.totalDeposited)}</p>
              <p className="text-xs text-muted-foreground">Total Deposited</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-light mb-1">{formatCurrency(portfolioData.totalStaked)}</p>
              <p className="text-xs text-muted-foreground">Total Staked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-light mb-1 text-green-600">{formatCurrency(portfolioData.totalEarned)}</p>
              <p className="text-xs text-muted-foreground">Total Earned</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Deposits */}
          <div>
            <h2 className="text-xl font-light mb-6">Deposits</h2>
            <div className="space-y-4">
              {portfolioData.deposits.map((deposit) => (
                <Card key={deposit.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Badge variant="outline" className="mb-2">{deposit.token}</Badge>
                        <p className="text-sm text-muted-foreground">{formatDate(deposit.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(deposit.amount)}</p>
                        <div className="flex items-center text-sm text-green-600">
                          <Percent className="w-3 h-3 mr-1" />
                          {deposit.apy}% APY
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Earned:</span>
                      <span className="text-green-600 font-medium">{formatCurrency(deposit.earned)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stakings */}
          <div>
            <h2 className="text-xl font-light mb-6">Stakings</h2>
            <div className="space-y-4">
              {portfolioData.stakings.map((staking) => (
                <Card key={staking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Badge 
                          variant="outline" 
                          className={`mb-2 ${
                            staking.strategy === 'Conservative' ? 'text-green-600 border-green-600' :
                            staking.strategy === 'Moderate' ? 'text-yellow-600 border-yellow-600' :
                            'text-red-600 border-red-600'
                          }`}
                        >
                          {staking.strategy}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{formatDate(staking.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(staking.amount)}</p>
                        <div className="flex items-center text-sm text-green-600">
                          <Percent className="w-3 h-3 mr-1" />
                          {staking.apy}% APY
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Risk Level:</span>
                        <span className="font-medium">{staking.risk}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Earned:</span>
                        <span className="text-green-600 font-medium">{formatCurrency(staking.earned)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
