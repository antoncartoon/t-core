import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  Sankey, 
  Tooltip, 
  Rectangle, 
  Layer 
} from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, RefreshCcw, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { calculateTCoreSubordinationLoss } from '@/utils/riskRangeCalculations';
import { generateTCoreRiskTicks } from '@/utils/riskRangeCalculations';
import { TOTAL_TVL } from '@/utils/protocolConstants';

// Custom node for the Sankey diagram
const CustomNode = ({ x, y, width, height, index, payload, containerWidth }: any) => {
  const isSource = payload.depth === 0;
  const isTarget = payload.targetLinks.length === 0;
  
  // Color nodes based on tier and loss severity
  let fill;
  if (isSource) {
    fill = '#ef4444'; // Loss source - red
  } else {
    // Calculate color based on tier
    const tierMatch = payload.name.match(/Tier (\d+)/);
    if (tierMatch) {
      const tier = parseInt(tierMatch[1]);
      switch (tier) {
        case 4: return <Rectangle x={x} y={y} width={width} height={height} fill="hsl(262.1 83.3% 57.8%)" />; // purple
        case 3: return <Rectangle x={x} y={y} width={width} height={height} fill="hsl(35.5 91.7% 32.9%)" />; // yellow
        case 2: return <Rectangle x={x} y={y} width={width} height={height} fill="hsl(221.2 83.2% 53.3%)" />; // blue
        case 1: return <Rectangle x={x} y={y} width={width} height={height} fill="hsl(142.1 76.2% 36.3%)" />; // green
        default: return <Rectangle x={x} y={y} width={width} height={height} fill="hsl(220 14.3% 95.9%)" />;
      }
    } else if (payload.name.includes('Reserve')) {
      fill = 'hsl(346.8 77.2% 49.8%)'; // Insurance reserve - pink
    } else {
      fill = 'hsl(262.1 83.3% 57.8%)'; // Default - purple
    }
  }

  return <Rectangle x={x} y={y} width={width} height={height} fill={fill} />;
};

const LossCascadeVisualizer = () => {
  const [lossAmount, setLossAmount] = useState<number>(1000000); // Default $1M loss
  const [protocolTVL, setProtocolTVL] = useState<number>(12500000); // Default $12.5M TVL
  const [insuranceReserve, setInsuranceReserve] = useState<number>(625000); // Default 5% reserve

  // Generate risk ticks for simulation
  const riskTicks = generateTCoreRiskTicks();
  
  // Calculate loss distribution using T-Core subordination formula
  const lossDistribution = calculateTCoreSubordinationLoss(lossAmount, riskTicks);
  
  // Calculate tier-level losses by summing individual level losses
  const calculateTierLoss = (tierStart: number, tierEnd: number): number => {
    let tierLoss = 0;
    for (let i = tierStart; i <= tierEnd; i++) {
      tierLoss += lossDistribution[i] || 0;
    }
    return tierLoss;
  };
  
  // Insurance reserve absorbs losses first
  const reserveAbsorption = Math.min(insuranceReserve, lossAmount);
  const remainingLoss = Math.max(0, lossAmount - reserveAbsorption);
  
  // Tier losses after reserve absorption
  const tier4Loss = Math.min(calculateTierLoss(76, 100), remainingLoss);
  const remainingAfterTier4 = Math.max(0, remainingLoss - tier4Loss);
  
  const tier3Loss = Math.min(calculateTierLoss(51, 75), remainingAfterTier4);
  const remainingAfterTier3 = Math.max(0, remainingAfterTier4 - tier3Loss);
  
  const tier2Loss = Math.min(calculateTierLoss(26, 50), remainingAfterTier3);
  const remainingAfterTier2 = Math.max(0, remainingAfterTier3 - tier2Loss);
  
  // Tier 1 is guaranteed in T-Core model, but we include for visualization completeness
  const tier1Loss = Math.min(calculateTierLoss(1, 25), remainingAfterTier2);
  
  // Sankey diagram data
  const data = {
    nodes: [
      { name: 'Total Loss' },
      { name: 'Insurance Reserve' },
      { name: 'Tier 4 (76-100)' },
      { name: 'Tier 3 (51-75)' },
      { name: 'Tier 2 (26-50)' },
      { name: 'Tier 1 (1-25)' },
      { name: 'Absorbed by Reserve' },
      { name: 'Absorbed by Tier 4' },
      { name: 'Absorbed by Tier 3' },
      { name: 'Absorbed by Tier 2' },
      { name: 'Absorbed by Tier 1' },
      { name: 'Unabsorbed Loss' },
    ],
    links: [
      // Initial Loss Distribution
      { source: 0, target: 1, value: reserveAbsorption },
      { source: 0, target: 2, value: tier4Loss },
      { source: 0, target: 3, value: tier3Loss },
      { source: 0, target: 4, value: tier2Loss },
      { source: 0, target: 5, value: tier1Loss },
      
      // Absorption Paths
      { source: 1, target: 6, value: reserveAbsorption },
      { source: 2, target: 7, value: tier4Loss },
      { source: 3, target: 8, value: tier3Loss },
      { source: 4, target: 9, value: tier2Loss },
      { source: 5, target: 10, value: tier1Loss },
      
      // If there's still unabsorbed loss (should be rare in T-Core model)
      { source: 0, target: 11, value: Math.max(0, lossAmount - reserveAbsorption - tier4Loss - tier3Loss - tier2Loss - tier1Loss) },
    ].filter(link => link.value > 0) // Remove links with 0 value
  };
  
  // Calculate loss coverage percentage
  const totalAbsorbed = reserveAbsorption + tier4Loss + tier3Loss + tier2Loss + tier1Loss;
  const coveragePercentage = (totalAbsorbed / lossAmount) * 100;
  
  const resetSimulation = () => {
    setLossAmount(1000000);
    setProtocolTVL(TOTAL_TVL);
    setInsuranceReserve(625000);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Loss Cascade Visualizer
          </CardTitle>
          <Badge 
            variant="outline" 
            className={coveragePercentage >= 99.9 
              ? "bg-green-500/10 text-green-600" 
              : coveragePercentage >= 90 
                ? "bg-yellow-500/10 text-yellow-600" 
                : "bg-red-500/10 text-red-600"
            }
          >
            {coveragePercentage.toFixed(1)}% Covered
          </Badge>
        </div>
        <CardDescription>
          Visualizes how losses cascade through T-Core's subordination tiers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Simulation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Loss Amount (USD)</label>
            <Slider
              value={[lossAmount]}
              onValueChange={(values) => setLossAmount(values[0])}
              min={100000}
              max={3000000}
              step={100000}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$100K</span>
              <span>${(lossAmount / 1000000).toFixed(1)}M</span>
              <span>$3M</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Protocol TVL (USD)</label>
            <Slider
              value={[protocolTVL]}
              onValueChange={(values) => {
                setProtocolTVL(values[0]);
                // Update insurance reserve to maintain 5% of TVL
                setInsuranceReserve(values[0] * 0.05);
              }}
              min={5000000}
              max={25000000}
              step={1000000}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$5M</span>
              <span>${(protocolTVL / 1000000).toFixed(1)}M</span>
              <span>$25M</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Insurance Reserve (USD)</label>
            <Slider
              value={[insuranceReserve]}
              onValueChange={(values) => setInsuranceReserve(values[0])}
              min={100000}
              max={2000000}
              step={100000}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$100K</span>
              <span>${(insuranceReserve / 1000000).toFixed(2)}M</span>
              <span>$2M</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetSimulation}
          className="flex items-center gap-1"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Reset Simulation
        </Button>
        
        {/* Sankey Diagram */}
        <div className="h-[400px] w-full border rounded-lg p-4 bg-muted/20">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={data}
              node={<CustomNode />}
              link={{ stroke: '#d1d5db', strokeOpacity: 0.2, fill: 'none' }}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              nodePadding={50}
            >
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const { name, value } = payload[0];
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${Number(value).toLocaleString()} 
                          ({((Number(value) / lossAmount) * 100).toFixed(1)}% of loss)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Sankey>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-green-500/10 rounded-md border border-green-200 dark:border-green-900">
            <p className="text-xs text-muted-foreground mb-1">Reserve Absorption</p>
            <p className="font-medium text-green-600 dark:text-green-400">
              ${reserveAbsorption.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-md border border-purple-200 dark:border-purple-900">
            <p className="text-xs text-muted-foreground mb-1">Tier 4 Absorption</p>
            <p className="font-medium text-purple-600 dark:text-purple-400">
              ${tier4Loss.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-md border border-yellow-200 dark:border-yellow-900">
            <p className="text-xs text-muted-foreground mb-1">Tier 3 Absorption</p>
            <p className="font-medium text-yellow-600 dark:text-yellow-400">
              ${tier3Loss.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-md border border-blue-200 dark:border-blue-900">
            <p className="text-xs text-muted-foreground mb-1">Tier 2 Absorption</p>
            <p className="font-medium text-blue-600 dark:text-blue-400">
              ${tier2Loss.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-md text-sm space-y-2">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium">T-Core Subordination Model</p>
              <p className="text-xs text-muted-foreground">
                In the T-Core protocol, losses are absorbed in a waterfall structure: first by the insurance reserve (funded by 25% of performance fees), then by higher risk tiers (76-100), followed by mid-risk tiers (51-75), and finally by lower risk tiers (26-50). Tier 1 (1-25) is protected by T-Bill backing and rarely experiences losses.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LossCascadeVisualizer;