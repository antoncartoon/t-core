
import React, { useState } from 'react';
import { TrendingUp, Shield, AlertTriangle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

const MobileStakingCard = () => {
  const [amount, setAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState([30]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getAvailableBalance, createStakingPosition } = useWallet();

  const availableBalance = getAvailableBalance('tkchUSD');

  const calculateYield = (risk: number) => {
    return Math.pow(risk / 100, 1.5) * 25 + 2;
  };

  const currentYield = calculateYield(riskLevel[0]);

  const getRiskCategory = (risk: number) => {
    if (risk <= 33) return { name: 'Conservative', color: 'text-green-600', icon: Shield };
    if (risk <= 66) return { name: 'Moderate', color: 'text-yellow-600', icon: TrendingUp };
    return { name: 'Aggressive', color: 'text-red-600', icon: AlertTriangle };
  };

  const riskCategory = getRiskCategory(riskLevel[0]);
  const RiskIcon = riskCategory.icon;

  const handleStake = async () => {
    const stakeAmount = parseFloat(amount);
    
    if (!amount || stakeAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      });
      return;
    }

    if (stakeAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${availableBalance.toFixed(2)} tkchUSD available.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const positionId = createStakingPosition(stakeAmount, riskLevel[0]);
      
      toast({
        title: "NFT Staking Position Created!",
        description: `Position ${positionId.slice(-6)} created successfully.`,
      });
      
      setAmount('');
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "There was an error creating your staking position.",
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
          <span>Create NFT Position</span>
          <Badge variant="secondary" className="text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            NFT
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount to Stake</label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg h-12"
          />
          <p className="text-xs text-muted-foreground">
            Available: {availableBalance.toFixed(2)} tkchUSD
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

        {/* Risk Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Risk Level</label>
            <div className={`flex items-center space-x-1 ${riskCategory.color}`}>
              <RiskIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{riskCategory.name}</span>
            </div>
          </div>
          <Slider
            value={riskLevel}
            onValueChange={setRiskLevel}
            max={100}
            step={1}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Risk</span>
            <span>{riskLevel[0]}%</span>
            <span>High Risk</span>
          </div>
        </div>

        {/* Expected Returns */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Expected APY</p>
              <p className="text-xl font-bold text-blue-600">
                {currentYield.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Annual Rewards</p>
              <p className="text-lg font-semibold">
                ${amount ? (parseFloat(amount) * currentYield / 100).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Lock Period Info */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">Lock Period: {
            riskLevel[0] <= 33 ? '30 days' : 
            riskLevel[0] <= 66 ? '90 days' : '180 days'
          }</p>
          <p>Your NFT position will be transferable and usable in DeFi protocols</p>
        </div>

        {/* Stake Button */}
        <Button 
          onClick={handleStake} 
          disabled={!amount || isLoading || parseFloat(amount) > availableBalance}
          className="w-full h-12 touch-manipulation"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Position...</span>
            </div>
          ) : (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              Create NFT Position
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobileStakingCard;
