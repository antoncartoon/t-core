
import React, { useState } from 'react';
import { TrendingUp, Shield, AlertTriangle, Trophy, Target, Zap, Settings, Building, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { 
  analyzeRiskRange, 
  generateInitialRiskTicks 
} from '@/utils/riskRangeCalculations';
import { 
  calculatePiecewiseAPY, 
  getTierForSegment, 
  calculateBonusYield 
} from '@/utils/tzFormulas';

// Compact risk range visualization for mobile
const MobileRiskVisualization = ({ selectedRange, centerPoint }) => {
  return (
    <div className="space-y-3">
      {/* Compact Risk Band */}
      <div className="relative h-8 bg-muted/30 rounded-lg overflow-hidden">
        {/* Color zones - 4 segments */}
        <div className="absolute inset-0 flex">
          <div className="w-[3%] bg-blue-500/20" />
          <div className="w-[21%] bg-green-500/20" />
          <div className="w-[56%] bg-yellow-500/20" />
          <div className="w-[20%] bg-purple-500/20" />
        </div>
        
        {/* Selected range highlight */}
        <div 
          className="absolute top-0 h-full bg-primary/30 border border-primary transition-all duration-300"
          style={{
            left: `${selectedRange[0]}%`,
            width: `${selectedRange[1] - selectedRange[0]}%`
          }}
        />
        
        {/* Center point marker */}
        <div 
          className="absolute top-1/2 w-2 h-2 bg-primary-foreground rounded-full border border-background shadow transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
          style={{ left: `${centerPoint}%` }}
        />
      </div>
      
      {/* Compact Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-blue-600 font-medium">Safe</span>
        <span className="text-green-600 font-medium">Cons</span>
        <span className="text-yellow-600 font-medium">Bal</span>
        <span className="text-purple-600 font-medium">HERO</span>
      </div>
    </div>
  );
};

const MobileStakingCard = () => {
  const [amount, setAmount] = useState('');
  const [centerPoint, setCenterPoint] = useState(8); // Start Conservative
  const [rangeWidth, setRangeWidth] = useState(14);
  const [isQuickMode, setIsQuickMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getAvailableBalance, createStakingPosition } = useWallet();

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
  
  // Generate risk ticks and analyze the range
  const riskTicks = generateInitialRiskTicks();
  const analysis = stakeAmount > 0 ? analyzeRiskRange(stakeAmount, riskRange, riskTicks) : null;

  // Risk presets - 4 levels with progressive formulas
  const presets = [
    { 
      name: 'Safe', 
      center: 4.5, 
      width: 9, 
      color: 'blue', 
      range: [0, 9],
      icon: Shield,
      description: 'Fixed 5.16%',
      tagline: 'Zero Risk'
    },
    { 
      name: 'Conservative', 
      center: 19.5, 
      width: 19, 
      color: 'green', 
      range: [10, 29],
      icon: Building,
      description: 'Linear 5.16%→7%',
      tagline: 'Low Risk'
    },
    { 
      name: 'Balanced', 
      center: 44.5, 
      width: 29, 
      color: 'yellow', 
      range: [30, 59],
      icon: Scale,
      description: 'Quadratic 7%→9.5%',
      tagline: 'Med Risk'
    },
    { 
      name: 'Hero', 
      center: 79.5, 
      width: 39, 
      color: 'purple', 
      range: [60, 99],
      icon: Trophy,
      description: 'Exponential',
      tagline: 'Max Yield 🦸'
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
      
      // Create position with range-based APY
      const estimatedAPY = analysis?.estimatedAPR || 0.10;
      const positionId = createStakingPosition(stakeAmount, estimatedAPY);
      
      toast({
        title: "NFT Position Created!",
        description: `Position ${positionId.slice(-6)} created in range ${selectedRange[0]}-${selectedRange[1]}.`,
      });
      
      // Reset form
      setAmount('');
      setCenterPoint(8);
      setRangeWidth(14);
    } catch (error) {
      toast({
        title: "Position Creation Failed",
        description: "There was an error creating your position. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Create Position</span>
          <Badge variant="secondary" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Range
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount to Stake (TDD)</label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg h-12"
          />
          <p className="text-xs text-muted-foreground">
            Available: {availableBalance.toFixed(2)} TDD
          </p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[0.25, 0.5, 1].map((percentage, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmount(percentage)}
              className="h-8 text-xs touch-manipulation"
            >
              {percentage === 1 ? 'Max' : `${(percentage * 100)}%`}
            </Button>
          ))}
        </div>

        {/* Risk Range Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Risk Range</label>
            <div className={`flex items-center space-x-1 ${riskColor}`}>
              <span className="text-sm font-medium">{riskLabel}</span>
            </div>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            <Button
              variant={isQuickMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsQuickMode(true)}
              className="flex items-center gap-1 text-xs"
            >
              <Zap className="w-3 h-3" />
              Quick
            </Button>
            <Button
              variant={!isQuickMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsQuickMode(false)}
              className="flex items-center gap-1 text-xs"
            >
              <Settings className="w-3 h-3" />
              Advanced
            </Button>
          </div>
          
          <MobileRiskVisualization
            selectedRange={selectedRange}
            centerPoint={centerPoint}
          />
          
          {/* Quick Mode - Enhanced Presets */}
          {isQuickMode && (
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => {
                const isActive = Math.abs(centerPoint - preset.center) < 5 && Math.abs(rangeWidth - preset.width) < 5;
                const colorClasses = {
                  blue: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-200',
                  green: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-200',
                  yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-200',
                  purple: 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-200'
                };
                
                const IconComponent = preset.icon;
                
                return (
                  <Button
                    key={preset.name}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePresetClick(preset)}
                    className={`h-auto p-3 flex-col text-xs transition-all duration-300 ${
                      !isActive ? colorClasses[preset.color as keyof typeof colorClasses] : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <IconComponent className="w-3 h-3" />
                      <span className="font-medium text-xs">{preset.name}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs opacity-75 font-medium">
                        {preset.tagline}
                      </div>
                      <div className="text-xs opacity-60">
                        {preset.range[0]}-{preset.range[1]}
                      </div>
                      <div className="text-xs font-medium mt-1">
                        {preset.name === 'Safe' ? '5.0%' : analysis ? `${(analysis.estimatedAPR * 100).toFixed(1)}%` : '~12%'}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
          
          {/* Advanced Mode - Compact Sliders */}
          {!isQuickMode && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Center</span>
                  <span className="font-medium">{centerPoint}</span>
                </div>
                <Slider
                  value={[centerPoint]}
                  onValueChange={(value) => setCenterPoint(value[0])}
                  max={99}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Width</span>
                  <span className="font-medium">{rangeWidth}</span>
                </div>
                <Slider
                  value={[rangeWidth]}
                  onValueChange={(value) => setRangeWidth(value[0])}
                  max={50}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Position Preview */}
        {analysis && stakeAmount > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 rounded-lg border border-primary/20">
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span>Est. APY</span>
                  <span className="font-bold text-primary">
                    {(analysis.estimatedAPR * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="underline decoration-dotted cursor-help">Risk</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Risk = (avg_segment/99)²</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="font-medium text-red-600">
                    {(Math.pow(avgRisk / 99, 2) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span>Annual Return</span>
                <span className="font-medium text-green-600">
                  ${(stakeAmount * analysis.estimatedAPR).toFixed(2)}
                </span>
              </div>

              {/* Mini Stress Test */}
              <div className="border-t pt-2">
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-1 rounded text-center">
                    <p className="text-yellow-700 dark:text-yellow-300 font-medium">1%</p>
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                      -${(analysis.potentialLoss?.at5Percent * 0.2 || 0).toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-1 rounded text-center">
                    <p className="text-orange-700 dark:text-orange-300 font-medium">5%</p>
                    <p className="font-semibold text-orange-800 dark:text-orange-200">
                      -${(analysis.potentialLoss?.at5Percent || 0).toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 p-1 rounded text-center">
                    <p className="text-red-700 dark:text-red-300 font-medium">10%</p>
                    <p className="font-semibold text-red-800 dark:text-red-200">
                      -${(analysis.potentialLoss?.at10Percent || 0).toFixed(0)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">TVL Drop Stress Test</p>
              </div>

              {/* Bonus Yield */}
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Bonus Yield Potential</span>
                  <span className="text-xs font-semibold text-green-600">
                    +{(() => {
                      const tierName = getTierForSegment(avgRisk).name.toLowerCase();
                      const currentDistribution = { safe: 0.15, conservative: 0.25, balanced: 0.35, hero: 0.25 };
                      const bonuses = calculateBonusYield(currentDistribution, 0.02);
                      return ((bonuses[tierName] || 0) * 100).toFixed(1);
                    })()}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Warning */}
        {analysis && analysis.riskScore > 50 && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                Higher risk position
              </p>
            </div>
          </div>
        )}

        {/* Create Position Button */}
        <Button 
          onClick={handleStake} 
          disabled={!amount || isLoading || stakeAmount > availableBalance || stakeAmount <= 0}
          className="w-full h-12 touch-manipulation"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Create Position
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobileStakingCard;
