
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, TrendingUp, Activity } from 'lucide-react';

const RiskMetrics = () => {
  const riskMetrics = [
    {
      category: 'Credit Risk',
      level: 'Low',
      score: 2.1,
      icon: Shield,
      description: 'Weighted average credit rating: AA+',
      color: 'text-green-600 border-green-600'
    },
    {
      category: 'Duration Risk',
      level: 'Moderate',
      score: 4.2,
      icon: TrendingUp,
      description: 'Average duration: 2.3 years',
      color: 'text-yellow-600 border-yellow-600'
    },
    {
      category: 'Liquidity Risk',
      level: 'Low',
      score: 1.8,
      icon: Activity,
      description: '10% cash reserves maintained',
      color: 'text-green-600 border-green-600'
    },
    {
      category: 'Concentration Risk',
      level: 'Low',
      score: 2.5,
      icon: AlertTriangle,
      description: 'Max single issuer: 15%',
      color: 'text-green-600 border-green-600'
    }
  ];

  const overallRisk = {
    score: 2.7,
    level: 'Conservative',
    confidence: 95
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h3 className="font-medium">Overall Risk Score</h3>
            <Badge variant="outline" className="text-green-600 border-green-600 self-start sm:self-center">
              {overallRisk.level}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Risk Level</span>
                <span>{overallRisk.score}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(overallRisk.score / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="font-bold">{overallRisk.confidence}%</p>
            </div>
          </div>
        </div>

        {/* Individual Risk Metrics */}
        <div className="space-y-4">
          {riskMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.category} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
                <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h4 className="font-medium">{metric.category}</h4>
                    <Badge variant="outline" className={`text-xs ${metric.color} self-start sm:self-center`}>
                      {metric.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{metric.description}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          metric.level === 'Low' ? 'bg-green-500' :
                          metric.level === 'Moderate' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(metric.score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{metric.score}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskMetrics;
