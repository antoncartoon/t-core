
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingDown, 
  Wallet, 
  BarChart3, 
  Shield, 
  BookOpen,
  Calculator,
  Target,
  Sparkles
} from 'lucide-react';

// Import all components
import WaterfallDashboardEnhanced from './waterfall/WaterfallDashboardEnhanced';
import AutoDistributeButton from './waterfall/AutoDistributeButton';
import RiskAnalyticsDashboard from './analytics/RiskAnalyticsDashboard';
import LossCascadeSimulator from './analytics/LossCascadeSimulator';
import { PositionHealthMonitor } from './analytics/PositionHealthMonitor';
import TutorialWalkthrough from './tutorial/TutorialWalkthrough';
import TZCompliantStakingInterface from './TZCompliantStakingInterface';

interface ComprehensiveDashboardProps {
  className?: string;
}

const ComprehensiveStakingDashboard: React.FC<ComprehensiveDashboardProps> = ({ 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('staking');
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      {/* Feature Announcement Banner */}
      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-b border-orange-200 dark:border-orange-800 p-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="relative flex-shrink-0">
                <Sparkles className="h-6 w-6 text-orange-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-lg sm:text-xl leading-tight">T-Core Staking Now Live!</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Waterfall distribution, bonus yield optimization, and mathematical precision with transparent formulas
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 flex-shrink-0">
              NEW
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-optimized TabsList */}
          <div className="mb-6 overflow-x-auto">
            <TabsList className="grid grid-cols-6 min-w-full sm:min-w-0 h-auto p-1">
              <TabsTrigger value="staking" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm">
                <Calculator className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Staking</span>
              </TabsTrigger>
              <TabsTrigger value="waterfall" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm">
                <TrendingDown className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Waterfall</span>
              </TabsTrigger>
              <TabsTrigger value="positions" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm">
                <Wallet className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Positions</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm">
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Health</span>
              </TabsTrigger>
              <TabsTrigger value="tutorial" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Tutorial</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* STAKING INTERFACE - MAIN TAB */}
          <TabsContent value="staking" className="space-y-4 sm:space-y-6">
            <TZCompliantStakingInterface />
            
            <Separator />
            
            {/* Auto Distribute Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <AutoDistributeButton 
                amount={10000}
                onDistribute={(ranges) => {
                  toast({
                    title: "Auto-distribution applied!",
                    description: `Distributed across ${ranges.length} underweight tiers for maximum bonus yield.`
                  });
                }}
              />
              
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Target className="h-5 w-5 flex-shrink-0" />
                    <span>Quick Tier Selection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Safe', range: [0, 9], color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
                      { name: 'Conservative', range: [10, 29], color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
                      { name: 'Balanced', range: [30, 59], color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
                      { name: 'Hero', range: [60, 99], color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
                    ].map((tier) => (
                      <Button
                        key={tier.name}
                        variant="outline"
                        className={`${tier.color} border-2 h-auto py-3`}
                        onClick={() => {
                          toast({
                            title: `${tier.name} Tier Selected`,
                            description: `Bucket range: ${tier.range[0]}-${tier.range[1]}`
                          });
                        }}
                      >
                        <div className="text-center w-full">
                          <div className="font-medium text-sm">{tier.name}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {tier.range[0]}-{tier.range[1]}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* WATERFALL TAB */}
          <TabsContent value="waterfall" className="space-y-4 sm:space-y-6">
            <WaterfallDashboardEnhanced />
          </TabsContent>

          {/* POSITIONS TAB */}
          <TabsContent value="positions" className="space-y-4 sm:space-y-6">
            <PositionHealthMonitor />
            <LossCascadeSimulator />
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <RiskAnalyticsDashboard />
          </TabsContent>

          {/* HEALTH TAB */}
          <TabsContent value="health" className="space-y-4 sm:space-y-6">
            <PositionHealthMonitor />
          </TabsContent>

          {/* TUTORIAL TAB */}
          <TabsContent value="tutorial" className="space-y-4 sm:space-y-6">
            <TutorialWalkthrough />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensiveStakingDashboard;
