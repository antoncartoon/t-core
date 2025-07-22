
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Info } from 'lucide-react';

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

  const totalPTValue = ptPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalYTValue = ytPositions.reduce((sum, pos) => sum + pos.currentValue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Pendle Positions</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          <span>Read-only view of your split token positions</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Principal Tokens */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Principal Tokens (PT)
              </h3>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="font-medium text-blue-600">{formatCurrency(totalPTValue)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {ptPositions.map((position) => (
                <Card key={position.id} className="bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Fixed {position.apy}% APY
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(position.maturity)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Position Size:</span>
                        <span className="font-medium">{position.amount} PT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Value:</span>
                        <span className="font-medium">{formatCurrency(position.currentValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unrealized P&L:</span>
                        <span className="text-green-600 font-medium">
                          +{formatCurrency(position.currentValue - position.amount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Yield Tokens */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Yield Tokens (YT)
              </h3>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="font-medium text-green-600">{formatCurrency(totalYTValue)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {ytPositions.map((position) => (
                <Card key={position.id} className="bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {position.currentYield}% Current
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(position.maturity)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Position Size:</span>
                        <span className="font-medium">{position.amount} YT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Value:</span>
                        <span className="font-medium">{formatCurrency(position.currentValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unrealized P&L:</span>
                        <span className="text-green-600 font-medium">
                          +{formatCurrency(position.currentValue - position.amount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {ptPositions.length === 0 && ytPositions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No Pendle positions yet</p>
            <p className="text-sm">Split your TDD above to create PT/YT positions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PTYTBalance;
