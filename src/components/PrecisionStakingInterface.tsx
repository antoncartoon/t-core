
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown, DollarSign, AlertTriangle, BarChart3 } from 'lucide-react';
import { calculatePrecisionAPY, calculatePredictedYield, calculateStressScenarios, getTierForBucket } from '@/utils/tzFormulas';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import QuickStrategies from '@/components/staking/QuickStrategies';

const PrecisionStakingInterface = () => {
  const [amount, setAmount] = useState<string>('');
  const [bucketRange, setBucketRange] = useState<[number, number]>([0, 9]); // Default to Safe tier
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const numericAmount = parseFloat(amount) || 0;
  const totalTVL = 12_500_000; // Example TVL

  // Calculate results
  const handleCalculate = () => {
    if (numericAmount <= 0) return;

    const yieldResults = calculatePredictedYield(numericAmount, bucketRange);
    const stressResults = calculateStressScenarios(numericAmount, bucketRange, totalTVL);

    setCalculationResults({
      yield: yieldResults,
      stress: stressResults,
      timestamp: new Date()
    });
  };

  // Auto-calculate when parameters change
  React.useEffect(() => {
    if (numericAmount > 0) {
      handleCalculate();
    }
  }, [numericAmount, bucketRange]);

  // Handle strategy selection from QuickStrategies
  const handleStrategySelect = (range: [number, number]) => {
    setBucketRange(range);
  };

  // Get tier info for current range
  const startTier = getTierForBucket(bucketRange[0]);
  const endTier = getTierForBucket(bucketRange[1]);
  const isSingleTier = startTier.name === endTier.name;

  // Calculate APY for visualization
  const apyData = [];
  for (let bucket = 0; bucket <= 99; bucket++) {
    apyData.push({
      bucket,
      apy: calculatePrecisionAPY(bucket) * 100,
      isSelected: bucket >= bucketRange[0] && bucket <= bucketRange[1],
      tier: getTierForBucket(bucket)
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Strategies */}
      <QuickStrategies onSelectStrategy={handleStrategySelect} />

      {/* Main Staking Interface */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calculator className="h-5 w-5 flex-shrink-0" />
            <span>T-Core Precision Staking</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter amount, select bucket range (0-99), and see real-time APY predictions and risk analysis
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount in TDD</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-base sm:text-lg h-12"
              />
            </div>
          </div>

          {/* Bucket Range Slider */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Risk Range (buckets 0-99)</Label>
            
            <div className="space-y-4">
              <div className="px-2 sm:px-3">
                <Slider
                  value={bucketRange}
                  onValueChange={(value) => setBucketRange(value as [number, number])}
                  min={0}
                  max={99}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">From:</span>
                  <Badge variant="outline" className={`${startTier.color} text-xs`}>
                    {bucketRange[0]} ({startTier.name})
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">To:</span>
                  <Badge variant="outline" className={`${endTier.color} text-xs`}>
                    {bucketRange[1]} ({endTier.name})
                  </Badge>
                </div>
              </div>
              
              {!isSingleTier && (
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <AlertDescription className="text-sm leading-relaxed">
                    Your range spans multiple tiers: {startTier.name} → {endTier.name}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Auto-calculation notice */}
          {numericAmount > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                ✅ Auto-calculating based on your inputs • Live preview enabled
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results - now shown automatically */}
      {calculationResults && (
        <>
          {/* Predicted Yield */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Predicted Yield</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    {calculationResults.yield.percentAPY.toFixed(2)}%
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400 mt-1">Annual Yield</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    ${calculationResults.yield.dollarYield.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400 mt-1">Annual Profit</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Formula:</strong> APY(r) = APY_safe + (APY_protocol - APY_safe) × r^1.5
                  <br />
                  where r = (average bucket) / 99 = {((bucketRange[0] + bucketRange[1]) / 2 / 99).toFixed(3)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stress Loss Scenarios */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span>Stress Test Scenarios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: '-1% TVL', data: calculationResults.stress.scenario1, color: 'text-yellow-600 dark:text-yellow-400' },
                  { label: '-5% TVL', data: calculationResults.stress.scenario5, color: 'text-orange-600 dark:text-orange-400' },
                  { label: '-10% TVL', data: calculationResults.stress.scenario10, color: 'text-red-600 dark:text-red-400' }
                ].map((scenario, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Badge variant="outline" className={`${scenario.color} flex-shrink-0 text-xs`}>
                        {scenario.label}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold ${scenario.color} text-sm`}>
                          {scenario.data.lossPercent.toFixed(2)}% loss
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          ${scenario.data.dollarLoss.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(scenario.data.lossPercent, 100)} 
                      className="w-full sm:w-24 h-2 flex-shrink-0" 
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Formula:</strong> Loss = min(residual_loss, user_position) / user_position
                  <br />
                  Losses are distributed from top to bottom (bucket 99 → 0)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* APY by Buckets Chart */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 flex-shrink-0" />
                <span>APR by Buckets & Your Position</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 w-full bg-muted/30 rounded-lg p-4 overflow-x-auto">
                  <div className="flex items-end justify-between h-full min-w-[400px] sm:min-w-[800px]">
                    {apyData.filter((_, i) => i % 5 === 0).map((data, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-3 sm:w-4 rounded-t-sm transition-all duration-300 ${
                            data.isSelected 
                              ? 'bg-primary shadow-lg border-2 border-primary-foreground animate-pulse' 
                              : 'bg-muted-foreground/50'
                          }`}
                          style={{ height: `${Math.max((data.apy / 25) * 100, 5)}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{data.bucket}</div>
                        {data.isSelected && (
                          <Badge variant="default" className="text-[8px] px-1 animate-bounce">
                            Your
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm flex-shrink-0" />
                    <span className="truncate">Safe (0-9)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm flex-shrink-0" />
                    <span className="truncate">Conservative (10-29)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-sm flex-shrink-0" />
                    <span className="truncate">Balanced (30-59)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-sm flex-shrink-0" />
                    <span className="truncate">Hero (60-99)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PrecisionStakingInterface;
