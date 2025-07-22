
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  Wallet, 
  BarChart3, 
  BookOpen,
  Sparkles
} from 'lucide-react';

// Import components
import RiskAnalyticsDashboard from './analytics/RiskAnalyticsDashboard';
import TutorialWalkthrough from './tutorial/TutorialWalkthrough';
import { SimplifiedStakingInterface } from './SimplifiedStakingInterface';
import { UserPositionsAndHealth } from './UserPositionsAndHealth';

interface ComprehensiveDashboardProps {
  className?: string;
}

const ComprehensiveStakingDashboard: React.FC<ComprehensiveDashboardProps> = ({ 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('staking');

  return (
    <div className="space-y-6">
      {/* Feature Announcement Banner */}
      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-b border-orange-200 dark:border-orange-800 p-3 sm:p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base sm:text-lg xl:text-xl leading-tight">T-Core Staking Live!</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed">
                4 simple risk tiers, waterfall distribution, and transparent yield calculations
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 flex-shrink-0 text-xs">
            SIMPLIFIED
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Responsive TabsList */}
        <div className="mb-4 sm:mb-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-auto min-w-full sm:min-w-0 p-1">
              <TabsTrigger 
                value="staking" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap"
              >
                <Calculator className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Staking</span>
              </TabsTrigger>
              <TabsTrigger 
                value="positions" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap"
              >
                <Wallet className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>My Positions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tutorial" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap"
              >
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Tutorial</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* STAKING INTERFACE - SIMPLIFIED */}
        <TabsContent value="staking" className="space-y-4 sm:space-y-6">
          <SimplifiedStakingInterface />
        </TabsContent>

        {/* USER POSITIONS & HEALTH - COMBINED */}
        <TabsContent value="positions" className="space-y-4 sm:space-y-6">
          <UserPositionsAndHealth />
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <RiskAnalyticsDashboard />
        </TabsContent>

        {/* TUTORIAL TAB */}
        <TabsContent value="tutorial" className="space-y-4 sm:space-y-6">
          <TutorialWalkthrough />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveStakingDashboard;
