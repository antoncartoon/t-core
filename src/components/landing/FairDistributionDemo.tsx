
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';

const FairDistributionDemo = () => {
  const [poolYield, setPoolYield] = useState([12]);
  
  // Demo scenarios showing fair distribution
  const scenarios = [
    { apy: 5, position: 1, payout: "First", color: "bg-green-500" },
    { apy: 8, position: 2, payout: "Second", color: "bg-blue-500" },
    { apy: 12, position: 3, payout: "Third", color: "bg-yellow-500" },
    { apy: 18, position: 4, payout: "Fourth", color: "bg-orange-500" },
    { apy: 25, position: 5, payout: "Last", color: "bg-red-500" }
  ];

  const getCurrentPayouts = () => {
    const currentYield = poolYield[0];
    return scenarios.map(scenario => ({
      ...scenario,
      receiving: currentYield >= scenario.apy,
      percentage: currentYield >= scenario.apy ? scenario.apy : 0
    }));
  };

  return (
    <section id="fair-distribution" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            Fair Distribution Model
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our transparent queue system ensures everyone gets paid fairly. 
            Lower APY requests get paid first, higher requests get paid only when there's enough yield.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Interactive Demo */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Interactive Demo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Current Pool Yield: {poolYield[0]}%
                </label>
                <Slider
                  value={poolYield}
                  onValueChange={setPoolYield}
                  max={30}
                  min={3}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3%</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Payout Queue Status:</h4>
                {getCurrentPayouts().map((scenario, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      scenario.receiving ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${scenario.color}`} />
                      <span className="font-medium">{scenario.apy}% APY Request</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        scenario.receiving ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {scenario.receiving ? `✓ Receiving ${scenario.apy}%` : '⏳ Waiting'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Queue-Based System</h3>
                    <p className="text-sm text-muted-foreground">
                      Users requesting lower APY get paid first. This ensures conservative users always receive their returns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Fair Allocation</h3>
                    <p className="text-sm text-muted-foreground">
                      When pool generates 12% yield, everyone requesting ≤12% gets their full amount. Higher requests wait for better pool performance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">No Hidden Risks</h3>
                    <p className="text-sm text-muted-foreground">
                      Higher yields come from optimization and better pool performance, not from investing in volatile assets or risky protocols.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FairDistributionDemo;
