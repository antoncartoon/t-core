import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Star, Crown, TrendingUp } from 'lucide-react';
import InteractiveRiskYieldChart from './InteractiveRiskYieldChart';
const SimpleRiskTiers = () => {
  const tiers = [{
    name: 'Safe',
    apy: '6%',
    risk: 'Zero Loss',
    description: 'T-Bills*1.2 fixed guarantee',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    formula: 'Fixed: T-Bills * 1.2'
  }, {
    name: 'Conservative',
    apy: '~9%',
    risk: 'Low Risk',
    description: 'Fixed + small bonus yield',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    formula: 'Small bonus yield'
  }, {
    name: 'Balanced',
    apy: '~13%',
    risk: 'Medium Risk',
    description: 'Moderate bonus yield ~18%',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    formula: 'Medium bonus + bonus pool'
  }, {
    name: 'Hero',
    apy: 'Up to 35%',
    risk: 'High Risk',
    description: 'Max bonus yield ~74%',
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    isHero: true,
    formula: 'High bonus + 74% bonus share'
  }];
  return <section className="py-16 sm:py-20 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
            Choose Your Risk Tier
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Four tiers designed for different risk appetites. Start safe, scale up when ready, or deploy your capital to several risk tiers.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => <Card key={index} className={`border-2 hover:shadow-lg transition-all duration-300 ${tier.borderColor} ${tier.bgColor}`}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tier.isHero ? 'bg-gradient-to-r from-purple-500 to-yellow-500' : 'bg-muted/30'}`}>
                    <tier.icon className={`w-6 h-6 ${tier.isHero ? 'text-white' : tier.color}`} />
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${tier.color}`}>
                  {tier.name}
                  {tier.isHero && <span className="ml-2 text-yellow-500">⭐</span>}
                </h3>
                
                <div className="mb-4">
                  <div className={`text-3xl font-bold mb-1 ${tier.color}`}>
                    {tier.apy}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tier.risk}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {tier.description}
                </p>
                
              </CardContent>
            </Card>)}
        </div>
        
        <div className="text-center mt-12">
          
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="inline-block p-3 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-950/20 dark:to-yellow-950/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 text-purple-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Waterfall: Heroes absorb losses first, earn bonus yield first</span>
              </div>
            </Card>
            
          </div>
        </div>

        <InteractiveRiskYieldChart />
      </div>
    </section>;
};
export default SimpleRiskTiers;