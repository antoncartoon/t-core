import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Shield, DollarSign, TrendingUp, Lock, Clock } from 'lucide-react';
import DynamicPerformanceFeeCompact from './DynamicPerformanceFeeCompact';
import { TCORE_STATS } from '@/data/tcoreData';
const TransparencyPreview = () => {
  // Performance fee allocation data (as per Knowledge document)
  const feeAllocation = [{
    name: 'Bonus Yield',
    value: 25,
    color: '#22c55e'
  }, {
    name: 'Buyback TDD',
    value: 25,
    color: '#3b82f6'
  }, {
    name: 'Protocol Revenue',
    value: 25,
    color: '#8b5cf6'
  }, {
    name: 'Hero Buffer',
    value: 25,
    color: '#f59e0b'
  }];

  // Key metrics as per Knowledge document
  const metrics = [{
    icon: Lock,
    label: 'Overcollateralization',
    value: '>105%',
    description: 'Maintains stable peg',
    color: 'text-green-600'
  }, {
    icon: DollarSign,
    label: 'Performance Fee',
    value: '20%',
    description: 'Transparent allocation',
    color: 'text-blue-600'
  }, {
    icon: TrendingUp,
    label: 'Bonus Yield to Tier 4',
    value: '~74%',
    description: 'Heroes earn residual',
    color: 'text-purple-600'
  }, {
    icon: Clock,
    label: 'Decentralization',
    value: 'Q1 2025',
    description: 'DAO governance launch',
    color: 'text-orange-600'
  }];

  // Real yield sources from tcoreData (Anti-Ponzi breakdown)
  const yieldSources = TCORE_STATS.yieldSources.sources.map(source => ({
    name: source.name,
    percentage: Math.round(source.allocation * 100),
    apy: source.apy * 100
  }));
  return <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
            Protocol Transparency
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real-time insights into T-Core's operations, fees, and security measures
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((metric, index) => <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className={`text-xl font-bold ${metric.color} mb-1`}>
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {metric.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metric.description}
                </div>
              </CardContent>
            </Card>)}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Dynamic Performance Fee Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Dynamic Performance Fee 20% Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicPerformanceFeeCompact />
            </CardContent>
          </Card>

          {/* Yield Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Real Yield Sources (Anti-Ponzi)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldSources} margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>
                    <XAxis dataKey="name" tick={{
                    fontSize: 12
                  }} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{
                    fontSize: 12
                  }} />
                    <Tooltip formatter={(value, name) => [`${value}%`, name === 'percentage' ? 'Allocation' : name]} />
                    <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Yield Sources Detail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {yieldSources.map((source, index) => <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${source.name === 'T-Bills' ? 'bg-green-500' : source.name === 'AAVE' ? 'bg-blue-500' : source.name === 'JLP' ? 'bg-yellow-500' : source.name === 'LP Farming' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                      <span className="text-sm font-medium">{source.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-primary font-medium">{source.percentage}%</span>
                      <span className="text-muted-foreground ml-1">({source.apy.toFixed(1)}% APY)</span>
                    </div>
                  </div>)}
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                
                <div className="text-xs text-green-600 dark:text-green-400 mt-1 text-center">
                  Sustainable, non-ponzi yield structure from real DeFi protocols
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Roadmap */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Security Measures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Multisig Security</div>
                  <div className="text-sm text-muted-foreground">3/5 signatures required for protocol operations</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Quarterly Audits</div>
                  <div className="text-sm text-muted-foreground">Regular security audits by external firms</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">On-Chain Verification</div>
                  <div className="text-sm text-muted-foreground">All operations verifiable on Etherscan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Decentralization Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Current Phase</div>
                  <div className="text-sm text-muted-foreground">Centralized management with multisig security</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Governance Token</div>
                  <div className="text-sm text-muted-foreground">Community voting on protocol parameters</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Full Decentralization</div>
                  <div className="text-sm text-muted-foreground">Complete transition to DAO governance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-warning/20">
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">⚠️ Important Disclaimers</p>
            <p>
              T-Core is experimental DeFi. No guaranteed returns, risk of loss. Not investment advice. 
              Use at own risk. Performance fee 20% allocated to bonus/buyback/protocol revenue/insurance buffer. 
              Centralized management with multisig for security, subject to roadmap decentralization.
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default TransparencyPreview;