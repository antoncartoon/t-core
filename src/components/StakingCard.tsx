
import React, { useState } from 'react';
import { TrendingUp, Shield, AlertTriangle, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import YieldCurveChart from './YieldCurveChart';

const StakingCard = () => {
  const [amount, setAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState([30]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getAvailableBalance, createStakingPosition } = useWallet();

  const availableBalance = getAvailableBalance('tkchUSD');

  // Calculate yield based on risk level
  const calculateYield = (risk: number) => {
    return Math.pow(risk / 100, 1.5) * 25 + 2; // Base yield curve formula
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
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const positionId = createStakingPosition(stakeAmount, riskLevel[0]);
      
      toast({
        title: "NFT Staking Position Created!",
        description: `Position ${positionId.slice(-6)} created with ${stakeAmount} tkchUSD at ${currentYield.toFixed(2)}% APY.`,
      });
      
      setAmount('');
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
                Risk Level
              </label>
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
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low Risk</span>
              <span>{riskLevel[0]}%</span>
              <span>High Risk</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Expected APY</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentYield.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Rewards</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${amount ? (parseFloat(amount) * currentYield / 100).toFixed(2) : '0.00'}
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
              Unique NFT with locked parameters: {amount || '0'} tkchUSD, {currentYield.toFixed(2)}% APY, {riskCategory.name} risk
            </p>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Lock Period: {
              riskLevel[0] <= 33 ? '30 days' : 
              riskLevel[0] <= 66 ? '90 days' : '180 days'
            }</p>
            <p>Your NFT position will be transferable and can be used in DeFi protocols</p>
          </div>

          <Button 
            onClick={handleStake} 
            disabled={!amount || isLoading || parseFloat(amount) > availableBalance}
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
          <YieldCurveChart riskLevel={riskLevel[0]} yieldLevel={currentYield} />
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Risk Score:</span>
              <span className={`font-medium ${riskCategory.color}`}>
                {riskLevel[0]}/100
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Strategy Type:</span>
              <span className="font-medium">{riskCategory.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Lock Period:</span>
              <span className="font-medium">
                {riskLevel[0] <= 33 ? '30 days' : riskLevel[0] <= 66 ? '90 days' : '180 days'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingCard;
