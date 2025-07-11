import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Coins, ArrowRightLeft, Target, Gem } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Coins,
      title: "Депозит стейблов",
      description: "USDC, USDT, DAI",
      detail: "Внеси любые стейблкоины в протокол T-Core"
    },
    {
      icon: ArrowRightLeft,
      title: "Получи TDD",
      description: "1:1 к депозиту",
      detail: "Заминть TDD стейблкоин в соотношении 1 к 1"
    },
    {
      icon: Target,
      title: "Выбери риск",
      description: "Низкий / Средний / Высокий",
      detail: "Сам регулируй соотношение риск/доход"
    },
    {
      icon: Gem,
      title: "NFT + DeFi",
      description: "Позиция + использование",
      detail: "Получи NFT позицию и используй на вторичных рынках"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Как это работает?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Простой 4-шаговый процесс для начала заработка на стейблкоинах
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="border-border bg-card/50 hover:bg-card/80 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium mb-4">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                      <p className="text-primary font-medium mb-3 text-sm">
                        {step.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;