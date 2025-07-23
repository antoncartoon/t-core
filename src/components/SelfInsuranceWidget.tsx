import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SELF_INSURANCE_POOL } from '@/utils/protocolConstants';

const SelfInsuranceWidget = () => {
  const insuranceData = {
    poolSize: SELF_INSURANCE_POOL,
    totalProtected: 12500000,
    protectionRatio: 9.6,
    weeklyInflow: 8500,
    avgProtocolFees: 0.5
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5 text-emerald-600" />
          Self-Insurance Pool
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Self-insurance pool. You are protected by yield generated.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-light text-emerald-600">
              {formatCurrency(insuranceData.poolSize)}
            </p>
            <p className="text-xs text-muted-foreground">Pool Size</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-primary">
              {insuranceData.protectionRatio}%
            </p>
            <p className="text-xs text-muted-foreground">Protection Ratio</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Coverage Level</span>
            <span className="font-medium">{insuranceData.protectionRatio}%</span>
          </div>
          <Progress value={insuranceData.protectionRatio} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-muted-foreground">Weekly Inflow</span>
            </div>
            <p className="text-sm font-medium">+{formatCurrency(insuranceData.weeklyInflow)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Protocol Fees</p>
            <p className="text-sm font-medium">{insuranceData.avgProtocolFees}% → Pool</p>
          </div>
        </div>

        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Protocol fees automatically strengthen the insurance pool, protecting all stakers
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfInsuranceWidget;