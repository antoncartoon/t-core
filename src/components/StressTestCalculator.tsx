
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, DollarSign, Shield, TrendingDown, History, BarChart3 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/data/tcoreData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileGestureHandler from '../MobileGestureHandler';

interface HistoricalScenario {
  name: string;
  year: string;
  description: string;
  marketDrop: number;
  impact: 'High' | 'Medium' | 'Low';
}

const StressTestCalculator = () => {
  const [stakeAmount, setStakeAmount] = useState([10000]);
  const [marketDrop, setMarketDrop] = useState([0.2]); // 20% default
  const [selectedTier, setSelectedTier] = useState(4);
  const [activeTab, setActiveTab] = useState('calculator');
  const isMobile = useIsMobile();
  
  // Historical scenarios for comparison
  const historicalScenarios: HistoricalScenario[] = [
    {
      name: 'Financial Crisis',
      year: '2008',
      description: 'Global financial crisis triggered by the collapse of Lehman Brothers',
      marketDrop: 0.35, // 35%
      impact: 'High'
    },
    {
      name: 'COVID-19 Crash',
      year: '2020',
      description: 'Market crash due to the global COVID-19 pandemic',
      marketDrop: 0.25, // 25%
      impact: 'High'
    },
    {
      name: 'FTX Collapse',
      year: '2022',
      description: 'Crypto market drop following the collapse of FTX exchange',
      marketDrop: 0.15, // 15%
      impact: 'Medium'
    },
    {
      name: 'Bear Market',
      year: '2022',
      description: 'Extended bear market in equities and crypto markets',
      marketDrop: 0.18, // 18%
      impact: 'Medium'
    },
    {
      name: 'Interest Rate Hike',
      year: '2023',
      description: 'Market reaction to unexpected interest rate hikes',
      marketDrop: 0.08, // 8%
      impact: 'Low'
    }
  ];
  
  // Risk calculations based on subordination
  const calculateRisk = (tier: number, drop: number) => {
    const riskFactors = {
      1: 0,      // Tier 1: 0% risk (fixed guaranteed)
      2: 0.1,    // Tier 2: 10% of losses
      3: 0.3,    // Tier 3: 30% of losses  
      4: 0.8     // Tier 4: 80% of losses (absorbs first)
    };
    
    return drop * riskFactors[tier as keyof typeof riskFactors];
  };
  
  const absoluteLoss = stakeAmount[0] * calculateRisk(selectedTier, marketDrop[0]);
  const lossPercentage = calculateRisk(selectedTier, marketDrop[0]) * 100;
  
  // APY calculations
  const tierAPYs = {
    1: 6.0,   // Fixed tier 1
    2: 9.2,   // Base + small bonus
    3: 16.8,  // Base + medium bonus
    4: 27.4   // Base + high bonus + surplus
  };
  
  const annualReturn = stakeAmount[0] * (tierAPYs[selectedTier as keyof typeof tierAPYs] / 100);
  const netReturn = annualReturn - absoluteLoss;
  
  // Calculate losses for historical scenarios
  const getHistoricalScenarioData = () => {
    return historicalScenarios.map(scenario => {
      const scenarioLoss = stakeAmount[0] * calculateRisk(selectedTier, scenario.marketDrop);
      const scenarioAPY = stakeAmount[0] * (tierAPYs[selectedTier as keyof typeof tierAPYs] / 100);
      const netProfit = scenarioAPY - scenarioLoss;
      
      return {
        name: scenario.name,
        year: scenario.year,
        loss: scenarioLoss,
        return: scenarioAPY,
        net: netProfit,
        marketDrop: scenario.marketDrop * 100,
        impactColor: scenario.impact === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
          : scenario.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      };
    });
  };
  
  // Chart data for comparison
  const comparisonChartData = getHistoricalScenarioData().map(scenario => ({
    name: scenario.name,
    'Gross Return': scenario.return,
    'Loss': -scenario.loss,
    'Net Profit': scenario.net
  }));
  
  // Handle mobile swipe
  const handleSwipeLeft = () => {
    if (activeTab === 'calculator') setActiveTab('historical');
    else if (activeTab === 'historical') setActiveTab('comparison');
  };
  
  const handleSwipeRight = () => {
    if (activeTab === 'comparison') setActiveTab('historical');
    else if (activeTab === 'historical') setActiveTab('calculator');
  };

  const content = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Stress Test Calculator
        </CardTitle>
        <CardDescription>
          Simulate performance in adverse market conditions and compare to historical events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6">
            {/* Input Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Stake Amount: {formatCurrency(stakeAmount[0])}</label>
                <Slider
                  value={stakeAmount}
                  onValueChange={setStakeAmount}
                  max={100000}
                  min={1000}
                  step={1000}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Market Drop: -{formatPercentage(marketDrop[0])}</label>
                <Slider
                  value={marketDrop}
                  onValueChange={setMarketDrop}
                  max={0.5}
                  min={0.1}
                  step={0.05}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Select Tier:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedTier === tier
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      Tier {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-900">
                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2 dark:text-red-300">
                  <TrendingDown className="w-4 h-4" />
                  Potential Loss
                </h4>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(absoluteLoss)}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {lossPercentage.toFixed(1)}% of stake at risk
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/10 dark:border-green-900">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2 dark:text-green-300">
                  <DollarSign className="w-4 h-4" />
                  Net Annual Return
                </h4>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(netReturn)}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    After absorbing losses
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Breakdown */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Risk Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Annual APY (Tier {selectedTier}):</span>
                  <span className="font-medium">{tierAPYs[selectedTier as keyof typeof tierAPYs]}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Return:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(annualReturn)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stress Loss:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(absoluteLoss)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Net Return:</span>
                  <span className={`font-medium ${netReturn > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(netReturn)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Tier Comparison */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Tier Comparison ({formatPercentage(marketDrop[0])} Drop)</h4>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((tier) => {
                  const tierLoss = stakeAmount[0] * calculateRisk(tier, marketDrop[0]);
                  const tierAPY = tierAPYs[tier as keyof typeof tierAPYs];
                  const tierReturn = stakeAmount[0] * (tierAPY / 100);
                  const tierNet = tierReturn - tierLoss;
                  
                  return (
                    <div key={tier} className="p-2 bg-background rounded border text-center">
                      <div className="text-xs font-medium mb-1">Tier {tier}</div>
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">{formatCurrency(tierReturn)}</div>
                      <div className="text-xs text-red-600 dark:text-red-400">-{formatCurrency(tierLoss)}</div>
                      <div className="text-xs font-medium border-t pt-1">
                        {formatCurrency(tierNet)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="historical" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Historical Stress Scenarios</h3>
              </div>
              
              <div className="space-y-3">
                {getHistoricalScenarioData().map((scenario, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center p-3 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{scenario.name}</span>
                        <span className="text-xs text-muted-foreground">({scenario.year})</span>
                      </div>
                      <Badge variant="outline" className={scenario.impactColor}>
                        {scenario.marketDrop.toFixed(0)}% Drop
                      </Badge>
                    </div>
                    
                    <div className="p-3 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Return</p>
                        <p className="font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(scenario.return)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Loss</p>
                        <p className="font-medium text-red-600 dark:text-red-400">
                          {formatCurrency(scenario.loss)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Net</p>
                        <p className={`font-medium ${scenario.net > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(scenario.net)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="px-3 pb-3">
                      <button 
                        className="text-xs text-primary"
                        onClick={() => {
                          setMarketDrop([scenario.marketDrop]);
                          setActiveTab('calculator');
                        }}
                      >
                        Apply this scenario
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Scenario Comparison</h3>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{ fontSize: 12 }}
                      tickMargin={5}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="Gross Return" fill="hsl(142.1 76.2% 36.3%)" />
                    <Bar dataKey="Loss" fill="hsl(346.8 77.2% 49.8%)" />
                    <Bar dataKey="Net Profit" fill="hsl(262.1 83.3% 57.8%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center justify-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Gross Return</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Loss</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Net Profit</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Insurance Explanation */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-6 dark:bg-blue-900/10 dark:border-blue-900">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2 dark:text-blue-300">
            <Shield className="w-4 h-4" />
            Subordination Protection
          </h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Higher tiers absorb losses first, protecting lower tiers. This insurance mechanism ensures 
            Tier 1 remains risk-free while Tier 4 gets maximum upside as compensation for first-loss risk.
          </p>
        </div>
      </CardContent>
    </Card>
  );
  
  // Wrap content with gesture handler for mobile
  return isMobile ? (
    <MobileGestureHandler
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
    >
      {content}
    </MobileGestureHandler>
  ) : content;
};

export default StressTestCalculator;
