
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Github, Twitter, Smartphone } from 'lucide-react';

interface WalletConnectProps {
  onConnect: (provider: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const socialProviders = [
    { name: 'Google', icon: Chrome, provider: 'google' },
    { name: 'GitHub', icon: Github, provider: 'github' },
    { name: 'Twitter', icon: Twitter, provider: 'twitter' },
    { name: 'Phone', icon: Smartphone, provider: 'phone' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center space-y-4">
          <div className="w-12 h-12 bg-foreground rounded mx-auto flex items-center justify-center">
            <span className="text-background font-bold text-xl">T</span>
          </div>
          <CardTitle className="text-2xl font-light">
            Welcome to Tolkachyield
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Connect with your social account to create a secure wallet
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {socialProviders.map((provider) => {
            const Icon = provider.icon;
            return (
              <Button
                key={provider.provider}
                onClick={() => onConnect(provider.provider)}
                className="w-full"
                variant="outline"
                size="lg"
              >
                <Icon className="w-4 h-4 mr-3" />
                Continue with {provider.name}
              </Button>
            );
          })}
          
          <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
