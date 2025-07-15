import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Lock, 
  Eye, 
  TrendingDown, 
  TrendingUp,
  RefreshCw,
  Bell,
  Settings
} from 'lucide-react';

interface SecurityAlert {
  id: string;
  type: 'high' | 'medium' | 'low';
  category: 'smart_contract' | 'market' | 'protocol' | 'user';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
  affectedProtocols: string[];
}

interface SecurityMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface ProtocolSecurity {
  name: string;
  logo: string;
  tvl: number;
  securityScore: number;
  auditStatus: 'verified' | 'pending' | 'failed';
  lastAudit: string;
  vulnerabilities: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const SecurityDashboard: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const securityMetrics: SecurityMetric[] = [
    {
      name: 'Overall Security Score',
      value: 92,
      status: 'healthy',
      trend: 'up',
      change: 2.5
    },
    {
      name: 'Protocol Risk Level',
      value: 15,
      status: 'healthy',
      trend: 'down',
      change: -3.2
    },
    {
      name: 'Smart Contract Coverage',
      value: 87,
      status: 'warning',
      trend: 'stable',
      change: 0.1
    },
    {
      name: 'Liquidity Risk',
      value: 23,
      status: 'warning',
      trend: 'up',
      change: 5.8
    }
  ];

  const protocolSecurity: ProtocolSecurity[] = [
    {
      name: 'Aave',
      logo: '/api/placeholder/32/32',
      tvl: 12.8,
      securityScore: 95,
      auditStatus: 'verified',
      lastAudit: '2024-01-15',
      vulnerabilities: 0,
      riskLevel: 'low'
    },
    {
      name: 'Compound',
      logo: '/api/placeholder/32/32',
      tvl: 8.4,
      securityScore: 91,
      auditStatus: 'verified',
      lastAudit: '2024-02-02',
      vulnerabilities: 1,
      riskLevel: 'low'
    },
    {
      name: 'Yearn Finance',
      logo: '/api/placeholder/32/32',
      tvl: 2.1,
      securityScore: 78,
      auditStatus: 'pending',
      lastAudit: '2023-12-10',
      vulnerabilities: 3,
      riskLevel: 'medium'
    }
  ];

  const mockAlerts: SecurityAlert[] = [
    {
      id: '1',
      type: 'high',
      category: 'smart_contract',
      title: 'Smart Contract Vulnerability Detected',
      description: 'Potential reentrancy vulnerability detected in DeFi protocol XYZ',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'investigating',
      affectedProtocols: ['Protocol XYZ']
    },
    {
      id: '2',
      type: 'medium',
      category: 'market',
      title: 'Unusual Trading Activity',
      description: 'Abnormal trading volumes detected in USDC-ETH pair',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'active',
      affectedProtocols: ['Uniswap V3']
    },
    {
      id: '3',
      type: 'low',
      category: 'protocol',
      title: 'Protocol Upgrade Scheduled',
      description: 'Aave V3 upgrade scheduled for next week',
      timestamp: '2024-01-15T08:00:00Z',
      status: 'resolved',
      affectedProtocols: ['Aave']
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Security Dashboard</h2>
            <p className="text-muted-foreground">Real-time security monitoring and alerts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {metric.name}
                {getTrendIcon(metric.trend)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}
                  {metric.name.includes('Score') || metric.name.includes('Coverage') ? '/100' : '%'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </div>
              </div>
              <Progress 
                value={metric.value} 
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
          </span>
          <span className="text-xs text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setLastUpdate(new Date())}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="protocols">Protocol Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-primary">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {alert.type === 'high' && <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />}
                      {alert.type === 'medium' && <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />}
                      {alert.type === 'low' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge variant={getAlertColor(alert.type)}>
                            {alert.type}
                          </Badge>
                        </div>
                        <AlertDescription className="mb-2">
                          {alert.description}
                        </AlertDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          <span>Status: {alert.status}</span>
                          <span>Affected: {alert.affectedProtocols.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Clear</h3>
                  <p className="text-muted-foreground">
                    No active security alerts at this time
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid gap-4">
            {protocolSecurity.map((protocol) => (
              <Card key={protocol.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <img src={protocol.logo} alt={protocol.name} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{protocol.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          TVL: ${protocol.tvl.toFixed(1)}B
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getRiskColor(protocol.riskLevel)}`} />
                      <span className="text-sm capitalize">{protocol.riskLevel} Risk</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{protocol.securityScore}/100</div>
                      <div className="text-xs text-muted-foreground">Security Score</div>
                    </div>
                    <div className="text-center">
                      <Badge variant={getAuditStatusColor(protocol.auditStatus)}>
                        {protocol.auditStatus}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">Audit Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{protocol.vulnerabilities}</div>
                      <div className="text-xs text-muted-foreground">Vulnerabilities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {new Date(protocol.lastAudit).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Last Audit</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Audit Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Settings</CardTitle>
              <CardDescription>Configure security monitoring preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Alert Thresholds</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Risk Threshold</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium Risk Threshold</span>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Risk Threshold</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Monitoring Frequency</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Smart Contract Scans</span>
                      <span className="text-sm font-medium">Every 5 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Market Analysis</span>
                      <span className="text-sm font-medium">Real-time</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Protocol Updates</span>
                      <span className="text-sm font-medium">Every hour</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button>Update Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;