import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, RefreshCw } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/data/tcoreData';

const MonteCarloSimulator = () => {
  const [simulations, setSimulations] = useState([1000]);
  const [timeHorizon, setTimeHorizon] = useState([12]); // months
  const [selectedTier, setSelectedTier] = useState(4);
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Monte Carlo simulation function
  const runSimulation = () => {
    setIsRunning(true);
    
    const numSims = simulations[0];
    const months = timeHorizon[0];
    const initialStake = 10000;
    
    const tierConfigs = {
      1: { baseAPY: 0.06, volatility: 0.02, riskFactor: 0 },
      2: { baseAPY: 0.092, volatility: 0.15, riskFactor: 0.1 },
      3: { baseAPY: 0.168, volatility: 0.25, riskFactor: 0.3 },
      4: { baseAPY: 0.274, volatility: 0.35, riskFactor: 0.8 }
    };
    
    const config = tierConfigs[selectedTier as keyof typeof tierConfigs];
    const monthlyReturn = config.baseAPY / 12;
    const monthlyVol = config.volatility / Math.sqrt(12);
    
    const outcomes: number[] = [];
    
    for (let i = 0; i < numSims; i++) {
      let value = initialStake;
      
      for (let month = 0; month < months; month++) {
        // Generate random market shock
        const randomShock = (Math.random() - 0.5) * 2; // -1 to 1
        const marketReturn = monthlyReturn + (randomShock * monthlyVol);
        
        // Apply market shock with risk factor
        const lossEvent = Math.random() < 0.05; // 5% chance of loss event per month
        const lossAmount = lossEvent ? value * config.riskFactor * 0.1 : 0;
        
        value = value * (1 + marketReturn) - lossAmount;
      }
      
      outcomes.push(value);
    }
    
    // Calculate statistics
    outcomes.sort((a, b) => a - b);
    const mean = outcomes.reduce((sum, val) => sum + val, 0) / outcomes.length;
    const median = outcomes[Math.floor(outcomes.length / 2)];
    const p5 = outcomes[Math.floor(outcomes.length * 0.05)];
    const p95 = outcomes[Math.floor(outcomes.length * 0.95)];
    
    // Create histogram data
    const bins = 20;
    const minVal = Math.min(...outcomes);
    const maxVal = Math.max(...outcomes);
    const binWidth = (maxVal - minVal) / bins;
    
    const histogramData = [];
    for (let i = 0; i < bins; i++) {
      const binStart = minVal + i * binWidth;
      const binEnd = binStart + binWidth;
      const count = outcomes.filter(val => val >= binStart && val < binEnd).length;
      
      histogramData.push({
        range: `${formatCurrency(binStart)} - ${formatCurrency(binEnd)}`,
        count,
        percentage: (count / outcomes.length) * 100
      });
    }
    
    setResults({
      outcomes,
      statistics: {
        mean,
        median,
        p5,
        p95,
        lossProb: (outcomes.filter(val => val < initialStake).length / outcomes.length) * 100,
        doubleProb: (outcomes.filter(val => val > initialStake * 2).length / outcomes.length) * 100
      },
      histogram: histogramData
    });
    
    setIsRunning(false);
  };
  
  useEffect(() => {
    runSimulation();
  }, [selectedTier]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Monte Carlo Risk Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Simulations: {simulations[0].toLocaleString()}</label>
              <Slider
                value={simulations}
                onValueChange={setSimulations}
                max={5000}
                min={100}
                step={100}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Time Horizon: {timeHorizon[0]} months</label>
              <Slider
                value={timeHorizon}
                onValueChange={setTimeHorizon}
                max={36}
                min={1}
                step={1}
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
            
            <Button 
              onClick={runSimulation} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Run New Simulation
                </>
              )}
            </Button>
          </div>
          
          {/* Results */}
          {results.statistics && (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Mean Outcome</div>
                  <div className="text-lg font-semibold">{formatCurrency(results.statistics.mean)}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Median</div>
                  <div className="text-lg font-semibold">{formatCurrency(results.statistics.median)}</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600">5th Percentile</div>
                  <div className="text-lg font-semibold text-red-600">{formatCurrency(results.statistics.p5)}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">95th Percentile</div>
                  <div className="text-lg font-semibold text-green-600">{formatCurrency(results.statistics.p95)}</div>
                </div>
              </div>
              
              {/* Probability Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="destructive">
                  {results.statistics.lossProb.toFixed(1)}% Loss Probability
                </Badge>
                <Badge variant="default" className="bg-green-600">
                  {results.statistics.doubleProb.toFixed(1)}% Double Money Probability
                </Badge>
              </div>
              
              {/* Histogram */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.histogram}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="range" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'count' ? `${value} outcomes` : `${value}%`,
                        name === 'count' ? 'Frequency' : 'Percentage'
                      ]}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Risk Insights */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Risk Insights</h4>
                <div className="space-y-2 text-sm text-blue-600">
                  <div>
                    • <strong>Best Case (95th percentile):</strong> {formatCurrency(results.statistics.p95)} 
                    ({formatPercentage((results.statistics.p95 - 10000) / 10000)} return)
                  </div>
                  <div>
                    • <strong>Worst Case (5th percentile):</strong> {formatCurrency(results.statistics.p5)} 
                    ({formatPercentage((results.statistics.p5 - 10000) / 10000)} loss)
                  </div>
                  <div>
                    • <strong>Risk-Adjusted Return:</strong> Expected {formatCurrency(results.statistics.mean)} 
                    with {results.statistics.lossProb.toFixed(1)}% chance of loss
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonteCarloSimulator;