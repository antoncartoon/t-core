import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ChartLine, 
  ChevronRight, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  BarChart4 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NFTPosition } from '@/types/tcore';
import { calculateTCorePersonalAPY } from '@/utils/riskRangeCalculations';
import { DISTRIBUTION_PARAMS } from '@/utils/tcoreCalculations';
import { toast } from 'sonner';

interface MarketCondition {
  name: string;
  description: string;
  riskStrategy: 'defensive' | 'balanced' | 'aggressive';
  suggestedRanges: Array<{ name: string; range: [number, number]; reasoning: string }>;
}

interface Props {
  position: NFTPosition;
  onRebalanceAccept: (newRange: { start: number; end: number }) => void;
}

const PositionRebalancingAdvisor: React.FC<Props> = ({ position, onRebalanceAccept }) => {
  // Market conditions simulation (in a real implementation, this would come from protocol data)
  const marketConditions: MarketCondition[] = [
    {
      name: 'Stable Growth',
      description: 'Market shows steady growth with minimal volatility',
      riskStrategy: 'balanced',
      suggestedRanges: [
        { 
          name: 'Balanced', 
          range: [30, 70], 
          reasoning: 'Balance risk and reward in stable conditions' 
        },
        { 
          name: 'Split', 
          range: [15, 85], 
          reasoning: 'Diversify across fixed and variable tiers' 
        }
      ]
    },
    {
      name: 'High Volatility',
      description: 'Market experiencing significant price swings',
      riskStrategy: 'defensive',
      suggestedRanges: [
        { 
          name: 'Safe Harbor', 
          range: [1, 25], 
          reasoning: 'Prioritize guaranteed tier1 returns' 
        },
        { 
          name: 'Cautious', 
          range: [10, 40], 
          reasoning: 'Focus on lower tiers with some exposure to bonus' 
        }
      ]
    },
    {
      name: 'Bull Market',
      description: 'Strong upward trend with high yields available',
      riskStrategy: 'aggressive',
      suggestedRanges: [
        { 
          name: 'High Yield', 
          range: [76, 100], 
          reasoning: 'Maximize exposure to surplus distribution' 
        },
        { 
          name: 'Growth Plus', 
          range: [50, 90], 
          reasoning: 'Target medium to high bonus tiers' 
        }
      ]
    }
  ];

  // Current simulation uses the first market condition
  const [currentMarket, setCurrentMarket] = useState<MarketCondition>(marketConditions[0]);
  const [selectedRange, setSelectedRange] = useState<[number, number]>([
    position.riskRange.start,
    position.riskRange.end
  ]);
  const [recommendedRange, setRecommendedRange] = useState<[number, number]>(
    currentMarket.suggestedRanges[0].range
  );

  // Calculate APYs for comparison
  const currentAPY = calculateTCorePersonalAPY(position.amount, {
    min: position.riskRange.start,
    max: position.riskRange.end
  });
  
  const recommendedAPY = calculateTCorePersonalAPY(position.amount, {
    min: recommendedRange[0],
    max: recommendedRange[1]
  });

  const selectedAPY = calculateTCorePersonalAPY(position.amount, {
    min: selectedRange[0],
    max: selectedRange[1]
  });

  const apyDifference = recommendedAPY - currentAPY;

  // Simulate different market conditions
  useEffect(() => {
    // In a real implementation, this would fetch current market conditions
    const intervalId = setInterval(() => {
      const nextMarketIndex = (marketConditions.indexOf(currentMarket) + 1) % marketConditions.length;
      setCurrentMarket(marketConditions[nextMarketIndex]);
      setRecommendedRange(marketConditions[nextMarketIndex].suggestedRanges[0].range);
    }, 10000); // Change market conditions every 10 seconds for demo
    
    return () => clearInterval(intervalId);
  }, [currentMarket, marketConditions]);

  // Get risk strategy color
  const getRiskStrategyColor = (strategy: string): string => {
    switch (strategy) {
      case 'defensive': return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
      case 'balanced': return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
      case 'aggressive': return 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleSelectRecommendation = (range: [number, number]) => {
    setSelectedRange(range);
  };

  const handleAcceptRebalance = () => {
    onRebalanceAccept({ start: selectedRange[0], end: selectedRange[1] });
    toast.success('Rebalance request submitted for next epoch');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5" />
            Position Rebalancing Advisor
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${getRiskStrategyColor(currentMarket.riskStrategy)}`}
          >
            {currentMarket.name}
          </Badge>
        </div>
        <CardDescription>
          {currentMarket.description}. Our AI suggests rebalancing your position for optimal returns.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Current Position</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/40 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Range</p>
              <p className="font-medium">{position.riskRange.start}-{position.riskRange.end}</p>
            </div>
            <div className="p-3 bg-muted/40 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Estimated APY</p>
              <p className="font-medium">{(currentAPY * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Recommended Rebalancing</h3>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              +{(apyDifference * 100).toFixed(2)}% APY
            </Badge>
          </div>
          
          <div className="grid gap-3">
            {currentMarket.suggestedRanges.map((suggestion, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  JSON.stringify(selectedRange) === JSON.stringify(suggestion.range) 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleSelectRecommendation(suggestion.range)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {suggestion.name === 'High Yield' && <TrendingUp className="h-4 w-4 text-purple-500" />}
                    {suggestion.name === 'Safe Harbor' && <ShieldCheck className="h-4 w-4 text-green-500" />}
                    {suggestion.name === 'Balanced' && <ChartLine className="h-4 w-4 text-blue-500" />}
                    <span className="font-medium">{suggestion.name}</span>
                  </div>
                  <span className="text-sm">
                    {suggestion.range[0]}-{suggestion.range[1]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
                <div className="mt-2 text-xs">
                  <span className="text-primary font-medium">
                    {(calculateTCorePersonalAPY(position.amount, {
                      min: suggestion.range[0],
                      max: suggestion.range[1]
                    }) * 100).toFixed(2)}% APY
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Range</label>
          <Slider
            value={selectedRange}
            onValueChange={setSelectedRange as any}
            min={1}
            max={100}
            step={1}
            className="my-4"
          />
          <div className="flex justify-between text-sm">
            <span>Range: {selectedRange[0]}-{selectedRange[1]}</span>
            <span className="text-muted-foreground">APY: {(selectedAPY * 100).toFixed(2)}%</span>
          </div>
        </div>

        <div className="bg-muted/30 p-3 rounded-md text-sm space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium">Rebalancing Information</p>
              <p className="text-xs text-muted-foreground">
                Rebalancing takes effect at the next epoch. A performance fee of {DISTRIBUTION_PARAMS.PERFORMANCE_FEE * 100}% 
                applies to any yields generated prior to rebalancing. This fee is allocated to protocol insurance, 
                bonus yield, buyback, and operations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleAcceptRebalance}
          disabled={
            selectedRange[0] === position.riskRange.start && 
            selectedRange[1] === position.riskRange.end
          }
        >
          <ChevronRight className="mr-1 h-4 w-4" />
          Accept Rebalance Recommendation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PositionRebalancingAdvisor;