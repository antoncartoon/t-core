
import React, { useState } from 'react';
import { ArrowRight, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const DepositCard = () => {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const tokens = [
    { symbol: 'USDT', name: 'Tether USD', balance: '1,250.00', minDeposit: 10, maxDeposit: 10000 },
    { symbol: 'USDC', name: 'USD Coin', balance: '890.50', minDeposit: 10, maxDeposit: 10000 }
  ];

  const selectedTokenData = tokens.find(token => token.symbol === selectedToken);
  const numericAmount = parseFloat(amount) || 0;
  const balanceNumeric = parseFloat(selectedTokenData?.balance.replace(',', '') || '0');

  const validateAmount = () => {
    setError('');
    
    if (!amount || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (selectedTokenData && numericAmount < selectedTokenData.minDeposit) {
      setError(`Minimum deposit is $${selectedTokenData.minDeposit}`);
      return false;
    }
    
    if (selectedTokenData && numericAmount > selectedTokenData.maxDeposit) {
      setError(`Maximum deposit is $${selectedTokenData.maxDeposit.toLocaleString()}`);
      return false;
    }
    
    if (numericAmount > balanceNumeric) {
      setError('Insufficient balance');
      return false;
    }
    
    return true;
  };

  const handleDeposit = async () => {
    if (!validateAmount()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.8) {
        throw new Error('Transaction failed');
      }
      
      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${amount} ${selectedToken} and minted ${amount} tkchUSD`,
      });
      
      setAmount('');
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setMaxAmount = () => {
    const maxAmount = Math.min(balanceNumeric, selectedTokenData?.maxDeposit || 0);
    setAmount(maxAmount.toString());
    setError('');
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
          <label className="text-sm font-medium text-foreground mb-2 block">
            Select Token
          </label>
          <Select value={selectedToken} onValueChange={(value) => {
            setSelectedToken(value);
            setError('');
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center justify-between w-full">
                    <span>{token.symbol}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      Balance: {token.balance}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Amount
            </label>
            <button 
              onClick={setMaxAmount}
              className="text-xs text-primary hover:underline"
            >
              MAX
            </button>
          </div>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            onBlur={validateAmount}
            className="text-lg"
            min={selectedTokenData?.minDeposit}
            max={selectedTokenData?.maxDeposit}
          />
          {selectedTokenData && (
            <p className="text-xs text-muted-foreground mt-1">
              Min: ${selectedTokenData.minDeposit} • Max: ${selectedTokenData.maxDeposit.toLocaleString()}
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">You will receive:</span>
            <span className="font-medium">
              {amount || '0.00'} tkchUSD
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
            <span>Exchange Rate:</span>
            <span>1:1</span>
          </div>
        </div>

        <Button 
          onClick={handleDeposit} 
          disabled={!amount || !!error || isLoading}
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
