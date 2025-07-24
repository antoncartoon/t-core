import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTCore } from '@/contexts/TCoreContext';
import { useWallet } from '@/contexts/WalletContext';
import { Shield, TrendingUp, Calculator, Info, BarChart3, AlertTriangle } from 'lucide-react';
import InteractiveLiquidityChart from './charts/InteractiveLiquidityChart';
import StakingStressTestPanel from './charts/StakingStressTestPanel';
import { calculatePredictedYield, getTierForBucket, calculateComprehensiveAPY } from '@/utils/tzFormulas';

export const SimplifiedStakingInterface = () => {
  const { createNFTPosition, tcoreState } = useTCore();
  const { getAvailableBalance } = useWallet();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<[number, number]>([10, 29]); // Conservative by default
  const [isStaking, setIsStaking] = useState(false);

  const tddBalance = getAvailableBalance('TDD');
  const numericAmount = parseFloat(amount) || 0;

  // Use actual protocol liquidity data for visualization
  const liquidityData = Array.from({ length: 100 }, (_, i) => {
    const tick = tcoreState.liquidityTicks[i];
    const tickLiquidity = tick ? tick.totalLiquidity : 0;
    return {
      bucket: i,
      liquidity: tickLiquidity
    };
  });

  // Calculate comprehensive predicted yield with incentives
  const comprehensiveAPY = numericAmount > 0 ? (() => {
    const midpoint = (selectedRange[0] + selectedRange[1]) / 2;
    // Safe tier shows fixed 6% APY without bonuses
    if (midpoint <= 9) return 6.0;
    return calculateComprehensiveAPY(numericAmount, selectedRange);
  })() : null;
  const yieldPrediction = numericAmount > 0 ? calculatePredictedYield(numericAmount, selectedRange) : null;
  const selectedTier = getTierForBucket(Math.floor((selectedRange[0] + selectedRange[1]) / 2));

  // Tier definitions for liquidity distribution
  const tierPresets = [
    { name: 'Safe', range: [0, 9], color: '#22c55e', targetWeight: 0.6 },
    { name: 'Conservative', range: [10, 29], color: '#3b82f6', targetWeight: 0.25 },
    { name: 'Balanced', range: [30, 69], color: '#f59e0b', targetWeight: 0.12 },
    { name: 'Hero', range: [70, 99], color: '#ef4444', targetWeight: 0.03 }
  ];

  // Calculate tier distribution for liquidity visualization
  const tierDistribution = useMemo(() => {
    console.log('Calculating tier distribution with liquidityData:', liquidityData);
    
    const totalLiquidity = liquidityData.reduce((sum, item) => sum + item.liquidity, 0);
    console.log('Total liquidity:', totalLiquidity);
    
    if (totalLiquidity === 0) {
      // Mock data when no liquidity
      console.log('Using mock data for tier distribution');
      return [
        { percentage: 45, tvl: 382500 },
        { percentage: 30, tvl: 255000 },
        { percentage: 20, tvl: 170000 },
        { percentage: 5, tvl: 42500 }
      ];
    }

    return tierPresets.map((tier) => {
      const tierLiquidity = liquidityData
        .filter(item => item.bucket >= tier.range[0] && item.bucket <= tier.range[1])
        .reduce((sum, item) => sum + item.liquidity, 0);
      
      const percentage = (tierLiquidity / totalLiquidity) * 100;
      const tvl = (percentage / 100) * (tcoreState.totalTVL || 850000);
      
      return { percentage, tvl };
    });
  }, [liquidityData, tcoreState.totalTVL]);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Main Staking Interface - Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Compact Amount Input */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Stake TDD Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="amount" className="text-sm font-medium">Amount (TDD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg h-11 mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Available: {tddBalance.toFixed(2)} TDD
                </p>
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <Label className="text-sm font-medium">Quick Select</Label>
                <div className="grid grid-cols-2 gap-1">
                  {[0.25, 0.5, 0.75, 1].map((percentage) => (
                    <Button
                      key={percentage}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(percentage)}
                      className="text-xs h-8 px-2"
                    >
                      {percentage === 1 ? 'Max' : `${percentage * 100}%`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Interactive Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Risk-Yield Selection
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select your preferred risk range to visualize potential yields
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="px-6 pb-4">
              {/* Real-time Yield Display */}
              {comprehensiveAPY && yieldPrediction && (
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Expected Returns</span>
                    <Badge variant="outline" style={{ color: selectedTier.color }}>
                      {selectedTier.name} Tier
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Est. APY</p>
                      <p className="text-lg font-bold text-primary">
                        {comprehensiveAPY.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Annual Yield</p>
                      <p className="text-lg font-bold text-primary">
                        ${((numericAmount * comprehensiveAPY) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Range</p>
                      <p className="text-lg font-bold">
                        {selectedRange[0]}-{selectedRange[1]}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Larger Chart */}
            <div className="h-[400px]">
              <InteractiveLiquidityChart
                selectedRange={selectedRange}
                onRangeSelect={setSelectedRange}
                amount={numericAmount}
                liquidityData={liquidityData}
              />
            </div>
          </CardContent>
        </Card>

        {/* Liquidity Distribution Visualization */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Liquidity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Safe', current: 40, target: 10, color: '#22c55e', status: 'overloaded' },
                { name: 'Conservative', current: 20, target: 20, color: '#3b82f6', status: 'balanced' },
                { name: 'Balanced', current: 20, target: 30, color: '#f59e0b', status: 'underloaded' },
                { name: 'Hero', current: 20, target: 40, color: '#ef4444', status: 'underloaded' }
              ].map((tier) => (
                <div key={tier.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="text-sm font-medium">{tier.name}</span>
                    <span className="text-xs">
                      {tier.status === 'overloaded' ? '📉' : 
                       tier.status === 'underloaded' ? '📈' : '✅'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium">{tier.current}%</span>
                    <span className="text-muted-foreground">→ {tier.target}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Protocol TVL</span>
                <span className="font-semibold">$900,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prominent Stake Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={handleStake}
                disabled={isStaking || numericAmount <= 0 || numericAmount > tddBalance}
                className="w-full max-w-md h-14 text-lg"
                size="lg"
              >
                {isStaking ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating Position...
                  </div>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Stake {numericAmount.toFixed(2)} TDD
                  </>
                )}
              </Button>
              {numericAmount > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  You'll create a position in the {selectedTier.name} tier with {comprehensiveAPY?.toFixed(2)}% estimated APY
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Sidebar - Right Column */}
      <div className="space-y-6">
        {/* Protocol Stats */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Protocol Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total TVL</span>
                <span className="font-semibold">
                  ${(900000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Positions</span>
                <span className="font-semibold">88</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Your TDD Balance</span>
                <span className="font-semibold">{tddBalance.toLocaleString()} TDD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Analytics */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-4 w-4" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stress-test" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="stress-test">Stress Testing</TabsTrigger>
              </TabsList>
              <TabsContent value="stress-test" className="mt-4">
                <div className="space-y-4">
                  {numericAmount > 0 ? (
                    <StakingStressTestPanel
                      amount={numericAmount}
                      selectedRange={selectedRange}
                      totalTVL={tcoreState.totalTVL || 850000}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Enter an amount to see stress test analysis
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
