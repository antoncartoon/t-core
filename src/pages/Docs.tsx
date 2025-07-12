
import React, { useState } from 'react';
import { Book, FileText, Shield, Zap, Users, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { useWallet } from '@/contexts/WalletContext';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { balances } = useWallet();
  
  // Mock wallet connection state - you can replace this with actual wallet logic
  const isConnected = balances.some(balance => balance.balance > 0);
  const walletAddress = isConnected ? "0x1234...5678" : undefined;

  const handleConnect = () => {
    // Mock connect function - replace with actual wallet connection logic
    console.log('Connect wallet clicked');
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: Book },
    { id: 'getting-started', title: 'Getting Started', icon: Zap },
    { id: 'wallet-integration', title: 'Wallet Integration', icon: Shield },
    { id: 'api-reference', title: 'API Reference', icon: FileText },
    { id: 'community', title: 'Community', icon: Users },
    { id: 'support', title: 'Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isConnected={isConnected}
        onConnect={handleConnect}
        walletAddress={walletAddress}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive guides and API reference to help you get started with T-Core platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm">{section.title}</span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile TOC */}
            <div className="lg:hidden mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {sections.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors ${
                            activeSection === section.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="text-xs text-center">{section.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Book className="w-5 h-5" />
                        <span>Platform Overview</span>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </CardTitle>
                      <CardDescription>
                        Learn about T-Core's core features and capabilities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        This section will contain comprehensive information about:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Platform architecture and design principles</li>
                        <li>Yield farming strategies and mechanisms</li>
                        <li>Risk management and security features</li>
                        <li>Tokenomics and governance structure</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'getting-started' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Getting Started</span>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </CardTitle>
                      <CardDescription>
                        Quick start guide for new users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Step-by-step guides will be available here:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Account setup and wallet connection</li>
                        <li>Making your first deposit</li>
                        <li>Understanding yield calculations</li>
                        <li>Portfolio management basics</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'wallet-integration' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Wallet Integration</span>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </CardTitle>
                      <CardDescription>
                        Detailed information about wallet integration and security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        This section will cover:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Dynamic.xyz embedded wallet technology</li>
                        <li>Social login and private key encryption</li>
                        <li>Multi-chain wallet support</li>
                        <li>Security best practices</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'api-reference' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>API Reference</span>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </CardTitle>
                      <CardDescription>
                        Complete API documentation for developers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        API documentation will include:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>REST API endpoints and authentication</li>
                        <li>WebSocket connections for real-time data</li>
                        <li>Smart contract interfaces</li>
                        <li>SDK and integration examples</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'community' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Community</span>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </CardTitle>
                      <CardDescription>
                        Join our community and contribute to the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Community resources will include:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Discord and Telegram channels</li>
                        <li>GitHub repositories and contribution guidelines</li>
                        <li>Community governance and voting</li>
                        <li>Educational resources and tutorials</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'support' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <HelpCircle className="w-5 h-5" />
                        <span>Support</span>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </CardTitle>
                      <CardDescription>
                        Get help and contact our support team
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Support resources will include:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Frequently asked questions</li>
                        <li>Troubleshooting guides</li>
                        <li>Contact forms and support tickets</li>
                        <li>Live chat and email support</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
