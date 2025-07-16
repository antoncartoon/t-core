import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Circle, Users, Shield, Vote, Zap, Lock } from 'lucide-react';

const DetailedRoadmap = () => {
  const phases = [
    {
      phase: 'Текущий этап',
      status: 'current',
      timeframe: '2024-2025',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      features: [
        { name: 'Централизованное управление стратегией', status: 'live', description: 'Профессиональная команда управляет распределением активов' },
        { name: 'Верификация транзакций on-chain', status: 'live', description: 'Все операции прозрачны и верифицируются в блокчейне' },
        { name: 'Распределение стейкинг наград on-chain', status: 'live', description: 'Автоматическое начисление наград через смарт-контракты' },
        { name: 'Выпуск и сжигание TDD on-chain', status: 'live', description: 'Mint/burn операции TDD полностью децентрализованы' },
        { name: 'Multisig управление (3/5)', status: 'live', description: 'Безопасность через мультиподпись для критических операций' }
      ]
    },
    {
      phase: 'Этап 1',
      status: 'planned',
      timeframe: '2025 Q2-Q3',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      features: [
        { name: 'Governance Token (TCORE)', status: 'planned', description: 'Выпуск токена управления для голосования' },
        { name: 'Голосование по распределению бонусов', status: 'planned', description: 'Сообщество решает параметры f(i) и surplus' },
        { name: 'Выбор стратегий инвестирования', status: 'planned', description: 'DAO голосует за протоколы и аллокации' },
        { name: 'Управление Performance Fee', status: 'planned', description: 'Голосование по распределению комиссии' }
      ]
    },
    {
      phase: 'Этап 2',
      status: 'future',
      timeframe: '2025 Q4 - 2026 Q1',
      icon: Vote,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      features: [
        { name: 'Полностью децентрализованное управление', status: 'future', description: 'Переход от multisig к DAO управлению' },
        { name: 'Автоматизированное ребалансирование', status: 'future', description: 'Смарт-контракты управляют распределением' },
        { name: 'Liquid Democracy', status: 'future', description: 'Делегирование голосов экспертам' },
        { name: 'Permissionless стратегии', status: 'future', description: 'Любой может предложить новую стратегию' }
      ]
    },
    {
      phase: 'Этап 3',
      status: 'future',
      timeframe: '2026 Q2+',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      features: [
        { name: 'Кросс-чейн интеграция', status: 'future', description: 'Поддержка множества блокчейнов' },
        { name: 'AI-powered оптимизация', status: 'future', description: 'Машинное обучение для стратегий' },
        { name: 'Permissionless листинги', status: 'future', description: 'Открытая экосистема протоколов' },
        { name: 'Мобильное приложение', status: 'future', description: 'Нативное приложение для управления' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'planned':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'future':
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Текущий</Badge>;
      case 'planned':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Запланирован</Badge>;
      case 'future':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Будущее</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Roadmap к полной децентрализации
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Поэтапный переход от централизованного управления к полностью децентрализованному протоколу
          </p>
        </div>

        <div className="space-y-8">
          {phases.map((phase, index) => (
            <Card 
              key={index} 
              className={`border-2 ${phase.borderColor} ${phase.bgColor}`}
            >
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${phase.bgColor} border-2 ${phase.borderColor}`}>
                      <phase.icon className={`w-6 h-6 ${phase.color}`} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${phase.color}`}>{phase.phase}</h3>
                      <p className="text-sm text-muted-foreground">{phase.timeframe}</p>
                    </div>
                  </div>
                  {getStatusBadge(phase.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                      {getStatusIcon(feature.status)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{feature.name}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-medium">Безопасность переходного периода</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Централизованное управление обеспечивает безопасность на раннем этапе</p>
            <p>• Multisig 3/5 защищает от единоличных решений</p>
            <p>• Постепенное делегирование полномочий сообществу</p>
            <p>• Аудиты смарт-контрактов на каждом этапе</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedRoadmap;