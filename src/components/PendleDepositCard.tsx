
import React, { useState } from 'react';
import { ArrowRight, Zap, Info, Target, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const PendleDepositCard = () => {
  const [amount, setAmount] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('pt');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      
      const strategy = selectedStrategy === 'pt' ? 'Principal Tokens' : 'Yield Tokens';
      toast({
        title: "Deposit Successful!",
        description: `Successfully deposited ${amount} sttkchUSD for ${strategy}.`,
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <span>Pendle Yield Splitting</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pendle Overview Metrics */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <Target className="w-4 h-4 mx-auto mb-1 text-blue-600" />
            <p className="text-lg font-medium text-blue-600">12.8%</p>
            <p className="text-xs text-muted-foreground">Fixed APY (PT)</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-600" />
            <p className="text-lg font-medium text-green-600">18.5%</p>
            <p className="text-xs text-muted-foreground">Max Variable (YT)</p>
          </div>
          <div className="text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-purple-600" />
            <p className="text-lg font-medium text-purple-600">365</p>
            <p className="text-xs text-muted-foreground">Days to Maturity</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            sttkchUSD Amount
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Available: 8,900.25 sttkchUSD
          </p>
        </div>

        <Tabs value={selectedStrategy} onValueChange={setSelectedStrategy}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pt">Principal Tokens</TabsTrigger>
            <TabsTrigger value="yt">Yield Tokens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pt" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Principal Tokens (PT)</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Lock in a fixed 12.8% APY. Guaranteed returns at maturity regardless of yield fluctuations.
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-600">Fixed APY</p>
                  <p className="font-bold text-blue-800">12.8%</p>
                </div>
                <div>
                  <p className="text-blue-600">You'll receive</p>
                  <p className="font-bold text-blue-800">
                    {amount ? (parseFloat(amount) * 1.128).toFixed(2) : '0.00'} PT
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="yt" className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Yield Tokens (YT)</p>
                  <p className="text-xs text-green-600 mt-1">
                    Capture all future yield above the discount rate. Higher risk but unlimited upside potential.
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-600">Potential APY</p>
                  <p className="font-bold text-green-800">Up to 18.5%</p>
                </div>
                <div>
                  <p className="text-green-600">You'll receive</p>
                  <p className="font-bold text-green-800">
                    {amount ? parseFloat(amount).toFixed(2) : '0.00'} YT
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-center py-2">
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>

        <Button 
          onClick={handleDeposit} 
          disabled={!amount || isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            `Split into ${selectedStrategy === 'pt' ? 'Principal' : 'Yield'} Tokens`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PendleDepositCard;
