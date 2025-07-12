import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Shield, TrendingDown, Calculator, AlertCircle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const AAVEIntegrationCard = () => {
  const { stakingPositions } = useWallet();
  const [borrowAmount, setBorrowAmount] = useState('');
  
  // Calculate total NFT position value for collateral
  const totalCollateralValue = stakingPositions
    .filter(p => p.status === 'active')
    .reduce((sum, position) => sum + position.amount, 0);
  
  // AAVE collateral ratio (typically 75% LTV for stablecoins)
  const collateralRatio = 0.75;
  const maxBorrowAmount = totalCollateralValue * collateralRatio;
  
  // Mock AAVE rates
  const borrowRates = [
    { asset: 'USDC', rate: 4.2, available: 850000 },
    { asset: 'USDT', rate: 4.5, available: 1200000 },
    { asset: 'DAI', rate: 4.1, available: 650000 },
    { asset: 'WETH', rate: 3.8, available: 45 }
  ];

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const isValidBorrow = borrowAmount && parseFloat(borrowAmount) > 0 && parseFloat(borrowAmount) <= maxBorrowAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          AAVE Integration
          <Badge variant="secondary">NFT Collateral</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Use your T-Core NFT positions as collateral to borrow assets on AAVE
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Collateral Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Shield className="w-5 h-5 mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground">Available Collateral</p>
            <p className="text-xl font-medium text-blue-600">{formatCurrency(totalCollateralValue)}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Calculator className="w-5 h-5 mb-2 text-green-600" />
            <p className="text-sm text-muted-foreground">Max Borrow (75% LTV)</p>
            <p className="text-xl font-medium text-green-600">{formatCurrency(maxBorrowAmount)}</p>
          </div>
        </div>

        <Separator />

        {/* Available Assets */}
        <div>
          <h4 className="font-medium mb-3">Available Borrow Assets</h4>
          <div className="space-y-3">
            {borrowRates.map((asset) => (
              <div key={asset.asset} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{asset.asset.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{asset.asset}</p>
                    <p className="text-sm text-muted-foreground">
                      Available: {asset.asset === 'WETH' ? `${asset.available} ETH` : formatCurrency(asset.available)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-3 h-3" />
                    <span className="text-sm font-medium">{asset.rate}% APR</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Borrow Rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Borrow Interface */}
        <div>
          <h4 className="font-medium mb-3">Borrow Amount</h4>
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USD
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>
                {borrowAmount && parseFloat(borrowAmount) > maxBorrowAmount
                  ? `Exceeds maximum borrow limit of ${formatCurrency(maxBorrowAmount)}`
                  : `Utilization: ${borrowAmount ? ((parseFloat(borrowAmount) / maxBorrowAmount) * 100).toFixed(1) : 0}%`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1" 
            disabled={!isValidBorrow || totalCollateralValue === 0}
          >
            {totalCollateralValue === 0 ? 'No NFT Positions' : 'Borrow on AAVE'}
          </Button>
          <Button variant="outline" className="flex-1">
            View Positions
          </Button>
        </div>

        {/* Info */}
        {totalCollateralValue === 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Create NFT staking positions first to use them as collateral for borrowing
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AAVEIntegrationCard;