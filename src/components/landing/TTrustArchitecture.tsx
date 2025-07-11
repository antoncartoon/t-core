import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Users, PieChart, Eye, ArrowDown, ArrowUp } from 'lucide-react';

const TTrustArchitecture = () => {
  const architecture = [
    {
      icon: Brain,
      title: "AI Советник",
      description: "Анализирует рынки 24/7 и предлагает оптимальные стратегии распределения активов",
      features: ["Машинное обучение", "Анализ рисков", "Автоматические сигналы"]
    },
    {
      icon: Users, 
      title: "Команда управляющих",
      description: "Профессиональные трейдеры и аналитики с опытом в TradiFi и DeFi",
      features: ["10+ лет опыта", "Проверенные стратегии", "Управление рисками"]
    },
    {
      icon: PieChart,
      title: "Разделение по рискам",
      description: "Доходы распределяются по waterfall модели - от низкого к высокому риску",
      features: ["Математическая точность", "Справедливое распределение", "Прозрачные правила"]
    }
  ];

  const waterfallFlow = [
    { level: "Низкий риск", color: "green", allocation: "60%", yield: "5-8%" },
    { level: "Средний риск", color: "blue", allocation: "30%", yield: "8-15%" },
    { level: "Высокий риск", color: "purple", allocation: "10%", yield: "15-25%" }
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            T-Trust & T-Transparency
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Архитектура доверия: AI технологии, профессиональная команда и математически точное распределение доходов
          </p>
        </div>

        {/* Architecture Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {architecture.map((component, index) => {
            const Icon = component.icon;
            return (
              <Card key={index} className="border-border bg-card/50">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-3">{component.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {component.description}
                    </p>
                    <div className="space-y-2">
                      {component.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Waterfall Visualization */}
        <Card className="border-border bg-card/50">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-medium">Waterfall распределение доходов</h3>
              </div>
              <p className="text-muted-foreground">
                Доходы протокола распределяются снизу вверх, убытки - сверху вниз
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Yield Flow */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600">Доходы (снизу вверх)</span>
                </div>
                <div className="space-y-3">
                  {waterfallFlow.map((level, index) => {
                    const colors = {
                      green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-800',
                      blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-200 dark:border-blue-800', 
                      purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-200 dark:border-purple-800'
                    };
                    
                    return (
                      <div key={index} className={`p-3 rounded-lg border ${colors[level.color as keyof typeof colors]}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{level.level}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{level.yield}</div>
                            <div className="text-xs opacity-75">{level.allocation} участников</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Loss Absorption */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <ArrowDown className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-600">Убытки (сверху вниз)</span>
                </div>
                <div className="space-y-3">
                  {[...waterfallFlow].reverse().map((level, index) => {
                    const colors = {
                      purple: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-800',
                      blue: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-200 dark:border-orange-800',
                      green: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-200 dark:border-yellow-800'
                    };
                    
                    return (
                      <div key={index} className={`p-3 rounded-lg border ${colors[level.color as keyof typeof colors]}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{level.level}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {index === 0 ? 'Первые' : index === 1 ? 'Вторые' : 'Защищены'}
                            </div>
                            <div className="text-xs opacity-75">
                              {index === 0 ? 'поглощают' : index === 1 ? 'поглощают' : 'от убытков'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Математическая прозрачность:</strong> Все расчеты основаны на точных формулах, 
                каждая транзакция видна on-chain, справедливое распределение гарантировано кодом.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TTrustArchitecture;