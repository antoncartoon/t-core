import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Shield, DollarSign, TrendingUp, Lock, Clock } from 'lucide-react';

const TransparencyPreview = () => {
  // Performance fee allocation data (as per Knowledge document)
  const feeAllocation = [
    { name: 'Bonus Yield', value: 25, color: '#22c55e' },
    { name: 'Buyback TDD', value: 25, color: '#3b82f6' },
    { name: 'Protocol Revenue', value: 25, color: '#8b5cf6' },
    { name: 'Insurance Buffer', value: 25, color: '#f59e0b' }
  ];

  // Key metrics as per Knowledge document
  const metrics = [
    {
      icon: Lock,
      label: 'Overcollateralization',
      value: '>105%',
      description: 'Real asset backing',
      color: 'text-green-600'
    },
    {
      icon: DollarSign,
      label: 'Performance Fee',
      value: '20%',
      description: 'Transparent allocation',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Surplus to Tier4',
      value: '~74%',
      description: 'Insurance compensation',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      label: 'Decentralization',
      value: 'Q1 2026',
      description: 'DAO governance launch',
      color: 'text-orange-600'
    }
  ];

  // Yield sources breakdown (60% fixed, 40% bonus)
  const yieldSources = [
    { name: 'T-Bills', percentage: 25 },
    { name: 'AAVE', percentage: 20 },
    { name: 'JLP', percentage: 15 },
    { name: 'LP Farming', percentage: 15 },
    { name: 'Protocol Revenue', percentage: 25 }
  ];

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
            Transparency & Security
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Centralized management with multisig security (3/5 signatures), quarterly audits, 
            and full on-chain verification. Roadmap to complete decentralization.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center">
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
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Performance Fee Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Performance Fee 20% Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feeAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {feeAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {feeAllocation.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
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
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldSources} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>60% Fixed yields + 40% Performance bonus from real DeFi strategies</p>
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
                  <div className="font-medium">Multisig 3/5 Signatures</div>
                  <div className="text-sm text-muted-foreground">Team wallet with Gnosis Safe standards</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Quarterly Audits</div>
                  <div className="text-sm text-muted-foreground">External security reviews (e.g., Quantstamp)</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">On-Chain Verification</div>
                  <div className="text-sm text-muted-foreground">All transactions verifiable on Etherscan</div>
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
                  <div className="font-medium">Current: Centralized Management</div>
                  <div className="text-sm text-muted-foreground">Multisig for security and efficiency</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Q1 2026: Governance Token</div>
                  <div className="text-sm text-muted-foreground">DAO voting on bonus distribution and upgrades</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Full Decentralization</div>
                  <div className="text-sm text-muted-foreground">Community control over all protocol parameters</div>
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
    </section>
  );
};

export default TransparencyPreview;