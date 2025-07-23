import React, { useState } from 'react';
import { TrendingUp, Shield, AlertTriangle, Coins, Target, Zap, Settings, Eye, ArrowUp, ArrowDown, Building, Scale, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useRiskRange } from '@/contexts/RiskRangeContext';
import { 
  calculateRealisticRangeAPY,
  calculateCapitalEfficiency, 
  calculatePotentialLoss, 
  calculateNormalizedRisk,
  analyzeRiskRange
} from '@/utils/riskRangeCalculations';
import YieldCurveChart from './YieldCurveChart';
import ActivePositions from './ActivePositions';

// Risk range visualization component (similar to Uniswap V3)
const RiskRangeVisualization = ({ selectedRange, centerPoint }) => {
  return (
    <div className="space-y-4">
      {/* Risk Band */}
      <div className="relative h-16 bg-muted/30 rounded-lg overflow-hidden">
        {/* Color zones - 4 segments */}
        <div className="absolute inset-0 flex">
          <div className="w-[3%] bg-blue-500/20" />
          <div className="w-[21%] bg-green-500/20" />
          <div className="w-[56%] bg-yellow-500/20" />
          <div className="w-[20%] bg-purple-500/20" />
        </div>
        
        {/* Selected range highlight */}
        <div 
          className="absolute top-0 h-full bg-primary/30 border-2 border-primary transition-all duration-300"
          style={{
            left: `${selectedRange[0]}%`,
            width: `${selectedRange[1] - selectedRange[0]}%`
          }}
        />
        
        {/* Center point marker */}
        <div 
          className="absolute top-0 w-1 h-full bg-primary-foreground shadow-lg z-10 transition-all duration-300"
          style={{ left: `${centerPoint}%` }}
        />
        <div 
          className="absolute top-1/2 w-3 h-3 bg-primary-foreground rounded-full border-2 border-background shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
          style={{ left: `${centerPoint}%` }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-blue-600 font-medium">Safe (0-9)</span>
        <span className="text-green-600 font-medium">Conservative (10-29)</span>
        <span className="text-yellow-600 font-medium">Balanced (30-59)</span>
        <span className="text-purple-600 font-medium">Hero (60-99)</span>
      </div>
    </div>
  );
};

const StakingCard = () => {
  // Step 1: Amount input, Step 2: Range selection
  const [amount, setAmount] = useState('');
  const [centerPoint, setCenterPoint] = useState(8); // Start Conservative
  const [rangeWidth, setRangeWidth] = useState(14);
  const [isQuickMode, setIsQuickMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getAvailableBalance, createLiquidityPosition, protocolState } = useRiskRange();

  const availableBalance = getAvailableBalance('TDD');
  const stakeAmount = parseFloat(amount) || 0;

  // Calculate selected range from center and width
  const calculateRange = (center, width) => {
    const halfWidth = width / 2;
    const start = Math.max(0, Math.min(center - halfWidth, 99 - width));
    const end = Math.min(99, start + width);
    return [Math.round(start), Math.round(end)];
  };

  const selectedRange = calculateRange(centerPoint, rangeWidth);
  const riskRange = { min: selectedRange[0], max: selectedRange[1] };
  
  // Use real protocol data for calculations
  const riskTicks = protocolState.riskTicks;
  const analysis = stakeAmount > 0 ? analyzeRiskRange(stakeAmount, riskRange, riskTicks) : null;
  
  // Calculate realistic APY for current range
  const realisticAPY = stakeAmount > 0 ? calculateRealisticRangeAPY(stakeAmount, riskRange) : 0;

  // Risk presets - 4 levels with enhanced marketing
  const presets = [
    { 
      name: 'Safe', 
      center: 4.5, 
      width: 9, 
      color: 'blue', 
      range: [0, 9],
      icon: Shield,
      description: 'Fixed 5.16% APY (T-Bills × 1.2)',
      tagline: 'Zero Risk Fixed Rate'
    },
    { 
      name: 'Conservative', 
      center: 19.5, 
      width: 19, 
      color: 'green', 
      range: [10, 29],
      icon: Building,
      description: 'Linear growth: 5.16% → 7%',
      tagline: 'Progressive Growth'
    },
    { 
      name: 'Balanced', 
      center: 44.5, 
      width: 29, 
      color: 'yellow', 
      range: [30, 59],
      icon: Scale,
      description: 'Quadratic curve: 7% → 9.5%',
      tagline: 'Accelerated Returns'
    },
    { 
      name: 'Hero', 
      center: 79.5, 
      width: 39, 
      color: 'purple', 
      range: [60, 99],
      icon: Trophy,
      description: 'Exponential: 9.5% × 1.03^(i-60)',
      tagline: 'Maximum Yield'
    }
  ];

  const handlePresetClick = (preset) => {
    setCenterPoint(preset.center);
    setRangeWidth(preset.width);
  };
  
  const getRiskLabel = (avgRisk) => {
    if (avgRisk <= 9) return 'Safe';
    if (avgRisk <= 29) return 'Conservative';
    if (avgRisk <= 59) return 'Balanced';
    return 'Hero';
  };

  const getRiskColorClass = (avgRisk) => {
    if (avgRisk <= 9) return 'text-blue-600';
    if (avgRisk <= 29) return 'text-green-600';
    if (avgRisk <= 59) return 'text-yellow-600';
    return 'text-purple-600';
  };

  const avgRisk = (selectedRange[0] + selectedRange[1]) / 2;
  const riskLabel = getRiskLabel(avgRisk);
  const riskColor = getRiskColorClass(avgRisk);

  // Quick amount buttons
  const handleQuickAmount = (percentage) => {
    const quickAmount = (availableBalance * percentage).toFixed(2);
    setAmount(quickAmount);
  };

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

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create position with realistic APY
      const estimatedAPY = realisticAPY || 0.10;
      const positionId = createLiquidityPosition(stakeAmount, selectedRange[0], selectedRange[1]);
      
      toast({
        title: "NFT Liquidity Position Created!",
        description: `Position ${positionId.slice(-6)} created with ${stakeAmount} TDD in range ${selectedRange[0]}-${selectedRange[1]}. Estimated APY: ${(estimatedAPY * 100).toFixed(1)}%.`,
      });
      
      // Reset form
      setAmount('');
      setCenterPoint(8);
      setRangeWidth(14);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Staking Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Create 
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="underline decoration-dotted cursor-help ml-1">Liquidity Position</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">A liquidity position allows you to provide funds to the protocol and earn yield based on your chosen risk level.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Amount Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Amount to Stake (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="underline decoration-dotted cursor-help">TDD</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">TDD (T-Core Deposit Dollars) are the protocol's native staking tokens representing your deposited value.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              )
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
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-2">
              {[0.25, 0.5, 1].map((percentage, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(percentage)}
                  className="text-xs"
                >
                  {percentage === 1 ? 'Max' : `${(percentage * 100)}%`}
                </Button>
              ))}
            </div>
          </div>

          {/* Step 2: Risk Range Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Risk Range Selection</label>
              <div className={`flex items-center space-x-1 ${riskColor}`}>
                <span className="text-sm font-medium">{riskLabel}</span>
              </div>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex bg-muted rounded-lg p-1 gap-1 mb-4">
              <Button
                variant={isQuickMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsQuickMode(true)}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Quick
              </Button>
              <Button
                variant={!isQuickMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsQuickMode(false)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Advanced
              </Button>
            </div>
            
            <RiskRangeVisualization
              selectedRange={selectedRange}
              centerPoint={centerPoint}
            />
            
            {/* Quick Mode - Enhanced Presets */}
            {isQuickMode && (
              <div className="mt-4 grid grid-cols-1 gap-3">
                {presets.map((preset) => {
                  const isActive = Math.abs(centerPoint - preset.center) < 5 && Math.abs(rangeWidth - preset.width) < 5;
                  const colorClasses = {
                    blue: 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-200',
                    green: 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-200',
                    yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-200',
                    purple: 'border-purple-500 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/20 dark:text-purple-200'
                  };
                  
                  const IconComponent = preset.icon;
                  
                  return (
                    <Button
                      key={preset.name}
                      variant={isActive ? "default" : "outline"}
                      size="lg"
                      onClick={() => handlePresetClick(preset)}
                      className={`p-4 h-auto flex items-center justify-between transition-all duration-300 hover:shadow-md overflow-hidden ${
                        !isActive ? colorClasses[preset.color as keyof typeof colorClasses] : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0 overflow-hidden">
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        <div className="text-left flex-1 min-w-0 overflow-hidden">
                          <div className="font-medium flex items-center space-x-2 overflow-hidden">
                            <span className="truncate flex-1">{preset.name}</span>
                            {preset.name === 'T-Core HERO' && (
                              <span className="text-xs flex-shrink-0">🦸</span>
                            )}
                          </div>
                          <div className="text-xs opacity-75 font-medium truncate overflow-hidden">
                            {preset.tagline}
                          </div>
                          <div className="text-xs opacity-60 truncate overflow-hidden">
                            Range {preset.range[0]}-{preset.range[1]}
                          </div>
                          <div className="text-xs opacity-50 truncate overflow-hidden">
                            {preset.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 min-w-[60px] max-w-[80px] overflow-hidden">
                        <div className="text-sm font-medium truncate">
                          {(() => {
                            if (preset.name === 'Safe') return '5.0%';
                            const presetRange = { min: preset.range[0], max: preset.range[1] };
                            const presetAPY = calculateRealisticRangeAPY(stakeAmount || 100000, presetRange);
                            return `${(presetAPY * 100).toFixed(1)}%`;
                          })()}
                        </div>
                        <div className="text-xs opacity-75 truncate">Est. APY</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            )}
            
            {/* Advanced Mode - Sliders */}
            {!isQuickMode && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Center Position</label>
                  <Slider
                    value={[centerPoint]}
                    onValueChange={(value) => setCenterPoint(value[0])}
                    max={99}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span className="font-medium">{centerPoint}</span>
                    <span>Aggressive</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Range Width</label>
                  <Slider
                    value={[rangeWidth]}
                    onValueChange={(value) => setRangeWidth(value[0])}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Focused (+Bonus)</span>
                    <span className="font-medium">{rangeWidth} levels</span>
                    <span>Broad</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Position Preview */}
          {analysis && stakeAmount > 0 && (
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">
                    Estimated 
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="underline decoration-dotted cursor-help ml-1">APY</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Annual Percentage Yield - the total return on your staked tokens including compound interest over one year.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span className="font-bold text-primary">
                    {(realisticAPY * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Capital Efficiency</span>
                  <span className="font-medium">
                    {analysis.capitalEfficiency.toFixed(1)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Annual Return</span>
                  <span className="font-medium text-green-600">
                    ${(stakeAmount * realisticAPY).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Risk Warning */}
          {analysis && analysis.riskScore > 50 && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Higher Risk Position
                </p>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Potential loss in 20% protocol drawdown: ${analysis.potentialLoss.at20Percent.toFixed(2)}
              </p>
            </div>
          )}

          <Button 
            onClick={handleStake} 
            disabled={!amount || isLoading || stakeAmount > availableBalance || stakeAmount <= 0}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Position...</span>
              </div>
            ) : (
              'Create Liquidity Position'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis & Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Position Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <YieldCurveChart 
            riskLevel={avgRisk} 
            yieldLevel={analysis ? analysis.estimatedAPR * 100 : 12} 
          />
          
          {analysis && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Score:</span>
                <span className={`font-medium ${riskColor}`}>
                  {analysis.riskScore.toFixed(1)}/100
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Strategy Type:</span>
                <span className="font-medium">{riskLabel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Range:</span>
                <span className="font-medium">{selectedRange[0]} - {selectedRange[1]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capital Efficiency:</span>
                <span className="font-medium">{analysis.capitalEfficiency.toFixed(1)}x</span>
              </div>
            </div>
          )}
          
          {/* Potential Loss Scenarios */}
          {analysis && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Potential Loss Scenarios</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>5% protocol drawdown:</span>
                  <span className="text-red-600">-${analysis.potentialLoss.at5Percent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>10% protocol drawdown:</span>
                  <span className="text-red-600">-${analysis.potentialLoss.at10Percent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>20% protocol drawdown:</span>
                  <span className="text-red-600">-${analysis.potentialLoss.at20Percent.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      
      {/* Active Positions Section - moved to bottom */}
      <ActivePositions />
    </div>
  );
};

export default StakingCard;
