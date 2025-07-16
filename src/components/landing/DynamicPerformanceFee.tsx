import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, TrendingUp, Shield, Users, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface FeeAllocation {
  name: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const DynamicPerformanceFee = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);

  const scenarios = [
    {
      name: 'Стабильная работа',
      description: 'Протокол работает стабильно, пег поддерживается',
      allocations: [
        { name: 'Bonus Yield', value: 25, color: '#10b981', icon: TrendingUp, description: 'Бонусы участникам' },
        { name: 'Buyback TDD', value: 25, color: '#3b82f6', icon: Shield, description: 'Поддержка пега' },
        { name: 'Protocol Revenue', value: 25, color: '#8b5cf6', icon: Users, description: 'Команда и развитие' },
        { name: 'Hero Tier Support', value: 25, color: '#f59e0b', icon: Zap, description: 'Страховой буфер' }
      ]
    },
    {
      name: 'Депег TDD',
      description: 'TDD отклонился от пега, нужно больше buyback',
      allocations: [
        { name: 'Bonus Yield', value: 15, color: '#10b981', icon: TrendingUp, description: 'Бонусы участникам' },
        { name: 'Buyback TDD', value: 45, color: '#3b82f6', icon: Shield, description: 'Поддержка пега' },
        { name: 'Protocol Revenue', value: 20, color: '#8b5cf6', icon: Users, description: 'Команда и развитие' },
        { name: 'Hero Tier Support', value: 20, color: '#f59e0b', icon: Zap, description: 'Страховой буфер' }
      ]
    },
    {
      name: 'Приток в Safe',
      description: 'Много ликвидности в безрисковые пулы',
      allocations: [
        { name: 'Bonus Yield', value: 35, color: '#10b981', icon: TrendingUp, description: 'Бонусы участникам' },
        { name: 'Buyback TDD', value: 15, color: '#3b82f6', icon: Shield, description: 'Поддержка пега' },
        { name: 'Protocol Revenue', value: 20, color: '#8b5cf6', icon: Users, description: 'Команда и развитие' },
        { name: 'Hero Tier Support', value: 30, color: '#f59e0b', icon: Zap, description: 'Страховой буфер' }
      ]
    }
  ];

  const currentData = scenarios[currentScenario];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentScenario((prev) => (prev + 1) % scenarios.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentScenario(0);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-3 shadow-lg border">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 mb-2">
              <data.icon className="w-4 h-4" style={{ color: data.color }} />
              <span className="font-medium">{data.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{data.description}</p>
            <p className="text-lg font-bold">{data.value}%</p>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-card rounded-lg border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-2xl font-light mb-2">Динамическое распределение Performance Fee</h3>
          <p className="text-muted-foreground">
            20% от общей доходности распределяется в зависимости от потребностей протокола
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
          Сценарий: {currentData.name}
        </Badge>
        <p className="text-sm text-muted-foreground mb-6">
          {currentData.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData.allocations}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {currentData.allocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation Details */}
        <div className="space-y-4">
          {currentData.allocations.map((allocation, index) => (
            <Card key={index} className="transition-all duration-500 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: allocation.color }}
                  />
                  <allocation.icon className="w-5 h-5" style={{ color: allocation.color }} />
                  <span className="font-medium">{allocation.name}</span>
                  <Badge variant="outline" className="ml-auto">
                    {allocation.value}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  {allocation.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/20 rounded-lg">
        <h4 className="font-medium mb-2">Алгоритм распределения:</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Bonus Yield:</strong> Увеличивается при притоке ликвидности в Safe тиры</div>
          <div>• <strong>Buyback TDD:</strong> Активируется при депеге для поддержки стабильности</div>
          <div>• <strong>Protocol Revenue:</strong> Стабильная часть для развития и операций</div>
          <div>• <strong>Hero Tier Support:</strong> Компенсация за страхование других участников</div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPerformanceFee;