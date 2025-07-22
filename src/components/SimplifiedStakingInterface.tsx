
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTCore } from '@/contexts/TCoreContext';
import { Shield, TrendingUp, Calculator, Info } from 'lucide-react';
import InteractiveLiquidityChart from './charts/InteractiveLiquidityChart';
import StakingStressTestPanel from './charts/StakingStressTestPanel';
import { calculatePredictedYield, getTierForBucket } from '@/utils/tzFormulas';

export const SimplifiedStakingInterface = () => {
  const { getAvailableBalance, createNFTPosition, tcoreState } = useTCore();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<[number, number]>([10, 29]); // Conservative by default
  const [isStaking, setIsStaking] = useState(false);

  const tddBalance = getAvailableBalance('TDD');
  const numericAmount = parseFloat(amount) || 0;

  // Calculate predicted yield using the new formula
  const yieldPrediction = numericAmount > 0 ? calculatePredictedYield(numericAmount, selectedRange) : null;
  const selectedTier = getTierForBucket(Math.floor((selectedRange[0] + selectedRange[1]) / 2));

  // Generate mock liquidity data for visualization
  const liquidityData = Array.from({ length: 100 }, (_, i) => ({
    bucket: i,
    liquidity: Math.random() * 1000000 + (i > 60 ? Math.random() * 2000000 : 0) // More liquidity in hero tier
  }));

  const handleStake = async () => {
    if (numericAmount <= 0 || numericAmount > tddBalance) {
      toast({
        title: "Invalid parameters",
        description: "Please enter a valid amount within your balance.",
        variant: "destructive"
      });
      return;
    }

    if (selectedRange[0] >= selectedRange[1]) {
      toast({
        title: "Invalid range",
        description: "Please select a valid risk range.",
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);
    
    try {
      const tokenId = createNFTPosition(numericAmount, { start: selectedRange[0], end: selectedRange[1] });
      
      if (tokenId) {
        toast({
          title: "Position Created!",
          description: `Successfully staked ${numericAmount} TDD in buckets ${selectedRange[0]}-${selectedRange[1]}`,
        });
        setAmount('');
        setSelectedRange([10, 29]);
      } else {
        throw new Error('Failed to create position');
      }
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Please check your balance and try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (tddBalance * percentage).toFixed(2);
    setAmount(quickAmount);
  };

  return (
    <div className="space-y-6">
      {/* Amount Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Stake TDD Tokens
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select your risk range and amount to start earning yield
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (TDD)</Label>
            <div className="space-y-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg h-12"
              />
              <div className="flex gap-2">
                {[0.25, 0.5, 0.75, 1].map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(percentage)}
                    className="flex-1"
                  >
                    {percentage === 1 ? 'Max' : `${percentage * 100}%`}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Available: {tddBalance.toFixed(2)} TDD
              </p>
            </div>
          </div>

          {/* Predicted Yield Display */}
          {yieldPrediction && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Expected Returns</span>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Est. APY</p>
                  <p className="text-xl font-bold text-green-600">
                    {yieldPrediction.percentAPY.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Yield</p>
                  <p className="text-xl font-bold text-green-600">
                    ${yieldPrediction.dollarYield.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" style={{ color: selectedTier.color }}>
                  {selectedTier.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Range: {selectedRange[0]}-{selectedRange[1]}
                </span>
              </div>
            </div>
          )}

          {/* Stake Button */}
          <Button
            onClick={handleStake}
            disabled={isStaking || numericAmount <= 0 || numericAmount > tddBalance}
            className="w-full h-12"
            size="lg"
          >
            {isStaking ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating Position...
              </div>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Stake {numericAmount.toFixed(2)} TDD
              </>
            )}
          </Button>

          {/* Protocol Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total TVL</p>
              <p className="font-semibold">${tcoreState.totalTVL.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Positions</p>
              <p className="font-semibold">{Object.keys(tcoreState.liquidityTicks).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Liquidity Chart */}
      <InteractiveLiquidityChart
        selectedRange={selectedRange}
        onRangeSelect={setSelectedRange}
        amount={numericAmount}
        liquidityData={liquidityData}
      />

      {/* Stress Test Panel */}
      <StakingStressTestPanel
        amount={numericAmount}
        selectedRange={selectedRange}
        totalTVL={tcoreState.totalTVL}
      />
    </div>
  );
};
