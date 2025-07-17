import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, TrendingUp, Shield, Users, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DynamicPerformanceFeeCompact = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScenario, setCurrentScenario] = useState(0);

  const scenarios = [
    {
      name: 'Stable Operations',
      description: 'Normal protocol operations',
      allocations: [
        { name: 'Bonus Yield', value: 25, color: '#10b981', icon: TrendingUp },
        { name: 'Buyback TDD', value: 25, color: '#3b82f6', icon: Shield },
        { name: 'Protocol Revenue', value: 25, color: '#8b5cf6', icon: Users },
        { name: 'Hero Tier Support', value: 25, color: '#f59e0b', icon: Zap }
      ]
    },
    {
      name: 'TDD Depeg Event',
      description: 'Increased buyback needed',
      allocations: [
        { name: 'Bonus Yield', value: 15, color: '#10b981', icon: TrendingUp },
        { name: 'Buyback TDD', value: 45, color: '#3b82f6', icon: Shield },
        { name: 'Protocol Revenue', value: 20, color: '#8b5cf6', icon: Users },
        { name: 'Hero Tier Support', value: 20, color: '#f59e0b', icon: Zap }
      ]
    },
    {
      name: 'Safe Tier Influx',
      description: 'More incentives needed',
      allocations: [
        { name: 'Bonus Yield', value: 35, color: '#10b981', icon: TrendingUp },
        { name: 'Buyback TDD', value: 15, color: '#3b82f6', icon: Shield },
        { name: 'Protocol Revenue', value: 20, color: '#8b5cf6', icon: Users },
        { name: 'Hero Tier Support', value: 30, color: '#f59e0b', icon: Zap }
      ]
    },
    {
      name: 'Stress Test Mode',
      description: 'Enhanced hero protection',
      allocations: [
        { name: 'Bonus Yield', value: 20, color: '#10b981', icon: TrendingUp },
        { name: 'Buyback TDD', value: 20, color: '#3b82f6', icon: Shield },
        { name: 'Protocol Revenue', value: 15, color: '#8b5cf6', icon: Users },
        { name: 'Hero Tier Support', value: 45, color: '#f59e0b', icon: Zap }
      ]
    }
  ];

  const currentData = scenarios[currentScenario];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentScenario((prev) => (prev + 1) % scenarios.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentScenario(0);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {currentData.name}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8 p-0"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Scenario Description */}
      <p className="text-sm text-muted-foreground">{currentData.description}</p>

      {/* Pie Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={currentData.allocations}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {currentData.allocations.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Allocation Legend */}
      <div className="grid grid-cols-2 gap-2">
        {currentData.allocations.map((allocation, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: allocation.color }}
            />
            <allocation.icon className="w-3 h-3 flex-shrink-0" style={{ color: allocation.color }} />
            <span className="text-xs truncate">{allocation.name}</span>
            <span className="text-xs font-medium ml-auto">{allocation.value}%</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="text-xs text-muted-foreground border-t pt-3">
        <p>Algorithm adapts allocation based on protocol needs for stability and growth</p>
      </div>
    </div>
  );
};

export default DynamicPerformanceFeeCompact;