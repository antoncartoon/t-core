
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTCore } from '@/contexts/TCoreContext';
import { Shield, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';
import { WaterfallYieldChart } from './WaterfallYieldChart';

const RISK_TIERS = [
  {
    id: 'safe',
    name: 'Safe',
    range: { start: 1, end: 9 },
    icon: Shield,
    color: 'bg-green-100 text-green-800 border-green-300',
    hoverColor: 'hover:bg-green-200',
    description: 'Guaranteed T-Bills yield + bonus',
    minAPY: 6.0,
    maxAPY: 8.5
  },
  {
    id: 'conservative',
    name: 'Conservative',
    range: { start: 10, end: 29 },
    icon: Target,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    hoverColor: 'hover:bg-blue-200',
    description: 'Moderate risk with steady returns',
    minAPY: 8.5,
    maxAPY: 12.0
  },
  {
    id: 'balanced',
    name: 'Balanced',
    range: { start: 30, end: 59 },
    icon: TrendingUp,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    hoverColor: 'hover:bg-yellow-200',
    description: 'Higher yield potential with moderate risk',
    minAPY: 12.0,
    maxAPY: 20.0
  },
  {
    id: 'hero',
    name: 'Hero',
    range: { start: 60, end: 99 },
    icon: Zap,
    color: 'bg-red-100 text-red-800 border-red-300',
    hoverColor: 'hover:bg-red-200',
    description: 'Maximum yield potential, absorbs losses first',
    minAPY: 20.0,
    maxAPY: 35.0
  }
];

export const SimplifiedStakingInterface = () => {
  const { getAvailableBalance, createNFTPosition, tcoreState } = useTCore();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [isStaking, setIsStaking] = useState(false);

  const tddBalance = getAvailableBalance('TDD');
  const numericAmount = parseFloat(amount) || 0;

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  const handleStake = async () => {
    if (!selectedTier || numericAmount <= 0 || numericAmount > tddBalance) {
      toast({
        title: "Invalid parameters",
        description: "Please select a tier and enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const tier = RISK_TIERS.find(t => t.id === selectedTier);
    if (!tier) return;

    setIsStaking(true);
    
    try {
      const tokenId = createNFTPosition(numericAmount, tier.range);
      
      if (tokenId) {
        toast({
          title: "Position Created!",
          description: `Successfully staked ${numericAmount} TDD in ${tier.name} tier (levels ${tier.range.start}-${tier.range.end})`,
        });
        setAmount('');
        setSelectedTier('');
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

  const selectedTierData = RISK_TIERS.find(t => t.id === selectedTier);

  return (
    <div className="space-y-6">
      {/* Waterfall Yield Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Risk Yield Distribution
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Visual representation of how yield flows through risk tiers
          </p>
        </CardHeader>
        <CardContent>
          <WaterfallYieldChart selectedTier={selectedTier} />
        </CardContent>
      </Card>

      {/* Simplified Staking Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Stake TDD Tokens</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose your risk tier and stake TDD to start earning yield
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

          {/* Risk Tier Selection */}
          <div className="space-y-3">
            <Label>Select Risk Tier</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RISK_TIERS.map((tier) => {
                const Icon = tier.icon;
                const isSelected = selectedTier === tier.id;
                
                return (
                  <Button
                    key={tier.id}
                    variant="outline"
                    onClick={() => handleTierSelect(tier.id)}
                    className={`h-auto p-4 border-2 transition-all ${
                      isSelected 
                        ? `${tier.color} border-current` 
                        : `hover:border-gray-300 ${tier.hoverColor}`
                    }`}
                  >
                    <div className="w-full text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{tier.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tier.range.start}-{tier.range.end}
                        </Badge>
                      </div>
                      <p className="text-xs opacity-70">
                        {tier.description}
                      </p>
                      <div className="text-xs font-medium">
                        APY: {tier.minAPY}% - {tier.maxAPY}%
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Selected Tier Preview */}
          {selectedTierData && numericAmount > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-medium mb-2">Staking Preview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tier:</span>
                  <span className="font-medium">{selectedTierData.name} (levels {selectedTierData.range.start}-{selectedTierData.range.end})</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">{numericAmount.toFixed(2)} TDD</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected APY:</span>
                  <span className="font-medium text-primary">
                    {selectedTierData.minAPY}% - {selectedTierData.maxAPY}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Estimated yearly return:</span>
                  <span>
                    {(numericAmount * selectedTierData.minAPY / 100).toFixed(2)} - {(numericAmount * selectedTierData.maxAPY / 100).toFixed(2)} TDD
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Risk Warning for Hero tier */}
          {selectedTier === 'hero' && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive">High Risk Warning</p>
                <p className="text-muted-foreground">
                  Hero tier positions absorb losses first during protocol stress events but earn the highest yields during good performance.
                </p>
              </div>
            </div>
          )}

          {/* Stake Button */}
          <Button
            onClick={handleStake}
            disabled={isStaking || !selectedTier || numericAmount <= 0 || numericAmount > tddBalance}
            className="w-full h-12"
            size="lg"
          >
            {isStaking ? (
              'Creating Position...'
            ) : (
              `Stake ${numericAmount.toFixed(2)} TDD${selectedTierData ? ` in ${selectedTierData.name}` : ''}`
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
              <p className="font-semibold">{tcoreState.positions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
