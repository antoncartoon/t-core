import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface YieldData {
  tier: string;
  range: string;
  baseYield: number;
  bonusYield: number;
  totalYield: number;
  liquidity: number;
  color: string;
}

const AnimatedYieldDistribution = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Симуляция различных распределений ликвидности
  const scenarios = [
    {
      name: 'Равномерное распределение',
      data: [
        { tier: 'Safe', range: '1-25', baseYield: 6.0, bonusYield: 0.5, totalYield: 6.5, liquidity: 25, color: 'bg-green-500' },
        { tier: 'Conservative', range: '26-50', baseYield: 6.0, bonusYield: 2.8, totalYield: 8.8, liquidity: 25, color: 'bg-blue-500' },
        { tier: 'Balanced', range: '51-75', baseYield: 6.0, bonusYield: 7.2, totalYield: 13.2, liquidity: 25, color: 'bg-yellow-500' },
        { tier: 'Hero', range: '76-100', baseYield: 6.0, bonusYield: 19.5, totalYield: 25.5, liquidity: 25, color: 'bg-purple-500' }
      ]
    },
    {
      name: 'Больше в Safe',
      data: [
        { tier: 'Safe', range: '1-25', baseYield: 6.0, bonusYield: 0.2, totalYield: 6.2, liquidity: 50, color: 'bg-green-500' },
        { tier: 'Conservative', range: '26-50', baseYield: 6.0, bonusYield: 1.5, totalYield: 7.5, liquidity: 20, color: 'bg-blue-500' },
        { tier: 'Balanced', range: '51-75', baseYield: 6.0, bonusYield: 4.8, totalYield: 10.8, liquidity: 20, color: 'bg-yellow-500' },
        { tier: 'Hero', range: '76-100', baseYield: 6.0, bonusYield: 28.2, totalYield: 34.2, liquidity: 10, color: 'bg-purple-500' }
      ]
    },
    {
      name: 'Больше в Hero',
      data: [
        { tier: 'Safe', range: '1-25', baseYield: 6.0, bonusYield: 0.8, totalYield: 6.8, liquidity: 10, color: 'bg-green-500' },
        { tier: 'Conservative', range: '26-50', baseYield: 6.0, bonusYield: 3.2, totalYield: 9.2, liquidity: 20, color: 'bg-blue-500' },
        { tier: 'Balanced', range: '51-75', baseYield: 6.0, bonusYield: 8.5, totalYield: 14.5, liquidity: 20, color: 'bg-yellow-500' },
        { tier: 'Hero', range: '76-100', baseYield: 6.0, bonusYield: 12.8, totalYield: 18.8, liquidity: 50, color: 'bg-purple-500' }
      ]
    }
  ];

  const currentScenario = scenarios[currentFrame];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % scenarios.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
    setSelectedTier(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-lg border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-2xl font-light mb-2">Динамическое распределение доходности</h3>
          <p className="text-muted-foreground">
            Как меняется доходность тиров в зависимости от ликвидности
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Badge variant="outline" className="mb-4">
          Сценарий: {currentScenario.name}
        </Badge>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentScenario.data.map((tier, index) => (
            <Card
              key={tier.tier}
              className={`cursor-pointer transition-all duration-500 hover:shadow-lg ${
                selectedTier === tier.tier ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTier(selectedTier === tier.tier ? null : tier.tier)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{tier.tier}</h4>
                  <Badge variant="outline" className="text-xs">
                    {tier.range}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Базовая:</span>
                    <span className="font-medium">{tier.baseYield.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Бонус:</span>
                    <span className="font-medium text-primary">+{tier.bonusYield.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>Общий APY:</span>
                    <span className="text-lg">{tier.totalYield.toFixed(1)}%</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Ликвидность:</span>
                      <span>{tier.liquidity}%</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${tier.color} transition-all duration-1000`}
                        style={{ width: `${tier.liquidity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedTier && (
        <Card className="bg-muted/20 border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Формула для {selectedTier}:</h4>
            <div className="font-mono text-sm text-muted-foreground space-y-1">
              <div>Базовая доходность: T-Bills * 1.2 = 6%</div>
              <div>Бонус: f(i) = 1.03^(i-25) * распределение_ликвидности</div>
              <div>Общая доходность: Базовая + Бонус + Инсентивы_от_комиссий</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Ключевые факторы:</strong> Распределение ликвидности между тирами влияет на бонусную доходность. 
          Высокие тиры получают больше бонуса при меньшей ликвидности. Инсентивы от performance fee (20%) 
          дополнительно увеличивают доходность.
        </p>
      </div>
    </div>
  );
};

export default AnimatedYieldDistribution;