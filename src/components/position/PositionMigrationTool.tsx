
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowRightLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import { NFTPosition } from '@/types/tcore';
import { calculateTCorePersonalAPY } from '@/utils/riskRangeCalculations';

interface Props {
  position: NFTPosition;
  onMigrate: (newRange: { start: number; end: number }) => void;
}

const PositionMigrationTool = ({ position, onMigrate }: Props) => {
  const [targetRange, setTargetRange] = React.useState([
    position.riskRange.start,
    position.riskRange.end
  ]);

  // Calculate APY difference
  const currentAPY = calculateTCorePersonalAPY(position.amount, {
    min: position.riskRange.start,
    max: position.riskRange.end
  });
  
  const newAPY = calculateTCorePersonalAPY(position.amount, {
    min: targetRange[0],
    max: targetRange[1]
  });

  const apyDifference = newAPY - currentAPY;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Position Migration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Current Range: {position.riskRange.start}-{position.riskRange.end}</span>
            <span className="text-muted-foreground">APY: {(currentAPY * 100).toFixed(2)}%</span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Range</label>
            <Slider
              value={targetRange}
              onValueChange={setTargetRange}
              min={1}
              max={100}
              step={1}
              className="my-4"
            />
            <div className="flex justify-between text-sm">
              <span>New Range: {targetRange[0]}-{targetRange[1]}</span>
              <span className="text-muted-foreground">APY: {(newAPY * 100).toFixed(2)}%</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 text-sm ${
            apyDifference >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {apyDifference >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span>
              APY Impact: {apyDifference >= 0 ? '+' : ''}
              {(apyDifference * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full"
            onClick={() => onMigrate({ start: targetRange[0], end: targetRange[1] })}
            disabled={
              targetRange[0] === position.riskRange.start && 
              targetRange[1] === position.riskRange.end
            }
          >
            Migrate Position
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Migration takes effect at the next epoch. No fees applied.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionMigrationTool;
