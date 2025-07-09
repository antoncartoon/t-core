
import React from 'react';
import Header from '@/components/Header';
import NFTPositionCard from '@/components/NFTPositionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Percent, Coins, Trophy } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const Portfolio = () => {
  const { balances, stakingPositions, getTotalStakedValue } = useWallet();

  const portfolioData = {
    totalDeposited: 12500.50,
    totalEarned: stakingPositions.reduce((sum, p) => sum + p.earnedAmount, 0),
    deposits: [
      { id: 1, token: 'USDT', amount: 5000, earned: 245.50, apy: 4.9, date: '2024-01-15' },
      { id: 2, token: 'USDC', amount: 7500.50, earned: 387.25, apy: 5.2, date: '2024-01-20' }
    ]
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const totalAssetsValue = balances.reduce((sum, asset) => sum + asset.usdValue, 0);
  const totalStakedValue = getTotalStakedValue();
  const totalPortfolioValue = totalAssetsValue + totalStakedValue;
  const activePositions = stakingPositions.filter(p => p.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} onConnect={() => {}} walletAddress="0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef" />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-light mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Track your assets, NFT staking positions, and earnings</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-light mb-1">{formatCurrency(totalPortfolioValue)}</p>
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
              <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-light mb-1">{formatCurrency(totalStakedValue)}</p>
              <p className="text-xs text-muted-foreground">NFT Positions Value</p>
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

        {/* Assets Section */}
        <div className="mb-12">
          <h2 className="text-xl font-light mb-6">Liquid Assets</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="w-5 h-5" />
                <span>Available Tokens</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {balances.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{asset.symbol}</p>
                        <p className="text-sm text-muted-foreground">{asset.balance.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${asset.usdValue.toLocaleString()}</p>
                      {asset.change && (
                        <p className={`text-sm ${asset.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.change}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Liquid Assets</span>
                    <span className="text-xl font-bold">{formatCurrency(totalAssetsValue)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NFT Staking Positions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light">NFT Staking Positions</h2>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Trophy className="w-3 h-3" />
              <span>{activePositions.length} Active</span>
            </Badge>
          </div>
          
          {activePositions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activePositions.map((position) => (
                <NFTPositionCard key={position.id} position={position} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Staking Positions</h3>
                <p className="text-muted-foreground">Create your first NFT staking position to start earning yield</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Traditional Deposits */}
          <div>
            <h2 className="text-xl font-light mb-6">Traditional Deposits</h2>
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

          {/* Statistics */}
          <div>
            <h2 className="text-xl font-light mb-6">Portfolio Statistics</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active NFT Positions:</span>
                  <span className="font-medium">{activePositions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Position Size:</span>
                  <span className="font-medium">
                    {activePositions.length > 0 
                      ? formatCurrency(totalStakedValue / activePositions.length)
                      : '$0'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Portfolio Diversification:</span>
                  <span className="font-medium">
                    {activePositions.length > 0
                      ? `${new Set(activePositions.map(p => p.riskCategory)).size}/3 Risk Types`
                      : 'Not diversified'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Yield Earned:</span>
                  <span className="font-medium text-green-600">{formatCurrency(portfolioData.totalEarned)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
