import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-light">Legal Disclaimer</h1>
          </div>
          <p className="text-muted-foreground">
            Important legal information regarding the use of T-Core Finance
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Warning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                T-Core Finance is an experimental DeFi protocol. Digital assets and DeFi protocols involve substantial risk of loss. 
                You should carefully consider whether trading or holding digital assets is suitable for you in light of your financial condition.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Key Risks Include:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Smart contract risks and potential bugs</li>
                  <li>Market volatility and impermanent loss</li>
                  <li>Liquidity risks in underlying protocols</li>
                  <li>Regulatory changes affecting DeFi protocols</li>
                  <li>Risk tier waterfall losses during stress events</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>No Financial Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The information provided on T-Core Finance is for informational purposes only and does not constitute financial advice. 
                We are not financial advisors, and any decisions to trade or invest are solely your responsibility.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                T-Core Finance and its team members shall not be liable for any direct, indirect, incidental, consequential, or special damages 
                arising out of or in any way connected with your use of the Protocol.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We reserve the right to modify or update this Disclaimer at any time without prior notice. 
                Your continued use of T-Core Finance after any changes indicates your acceptance of the revised Disclaimer.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Disclaimer;
