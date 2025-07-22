
import React, { useState } from 'react';
import { TrendingUp, Target, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRiskRange } from '@/contexts/RiskRangeContext';
import { analyzeRiskRange } from '@/utils/riskRangeCalculations';
import RiskTierSelector from './enhanced/RiskTierSelector';
import AutoDistributeButton from './waterfall/AutoDistributeButton';
import { Separator } from '@/components/ui/separator';

const RangeStakingCard = () => {
  const [amount, setAmount] = useState('');
  const [riskRange, setRiskRange] = useState<[number, number]>([15, 35]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { getAvailableBalance, createLiquidityPosition, protocolState } = useRiskRange();

  const availableBalance = getAvailableBalance('TDD');
  const stakeAmount = parseFloat(amount) || 0;

  // Calculate range analysis
  const analysis = stakeAmount > 0 ? analyzeRiskRange(
    stakeAmount,
    { min: riskRange[0], max: riskRange[1] },
    protocolState.riskTicks
  ) : null;

  // Convert liquidity data for visualization using real protocol data
  const liquidityData = protocolState.riskTicks.map(tick => ({
    risk: tick.riskLevel,
    liquidity: tick.totalLiquidity
  }));

  const handleStake = async () => {
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
        description: `You only have ${availableBalance.toFixed(2)} TDD available.`,
        variant: "destructive",
      });
      return;
    }

    if (riskRange[0] >= riskRange[1]) {
      toast({
        title: "Invalid Range",
        description: "Please select a valid risk range.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const positionId = createLiquidityPosition(stakeAmount, riskRange[0], riskRange[1]);
      
      toast({
        title: "Liquidity Position Created!",
        description: `Position ${positionId.slice(-6)} created with ${stakeAmount} TDD in range ${riskRange[0]}-${riskRange[1]}.`,
      });
      
      setAmount('');
      setRiskRange([15, 35]);
    } catch (error) {
      toast({
        title: "Position Creation Failed",
        description: "There was an error creating your liquidity position. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle distribution from the AutoDistributeButton
  const handleAutoDistribute = (ranges: Array<{ range: [number, number]; weight: number }>) => {
    if (stakeAmount <= 0) return;
    
    // Convert the optimized ranges to a single range
    // This is a simplification - in a real implementation, we'd create multiple positions
    if (ranges.length > 0) {
      // Find min and max from all ranges
      const minRisk = Math.min(...ranges.map(r => r.range[0]));
      const maxRisk = Math.max(...ranges.map(r => r.range[1]));
      setRiskRange([minRisk, maxRisk]);
      
      toast({
        title: "Auto-distribution applied",
        description: `Your position will be optimized across the risk range ${minRisk}-${maxRisk}.`,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Main Staking Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Concentrated Liquidity Position</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Amount to Stake
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available: {availableBalance.toFixed(2)} TDD
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {['25%', '50%', '75%', 'Max'].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => {
                  const percentage = preset === '25%' ? 0.25 : preset === '50%' ? 0.5 : preset === '75%' ? 0.75 : 1;
                  setAmount((availableBalance * percentage).toFixed(2));
                }}
                className="h-8 text-xs"
              >
                {preset}
              </Button>
            ))}
          </div>

          {/* Performance Metrics */}
          {analysis && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated APR</p>
                  <p className="text-xl font-bold text-blue-600">
                    {(analysis.estimatedAPR * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capital Efficiency</p>
                  <p className="text-xl font-bold text-purple-600">
                    {analysis.capitalEfficiency.toFixed(1)}x
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Risk Analysis */}
          {analysis && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Potential Loss Scenarios</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded text-center">
                  <p className="text-xs text-muted-foreground">5% Protocol Loss</p>
                  <p className="font-semibold text-yellow-700">
                    -${analysis.potentialLoss.at5Percent.toFixed(2)}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 p-2 rounded text-center">
                  <p className="text-xs text-muted-foreground">10% Protocol Loss</p>
                  <p className="font-semibold text-orange-700">
                    -${analysis.potentialLoss.at10Percent.toFixed(2)}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-center">
                  <p className="text-xs text-muted-foreground">20% Protocol Loss</p>
                  <p className="font-semibold text-red-700">
                    -${analysis.potentialLoss.at20Percent.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expected Returns */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Expected Annual Return</span>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              ${analysis ? (stakeAmount * analysis.estimatedAPR).toFixed(2) : '0.00'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on current protocol yield and your risk range
            </p>
          </div>

          {/* Auto-distribute Button */}
          <div className="mt-4">
            <Separator className="my-4" />
            <h3 className="text-sm font-medium mb-2">Optimize Your Position</h3>
            <AutoDistributeButton 
              amount={stakeAmount} 
              onDistribute={handleAutoDistribute} 
            />
          </div>

          {/* Stake Button */}
          <Button 
            onClick={handleStake} 
            disabled={!amount || isLoading || stakeAmount > availableBalance}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Creating Position...</span>
              </div>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Create Liquidity Position
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Risk Tier Selector */}
      <RiskTierSelector
        value={riskRange}
        onChange={setRiskRange}
        amount={stakeAmount}
      />
    </div>
  );
};

export default RangeStakingCard;
