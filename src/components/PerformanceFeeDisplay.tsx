import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, Shield, Zap } from 'lucide-react';
import { getFeeAllocationSummary, PERFORMANCE_FEE } from '@/utils/feeAllocationLogic';

interface PerformanceFeeDisplayProps {
  totalYield?: number;
  showChart?: boolean;
  className?: string;
}

const PerformanceFeeDisplay: React.FC<PerformanceFeeDisplayProps> = ({
  totalYield = 1000000,
  showChart = true,
  className = ''
}) => {
  const feeAllocation = getFeeAllocationSummary();
  const performanceFee = totalYield * PERFORMANCE_FEE;
  
  const chartData = feeAllocation.map(item => ({
    name: item.name,
    value: item.percentage,
    description: item.description,
    color: getColorByType(item.color)
  }));

  const icons = {
    'Bonus Yield': TrendingUp,
    'TDD Buyback': DollarSign,
    'Protocol Revenue': Zap,
    'Hero Buffer': Shield,
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Performance Fee Allocation
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {(PERFORMANCE_FEE * 100).toFixed(0)}% of Total Yield
          </Badge>
          <Badge variant="secondary">
            ${(performanceFee / 1000000).toFixed(1)}M Annual
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showChart && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="space-y-3">
            {feeAllocation.map((item, index) => {
              const Icon = icons[item.name as keyof typeof icons] || DollarSign;
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Icon className="h-5 w-5 mt-0.5 text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium">{item.name}</div>
                      <Badge variant="outline">{item.percentage}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-info/10 rounded-lg">
          <div className="text-sm">
            <strong>Transparency Note:</strong> The 20% performance fee ensures protocol sustainability 
            while enhancing user yields through bonus distribution, maintaining TDD peg stability via 
            buybacks, and providing insurance protection for all participants.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getColorByType(type: string): string {
  switch (type) {
    case 'success': return 'hsl(var(--success))';
    case 'info': return 'hsl(var(--info))';
    case 'primary': return 'hsl(var(--primary))';
    case 'warning': return 'hsl(var(--warning))';
    default: return 'hsl(var(--primary))';
  }
}

export default PerformanceFeeDisplay;