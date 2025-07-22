
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown, DollarSign, AlertTriangle, BarChart3 } from 'lucide-react';
import { calculateTZCompliantAPY, calculatePredictedYield, calculateStressScenarios, getTierForBucket } from '@/utils/tzFormulas';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const TZCompliantStakingInterface = () => {
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

  // Get tier info for current range
  const startTier = getTierForBucket(bucketRange[0]);
  const endTier = getTierForBucket(bucketRange[1]);
  const isSingleTier = startTier.name === endTier.name;

  // Calculate APY for visualization
  const apyData = [];
  for (let bucket = 0; bucket <= 99; bucket++) {
    apyData.push({
      bucket,
      apy: calculateTZCompliantAPY(bucket) * 100,
      isSelected: bucket >= bucketRange[0] && bucket <= bucketRange[1],
      tier: getTierForBucket(bucket)
    });
  }

  return (
    <div className="space-y-6">
      {/* Main Staking Interface */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            T-Core Staking Interface (ТЗ Compliant)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter amount, select bucket range (0-99), and calculate your predicted yield and risks
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма TDD</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
          </div>

          {/* Bucket Range Slider */}
          <div className="space-y-4">
            <Label>Диапазон риска (bucket'ов 0-99)</Label>
            
            <div className="space-y-4">
              <div className="px-3">
                <Slider
                  value={bucketRange}
                  onValueChange={(value) => setBucketRange(value as [number, number])}
                  min={0}
                  max={99}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>От:</span>
                  <Badge variant="outline" className={startTier.color}>
                    {bucketRange[0]} ({startTier.name})
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>До:</span>
                  <Badge variant="outline" className={endTier.color}>
                    {bucketRange[1]} ({endTier.name})
                  </Badge>
                </div>
              </div>
              
              {!isSingleTier && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ваш диапазон охватывает несколько тиров: {startTier.name} → {endTier.name}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Calculate Button */}
          <Button 
            onClick={handleCalculate}
            disabled={numericAmount <= 0}
            className="w-full" 
            size="lg"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Рассчитать
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {calculationResults && (
        <>
          {/* Predicted Yield */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-500" />
                Прогнозируемая доходность
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {calculationResults.yield.percentAPY.toFixed(2)}%
                  </div>
                  <div className="text-sm text-green-700">Годовая доходность</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${calculationResults.yield.dollarYield.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Прибыль в год</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Формула ТЗ:</strong> APY(r) = APY_safe + (APY_protocol - APY_safe) × r^1.5
                  <br />
                  где r = (средний bucket) / 99 = {((bucketRange[0] + bucketRange[1]) / 2 / 99).toFixed(3)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stress Loss Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Потери при стресс-сценариях
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: '-1% TVL', data: calculationResults.stress.scenario1, color: 'text-yellow-600' },
                  { label: '-5% TVL', data: calculationResults.stress.scenario5, color: 'text-orange-600' },
                  { label: '-10% TVL', data: calculationResults.stress.scenario10, color: 'text-red-600' }
                ].map((scenario, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={scenario.color}>
                        {scenario.label}
                      </Badge>
                      <div>
                        <div className={`font-semibold ${scenario.color}`}>
                          {scenario.data.lossPercent.toFixed(2)}% потери
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${scenario.data.dollarLoss.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(scenario.data.lossPercent, 100)} 
                      className="w-24 h-2" 
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Формула ТЗ:</strong> Loss = min(residual_loss, user_position) / user_position
                  <br />
                  Потери распределяются сверху вниз (bucket 99 → 0)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* APY by Buckets Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                APR по bucket'ам и ваша позиция
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 w-full bg-muted/30 rounded-lg p-4 overflow-x-auto">
                  <div className="flex items-end justify-between h-full min-w-[800px]">
                    {apyData.filter((_, i) => i % 5 === 0).map((data, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-4 rounded-t-sm ${
                            data.isSelected 
                              ? 'bg-primary shadow-lg border-2 border-primary-foreground' 
                              : 'bg-muted-foreground/50'
                          }`}
                          style={{ height: `${(data.apy / 25) * 100}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{data.bucket}</div>
                        {data.isSelected && (
                          <Badge variant="default" className="text-[8px] px-1">
                            Ваша
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm" />
                    <span>Safe (0-9)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                    <span>Conservative (10-29)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
                    <span>Balanced (30-59)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-sm" />
                    <span>Hero (60-99)</span>
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

export default TZCompliantStakingInterface;
