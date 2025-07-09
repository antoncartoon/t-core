
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, ArrowUpDown } from 'lucide-react';

const PTYTBalance = () => {
  const ptPositions = [
    { id: 1, amount: 2500, maturity: '2024-12-25', apy: 12.8, currentValue: 2640 },
    { id: 2, amount: 1800, maturity: '2025-06-25', apy: 13.2, currentValue: 1910 },
  ];

  const ytPositions = [
    { id: 1, amount: 1200, maturity: '2024-12-25', currentYield: 15.2, currentValue: 1284 },
    { id: 2, amount: 900, maturity: '2025-03-25', currentYield: 17.8, currentValue: 1045 },
  ];

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Principal Tokens */}
      <div>
        <h2 className="text-xl font-light mb-6 flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Principal Tokens (PT)</span>
        </h2>
        <div className="space-y-4">
          {ptPositions.map((position) => (
            <Card key={position.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2 text-blue-600 border-blue-600">
                      Fixed APY
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Matures: {formatDate(position.maturity)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{position.amount} PT</p>
                    <p className="text-sm text-blue-600">{position.apy}% APY</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Value:</span>
                    <span className="font-medium">{formatCurrency(position.currentValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Unrealized P&L:</span>
                    <span className="text-green-600 font-medium">
                      +{formatCurrency(position.currentValue - position.amount)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ArrowUpDown className="w-3 h-3 mr-1" />
                    Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Yield Tokens */}
      <div>
        <h2 className="text-xl font-light mb-6 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span>Yield Tokens (YT)</span>
        </h2>
        <div className="space-y-4">
          {ytPositions.map((position) => (
            <Card key={position.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2 text-green-600 border-green-600">
                      Variable Yield
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Matures: {formatDate(position.maturity)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{position.amount} YT</p>
                    <p className="text-sm text-green-600">{position.currentYield}% Current</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Value:</span>
                    <span className="font-medium">{formatCurrency(position.currentValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Unrealized P&L:</span>
                    <span className="text-green-600 font-medium">
                      +{formatCurrency(position.currentValue - position.amount)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ArrowUpDown className="w-3 h-3 mr-1" />
                    Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PTYTBalance;
