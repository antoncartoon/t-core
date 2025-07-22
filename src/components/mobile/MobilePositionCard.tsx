
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Calendar, Settings, ChevronRight, Shield } from 'lucide-react';
import { NFTPosition } from '@/types/tcore';
import { calculateTCorePersonalAPY } from '@/utils/riskRangeCalculations';
import AnimatedCounter from '../AnimatedCounter';

interface MobilePositionCardProps {
  position: NFTPosition;
  onManage: (position: NFTPosition) => void;
  onRebalance: (position: NFTPosition) => void;
}

const MobilePositionCard: React.FC<MobilePositionCardProps> = ({
  position,
  onManage,
  onRebalance
}) => {
  const apy = calculateTCorePersonalAPY(position.amount, {
    min: position.riskRange.start,
    max: position.riskRange.end
  });
  
  const percentChange = ((position.currentValue - position.amount) / position.amount) * 100;
  const isPositive = percentChange >= 0;
  
  // Helper to determine risk level color
  const getRiskColor = () => {
    const avgRisk = (position.riskRange.start + position.riskRange.end) / 2;
    if (avgRisk <= 25) return 'bg-green-500/10 text-green-600';
    if (avgRisk <= 50) return 'bg-blue-500/10 text-blue-600';
    if (avgRisk <= 75) return 'bg-yellow-500/10 text-yellow-600';
    return 'bg-red-500/10 text-red-600';
  };
  
  // Get tier based on risk range
  const getTier = () => {
    const avgRisk = (position.riskRange.start + position.riskRange.end) / 2;
    if (avgRisk <= 25) return 'Tier 1';
    if (avgRisk <= 50) return 'Tier 2';
    if (avgRisk <= 75) return 'Tier 3';
    return 'Tier 4';
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getRiskColor()}>
              {getTier()}
            </Badge>
            <span className="text-xs text-muted-foreground">
              ID: {position.tokenId.slice(0, 6)}...
            </span>
          </div>
          <Badge variant={position.status === 'active' ? 'default' : 'outline'}>
            {position.status}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Current Value</p>
            <p className="text-lg font-semibold">
              $<AnimatedCounter 
                end={position.currentValue}
                decimals={2}
              />
            </p>
          </div>
          
          <div className={`flex items-center gap-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            <span className="font-medium">
              {Math.abs(percentChange).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Staked</p>
            <p className="font-medium">${position.amount}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">APY</p>
            <p className="font-medium text-primary">{(apy * 100).toFixed(2)}%</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Earned</p>
            <p className="font-medium text-green-600">${position.earnedAmount.toFixed(2)}</p>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="mb-3">
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger className="py-2">
              <span className="text-sm">Position Details</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Risk Range</span>
                  <span className="text-xs">{position.riskRange.start}-{position.riskRange.end}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span>{((position.riskRange.start + position.riskRange.end) / 2).toFixed(0)}/100</span>
                  </div>
                  <Progress
                    value={(position.riskRange.start + position.riskRange.end) / 2}
                    max={100}
                    className="h-1.5"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>{position.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Protection</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Shield className="h-3 w-3 text-green-600" />
                    <span>{position.riskRange.start <= 25 ? 'Guaranteed' : 'Partial'}</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 flex items-center justify-center gap-1"
            onClick={() => onManage(position)}
          >
            <Settings className="h-3.5 w-3.5" />
            Manage
          </Button>
          
          <Button 
            variant="default"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1"
            onClick={() => onRebalance(position)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
            Rebalance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobilePositionCard;
