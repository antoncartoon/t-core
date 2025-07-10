
import React, { useState } from 'react';
import { ArrowRight, Coins, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

const DepositCard = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getAvailableBalance, mintTkchUSD } = useWallet();

  const availableUSDC = getAvailableBalance('USDC');

  const handleMint = async () => {
    const mintAmount = parseFloat(amount);
    
    if (!amount || mintAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to mint.",
        variant: "destructive",
      });
      return;
    }

    if (mintAmount > availableUSDC) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${availableUSDC.toFixed(2)} USDC available.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate minting transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = mintTkchUSD(mintAmount);
      if (success) {
        toast({
          title: "Minting Successful!",
          description: `${mintAmount} tkchUSD has been minted from ${mintAmount} USDC.`,
        });
        setAmount('');
      } else {
        throw new Error('Minting failed');
      }
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "There was an error minting your tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-blue-600" />
          <span>Mint tkchUSD</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            USDC Amount
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Available: {availableUSDC.toFixed(2)} USDC
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">1:1 Minting</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">You deposit</p>
              <p className="text-lg font-bold text-blue-600">
                {amount || '0'} USDC
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">You receive</p>
              <p className="text-lg font-bold text-green-600">
                {amount || '0'} tkchUSD
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>1:1 USDC to tkchUSD conversion</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Instant minting with no fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Use tkchUSD for staking and earning yield</span>
          </div>
        </div>

        <Button 
          onClick={handleMint} 
          disabled={!amount || isLoading || parseFloat(amount) > availableUSDC}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Minting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Mint tkchUSD</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DepositCard;
