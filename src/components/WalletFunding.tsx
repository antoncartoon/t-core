
import React, { useState } from 'react';
import { Plus, CreditCard, Coins, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

interface WalletFundingProps {
  onClose: () => void;
}

const WalletFunding = ({ onClose }: WalletFundingProps) => {
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addBalance } = useWallet();

  const handleCryptoDeposit = async () => {
    const amount = parseFloat(cryptoAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate crypto transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addBalance('USDC', amount);
      
      toast({
        title: "Deposit Successful",
        description: `${amount} USDC has been added to your wallet.`,
      });
      
      setCryptoAmount('');
      onClose();
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

  const handleFiatOnRamp = async () => {
    const amount = parseFloat(fiatAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate fiat on-ramp process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      addBalance('USDC', amount);
      
      toast({
        title: "Purchase Successful",
        description: `${amount} USDC has been purchased and added to your wallet.`,
      });
      
      setFiatAmount('');
      onClose();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Funds</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="crypto" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto" className="flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>Crypto</span>
            </TabsTrigger>
            <TabsTrigger value="fiat" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Fiat</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="crypto" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Deposit Amount (USDC)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum deposit: 10 USDC
              </p>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Send USDC to your wallet address. Transaction will be confirmed automatically.
              </p>
            </div>
            
            <Button 
              onClick={handleCryptoDeposit}
              disabled={!cryptoAmount || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Deposit USDC</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="fiat" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Purchase Amount (USD)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum purchase: $10 USD
              </p>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Use your credit/debit card to purchase USDC directly. Powered by secure payment processors.
              </p>
            </div>
            
            <Button 
              onClick={handleFiatOnRamp}
              disabled={!fiatAmount || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Buy with Card</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WalletFunding;
