import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Play, Shield, TrendingUp, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { T_BILL_RATE, FIXED_BASE_MULTIPLIER, FIXED_BASE_APY } from '@/utils/riskRangeCalculations';

interface SimpleHeroSectionProps {
  onStartTutorial?: () => void;
}

const SimpleHeroSection = ({ onStartTutorial }: SimpleHeroSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-foreground mb-4 sm:mb-6">
            <span className="text-green-600 font-medium">{(FIXED_BASE_APY * 100).toFixed(0)}% Guaranteed Safe</span> +{' '}
            <span className="text-primary font-medium">Dynamic Bonus Yields</span>
          </h1>
          
          <p className="text-sm text-muted-foreground mb-8 sm:mb-12">
            Гарантированная доходность рассчитывается как текущая ставка T-Bills ({(T_BILL_RATE * 100).toFixed(0)}%) × {FIXED_BASE_MULTIPLIER} = {(FIXED_BASE_APY * 100).toFixed(0)}%
          </p>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
            Профессионально управляемые стейблкоин стратегии с прозрачными комиссиями
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Safe: {(FIXED_BASE_APY * 100).toFixed(0)}% гарантированно (мин. 25% базовой доходности)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Бонус: f(i) = 1.03^(i-25) + инсентивы
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Hero: до 35%+ в зависимости от ликвидности
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16">
            <NavLink to="/app">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="w-full sm:w-auto text-base font-medium px-8 py-6 h-auto"
              >
                Начать инвестировать
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </NavLink>
            
            {onStartTutorial && (
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "lg"} 
                className="w-full sm:w-auto text-base px-8 py-6 h-auto"
                onClick={onStartTutorial}
              >
                <Play className="w-4 h-4 mr-2" />
                Take Tutorial
              </Button>
            )}
            
            <a href="#how-it-works">
              <Button 
                variant="ghost" 
                size={isMobile ? "default" : "lg"} 
                className="w-full sm:w-auto text-base px-8 py-6 h-auto"
              >
                Learn More
              </Button>
            </a>
          </div>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Фиксированный Safe Tier</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Кастомизируемые тиры</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Lock className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">Прозрачно и безопасно</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHeroSection;