import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RiskRange } from '@/types/tcore';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';

interface SimulationScenario {
  scenario: string;
  expectedReturn: number;
  finalAPY: number;
  maxLoss: number;
  netAmount: number;
}

interface YieldSimulatorProps {
  amount: number;
  riskRange: RiskRange;
  scenarios: SimulationScenario[];
}

export const YieldSimulator: React.FC<YieldSimulatorProps> = ({
  amount,
  riskRange,
  scenarios
}) => {
  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'Bull Market': return TrendingUp;
      case 'Normal Market': return DollarSign;
      case 'Bear Market': return TrendingDown;
      case 'Crisis': return AlertTriangle;
      default: return DollarSign;
    }
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'Bull Market': return 'text-green-500';
      case 'Normal Market': return 'text-blue-500';
      case 'Bear Market': return 'text-orange-500';
      case 'Crisis': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const getScenarioBadgeVariant = (scenario: string) => {
    switch (scenario) {
      case 'Bull Market': return 'default';
      case 'Normal Market': return 'secondary';
      case 'Bear Market': return 'secondary';
      case 'Crisis': return 'destructive';
      default: return 'secondary';
    }
  };

  if (scenarios.length === 0) return null;

  return (
    <Card className="bg-muted/30 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Yield Simulation
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Projected outcomes for {amount.toFixed(2)} TDD in risk levels {riskRange.start}-{riskRange.end}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {scenarios.map((sim, index) => {
          const Icon = getScenarioIcon(sim.scenario);
          const isPositive = sim.expectedReturn >= 0;
          const returnPercentage = (sim.expectedReturn / amount) * 100;
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${getScenarioColor(sim.scenario)}`} />
                  <span className="font-medium text-sm">{sim.scenario}</span>
                </div>
                <Badge 
                  variant={getScenarioBadgeVariant(sim.scenario)}
                  className="text-xs"
                >
                  {sim.finalAPY >= 0 ? '+' : ''}{(sim.finalAPY * 100).toFixed(1)}% APY
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Expected Return</p>
                  <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}${sim.expectedReturn.toFixed(2)}
                  </p>
                  <p className={`text-xs ${isPositive ? 'text-green-600/70' : 'text-red-600/70'}`}>
                    {isPositive ? '+' : ''}{returnPercentage.toFixed(1)}%
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Final Amount</p>
                  <p className="font-medium">
                    ${sim.netAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total value
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Max Loss</p>
                  <p className="font-medium text-red-600">
                    -${sim.maxLoss.toFixed(2)}
                  </p>
                  <p className="text-xs text-red-600/70">
                    -{((sim.maxLoss / amount) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress bar showing potential range */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Risk/Reward Profile</span>
                  <span>
                    {isPositive ? 'Profitable' : 'Loss'} scenario
                  </span>
                </div>
                <Progress 
                  value={Math.abs(returnPercentage)} 
                  className={`h-2 ${isPositive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}
                />
              </div>

              {index < scenarios.length - 1 && <div className="border-b border-border/50" />}
            </div>
          );
        })}

        {/* Risk Summary */}
        <div className="pt-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground">Best Case (Bull)</p>
              <p className="font-medium text-green-600">
                +${scenarios[0]?.expectedReturn.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Worst Case (Crisis)</p>
              <p className="font-medium text-red-600">
                -${scenarios[scenarios.length - 1]?.maxLoss.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
          
          <div className="mt-3 p-2 rounded bg-muted/50 border border-border/50">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Simulations based on historical data and current liquidity distribution. 
              Actual results may vary. Level 1 positions have guaranteed minimum returns.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};