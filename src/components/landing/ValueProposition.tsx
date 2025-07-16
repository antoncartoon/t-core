import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, Eye, Shield, Users, TrendingUp } from 'lucide-react';

const ValueProposition = () => {
  const painPoints = [
    {
      icon: Target,
      title: "Множество протоколов",
      problem: "Сложно отслеживать десятки DeFi протоколов",
      solution: "Одна платформа для всех стратегий",
      color: "text-blue-600"
    },
    {
      icon: Shield,
      title: "Риск-менеджмент",
      problem: "Трудно оценить и контролировать риски",
      solution: "Профессиональная команда управляет рисками",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "Постоянное перераспределение",
      problem: "Нужно постоянно перебалансировать портфель",
      solution: "Автоматическое управление и оптимизация",
      color: "text-purple-600"
    }
  ];

  const advantages = [
    {
      icon: Eye,
      title: "Прозрачность",
      description: "Все операции верифицируются на блокчейне. Полная прозрачность комиссий и распределения доходности.",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Диверсификация",
      description: "Обширная и диверсифицированная стратегия: T-Bills, стейблкоин стейкинг, lending, DEX LP, AMM позиции.",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "Профессиональное управление",
      description: "Команда опытных инвесторов управляет стратегиями, а вы получаете доходность без лишних хлопот.",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Решаем главные боли DeFi инвесторов
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Перестаньте жонглировать десятками протоколов. Получайте профессионально управляемую доходность.
          </p>
        </div>

        {/* Pain Points */}
        <div className="mb-16">
          <h3 className="text-xl font-medium text-center mb-8 text-muted-foreground">
            Что мы решаем
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {painPoints.map((point, index) => (
              <Card key={index} className="border-border bg-card/50 hover:bg-card/80 transition-colors">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <point.icon className={`w-6 h-6 ${point.color}`} />
                    </div>
                    <h4 className="text-lg font-medium mb-3">{point.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      <span className="text-red-600">Проблема:</span> {point.problem}
                    </p>
                    <p className="text-sm text-green-600 font-medium leading-relaxed">
                      <span className="text-green-600">Решение:</span> {point.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div>
          <h3 className="text-xl font-medium text-center mb-8 text-muted-foreground">
            Наши преимущества
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="border-border bg-card/50 hover:bg-card/80 transition-colors">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <advantage.icon className={`w-6 h-6 ${advantage.color}`} />
                    </div>
                    <h4 className="text-lg font-medium mb-3">{advantage.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;