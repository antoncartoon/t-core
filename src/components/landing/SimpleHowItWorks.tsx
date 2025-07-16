import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Wallet, Target, TrendingUp } from 'lucide-react';

const SimpleHowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: 'Депонируйте стейблкоины',
      description: 'Mint TDD 1:1 из USDC, USDT, DAI для начала инвестирования.',
      color: 'text-blue-600'
    },
    {
      icon: Target,
      title: 'Выберите стратегию',
      description: 'Предустановленные тиры или полностью кастомизированная позиция.',
      color: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Получайте доходность',
      description: 'Автоматическое начисление yield с прозрачным трекингом on-chain.',
      color: 'text-green-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
            Как это работает
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Начните инвестировать в три простых шага. Никаких сложных стратегий, только прозрачная доходность.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-border hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Готовы начать получать устойчивую доходность?
          </p>
          <a href="/app" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
            Запустить приложение
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default SimpleHowItWorks;