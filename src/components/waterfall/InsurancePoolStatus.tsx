
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface InsurancePoolStatusProps {
  currentAmount: number;
  targetAmount: number;
  coverageRatio: number;
}

const InsurancePoolStatus = ({ 
  currentAmount, 
  targetAmount, 
  coverageRatio 
}: InsurancePoolStatusProps) => {
  const percentage = (currentAmount / targetAmount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Insurance Pool Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Balance</span>
            <span className="font-medium">${currentAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target Amount</span>
            <span className="font-medium">${targetAmount.toLocaleString()}</span>
          </div>
        </div>

        <Progress value={percentage} className="h-2" />
        
        <div className="pt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Coverage Ratio</span>
            <span className="text-lg font-semibold">{(coverageRatio * 100).toFixed(1)}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {coverageRatio >= 1 
              ? 'Fully protected against potential losses'
              : 'Building insurance reserves for better protection'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsurancePoolStatus;
