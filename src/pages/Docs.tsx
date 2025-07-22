import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calculator, Shield, TrendingUp, Users, Zap } from 'lucide-react';

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-light">Documentation</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive guides, API references, and technical documentation for T-Core Finance
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            Quick Start Guide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                step: 1,
                title: "Connect Wallet",
                description: "Connect your Web3 wallet or create one using social login",
                icon: Shield,
                status: "Essential"
              },
              {
                step: 2,
                title: "Mint TDD Tokens",
                description: "Deposit USDC/USDT/DAI to mint TDD tokens 1:1",
                icon: Calculator,
                status: "Required"
              },
              {
                step: 3,
                title: "Choose Risk Tier",
                description: "Select your preferred risk/reward tier (0-100)",
                icon: TrendingUp,
                status: "Strategy"
              },
              {
                step: 4,
                title: "Stake & Earn",
                description: "Stake TDD tokens and receive NFT position",
                icon: Users,
                status: "Active"
              }
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {item.step}
                      </div>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Documentation Sections */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Connect your wallet using MetaMask, WalletConnect, Coinbase Wallet, or social login via Dynamic.xyz. 
                The embedded wallet securely manages your private keys without requiring manual seed phrase handling.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>MetaMask and WalletConnect support</li>
                <li>Social login creates an encrypted embedded wallet</li>
                <li>Seamless wallet switching and connection persistence</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Minting TDD Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Deposit supported stablecoins (USDC, USDT, DAI) to mint TDD tokens at a 1:1 ratio. 
                These tokens represent your stake in the protocol and can be redeemed or staked.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Instant minting upon deposit</li>
                <li>Supports multiple stablecoins for flexibility</li>
                <li>Transparent conversion rates and fees</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Tiers and Staking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Choose your preferred risk tier (0-100) to stake TDD tokens and earn yield. 
                Each tier offers different risk/reward profiles, with advanced features like waterfall distribution and bonus yield heatmaps.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Risk tiers from Safe (1-3) to T-Core HERO (81-100)</li>
                <li>Stake tokens to receive NFT positions representing your stake</li>
                <li>Real-time APY predictions and stress testing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API and Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Access our API for real-time data on staking positions, yield distributions, and protocol metrics. 
                Integrate T-Core Finance features into your own applications.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>REST and WebSocket endpoints</li>
                <li>Authentication via wallet signature</li>
                <li>Comprehensive API documentation and examples</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Docs;
