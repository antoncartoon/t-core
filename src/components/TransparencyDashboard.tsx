import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  Users, 
  Shield, 
  ExternalLink, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Gavel,
  TrendingUp,
  Database,
  DollarSign
} from 'lucide-react';
import PerformanceFeeDisplay from '@/components/PerformanceFeeDisplay';
import { TCORE_STATS } from '@/data/tcoreData';

interface TransparencyDashboardProps {
  className?: string;
}

const TransparencyDashboard: React.FC<TransparencyDashboardProps> = ({ className }) => {
  const [selectedTab, setSelectedTab] = useState('governance');

  const governanceData = {
    structure: "Centralized → Hybrid → Decentralized",
    currentPhase: "Centralized Management",
    decentralizationProgress: 25,
    nextMilestone: "DAO Token Launch (Q1 2027)",
    multisigAddresses: [
      {
        name: "Treasury Management",
        address: "0x1234...5678",
        signers: 5,
        threshold: 3,
        purpose: "T-Bills allocation, yield optimization"
      },
      {
        name: "Protocol Operations",
        address: "0xabcd...efgh",
        signers: 3,
        threshold: 2,
        purpose: "DeFi protocol rebalancing, fee distribution"
      }
    ],
    decisions: [
      {
        date: "2024-01-15",
        type: "Rebalancing",
        description: "Increased AAVE allocation by 15% due to higher yields",
        txHash: "0x789...012",
        status: "Executed"
      },
      {
        date: "2024-01-10",
        type: "Fee Adjustment",
        description: "Reduced performance fee from 22% to 20%",
        txHash: "0x345...678",
        status: "Executed"
      }
    ]
  };

  const collateralData = {
    totalTVL: 125000000,
    overcollateralization: 108,
    reserves: {
      tBills: 62500000,
      defi: 52500000,
      insurance: 10000000
    },
    breakdown: [
      { name: "T-Bills (ONDO)", amount: 62500000, percentage: 50, risk: "AAA", yield: 5.2 },
      { name: "AAVE Lending", amount: 21000000, percentage: 16.8, risk: "A+", yield: 8.3 },
      { name: "Pendle PT", amount: 18750000, percentage: 15, risk: "A", yield: 12.1 },
      { name: "Uniswap V3 LP", amount: 12500000, percentage: 10, risk: "B+", yield: 15.4 },
      { name: "Insurance Reserve", amount: 10000000, percentage: 8, risk: "AAA", yield: 0 },
      { name: "JLP (Jupiter)", amount: 250000, percentage: 0.2, risk: "B", yield: 18.2 }
    ]
  };

  const auditData = {
    lastAudit: "2024-01-01",
    auditor: "Trail of Bits",
    nextAudit: "2024-07-01",
    findings: {
      critical: 0,
      high: 1,
      medium: 3,
      low: 5,
      informational: 12
    },
    status: "Passed with recommendations",
    reportUrl: "https://github.com/tcore/audit-reports"
  };

  const roadmapData = {
    milestones: [
      {
        phase: "Phase 1: Centralized Launch",
        status: "completed",
        date: "Q2 2024",
        items: [
          "Core protocol deployment",
          "T-Bills integration via ONDO",
          "Basic DeFi yield strategies"
        ]
      },
      {
        phase: "Phase 2: Expansion",
        status: "current",
        date: "Q3-Q4 2024",
        items: [
          "Multi-chain deployment",
          "Advanced yield optimization",
          "Institutional partnerships"
        ]
      },
      {
        phase: "Phase 3: Hybrid Governance",
        status: "upcoming",
        date: "Q1 2027",
        items: [
          "DAO token launch",
          "Community governance voting",
          "Decentralized parameter adjustment"
        ]
      },
      {
        phase: "Phase 4: Full Decentralization",
        status: "planned",
        date: "Q3 2027",
        items: [
          "Community-controlled treasury",
          "Decentralized protocol upgrades",
          "Open-source governance"
        ]
      }
    ]
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Protocol Transparency Dashboard
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Audited
              </Badge>
              <Badge variant="outline" className="border-info">
                <Clock className="h-3 w-3 mr-1" />
                Live Updates
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="governance">Governance</TabsTrigger>
              <TabsTrigger value="collateral">Collateral</TabsTrigger>
              <TabsTrigger value="fees">Performance Fee</TabsTrigger>
              <TabsTrigger value="audits">Audits</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            </TabsList>
            
            <TabsContent value="governance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    Current Governance Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Current Phase</div>
                      <div className="text-lg font-bold text-primary">
                        {governanceData.currentPhase}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Multisig ({TCORE_STATS.multisigAddresses[0].threshold}/{TCORE_STATS.multisigAddresses[0].signers}) manages T-Bills allocation & DeFi optimization
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Decentralization Progress</div>
                      <div className="space-y-2">
                        <Progress value={governanceData.decentralizationProgress} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          {governanceData.decentralizationProgress}% → {governanceData.nextMilestone}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-3">Multisig Addresses</div>
                    <div className="space-y-3">
                      {TCORE_STATS.multisigAddresses.map((multisig, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{multisig.name}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {multisig.threshold}/{multisig.signers} signatures
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1 font-mono">
                            {multisig.address}
                          </div>
                          <div className="text-sm">
                            {multisig.purpose}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-3">Recent Decisions</div>
                    <div className="space-y-3">
                      {governanceData.decisions.map((decision, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{decision.type}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="border-success">
                                {decision.status}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {decision.date}
                          </div>
                          <div className="text-sm">
                            {decision.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collateral" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Collateral & Reserves
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        ${(collateralData.totalTVL / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-muted-foreground">Total TVL</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {collateralData.overcollateralization}%
                      </div>
                      <div className="text-sm text-muted-foreground">Overcollateralized</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-info">
                        ${(collateralData.reserves.insurance / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-muted-foreground">Insurance Reserve</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-3">Asset Breakdown</div>
                    <div className="space-y-3">
                      {collateralData.breakdown.map((asset, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{asset.name}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {asset.risk}
                              </Badge>
                              <div className="text-sm font-medium text-success">
                                {asset.yield.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              ${(asset.amount / 1000000).toFixed(1)}M ({asset.percentage}%)
                            </div>
                            <Progress value={asset.percentage} className="w-20 h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees" className="space-y-6">
              <PerformanceFeeDisplay 
                totalYield={TCORE_STATS.totalValueLocked * TCORE_STATS.averageAPYTarget} 
                showChart={true}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Mathematical Formulas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Core Formula</h3>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                      {TCORE_STATS.mathematicalConstants.formula}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Where f(i) determines bonus yield distribution for risk levels 26-100
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Performance Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {(TCORE_STATS.mathematicalConstants.averageAPY * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Average APY</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {(TCORE_STATS.mathematicalConstants.spread * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Spread</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {TCORE_STATS.mathematicalConstants.variance.toExponential(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Variance</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {TCORE_STATS.mathematicalConstants.kParameter}
                        </div>
                        <div className="text-xs text-muted-foreground">K Parameter</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Stress Test Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-success/10 rounded-lg">
                        <div className="text-lg font-bold text-success">
                          ${TCORE_STATS.stressTestResults.marketDrop20.tier1Loss * 10000}
                        </div>
                        <div className="text-xs text-muted-foreground">Tier 1 Loss per $10k</div>
                      </div>
                      <div className="text-center p-3 bg-info/10 rounded-lg">
                        <div className="text-lg font-bold text-info">
                          ${(TCORE_STATS.stressTestResults.marketDrop20.tier2Loss * 10000).toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Tier 2 Loss per $10k</div>
                      </div>
                      <div className="text-center p-3 bg-warning/10 rounded-lg">
                        <div className="text-lg font-bold text-warning">
                          ${(TCORE_STATS.stressTestResults.marketDrop20.tier3Loss * 10000).toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Tier 3 Loss per $10k</div>
                      </div>
                      <div className="text-center p-3 bg-error/10 rounded-lg">
                        <div className="text-lg font-bold text-error">
                          ${(TCORE_STATS.stressTestResults.marketDrop20.tier4Loss * 10000).toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Tier 4 Loss per $10k</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Audits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Latest Audit</div>
                      <div className="text-lg font-bold text-primary">
                        {TCORE_STATS.auditData.auditor}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {TCORE_STATS.auditData.lastAudit} • {TCORE_STATS.auditData.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Next Audit</div>
                      <div className="text-lg font-bold text-primary">
                        {TCORE_STATS.auditData.nextAudit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Scheduled security review
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-3">Audit Findings</div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <div className="text-center p-2 bg-error/10 rounded">
                        <div className="text-lg font-bold text-error">
                          {auditData.findings.critical}
                        </div>
                        <div className="text-xs">Critical</div>
                      </div>
                      <div className="text-center p-2 bg-warning/10 rounded">
                        <div className="text-lg font-bold text-warning">
                          {auditData.findings.high}
                        </div>
                        <div className="text-xs">High</div>
                      </div>
                      <div className="text-center p-2 bg-info/10 rounded">
                        <div className="text-lg font-bold text-info">
                          {auditData.findings.medium}
                        </div>
                        <div className="text-xs">Medium</div>
                      </div>
                      <div className="text-center p-2 bg-success/10 rounded">
                        <div className="text-lg font-bold text-success">
                          {auditData.findings.low}
                        </div>
                        <div className="text-xs">Low</div>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-lg font-bold text-muted-foreground">
                          {auditData.findings.informational}
                        </div>
                        <div className="text-xs">Info</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Audit Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Decentralization Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-6">
                    {roadmapData.milestones.map((milestone, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-start gap-4">
                          <div className={`w-4 h-4 rounded-full mt-1 ${
                            milestone.status === 'completed' ? 'bg-success' :
                            milestone.status === 'current' ? 'bg-info' :
                            milestone.status === 'upcoming' ? 'bg-warning' :
                            'bg-muted'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-semibold">{milestone.phase}</div>
                              <Badge variant="outline" className={
                                milestone.status === 'completed' ? 'border-success' :
                                milestone.status === 'current' ? 'border-info' :
                                milestone.status === 'upcoming' ? 'border-warning' :
                                'border-muted'
                              }>
                                {milestone.status}
                              </Badge>
                              <div className="text-sm text-muted-foreground">
                                {milestone.date}
                              </div>
                            </div>
                            <ul className="text-sm space-y-1">
                              {milestone.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {index < roadmapData.milestones.length - 1 && (
                          <div className="absolute left-2 top-8 w-0.5 h-8 bg-muted" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransparencyDashboard;