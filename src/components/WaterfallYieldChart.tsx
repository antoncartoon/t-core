
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface WaterfallYieldChartProps {
  selectedTier?: string;
}

export const WaterfallYieldChart: React.FC<WaterfallYieldChartProps> = ({ selectedTier }) => {
  // Generate waterfall data showing yield distribution across risk levels
  const generateWaterfallData = () => {
    const data = [];
    const baseYield = 6.0; // T-Bills base
    
    for (let level = 1; level <= 100; level += 5) {
      let yield_pct = baseYield;
      let bonusMultiplier = 1;
      let tierName = '';
      let isSelected = false;
      
      if (level <= 9) {
        tierName = 'Safe';
        bonusMultiplier = 1.1;
        isSelected = selectedTier === 'safe';
      } else if (level <= 29) {
        tierName = 'Conservative';
        bonusMultiplier = 1.2 + (level - 10) * 0.02;
        isSelected = selectedTier === 'conservative';
      } else if (level <= 59) {
        tierName = 'Balanced';
        bonusMultiplier = 1.4 + (level - 30) * 0.025;
        isSelected = selectedTier === 'balanced';
      } else {
        tierName = 'Hero';
        bonusMultiplier = 2.0 + (level - 60) * 0.03;
        isSelected = selectedTier === 'hero';
      }
      
      yield_pct = baseYield * bonusMultiplier;
      
      // Add bonus incentive zones at certain levels
      const bonusZones = [25, 45, 65, 85];
      const hasBonus = bonusZones.some(zone => Math.abs(level - zone) <= 2);
      if (hasBonus) {
        yield_pct *= 1.15; // 15% bonus in incentive zones
      }
      
      data.push({
        level,
        yield: yield_pct,
        tier: tierName,
        isSelected,
        hasBonus,
        bonusMultiplier: hasBonus ? 1.15 : 1
      });
    }
    
    return data;
  };

  const data = generateWaterfallData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{`Level ${label} (${data.tier})`}</p>
          <p className="text-primary">
            {`Yield: ${data.yield.toFixed(1)}% APY`}
          </p>
          {data.hasBonus && (
            <p className="text-green-600 text-sm">
              🎯 Bonus Incentive Zone (+15%)
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Safe (1-9)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Conservative (10-29)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Balanced (30-59)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Hero (60-99)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>🎯 Bonus Zones</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="level" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Risk Level', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'APY %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Base bars */}
            <Bar 
              dataKey="yield" 
              fill={(entry: any) => {
                if (entry.hasBonus) return '#8b5cf6'; // Purple for bonus zones
                if (entry.level <= 9) return '#22c55e'; // Green for Safe
                if (entry.level <= 29) return '#3b82f6'; // Blue for Conservative  
                if (entry.level <= 59) return '#eab308'; // Yellow for Balanced
                return '#ef4444'; // Red for Hero
              }}
              stroke={(entry: any) => entry.isSelected ? '#000' : 'transparent'}
              strokeWidth={2}
              opacity={(entry: any) => entry.isSelected ? 1 : 0.8}
            />
            
            {/* Reference lines for tier boundaries */}
            <ReferenceLine x={9} stroke="#666" strokeDasharray="2 2" />
            <ReferenceLine x={29} stroke="#666" strokeDasharray="2 2" />
            <ReferenceLine x={59} stroke="#666" strokeDasharray="2 2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Waterfall explanation */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Waterfall Model:</strong> Yield flows from protocol sources down through risk levels</p>
        <p><strong>Bonus Zones:</strong> Purple bars show levels with additional incentive rewards (+15%)</p>
        <p><strong>Risk Flow:</strong> Higher levels absorb losses first but earn residual yield first</p>
      </div>
    </div>
  );
};
