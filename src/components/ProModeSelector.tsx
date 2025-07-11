import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskRange, LiquidityTick } from '@/types/tcore';
import { calculateConcentrationRisk } from '@/utils/tcoreCalculations';
import { BarChart3, TrendingUp, AlertTriangle, Info } from 'lucide-react';

interface ProModeSelectorProps {
  riskRange: RiskRange;
  onRangeChange: (range: RiskRange) => void;
  liquidityTicks: LiquidityTick[];
}

export const ProModeSelector: React.FC<ProModeSelectorProps> = ({
  riskRange,
  onRangeChange,
  liquidityTicks
}) => {
  const [sliderValues, setSliderValues] = useState([riskRange.start, riskRange.end]);

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    onRangeChange({ start: values[0], end: values[1] });
  };

  const handleManualInput = (field: 'start' | 'end', value: string) => {
    const numValue = parseInt(value) || (field === 'start' ? 1 : 100);
    const clampedValue = Math.max(1, Math.min(100, numValue));
    
    const newRange = {
      start: field === 'start' ? clampedValue : riskRange.start,
      end: field === 'end' ? clampedValue : riskRange.end
    };

    // Ensure start <= end
    if (newRange.start > newRange.end) {
      if (field === 'start') {
        newRange.end = newRange.start;
      } else {
        newRange.start = newRange.end;
      }
    }

    setSliderValues([newRange.start, newRange.end]);
    onRangeChange(newRange);
  };

  const rangeSize = riskRange.end - riskRange.start + 1;
  const concentrationRisk = calculateConcentrationRisk(riskRange);
  
  // Calculate liquidity in selected range
  const rangeLiquidity = liquidityTicks
    .filter(tick => tick.riskLevel >= riskRange.start && tick.riskLevel <= riskRange.end)
    .reduce((sum, tick) => sum + tick.totalLiquidity, 0);

  const totalLiquidity = liquidityTicks.reduce((sum, tick) => sum + tick.totalLiquidity, 0);
  const rangeUtilization = totalLiquidity > 0 ? (rangeLiquidity / totalLiquidity) * 100 : 0;

  // Preset ranges for quick selection
  const presetRanges = [
    { name: 'Ultra Safe', range: { start: 1, end: 5 }, description: 'Maximum protection' },
    { name: 'Low Risk', range: { start: 1, end: 30 }, description: 'Conservative with some upside' },
    { name: 'Mid Risk', range: { start: 25, end: 75 }, description: 'Balanced exposure' },
    { name: 'High Risk', range: { start: 70, end: 95 }, description: 'Aggressive growth' },
    { name: 'Max Risk', range: { start: 95, end: 100 }, description: 'Maximum yield potential' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Advanced mode: Manually select your risk range with detailed analytics and liquidity insights.
      </div>

      {/* Range Slider */}
      <div className="space-y-4">
        <Label>Risk Level Range (1-100)</Label>
        
        <div className="px-3">
          <Slider
            value={sliderValues}
            onValueChange={handleSliderChange}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Manual Input */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-level">Start Level</Label>
            <Input
              id="start-level"
              type="number"
              min={1}
              max={100}
              value={riskRange.start}
              onChange={(e) => handleManualInput('start', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-level">End Level</Label>
            <Input
              id="end-level"
              type="number"
              min={1}
              max={100}
              value={riskRange.end}
              onChange={(e) => handleManualInput('end', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Preset Quick Selection */}
      <div className="space-y-3">
        <Label>Quick Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          {presetRanges.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => onRangeChange(preset.range)}
              className="h-auto p-3 text-left"
            >
              <div className="space-y-1">
                <div className="font-medium text-xs">{preset.name}</div>
                <div className="text-xs text-muted-foreground">
                  {preset.range.start}-{preset.range.end}
                </div>
                <div className="text-xs text-muted-foreground">
                  {preset.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Range Analytics */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Range Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Range Size</span>
                <Badge variant="outline" className="text-xs">
                  {rangeSize} levels
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Wider ranges = lower concentration risk
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Concentration</span>
                <Badge 
                  variant={concentrationRisk > 0.8 ? "destructive" : concentrationRisk > 0.5 ? "secondary" : "default"}
                  className="text-xs"
                >
                  {(concentrationRisk * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Higher = more concentrated risk
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Liquidity in Range</span>
              <span className="text-sm font-medium">${rangeLiquidity.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Range Utilization</span>
              <span className="text-sm font-medium">{rangeUtilization.toFixed(1)}%</span>
            </div>
          </div>

          {/* Risk Warnings */}
          {concentrationRisk > 0.9 && (
            <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-3 w-3 text-destructive mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-destructive">High Concentration Risk</p>
                <p className="text-muted-foreground">Consider widening your range for better diversification.</p>
              </div>
            </div>
          )}

          {riskRange.end >= 90 && (
            <div className="flex items-start gap-2 p-2 rounded bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <Info className="h-3 w-3 text-orange-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-orange-700 dark:text-orange-400">High Risk Exposure</p>
                <p className="text-muted-foreground">Levels 90+ are first to absorb losses during stress events.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liquidity Heatmap Preview */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Liquidity Distribution Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 100 }, (_, i) => i + 1).map((level) => {
                const tick = liquidityTicks.find(t => t.riskLevel === level);
                const isInRange = level >= riskRange.start && level <= riskRange.end;
                const liquidity = tick?.totalLiquidity || 0;
                const intensity = Math.min(liquidity / 10000, 1); // Normalize for visualization
                
                return (
                  <div
                    key={level}
                    className={`h-2 rounded-sm transition-all ${
                      isInRange 
                        ? 'bg-primary border border-primary/50' 
                        : liquidity > 0 
                        ? 'bg-muted-foreground/20' 
                        : 'bg-muted/50'
                    }`}
                    style={{
                      opacity: isInRange ? 1 : Math.max(0.1, intensity)
                    }}
                    title={`Level ${level}: $${liquidity.toLocaleString()} liquidity`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level 1 (Safe)</span>
              <span>Your Range: {riskRange.start}-{riskRange.end}</span>
              <span>Level 100 (Risky)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};