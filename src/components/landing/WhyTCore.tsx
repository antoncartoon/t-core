import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, Brain, Eye } from 'lucide-react';

const WhyTCore = () => {
  const benefits = [
    {
      icon: Coins,
      title: "Стейблкоины в работе",
      description: "Превращай USDC, USDT, DAI в источник прибыли. Никаких рисков волатильности - только оптимизированный доход.",
      color: "text-green-600"
    },
    {
      icon: Brain,
      title: "AI + Профи управляющие",
      description: "Команда экспертов и AI советник управляют распределением по лучшим DeFi и CeFi стратегиям.",
      color: "text-blue-600"
    },
    {
      icon: Eye,
      title: "Полная прозрачность",
      description: "Видишь каждую аллокацию и транзакцию on-chain. T-Trust и T-Transparency - наши главные принципы.",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Почему T-Core?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Революционный подход к доходности стейблкоинов с беспрецедентным контролем риска и дохода
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="border-border bg-card/50 hover:bg-card/80 transition-colors">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <Icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <h3 className="text-xl font-medium mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyTCore;