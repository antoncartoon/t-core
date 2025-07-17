import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Info } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={false} onConnect={() => {}} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-4">Legal Disclaimer</h1>
          <p className="text-muted-foreground">
            Important legal information regarding T-Core Finance protocol usage
          </p>
        </div>

        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>T-Core is experimental DeFi technology.</strong> There are no guaranteed returns, 
              and there is risk of loss. This is not investment advice. Use at your own risk.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Risk Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Protocol Risks</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Smart Contract Risk:</strong> Potential bugs or vulnerabilities in smart contracts</li>
                  <li>• <strong>Market Risk:</strong> Losses from adverse market conditions (stress tests show tier1 $0 loss, tier4 up to $80 per $10k)</li>
                  <li>• <strong>Liquidity Risk:</strong> Potential delays in withdrawals during market stress</li>
                  <li>• <strong>Technology Risk:</strong> Potential technical failures or service interruptions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Yield Disclaimers</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Historical performance (average 8.73% APY) does not guarantee future returns</li>
                  <li>• Yields are subject to market conditions and protocol performance</li>
                  <li>• Performance fee of 20% is deducted from all yields before distribution</li>
                  <li>• Actual returns may vary significantly from estimates</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Centralized Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Current Structure</h3>
                <p className="text-sm text-muted-foreground">
                  T-Core currently operates under centralized management with multisig wallets (3/5 signatures) 
                  for security and operational efficiency. This includes position management, rebalancing, 
                  withdrawals, and fee distribution.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Decentralization Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  Full decentralization and governance are planned for Q1 2027, including a governance 
                  token for voting on bonus distribution, surplus allocation, and protocol upgrades. 
                  Current centralized aspects will transition to community control.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Fee Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Fee Allocation (20% of Total Yield)</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>25% to Bonus Yield:</strong> Enhances higher tier returns</li>
                  <li>• <strong>25% to TDD Buyback:</strong> Supply regulation and peg stability</li>
                  <li>• <strong>25% as Protocol Revenue:</strong> Operations and team funding</li>
                  <li>• <strong>25% to Insurance Buffer:</strong> High-risk tier protection</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  All fee allocation is transparent and verifiable on-chain. Performance fees are 
                  deducted post-yield generation and allocated according to the fixed percentages above.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Current Status</h3>
                <p className="text-sm text-muted-foreground">
                  T-Core is currently in prototype phase with no KYC requirements. Production deployment 
                  may require KYC/AML compliance for US/EU users. The protocol follows SEC guidelines 
                  for stablecoin backing (1:1 ratio) and maintains quarterly audit schedules.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Tax Implications</h3>
                <p className="text-sm text-muted-foreground">
                  Yields and fee revenue may be taxable in your jurisdiction. Consult a tax advisor 
                  for specific guidance. Users are responsible for reporting and paying applicable taxes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Age and Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You must be 18 years or older to use T-Core. By using this protocol, you confirm 
                that you meet all eligibility requirements in your jurisdiction and that you understand 
                the risks involved in DeFi protocols.
              </p>
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Data Privacy:</strong> T-Core operates on-chain with no personal information stored. 
              All transactions and positions are publicly verifiable on the blockchain. We do not collect 
              or store personal identifiable information.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
};

export default Disclaimer;