
import React, { useState, useEffect } from 'react';
import { Wallet, Smartphone, Globe, ArrowRight, Zap, Info, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WalletConnectProps {
  onConnect: (provider?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [isWeb3Available, setIsWeb3Available] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    // Check if Web3 provider is available
    const checkWeb3 = () => {
      const hasMetaMask = typeof window !== 'undefined' && window.ethereum;
      const hasWalletConnect = typeof window !== 'undefined' && window.WalletConnect;
      setIsWeb3Available(hasMetaMask || hasWalletConnect);
    };
    
    checkWeb3();
  }, []);

  const handleConnect = async (provider: string) => {
    setConnecting(provider);
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      onConnect(provider);
    } finally {
      setConnecting(null);
    }
  };

  const web3Options = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: Wallet,
      description: 'Connect using MetaMask wallet',
      available: typeof window !== 'undefined' && window.ethereum,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: Smartphone,
      description: 'Connect using mobile wallet',
      available: true,
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: Globe,
      description: 'Connect using Coinbase Wallet',
      available: true,
    }
  ];

  const socialOptions = [
    {
      id: 'google',
      name: 'Google',
      description: 'Sign in with Google account',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Sign in with Twitter account',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">T</span>
            </div>
          </div>
          <h1 className="text-4xl font-light mb-4">Welcome to Tolkachyield</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect your wallet to start earning yield through optimized DeFi strategies and NFT staking positions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Web3 Wallets */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Web3 Wallets</span>
                </CardTitle>
                {isWeb3Available && (
                  <Badge variant="secondary" className="text-green-600 border-green-600">
                    <Zap className="w-3 h-3 mr-1" />
                    Available
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Connect using your existing crypto wallet
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {web3Options.map((option) => {
                const Icon = option.icon;
                const isConnecting = connecting === option.id;
                
                return (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 hover:bg-muted/50"
                    onClick={() => handleConnect(option.id)}
                    disabled={!option.available || isConnecting}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{option.name}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      {isConnecting ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Social Login */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span>Social Login</span>
                </CardTitle>
                <Badge variant="secondary" className="text-blue-600 border-blue-600">
                  <Shield className="w-3 h-3 mr-1" />
                  Embedded Wallet
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Creates a secure embedded wallet using Dynamic.xyz
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50/50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Embedded Wallet Technology:</strong> Social login creates a secure crypto wallet automatically through Dynamic.xyz. Your private keys are encrypted and managed securely - no need to handle seed phrases or private keys manually.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                {socialOptions.map((option) => {
                  const isConnecting = connecting === option.id;
                  
                  return (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 hover:bg-muted/50"
                      onClick={() => handleConnect(option.id)}
                      disabled={isConnecting}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-5 h-5 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold">{option.name[0]}</span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{option.name}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        {isConnecting ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
          <p className="font-medium">How Social Login Works:</p>
          <p>
            Social login uses <span className="font-medium text-foreground">Dynamic.xyz</span> technology to automatically create an embedded wallet. 
            Your private key is encrypted and secured without requiring you to manage seed phrases or technical wallet setup.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
