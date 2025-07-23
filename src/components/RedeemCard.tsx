import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, Clock, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { useRedeem } from '@/contexts/RedeemContext';

export const RedeemCard = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'instant' | 'queue' | 'uniswap'>('instant');
  
  const { toast } = useToast();
  const { getAvailableBalance, addBalance } = useWallet();
  const { 
    bufferState, 
    redeemInstant, 
    addToQueue, 
    getUniswapRoute,
    redeemViaUniswap,
    checkInstantRedeemAvailable,
    calculateRedeemFee 
  } = useRedeem();

  const tddBalance = getAvailableBalance('TDD');
  const redeemAmount = parseFloat(amount) || 0;
  const fee = calculateRedeemFee(redeemAmount, selectedMethod);
  const expectedUSDC = redeemAmount - fee;

  const canRedeemInstant = checkInstantRedeemAvailable(redeemAmount);
  const hasHighSlippageRisk = redeemAmount > 50000; // High slippage warning

  const handleRedeem = async () => {
    if (!amount || redeemAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to redeem.",
        variant: "destructive",
      });
      return;
    }

    if (redeemAmount > tddBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${tddBalance.toFixed(2)} TDD available.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let success = false;
      let message = '';

      switch (selectedMethod) {
        case 'instant':
          success = await redeemInstant(redeemAmount);
          if (success) {
            addBalance('USDC', expectedUSDC);
            message = `Instantly redeemed ${redeemAmount} TDD for ${expectedUSDC.toFixed(2)} USDC`;
          }
          break;

        case 'queue':
          const queueId = addToQueue(redeemAmount);
          success = !!queueId;
          message = success 
            ? `Added ${redeemAmount} TDD to redeem queue. Position: #${queueId.slice(-6)}`
            : 'Failed to add to queue';
          break;

        case 'uniswap':
          success = await redeemViaUniswap(redeemAmount);
          if (success) {
            const route = await getUniswapRoute(redeemAmount);
            addBalance('USDC', route.expectedUSDC);
            message = `Redeemed ${redeemAmount} TDD via Uniswap for ${route.expectedUSDC.toFixed(2)} USDC`;
          }
          break;
      }

      if (success) {
        // Reduce TDD balance
        addBalance('TDD', -redeemAmount);
        
        toast({
          title: "Redemption Successful!",
          description: message,
        });
        setAmount('');
      } else {
        throw new Error('Redemption failed');
      }
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "There was an error processing your redemption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'instant':
        return canRedeemInstant ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Zap className="w-3 h-3 mr-1" />
            Available
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Limited
          </Badge>
        );
      case 'queue':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Clock className="w-3 h-3 mr-1" />
            1-3 days
          </Badge>
        );
      case 'uniswap':
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            <ExternalLink className="w-3 h-3 mr-1" />
            DEX
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowRight className="w-5 h-5 text-primary" />
          <span>Redeem TDD</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Convert TDD back to USDC
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            TDD Amount
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Available: {tddBalance.toFixed(2)} TDD
          </p>
        </div>

        {/* Buffer Status */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Protocol Buffer</span>
            <Badge variant={bufferState.status === 'healthy' ? 'default' : 'destructive'}>
              {bufferState.status}
            </Badge>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Available: ${bufferState.availableUSDC.toLocaleString()}</span>
            <span>{bufferState.utilizationPercent.toFixed(1)}% utilized</span>
          </div>
        </div>

        {/* Redemption Methods */}
        <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instant" className="text-xs">Instant</TabsTrigger>
            <TabsTrigger value="queue" className="text-xs">Queue</TabsTrigger>
            <TabsTrigger value="uniswap" className="text-xs">Uniswap</TabsTrigger>
          </TabsList>

          <TabsContent value="instant" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Method</span>
              {getMethodBadge('instant')}
            </div>
            <p className="text-xs text-muted-foreground">
              Instant redemption from protocol buffer. Subject to availability.
            </p>
            {!canRedeemInstant && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded text-xs text-yellow-800 dark:text-yellow-200">
                Amount exceeds instant limit or buffer capacity
              </div>
            )}
          </TabsContent>

          <TabsContent value="queue" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Method</span>
              {getMethodBadge('queue')}
            </div>
            <p className="text-xs text-muted-foreground">
              Join redemption queue. Lower fees, guaranteed execution within 1-3 days.
            </p>
          </TabsContent>

          <TabsContent value="uniswap" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Method</span>
              {getMethodBadge('uniswap')}
            </div>
            <p className="text-xs text-muted-foreground">
              Trade via Uniswap DEX. Best for smaller amounts with immediate settlement.
            </p>
            {hasHighSlippageRisk && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded text-xs text-yellow-800 dark:text-yellow-200">
                High amount may result in slippage. Please be careful with large trades.
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Redemption Preview */}
        {redeemAmount > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">TDD Amount</span>
                <span className="font-medium">{redeemAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fee ({(fee/redeemAmount*100).toFixed(2)}%)</span>
                <span className="font-medium text-red-600">-{fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">You receive</span>
                <span className="font-bold text-green-600">{expectedUSDC.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleRedeem} 
          disabled={!amount || isLoading || redeemAmount > tddBalance || redeemAmount <= 0 || (selectedMethod === 'instant' && !canRedeemInstant)}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Redeem via {selectedMethod}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};