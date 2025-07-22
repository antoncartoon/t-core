import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-light">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">
            Terms and conditions for using T-Core Finance
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By accessing and using T-Core Finance ("the Protocol"), you accept and agree to be bound by the terms 
                and provision of this agreement. These terms apply to all users of the Protocol.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                T-Core Finance provides a decentralized finance (DeFi) platform that allows users to participate in yield-generating activities. 
                The Protocol utilizes smart contracts on the blockchain to facilitate these activities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Obligations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li>You must be at least 18 years old to use the Protocol.</li>
                <li>You are responsible for maintaining the security of your wallet and private keys.</li>
                <li>You agree to comply with all applicable laws and regulations.</li>
                <li>You will not use the Protocol for any illegal or unauthorized purpose.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Disclosure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Participating in DeFi activities involves significant risks, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li>Smart contract risks and potential bugs</li>
                <li>Market volatility and impermanent loss</li>
                <li>Liquidity risks in underlying protocols</li>
                <li>Regulatory changes affecting DeFi protocols</li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You should carefully consider whether participating in T-Core Finance is suitable for you in light of your financial condition.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                T-Core Finance and its developers are not liable for any direct, indirect, incidental, special, or consequential damages 
                arising out of or in any way connected with your use of the Protocol.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                T-Core Finance reserves the right to modify or revise these terms at any time. Your continued use of the Protocol 
                following the posting of any changes constitutes acceptance of those changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Terms;
