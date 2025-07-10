
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const MobileDepositCard = () => {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const tokens = [
    { symbol: 'USDT', name: 'Tether USD', apy: 4.9, balance: 2500.50 },
    { symbol: 'USDC', name: 'USD Coin', apy: 5.2, balance: 1750.25 }
  ];

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken) || tokens[0];

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Deposit Successful!",
        description: `Deposited ${amount} ${selectedToken} and minted ${amount} tkchUSD.`,
      });
      
      setAmount('');
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Deposit</span>
          <Badge variant="secondary" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Secured
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selection */}
        <div className="grid grid-cols-2 gap-2">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => setSelectedToken(token.symbol)}
              className={`p-3 rounded-lg border-2 transition-all touch-manipulation ${
                selectedToken === token.symbol
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-left">
                <p className="font-medium text-sm">{token.symbol}</p>
                <p className="text-xs text-muted-foreground">{token.apy}% APY</p>
              </div>
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg pr-16 h-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {selectedToken}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Available: {selectedTokenData.balance.toFixed(2)} {selectedToken}
          </p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {['25%', '50%', 'Max'].map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => {
                const percentage = preset === '25%' ? 0.25 : preset === '50%' ? 0.5 : 1;
                setAmount((selectedTokenData.balance * percentage).toFixed(2));
              }}
              className="h-8 text-xs touch-manipulation"
            >
              {preset}
            </Button>
          ))}
        </div>

        {/* Deposit Info */}
        <div className="bg-muted/30 p-3 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You will receive:</span>
            <span className="font-medium">{amount || '0'} tkchUSD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">APY:</span>
            <span className="text-green-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {selectedTokenData.apy}%
            </span>
          </div>
        </div>

        {/* Deposit Button */}
        <Button 
          onClick={handleDeposit} 
          disabled={!amount || isLoading}
          className="w-full h-12 touch-manipulation"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Deposit & Mint
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobileDepositCard;
