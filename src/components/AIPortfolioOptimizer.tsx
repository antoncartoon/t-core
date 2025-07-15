import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, Target, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface OptimizationSuggestion {
  id: string;
  type: 'rebalance' | 'diversify' | 'hedge' | 'yield';
  title: string;
  description: string;
  expectedReturn: number;
  riskReduction: number;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
}

interface AIAnalysis {
  score: number;
  efficiency: number;
  risk: number;
  diversification: number;
  yield: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
}

const AIPortfolioOptimizer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Mock AI analysis data
  const mockAnalysis: AIAnalysis = {
    score: 87,
    efficiency: 92,
    risk: 34,
    diversification: 78,
    yield: 91,
    marketSentiment: 'bullish'
  };

  const mockSuggestions: OptimizationSuggestion[] = [
    {
      id: '1',
      type: 'rebalance',
      title: 'Rebalance High-Risk Positions',
      description: 'Move 15% from high-risk to medium-risk positions to optimize risk-adjusted returns',
      expectedReturn: 2.3,
      riskReduction: 12,
      confidence: 94,
      priority: 'high'
    },
    {
      id: '2',
      type: 'diversify',
      title: 'Increase Protocol Diversification',
      description: 'Add positions in Compound and MakerDAO to reduce concentration risk',
      expectedReturn: 1.8,
      riskReduction: 8,
      confidence: 87,
      priority: 'high'
    },
    {
      id: '3',
      type: 'yield',
      title: 'Optimize Yield Farming',
      description: 'Switch to higher-yield opportunities in Curve and Yearn Finance',
      expectedReturn: 4.2,
      riskReduction: -2,
      confidence: 82,
      priority: 'medium'
    }
  ];

  const performanceData = [
    { month: 'Jan', current: 12.5, optimized: 14.2 },
    { month: 'Feb', current: 13.8, optimized: 15.6 },
    { month: 'Mar', current: 11.2, optimized: 13.8 },
    { month: 'Apr', current: 15.3, optimized: 17.1 },
    { month: 'May', current: 14.7, optimized: 16.9 },
    { month: 'Jun', current: 16.2, optimized: 18.4 }
  ];

  const allocationData = [
    { name: 'Low Risk', value: 40, color: 'hsl(var(--chart-1))' },
    { name: 'Medium Risk', value: 35, color: 'hsl(var(--chart-2))' },
    { name: 'High Risk', value: 25, color: 'hsl(var(--chart-3))' }
  ];

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalysis(mockAnalysis);
    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);
  };

  const implementSuggestion = (suggestionId: string) => {
    setSelectedSuggestion(suggestionId);
    // Simulate implementation
    setTimeout(() => {
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      setSelectedSuggestion(null);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <Target className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">AI Portfolio Optimizer</h2>
            <p className="text-muted-foreground">Machine learning-powered portfolio optimization</p>
          </div>
        </div>
        <Button 
          onClick={runAIAnalysis} 
          disabled={isAnalyzing}
          className="gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing portfolio composition...</span>
                <span>Step 1 of 4</span>
              </div>
              <Progress value={75} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>✓ Risk assessment complete</div>
                <div>✓ Yield optimization analyzed</div>
                <div>⏳ Market sentiment analysis</div>
                <div>⏳ Generating recommendations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Portfolio Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.score}/100</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.risk}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysis.risk <= 30 ? 'Conservative' : analysis.risk <= 60 ? 'Moderate' : 'Aggressive'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    Market Sentiment
                    {getSentimentIcon(analysis.marketSentiment)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{analysis.marketSentiment}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on 24h market data
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Efficiency</span>
                      <span>{analysis.efficiency}%</span>
                    </div>
                    <Progress value={analysis.efficiency} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Diversification</span>
                      <span>{analysis.diversification}%</span>
                    </div>
                    <Progress value={analysis.diversification} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yield Optimization</span>
                      <span>{analysis.yield}%</span>
                    </div>
                    <Progress value={analysis.yield} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {allocationData.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="text-sm font-medium">{item.value}%</div>
                        <div className="text-xs text-muted-foreground">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                        <Badge variant={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <CardDescription>{suggestion.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            +{suggestion.expectedReturn.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Expected Return</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {suggestion.riskReduction > 0 ? '-' : ''}{Math.abs(suggestion.riskReduction)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Risk Change</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{suggestion.confidence}%</div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => implementSuggestion(suggestion.id)}
                        disabled={selectedSuggestion === suggestion.id}
                        className="w-full"
                      >
                        {selectedSuggestion === suggestion.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                            Implementing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Implement Suggestion
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your portfolio is already optimized! No immediate suggestions at this time.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="projections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Projection</CardTitle>
                <CardDescription>
                  Comparing current vs AI-optimized portfolio performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Line 
                        type="monotone" 
                        dataKey="current" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                        name="Current"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="optimized" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="AI Optimized"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">14.8%</div>
                    <div className="text-sm text-muted-foreground">Current APY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">17.2%</div>
                    <div className="text-sm text-muted-foreground">Projected APY</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AIPortfolioOptimizer;