import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, DollarSign, Shield, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/data/tcoreData';

const StressTestCalculator = () => {
  const [stakeAmount, setStakeAmount] = useState([10000]);
  const [marketDrop, setMarketDrop] = useState([0.2]); // 20% default
  const [selectedTier, setSelectedTier] = useState(4);
  
  // Risk calculations based on subordination
  const calculateRisk = (tier: number, drop: number) => {
    const riskFactors = {
      1: 0,      // Tier 1: 0% risk (fixed guaranteed)
      2: 0.1,    // Tier 2: 10% of losses
      3: 0.3,    // Tier 3: 30% of losses  
      4: 0.8     // Tier 4: 80% of losses (absorbs first)
    };
    
    return drop * riskFactors[tier as keyof typeof riskFactors];
  };
  
  const absoluteLoss = stakeAmount[0] * calculateRisk(selectedTier, marketDrop[0]);
  const lossPercentage = calculateRisk(selectedTier, marketDrop[0]) * 100;
  
  // APY calculations
  const tierAPYs = {
    1: 6.0,   // Fixed tier 1
    2: 9.2,   // Base + small bonus
    3: 16.8,  // Base + medium bonus
    4: 27.4   // Base + high bonus + surplus
  };
  
  const annualReturn = stakeAmount[0] * (tierAPYs[selectedTier as keyof typeof tierAPYs] / 100);
  const netReturn = annualReturn - absoluteLoss;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Stress Test Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Input Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Stake Amount: {formatCurrency(stakeAmount[0])}</label>
              <Slider
                value={stakeAmount}
                onValueChange={setStakeAmount}
                max={100000}
                min={1000}
                step={1000}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Market Drop: -{formatPercentage(marketDrop[0])}</label>
              <Slider
                value={marketDrop}
                onValueChange={setMarketDrop}
                max={0.5}
                min={0.1}
                step={0.05}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Select Tier:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedTier === tier
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Tier {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Potential Loss
              </h4>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(absoluteLoss)}
                </div>
                <div className="text-sm text-red-600">
                  {lossPercentage.toFixed(1)}% of stake at risk
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Net Annual Return
              </h4>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(netReturn)}
                </div>
                <div className="text-sm text-green-600">
                  After absorbing losses
                </div>
              </div>
            </div>
          </div>
          
          {/* Risk Breakdown */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">Risk Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Annual APY (Tier {selectedTier}):</span>
                <span className="font-medium">{tierAPYs[selectedTier as keyof typeof tierAPYs]}%</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Return:</span>
                <span className="font-medium text-green-600">{formatCurrency(annualReturn)}</span>
              </div>
              <div className="flex justify-between">
                <span>Stress Loss:</span>
                <span className="font-medium text-red-600">-{formatCurrency(absoluteLoss)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Net Return:</span>
                <span className={`font-medium ${netReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netReturn)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Tier Comparison */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Tier Comparison ({formatPercentage(marketDrop[0])} Drop)</h4>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((tier) => {
                const tierLoss = stakeAmount[0] * calculateRisk(tier, marketDrop[0]);
                const tierAPY = tierAPYs[tier as keyof typeof tierAPYs];
                const tierReturn = stakeAmount[0] * (tierAPY / 100);
                const tierNet = tierReturn - tierLoss;
                
                return (
                  <div key={tier} className="p-2 bg-background rounded border text-center">
                    <div className="text-xs font-medium mb-1">Tier {tier}</div>
                    <div className="text-sm font-semibold text-green-600">{formatCurrency(tierReturn)}</div>
                    <div className="text-xs text-red-600">-{formatCurrency(tierLoss)}</div>
                    <div className="text-xs font-medium border-t pt-1">
                      {formatCurrency(tierNet)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Insurance Explanation */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Subordination Protection
            </h4>
            <p className="text-sm text-blue-600">
              Higher tiers absorb losses first, protecting lower tiers. This insurance mechanism ensures 
              Tier 1 remains risk-free while Tier 4 gets maximum upside as compensation for first-loss risk.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StressTestCalculator;