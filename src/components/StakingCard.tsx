
import React, { useState } from 'react';
import { TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import YieldCurveChart from './YieldCurveChart';

const StakingCard = () => {
  const [amount, setAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState([30]);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAmount('');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Stake tkchUSD</span>
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
              Available: 0.00 tkchUSD
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

          <Button 
            onClick={handleStake} 
            disabled={!amount || isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Staking...</span>
              </div>
            ) : (
              'Stake tkchUSD'
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
