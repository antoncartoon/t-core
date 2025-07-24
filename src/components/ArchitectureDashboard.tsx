import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Users, 
  Vote, 
  Shield, 
  ExternalLink, 
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface ArchitectureDashboardProps {
  className?: string;
}

const ArchitectureDashboard: React.FC<ArchitectureDashboardProps> = ({ className }) => {
  // Timeline data
  const roadmapPhases = [
    {
      phase: 'Phase 1',
      title: 'Centralized Fixed Base',
      status: 'current',
      period: 'Now - Q4 2024',
      description: 'Team manages T-Bills/oracles for fixed_base enforcement (5.16% guaranteed)',
      features: ['Centralized fixed_base = T-Bills * 1.2', 'Transparent on-chain tracking', 'Multisig governance'],
      progress: 100,
      icon: Building2
    },
    {
      phase: 'Phase 2',
      title: 'Hybrid Governance',
      status: 'planned',
      period: 'Q1 2025',
      description: 'Introduce community voting for bonus optimization while maintaining fixed guarantees',
      features: ['Fixed_base remains centralized', 'Community votes on k parameter', 'Protocol weight voting'],
      progress: 30,
      icon: Vote
    },
    {
      phase: 'Phase 3',
      title: 'Full Decentralization',
      status: 'future',
      period: 'Q2 2025',
      description: 'Complete decentralized bonus governance with token-based voting',
      features: ['Token-based voting system', 'Decentralized bonus allocation', 'Community-driven protocols'],
      progress: 0,
      icon: Users
    }
  ];

  // Current architecture metrics
  const architectureMetrics = [
    {
      label: 'Fixed Base Control',
      value: 'Centralized',
      description: 'Team-managed T-Bills guarantee',
      status: 'active',
      icon: Shield
    },
    {
      label: 'Bonus Optimization',
      value: 'Centralized',
      description: 'Transitioning to community control',
      status: 'transitioning',
      icon: Zap
    },
    {
      label: 'On-chain Transparency',
      value: '100%',
      description: 'All transactions visible',
      status: 'active',
      icon: ExternalLink
    },
    {
      label: 'Multisig Security',
      value: '3/5',
      description: 'Multi-signature protection',
      status: 'active',
      icon: CheckCircle
    }
  ];

  // Recent transactions/actions
  const recentActions = [
    {
      type: 'rebalance',
      description: 'Protocol rebalancing: T-Bills allocation adjustment',
      timestamp: '2 hours ago',
      txHash: '0x1234...5678',
      status: 'completed'
    },
    {
      type: 'oracle_update',
      description: 'T-Bills rate oracle update: 5.0% → 5.1%',
      timestamp: '6 hours ago',
      txHash: '0x8765...4321',
      status: 'completed'
    },
    {
      type: 'multisig',
      description: 'Multisig proposal: Bonus parameter adjustment',
      timestamp: '1 day ago',
      txHash: '0xabcd...efgh',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500';
      case 'active': return 'bg-green-500';
      case 'planned': return 'bg-blue-500';
      case 'transitioning': return 'bg-orange-500';
      case 'future': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current': return <Badge className="bg-green-500">Current</Badge>;
      case 'planned': return <Badge className="bg-blue-500">Planned</Badge>;
      case 'future': return <Badge className="bg-gray-500">Future</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Current Architecture Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              T-Core Architecture: Centralized → Decentralized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {architectureMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <IconComponent className={`h-5 w-5 mt-0.5 ${
                      metric.status === 'active' ? 'text-green-600' : 
                      metric.status === 'transitioning' ? 'text-orange-600' : 
                      'text-gray-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.label}</span>
                        <Badge 
                          variant={metric.status === 'active' ? 'default' : 'outline'}
                          className={metric.status === 'active' ? 'bg-green-500' : 
                                   metric.status === 'transitioning' ? 'bg-orange-500' : ''}
                        >
                          {metric.value}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Decentralization Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {roadmapPhases.map((phase, index) => {
                const IconComponent = phase.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(phase.status)}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      {index < roadmapPhases.length - 1 && (
                        <div className="w-px h-16 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{phase.title}</h3>
                        {getStatusBadge(phase.status)}
                        <span className="text-sm text-muted-foreground">{phase.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                      <div className="space-y-2">
                        {phase.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{phase.progress}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Actions Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Protocol Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    action.status === 'completed' ? 'bg-green-500' : 
                    action.status === 'pending' ? 'bg-orange-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{action.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{action.timestamp}</span>
                        <Badge variant={action.status === 'completed' ? 'default' : 'outline'}>
                          {action.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Tx:</span>
                      <span className="text-sm font-mono">{action.txHash}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security & Transparency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Transparency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Centralized Benefits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Guaranteed fixed_base enforcement (5.16%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Risk mitigation for tier1 guarantee</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Professional T-Bills management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Rapid response to market changes</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Decentralized Future</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span>Community bonus optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span>Token-based governance voting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span>Protocol weight adjustments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span>Parameter optimization (k, weights)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Transparency Commitment:</strong> All protocol actions are recorded on-chain with full transaction history. 
                Centralized control is limited to fixed_base enforcement for guarantee security, while bonus optimization 
                will transition to community governance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArchitectureDashboard;