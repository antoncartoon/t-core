import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, ArrowDown, ArrowUp, Shield, Crown, Zap, Star } from 'lucide-react';

// T-Core risk band visualization with 4 categories and animation
const RiskBandVisualization = ({ activeCategory, isAnimating }) => {
  const categories = [
    { name: 'Safe', range: [1, 3], color: 'bg-green-500/30', width: '3%' },
    { name: 'Conservative', range: [4, 24], color: 'bg-blue-500/30', width: '21%' },
    { name: 'Balanced', range: [25, 80], color: 'bg-yellow-500/30', width: '56%' },
    { name: 'T-Core HERO', range: [81, 100], color: 'bg-gradient-to-r from-purple-500/30 to-yellow-500/30', width: '20%' }
  ];

  return (
    <div className="space-y-6">
      {/* Risk Band */}
      <div className="relative h-20 bg-muted/30 rounded-lg overflow-hidden">
        {/* Color zones */}
        <div className="absolute inset-0 flex">
          <div className="w-[3%] bg-green-500/20" />
          <div className="w-[21%] bg-blue-500/20" />
          <div className="w-[56%] bg-yellow-500/20" />
          <div className="w-[20%] bg-gradient-to-r from-purple-500/20 to-yellow-500/20" />
        </div>
        
        {/* Active category highlight */}
        {activeCategory && (
          <div 
            className={`absolute top-0 h-full border-2 border-primary transition-all duration-1000 ${
              activeCategory.name === 'T-Core HERO' 
                ? 'bg-gradient-to-r from-purple-500/40 to-yellow-500/40 shadow-lg shadow-yellow-500/20' 
                : 'bg-primary/30'
            } ${isAnimating ? 'animate-pulse' : ''}`}
            style={{
              left: `${(activeCategory.range[0] - 1)}%`,
              width: `${activeCategory.range[1] - activeCategory.range[0] + 1}%`
            }}
          />
        )}
        
        {/* T-Core HERO crown icon */}
        {activeCategory?.name === 'T-Core HERO' && (
          <div className="absolute top-2 right-4 animate-bounce">
            <Crown className="w-6 h-6 text-yellow-500" />
          </div>
        )}
      </div>
      
      {/* Labels */}
      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
        <span className="text-green-600 font-medium text-center">Safe (1-3)</span>
        <span className="text-blue-600 font-medium text-center">Conservative (4-24)</span>
        <span className="text-yellow-600 font-medium text-center">Balanced (25-80)</span>
        <span className="text-purple-600 font-medium text-center">T-Core HERO (81-100)</span>
      </div>
    </div>
  );
};

// T-Core APY calculation with new categories
const calculateCategoryAPY = (categoryName) => {
  const categoryAPYs = {
    'Safe': { min: 5.2, max: 5.8 },
    'Conservative': { min: 6.5, max: 9.2 },
    'Balanced': { min: 8.5, max: 16.8 },
    'T-Core HERO': { min: 15.0, max: 35.0 }
  };
  
  const apy = categoryAPYs[categoryName];
  if (!apy) return 8.0;
  
  return {
    estimated: (apy.min + apy.max) / 2,
    range: `${apy.min}% - ${apy.max}%`
  };
};

// T-Core Waterfall Distribution Component
const TCoreWaterfallDistribution = () => {
  const waterfallFlow = [
    { level: "Safe", color: "green", allocation: "25%", yield: "T-Bill + 20% guaranteed" },
    { level: "Conservative", color: "blue", allocation: "40%", yield: "Stable yield" },
    { level: "Balanced", color: "yellow", allocation: "30%", yield: "Enhanced yield" },
    { level: "T-Core HERO", color: "purple", allocation: "5%", yield: "Maximum yield + pool insurance" }
  ];

  return (
    <Card className="border-border bg-card/50 mb-8">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-medium">T-Core Waterfall Distribution</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            T-Core HERO tier protects lower tiers, earns maximum yield.<br/>
            <span className="text-sm font-medium text-purple-600">Be the pool's hero - earn the most, protect others</span>
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-purple-600 mb-4 p-3 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <Crown className="w-4 h-4" />
            <span className="font-medium">T-Core HERO: Maximum yield for heroes who protect the entire pool</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Yield Flow */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-600">Yields (bottom-up)</span>
            </div>
            <div className="space-y-3">
              {waterfallFlow.map((level, index) => {
                const colors = {
                  green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-800',
                  blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-200 dark:border-blue-800',
                  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-200 dark:border-yellow-800',
                  purple: 'bg-gradient-to-r from-purple-100 to-yellow-100 text-purple-800 border-purple-200 dark:from-purple-950/20 dark:to-yellow-950/20 dark:text-purple-200 dark:border-purple-800'
                };
                
                return (
                  <div key={index} className={`p-3 rounded-lg border ${colors[level.color as keyof typeof colors]} ${level.level === 'T-Core HERO' ? 'shadow-lg' : ''}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{level.level}</span>
                        {level.level === 'T-Core HERO' && <Crown className="w-4 h-4 text-yellow-600" />}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{level.yield}</div>
                        <div className="text-xs opacity-75">{level.allocation} participants</div>
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
              <span className="font-medium text-red-600">Losses (top-down)</span>
            </div>
            <div className="space-y-3">
              {[...waterfallFlow].reverse().map((level, index) => {
                const colors = {
                  purple: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-800',
                  yellow: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-200 dark:border-orange-800',
                  blue: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-200 dark:border-yellow-800',
                  green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-800'
                };
                
                return (
                  <div key={index} className={`p-3 rounded-lg border ${colors[level.color as keyof typeof colors]}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{level.level}</span>
                        {level.level === 'T-Core HERO' && <Crown className="w-4 h-4 text-yellow-600" />}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {index === 0 ? 'First' : index === 1 ? 'Second' : index === 2 ? 'Third' : 'Protected'}
                        </div>
                        <div className="text-xs opacity-75">
                          {index <= 2 ? 'absorb losses' : 'from losses'}
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
            <strong>Mathematical transparency:</strong> All calculations based on precise formulas, 
            every transaction visible on-chain, fair distribution guaranteed by code.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const RiskSelection = () => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  
  // T-Core risk categories
  const categories = [
    { 
      name: 'Safe', 
      range: [1, 3], 
      color: 'green',
      description: 'T-Bill +20% guaranteed, zero loss risk',
      apyRange: '5.2% - 5.8%',
      participants: '25%',
      icon: Shield
    },
    { 
      name: 'Conservative', 
      range: [4, 24], 
      color: 'blue',
      description: 'Stable yield, minimal drawdown risk',
      apyRange: '6.5% - 9.2%',
      participants: '40%',
      icon: Shield
    },
    { 
      name: 'Balanced', 
      range: [25, 80], 
      color: 'yellow',
      description: 'Optimal risk/reward, diversified exposure',
      apyRange: '8.5% - 16.8%',
      participants: '30%',
      icon: Star
    },
    { 
      name: 'T-Core HERO', 
      range: [81, 100], 
      color: 'purple',
      description: 'Be the pool\'s insurance - max yield for heroes!',
      apyRange: '15.0% - 35.0%',
      participants: '5%',
      icon: Crown,
      isHero: true
    }
  ];

  // Auto-cycle through categories every 4 seconds
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAnimating, categories.length]);

  const currentCategory = categories[currentCategoryIndex];

  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Choose Your T-Core Position
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Four risk tiers designed for different investor profiles. From guaranteed safe yields to heroic maximum returns.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Animated Risk Visualization */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Live Demo</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isAnimating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="flex items-center gap-2"
                  >
                    {isAnimating ? 'Pause' : 'Play'}
                  </Button>
                </div>
              </div>
              
              <RiskBandVisualization
                activeCategory={currentCategory}
                isAnimating={isAnimating}
              />
              
              {/* Current Category Display */}
              <div className="mt-8">
                <Card className={`p-6 transition-all duration-1000 ${
                  currentCategory.isHero 
                    ? 'bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20 border-purple-200 dark:border-purple-800 shadow-lg' 
                    : 'bg-muted/30'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        currentCategory.isHero 
                          ? 'bg-gradient-to-r from-purple-500 to-yellow-500' 
                          : 'bg-primary/10'
                      }`}>
                        <currentCategory.icon className={`w-6 h-6 ${
                          currentCategory.isHero ? 'text-white' : 'text-primary'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xl font-bold mb-2 ${
                        currentCategory.isHero ? 'text-purple-700 dark:text-purple-300' : 'text-foreground'
                      }`}>
                        {currentCategory.name}
                        {currentCategory.isHero && <span className="ml-2 text-yellow-500">⭐</span>}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {currentCategory.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Expected APY</div>
                          <div className={`text-lg font-bold ${
                            currentCategory.isHero ? 'text-purple-600' : 'text-primary'
                          }`}>
                            {currentCategory.apyRange}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Risk Range</div>
                          <div className="text-lg font-medium">
                            {currentCategory.range[0]} - {currentCategory.range[1]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Manual Category Selection */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  const isActive = index === currentCategoryIndex;
                  
                  return (
                    <Button
                      key={category.name}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setCurrentCategoryIndex(index);
                        setIsAnimating(false);
                      }}
                      className={`flex items-center gap-2 transition-all duration-200 ${
                        category.isHero && isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-yellow-500 text-white' 
                          : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right: Category Benefits */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-medium">T-Core Benefits</h3>
                </div>

                {/* All Categories Overview */}
                <div className="space-y-3">
                  {categories.map((category, index) => {
                    const Icon = category.icon;
                    const isActive = index === currentCategoryIndex;
                    
                    return (
                      <div
                        key={category.name}
                        className={`p-4 rounded-lg border transition-all duration-300 ${
                          isActive 
                            ? category.isHero 
                              ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20' 
                              : 'border-primary bg-primary/5'
                            : 'border-border bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-5 h-5 ${
                              isActive 
                                ? category.isHero ? 'text-purple-600' : 'text-primary'
                                : 'text-muted-foreground'
                            }`} />
                            <div>
                              <div className={`font-medium ${
                                isActive 
                                  ? category.isHero ? 'text-purple-700 dark:text-purple-300' : 'text-primary'
                                  : 'text-foreground'
                              }`}>
                                {category.name}
                                {category.isHero && ' ⭐'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Risk {category.range[0]}-{category.range[1]}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              isActive 
                                ? category.isHero ? 'text-purple-600' : 'text-primary'
                                : 'text-muted-foreground'
                            }`}>
                              {category.apyRange}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {category.participants} users
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* T-Core HERO Special Benefits */}
                <Card className="bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Crown className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-purple-700 dark:text-purple-300">T-Core HERO Benefits</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>Maximum yield potential (up to 35%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>Pool insurance role - protect others</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>First to earn from protocol success</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        <span>Hero status in community</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Benefits */}
                <div className="space-y-3">
                  <div className="text-sm font-medium">Universal Benefits</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Transparent on-chain mechanics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>No lock-up periods</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>NFT positions for DeFi use</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Self-insurance protection</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* T-Core Waterfall Distribution */}
        <TCoreWaterfallDistribution />

        {/* Start Position CTA */}
        <div className="text-center">
          <Card className={`inline-block border-border p-8 ${
            currentCategory.isHero 
              ? 'bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20 border-purple-200 dark:border-purple-800' 
              : 'bg-card/50'
          }`}>
            <CardContent className="p-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">Ready to Become a T-Core {currentCategory.isHero ? 'HERO' : 'User'}?</h3>
                  <p className="text-muted-foreground">
                    {currentCategory.isHero 
                      ? 'Join the heroes who protect the pool and earn maximum yields.'
                      : 'Start earning with your selected risk category immediately.'
                    }
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border ${
                  currentCategory.isHero
                    ? 'bg-gradient-to-r from-purple-100 to-yellow-100 dark:from-purple-950/30 dark:to-yellow-950/30 border-purple-300 dark:border-purple-700'
                    : 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20'
                }`}>
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">Your Position</div>
                    <div className={`text-lg font-bold ${
                      currentCategory.isHero ? 'text-purple-600' : 'text-primary'
                    }`}>
                      {currentCategory.name} • {currentCategory.range[0]}-{currentCategory.range[1]} • {currentCategory.apyRange}
                      {currentCategory.isHero && ' ⭐'}
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className={`w-full sm:w-auto ${
                    currentCategory.isHero 
                      ? 'bg-gradient-to-r from-purple-500 to-yellow-500 hover:from-purple-600 hover:to-yellow-600 text-white'
                      : ''
                  }`}
                >
                  {currentCategory.isHero && <Crown className="w-4 h-4 mr-2" />}
                  Start as {currentCategory.name}
                  {currentCategory.isHero && ' HERO'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RiskSelection;