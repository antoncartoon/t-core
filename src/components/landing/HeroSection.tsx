
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-12 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-foreground rounded-xl flex items-center justify-center">
              <span className="text-background font-bold text-2xl sm:text-3xl">T</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-foreground mb-4 sm:mb-6 tracking-tight">
            T-Core: Customize Your{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TDD Yields
            </span>{' '}
            with Precision Risk Ranges
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12">
            Choose your risk range (1–100) for tailored TDD yields, from T-Bill +20% minimum to maximum gains. 
            AI-optimized, transparent, NFT-powered staking with concentrated liquidity efficiency.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
          <NavLink to="/app">
            <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </NavLink>
          
          <a href="#how-it-works">
            <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
              Learn More
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-border bg-card/50">
            <Shield className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-medium mb-2">T-Bill +20% Minimum</h3>
            <p className="text-sm text-muted-foreground">
              Guaranteed minimum yield based on T-Bills + 20% premium for low-risk positions.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-border bg-card/50">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-medium mb-2">Up to Max Gains</h3>
            <p className="text-sm text-muted-foreground">
              Higher risk ranges unlock maximum yield potential based on 28-day historical performance.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-border bg-card/50">
            <Lock className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-medium mb-2">AI-Optimized & NFT-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Intelligent rebalancing with NFT position management and transparent waterfall distribution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
