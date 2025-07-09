
import React, { useState } from 'react';
import { ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DepositCard = () => {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [isLoading, setIsLoading] = useState(false);

  const tokens = [
    { symbol: 'USDT', name: 'Tether USD', balance: '1,250.00' },
    { symbol: 'USDC', name: 'USD Coin', balance: '890.50' }
  ];

  const handleDeposit = async () => {
    setIsLoading(true);
    // Simulate deposit transaction
    setTimeout(() => {
      setIsLoading(false);
      setAmount('');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span>Deposit Stablecoins</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Token
          </label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center justify-between w-full">
                    <span>{token.symbol}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      Balance: {token.balance}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Amount
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">You will receive:</span>
            <span className="font-medium">
              {amount || '0.00'} tkchUSD
            </span>
          </div>
        </div>

        <Button 
          onClick={handleDeposit} 
          disabled={!amount || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Deposit & Mint tkchUSD</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DepositCard;
