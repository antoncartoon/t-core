import React, { useState } from 'react';
import { DollarSign, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

const MobileDepositCard = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getAvailableBalance, mintTDD } = useWallet();

  const availableBalance = getAvailableBalance('USDC');

  const handleMint = async () => {
    const usdcAmount = parseFloat(amount);
    
    if (!amount || usdcAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      });
      return;
    }

    if (usdcAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough USDC for this transaction.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = mintTDD(usdcAmount);
      
      if (success) {
        toast({
          title: "Success!",
          description: `Deposited ${amount} USDC and minted ${amount} TDD tokens.`,
        });
        setAmount('');
      } else {
        throw new Error('Minting failed');
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
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
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (USDC)</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg pr-16 h-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              USDC
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Available: {availableBalance.toFixed(2)} USDC
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
                setAmount((availableBalance * percentage).toFixed(2));
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
            <span className="font-medium">{amount || '0'} TDD</span>
          </div>
          <p className="text-xs text-muted-foreground">
            TDD tokens can be staked for yield. 1 USDC = 1 TDD
          </p>
        </div>

        {/* Deposit Button */}
        <Button 
          onClick={handleMint} 
          disabled={!amount || isLoading || parseFloat(amount) > availableBalance}
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
              Deposit & Mint TDD
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobileDepositCard;
