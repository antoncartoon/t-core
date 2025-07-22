
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { TIER_DEFINITIONS } from '@/types/riskTiers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowDown } from 'lucide-react';

interface TierLossResult {
  name: string;
  key: string;
  originalAmount: number;
  lossAmount: number;
  lossPercentage: number;
  remainingAmount: number;
  color: string;
}

interface LossCascadeSimulatorProps {
  userPositions?: any[];
}

const LossCascadeSimulator: React.FC<LossCascadeSimulatorProps> = ({ userPositions }) => {
  const [lossPercentage, setLossPercentage] = useState<number>(5);
  const [userPosition, setUserPosition] = useState<string>('BALANCED'); // SAFE, CONSERVATIVE, BALANCED, HERO
  
  // Initial liquidity distribution across tiers (in TDD)
  const initialLiquidity = {
    HERO: 1_000_000, // 1M
    BALANCED: 3_000_000, // 3M
    CONSERVATIVE: 2_000_000, // 2M
    SAFE: 1_000_000, // 1M
  };
  
  // Total protocol TVL
  const totalTVL = Object.values(initialLiquidity).reduce((sum, value) => sum + value, 0);
  
  // Calculate loss amounts for each tier
  const calculateLosses = (): TierLossResult[] => {
    const totalLossAmount = (totalTVL * lossPercentage) / 100;
    let remainingLoss = totalLossAmount;
    
    // Color scheme for tiers
    const tierColors = {
      HERO: '#c084fc', // purple-400
      BALANCED: '#facc15', // yellow-400
      CONSERVATIVE: '#60a5fa', // blue-400
      SAFE: '#4ade80', // green-400
    };
    
    // Process tiers in reverse order (HERO first, then BALANCED, etc.)
    const results: TierLossResult[] = [];
    const tierOrder = ['HERO', 'BALANCED', 'CONSERVATIVE', 'SAFE'];
    
    for (const tier of tierOrder) {
      const tierLiquidity = initialLiquidity[tier as keyof typeof initialLiquidity];
      const lossForTier = Math.min(remainingLoss, tierLiquidity);
      const lossPercentageForTier = (lossForTier / tierLiquidity) * 100;
      
      results.push({
        name: TIER_DEFINITIONS[tier as keyof typeof TIER_DEFINITIONS].name,
        key: tier,
        originalAmount: tierLiquidity,
        lossAmount: lossForTier,
        lossPercentage: lossPercentageForTier,
        remainingAmount: tierLiquidity - lossForTier,
        color: tierColors[tier as keyof typeof tierColors]
      });
      
      remainingLoss -= lossForTier;
      if (remainingLoss <= 0) break;
    }
    
    // Fill in remaining tiers with zero loss
    for (let i = results.length; i < tierOrder.length; i++) {
      const tier = tierOrder[i];
      const tierLiquidity = initialLiquidity[tier as keyof typeof initialLiquidity];
      
      results.push({
        name: TIER_DEFINITIONS[tier as keyof typeof TIER_DEFINITIONS].name,
        key: tier,
        originalAmount: tierLiquidity,
        lossAmount: 0,
        lossPercentage: 0,
        remainingAmount: tierLiquidity,
        color: tierColors[tier as keyof typeof tierColors]
      });
    }
    
    return results;
  };
  
  const losses = calculateLosses();
  
  // Calculate user impact based on selected position tier
  const calculateUserImpact = () => {
    const userTier = losses.find(tier => tier.key === userPosition);
    if (!userTier) return null;
    
    const userLossPercentage = userTier.lossPercentage;
    const userInvestment = 10000; // Example $10,000 investment
    const userLoss = (userInvestment * userLossPercentage) / 100;
    
    return {
      investmentAmount: userInvestment,
      lossAmount: userLoss,
      lossPercentage: userLossPercentage,
      remainingAmount: userInvestment - userLoss,
    };
  };
  
  const userImpact = calculateUserImpact();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Loss Cascade Simulator
        </CardTitle>
        <CardDescription>
          Visualize how losses affect different risk tiers in the waterfall model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <AlertDescription className="text-sm">
            In the waterfall model, losses are absorbed from highest to lowest risk tiers. Hero tier absorbs losses first, protecting lower tiers.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Protocol Loss Percentage</h3>
            <span className="font-bold text-red-500">{lossPercentage}%</span>
          </div>
          <Slider
            value={[lossPercentage]}
            min={1}
            max={20}
            step={1}
            onValueChange={(value) => setLossPercentage(value[0])}
            className="my-4"
          />
          <div className="text-xs text-muted-foreground">
            Total Loss Amount: ${((totalTVL * lossPercentage) / 100).toLocaleString()} of ${totalTVL.toLocaleString()} TVL
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Your Position Tier</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(TIER_DEFINITIONS).map((tier) => (
              <Button
                key={tier}
                variant={userPosition === tier ? "default" : "outline"}
                className={`h-auto py-2 ${userPosition === tier ? "" : "border-gray-200"}`}
                onClick={() => setUserPosition(tier)}
              >
                <div className="text-xs">
                  {TIER_DEFINITIONS[tier as keyof typeof TIER_DEFINITIONS].name}
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Loss cascade visualization */}
        <div className="space-y-4 mt-6">
          <h3 className="text-sm font-medium">Loss Absorption By Tier</h3>
          <div className="space-y-6">
            {losses.map((tier, index) => (
              <div key={tier.key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: tier.color }}
                    />
                    <span>{tier.name} Tier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">${tier.originalAmount.toLocaleString()}</span>
                    {tier.lossAmount > 0 && (
                      <span className="text-red-500">
                        -{tier.lossPercentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="h-8 w-full bg-muted rounded-md overflow-hidden flex">
                  <div 
                    className="h-full bg-red-200 dark:bg-red-900/30 flex items-center justify-start px-2 text-xs text-red-700 dark:text-red-300"
                    style={{ width: `${tier.lossPercentage}%` }}
                  >
                    {tier.lossAmount > 0 ? `-$${tier.lossAmount.toLocaleString()}` : ''}
                  </div>
                  <div 
                    className="h-full flex items-center px-2 text-xs"
                    style={{ 
                      backgroundColor: `${tier.color}40`, // Adding transparency
                      width: `${100 - tier.lossPercentage}%` 
                    }}
                  >
                    ${tier.remainingAmount.toLocaleString()}
                  </div>
                </div>
                
                {index < losses.length - 1 && tier.lossAmount >= tier.originalAmount && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* User impact */}
        {userImpact && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-3 mt-4">
            <h3 className="text-sm font-medium">Your Position Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Investment Amount</span>
                <span>${userImpact.investmentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Loss Amount</span>
                <span className={userImpact.lossAmount > 0 ? "text-red-500" : "text-green-500"}>
                  {userImpact.lossAmount > 0 ? `-$${userImpact.lossAmount.toFixed(2)}` : '$0.00'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining Value</span>
                <span className="font-medium">${userImpact.remainingAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              Formula: Loss = min(residual_loss, user_position) / user_position
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LossCascadeSimulator;
