
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, TrendingDown, Shield, Activity } from 'lucide-react';
import { TierUtilizationChart } from './TierUtilizationChart';
import { PositionHealthMonitor } from './PositionHealthMonitor';
import InsurancePoolStatus from '../waterfall/InsurancePoolStatus';
import RiskDistributionChart from './RiskDistributionChart';

const RiskAnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Protocol Risk Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PositionHealthMonitor />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AreaChart className="w-5 h-5" />
              Tier Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TierUtilizationChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsurancePoolStatus 
          currentAmount={875000}
          targetAmount={1250000}
          coverageRatio={0.7}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Risk Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <RiskDistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAnalyticsDashboard;
