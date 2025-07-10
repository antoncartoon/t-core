
import React, { useState } from 'react';
import { TrendingUp, Shield, AlertTriangle, Coins, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { calculateRiskScore, calculatePayoutPriority, riskScoreToCategory } from '@/utils/riskCalculations';
import YieldCurveChart from './YieldCurveChart';

const StakingCard = () => {
  const [amount, setAmount] = useState('');
  const [desiredAPY, setDesiredAPY] = useState('12'); // Default 12% APY
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getAvailableBalance, createStakingPosition, poolSettings } = useWallet();

  const availableBalance = getAvailableBalance('tkchUSD');
  const desiredAPYDecimal = parseFloat(desiredAPY) / 100 || 0;

  // Calculate risk metrics
  const riskScore = calculateRiskScore(desiredAPYDecimal, poolSettings);
  const payoutPriority = calculatePayoutPriority(riskScore);
  const riskLevel = Math.round((riskScore / 10000) * 100);
  const riskCategory = riskScoreToCategory(riskScore);

  const getRiskIcon = () => {
    switch (riskCategory) {
      case 'Conservative': return Shield;
      case 'Moderate': return TrendingUp;
      case 'Aggressive': return AlertTriangle;
    }
  };

  const getRiskColor = () => {
    switch (riskCategory) {
      case 'Conservative': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'Aggressive': return 'text-red-600';
    }
  };

  const RiskIcon = getRiskIcon();
  const riskColor = getRiskColor();

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

    if (!desiredAPY || desiredAPYDecimal <= 0) {
      toast({
        title: "Invalid APY",
        description: "Please enter a valid desired APY.",
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

    if (desiredAPYDecimal > poolSettings.maxAPY) {
      toast({
        title: "APY Too High",
        description: `Maximum APY is ${(poolSettings.maxAPY * 100).toFixed(1)}%.`,
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
        description: `Position ${positionId.slice(-6)} created with ${stakeAmount} tkchUSD at ${desiredAPY}% APY. Priority: ${payoutPriority.toLocaleString()}.`,
      });
      
      setAmount('');
      setDesiredAPY('12');
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "There was an error creating your staking position. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Create NFT Staking Position</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Amount to Stake
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Available: {availableBalance.toFixed(2)} tkchUSD
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Desired APY (%)
              </label>
              <div className={`flex items-center space-x-1 ${riskColor}`}>
                <RiskIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{riskCategory}</span>
              </div>
            </div>
            <Input
              type="number"
              placeholder="12.0"
              value={desiredAPY}
              onChange={(e) => setDesiredAPY(e.target.value)}
              min={poolSettings.baseAPY * 100}
              max={poolSettings.maxAPY * 100}
              step="0.1"
              className="text-lg"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {(poolSettings.baseAPY * 100).toFixed(1)}% (Risk-free)</span>
              <span>Max: {(poolSettings.maxAPY * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Risk Score</p>
                <p className="text-xl font-bold text-blue-600">
                  {riskScore.toLocaleString()}/10,000
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payout Priority</p>
                <p className="text-xl font-bold text-purple-600">
                  #{payoutPriority.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Priority Queue System</p>
                <p className="text-yellow-700">
                  Higher APY = Lower priority. You'll receive payouts based on your position in the queue. 
                  Conservative positions get paid first.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-800">You will receive</p>
            </div>
            <p className="text-lg font-bold text-green-700">
              NFT Position #{Date.now().toString().slice(-6)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Annual expected return: ${amount ? (parseFloat(amount) * desiredAPYDecimal).toFixed(2) : '0.00'}
            </p>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Lock Period: {
              riskLevel <= 33 ? '30 days' : 
              riskLevel <= 66 ? '90 days' : '180 days'
            }</p>
            <p>Your NFT position will be transferable and can be used in DeFi protocols</p>
          </div>

          <Button 
            onClick={handleStake} 
            disabled={!amount || !desiredAPY || isLoading || parseFloat(amount) > availableBalance || desiredAPYDecimal > poolSettings.maxAPY}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating NFT Position...</span>
              </div>
            ) : (
              'Create NFT Staking Position'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk-Yield Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <YieldCurveChart riskLevel={riskLevel} yieldLevel={parseFloat(desiredAPY) || 12} />
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Risk Score:</span>
              <span className={`font-medium ${riskColor}`}>
                {riskScore.toLocaleString()}/10,000
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Queue Position:</span>
              <span className="font-medium">#{payoutPriority.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Strategy Type:</span>
              <span className="font-medium">{riskCategory}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Lock Period:</span>
              <span className="font-medium">
                {riskLevel <= 33 ? '30 days' : riskLevel <= 66 ? '90 days' : '180 days'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingCard;
