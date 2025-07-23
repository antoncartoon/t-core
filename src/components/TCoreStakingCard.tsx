import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTCore } from '@/contexts/TCoreContext';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { LITE_TEMPLATES, StakingMode, RiskRange } from '@/types/tcore';
import { simulateScenarios } from '@/utils/tcoreCalculations';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { LiteModeSelector } from './LiteModeSelector';
import { ProModeSelector } from './ProModeSelector';
import { YieldSimulator } from './YieldSimulator';

export const TCoreStakingCard = () => {
  const { 
    createNFTPosition, 
    stakingMode, 
    setStakingMode,
    tcoreState 
  } = useTCore();
  const { getAvailableBalance } = useWallet();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState(LITE_TEMPLATES[0]);
  const [customRange, setCustomRange] = useState<RiskRange>({ start: 1, end: 20 });
  const [isLoading, setIsLoading] = useState(false);

  const tddBalance = getAvailableBalance('TDD');
  const numericAmount = parseFloat(amount) || 0;

  // Get active risk range based on mode
  const activeRiskRange = stakingMode === 'lite' ? selectedTemplate.riskRange : customRange;

  // Simulate scenarios for current selection
  const scenarios = numericAmount > 0 ? simulateScenarios(
    numericAmount,
    activeRiskRange,
    tcoreState.liquidityTicks,
    tcoreState.protocolParams
  ) : [];

  const handleStake = async () => {
    if (numericAmount <= 0 || numericAmount > tddBalance) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount within your balance.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const tokenId = createNFTPosition(numericAmount, activeRiskRange);
      
      if (tokenId) {
        toast({
          title: "NFT Position Created!",
          description: `Successfully created position #${tokenId.slice(-6)} for ${numericAmount} TDD in risk levels ${activeRiskRange.start}-${activeRiskRange.end}`,
        });
        setAmount('');
      } else {
        toast({
          title: "Failed to create position",
          description: "Please check your balance and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create NFT position",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (tddBalance * percentage).toFixed(2);
    setAmount(quickAmount);
  };

  return (
    <Card className="bg-background/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          T-CORE Liquidity Position
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Stake TDD across 100 risk levels and mint an NFT representing your position
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
              className="text-lg"
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

        {/* Mode Selection */}
        <Tabs value={stakingMode} onValueChange={(value) => setStakingMode(value as StakingMode)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lite" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Lite Mode
            </TabsTrigger>
            <TabsTrigger value="pro" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pro Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lite" className="space-y-4">
            <LiteModeSelector 
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          </TabsContent>

          <TabsContent value="pro" className="space-y-4">
            <ProModeSelector 
              riskRange={customRange}
              onRangeChange={setCustomRange}
              liquidityTicks={tcoreState.liquidityTicks}
            />
          </TabsContent>
        </Tabs>

        {/* Current Selection Summary */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Selected Range:</span>
            <Badge variant="outline">
              Levels {activeRiskRange.start} - {activeRiskRange.end}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Range Size:</span>
            <span className="text-sm">{activeRiskRange.end - activeRiskRange.start + 1} levels</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Expected APY:</span>
            <span className="text-sm font-semibold text-primary">
              {stakingMode === 'lite' ? `${(selectedTemplate.expectedAPY * 100).toFixed(1)}%` : '8-25%'}
            </span>
          </div>
        </div>

        {/* Yield Simulator */}
        {numericAmount > 0 && (
          <YieldSimulator 
            amount={numericAmount}
            riskRange={activeRiskRange}
            scenarios={scenarios}
          />
        )}

        {/* Risk Warnings */}
        {activeRiskRange.end >= 80 && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">High Risk Warning</p>
              <p className="text-muted-foreground">
                Positions in levels 80+ are first to absorb losses during protocol stress events.
              </p>
            </div>
          </div>
        )}

        {/* Stake Button */}
        <Button
          onClick={handleStake}
          disabled={isLoading || numericAmount <= 0 || numericAmount > tddBalance}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            'Creating NFT Position...'
          ) : (
            `Create NFT Position (${numericAmount.toFixed(2)} TDD)`
          )}
        </Button>

        {/* Protocol Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Protocol TVL</p>
            <p className="font-semibold">${tcoreState.totalTVL.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Reserve Coverage</p>
            <p className="font-semibold text-primary">
              {((tcoreState.protocolParams.reserveAmount / Math.max(tcoreState.totalTVL, 1)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};