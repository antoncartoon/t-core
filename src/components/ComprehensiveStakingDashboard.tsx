
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
  const [activeTab, setActiveTab] = useState('tz-staking'); // Default to ТЗ staking
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      {/* Feature Announcement Banner */}
      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-b border-orange-200 dark:border-orange-800 p-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-orange-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="font-bold text-lg">ТЗ Compliant T-Core Staking Now Live!</h2>
                <p className="text-sm text-muted-foreground">
                  Waterfall distribution, bonus yield heatmap, and stress testing with exact formulas from specification
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              NEW
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="tz-staking" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              ТЗ Staking
            </TabsTrigger>
            <TabsTrigger value="waterfall" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Waterfall
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Positions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Health
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tutorial
            </TabsTrigger>
          </TabsList>

          {/* ТЗ COMPLIANT STAKING INTERFACE - MAIN TAB */}
          <TabsContent value="tz-staking" className="space-y-6">
            <TZCompliantStakingInterface />
            
            <Separator />
            
            {/* Auto Distribute Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Quick Tier Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Safe', range: [0, 9], color: 'bg-green-100 text-green-800' },
                      { name: 'Conservative', range: [10, 29], color: 'bg-blue-100 text-blue-800' },
                      { name: 'Balanced', range: [30, 59], color: 'bg-yellow-100 text-yellow-800' },
                      { name: 'Hero', range: [60, 99], color: 'bg-red-100 text-red-800' }
                    ].map((tier) => (
                      <Button
                        key={tier.name}
                        variant="outline"
                        className={`${tier.color} border-2`}
                        onClick={() => {
                          toast({
                            title: `${tier.name} Tier Selected`,
                            description: `Bucket range: ${tier.range[0]}-${tier.range[1]}`
                          });
                        }}
                      >
                        <div className="text-center">
                          <div>{tier.name}</div>
                          <div className="text-xs opacity-70">
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
          <TabsContent value="waterfall" className="space-y-6">
            <WaterfallDashboardEnhanced />
          </TabsContent>

          {/* POSITIONS TAB */}
          <TabsContent value="positions" className="space-y-6">
            <PositionHealthMonitor />
            <LossCascadeSimulator />
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <RiskAnalyticsDashboard />
          </TabsContent>

          {/* HEALTH TAB */}
          <TabsContent value="health" className="space-y-6">
            <PositionHealthMonitor />
          </TabsContent>

          {/* TUTORIAL TAB */}
          <TabsContent value="tutorial" className="space-y-6">
            <TutorialWalkthrough />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensiveStakingDashboard;
