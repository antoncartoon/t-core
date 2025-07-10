
import React, { useState } from 'react';
import { TrendingUp, Shield, AlertTriangle, Trophy, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { calculateRiskScore, calculatePayoutPriority, riskScoreToCategory, calculateAvailableCapacity } from '@/utils/riskCalculations';

const MobileStakingCard = () => {
  const [amount, setAmount] = useState('');
  const [desiredAPY, setDesiredAPY] = useState('10.5'); // Default to average APY
  const [sliderAPY, setSliderAPY] = useState([10.5]); // Slider state
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getAvailableBalance, createStakingPosition, poolSettings, stakingPositions } = useWallet();

  const availableBalance = getAvailableBalance('tkchUSD');
  const desiredAPYDecimal = parseFloat(desiredAPY) / 100 || 0;

  // Calculate risk metrics
  const riskScore = calculateRiskScore(desiredAPYDecimal, poolSettings);
  const payoutPriority = calculatePayoutPriority(riskScore);
  const riskLevel = Math.round((riskScore / 10000) * 100);
  const riskCategory = riskScoreToCategory(riskScore);
  
  // Calculate available capacity
  const availableCapacity = calculateAvailableCapacity(
    riskScore, 
    poolSettings.totalPoolValue || 1000000,
    stakingPositions.map(p => ({ riskScore: p.riskScore, amount: p.amount }))
  );

  // Sync slider and input
  const handleSliderChange = (value: number[]) => {
    setSliderAPY(value);
    setDesiredAPY(value[0].toFixed(1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDesiredAPY(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSliderAPY([numValue]);
    }
  };

  const setMinAPY = () => {
    const minAPY = poolSettings.baseAPY * 100;
    setDesiredAPY(minAPY.toFixed(1));
    setSliderAPY([minAPY]);
  };

  const getRiskCategory = (risk: number) => {
    if (risk <= 33) return { name: 'Conservative', color: 'text-green-600', icon: Shield };
    if (risk <= 66) return { name: 'Moderate', color: 'text-yellow-600', icon: TrendingUp };
    return { name: 'Aggressive', color: 'text-red-600', icon: AlertTriangle };
  };

  const riskCategoryInfo = getRiskCategory(riskLevel);
  const RiskIcon = riskCategoryInfo.icon;

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

    if (stakeAmount > availableCapacity) {
      toast({
        title: "Pool Capacity Exceeded",
        description: `Max available: ${availableCapacity.toFixed(2)} tkchUSD.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const positionId = createStakingPosition(stakeAmount, desiredAPYDecimal);
      
      toast({
        title: "NFT Staking Position Created!",
        description: `Position ${positionId.slice(-6)} created successfully.`,
      });
      
      setAmount('');
      setDesiredAPY('10.5');
      setSliderAPY([10.5]);
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

  const lockPeriod = riskLevel <= 33 ? '15 days' : riskLevel <= 66 ? '60 days' : '120 days';

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
                const maxAmount = Math.min(availableBalance, availableCapacity);
                setAmount((maxAmount * percentage).toFixed(2));
              }}
              className="h-8 text-xs touch-manipulation"
            >
              {preset}
            </Button>
          ))}
        </div>

        {/* APY Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Desired APY (%)</label>
            <div className={`flex items-center space-x-1 ${riskCategoryInfo.color}`}>
              <RiskIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{riskCategoryInfo.name}</span>
            </div>
          </div>
          
          {/* APY Input and Min Button */}
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="10.5"
              value={desiredAPY}
              onChange={handleInputChange}
              min={poolSettings.baseAPY * 100}
              max={poolSettings.maxAPY * 100}
              step="0.1"
              className="text-base flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={setMinAPY}
              className="px-2 text-xs whitespace-nowrap"
            >
              Min
            </Button>
          </div>

          {/* APY Slider */}
          <Slider
            value={sliderAPY}
            onValueChange={handleSliderChange}
            min={poolSettings.baseAPY * 100}
            max={poolSettings.maxAPY * 100}
            step={0.1}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {(poolSettings.baseAPY * 100).toFixed(1)}%</span>
            <span>{sliderAPY[0].toFixed(1)}%</span>
            <span>Max: {(poolSettings.maxAPY * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Priority and Risk Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Risk Score</p>
              <p className="text-lg font-bold text-blue-600">
                {riskScore.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Queue Priority</p>
              <p className="text-lg font-bold text-purple-600">
                #{payoutPriority.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Priority Explanation */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center space-x-1 mb-1">
            <Users className="w-3 h-3" />
            <p className="font-medium">Payout Priority System</p>
          </div>
          <p className="mb-1">Normal conditions: ALL positions get paid.</p>
          <p>Stress scenarios: Lower APY = Higher priority.</p>
        </div>

        {/* Expected Returns */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-lg">
          <div className="text-sm">
            <p className="text-xs text-muted-foreground mb-1">Annual Expected Return</p>
            <p className="text-xl font-bold text-green-600">
              ${amount ? (parseFloat(amount) * desiredAPYDecimal).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Lock Period Info */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">Lock Period: {lockPeriod}</p>
          <p>Your NFT position will be transferable and usable in DeFi protocols</p>
        </div>

        {/* Stake Button */}
        <Button 
          onClick={handleStake} 
          disabled={!amount || isLoading || parseFloat(amount) > availableBalance || parseFloat(amount) > availableCapacity}
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
