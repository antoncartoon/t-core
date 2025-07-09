
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Github, Twitter, Smartphone } from 'lucide-react';

interface WalletConnectProps {
  onConnect: (provider: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const socialProviders = [
    {
      name: 'Google',
      icon: Chrome,
      color: 'bg-red-500 hover:bg-red-600',
      provider: 'google'
    },
    {
      name: 'GitHub',
      icon: Github,
      color: 'bg-gray-800 hover:bg-gray-900',
      provider: 'github'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500 hover:bg-blue-600',
      provider: 'twitter'
    },
    {
      name: 'Phone',
      icon: Smartphone,
      color: 'bg-green-500 hover:bg-green-600',
      provider: 'phone'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to Tolkachyield Finance
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Connect seamlessly with your social account to create a secure wallet
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {socialProviders.map((provider) => {
              const Icon = provider.icon;
              return (
                <Button
                  key={provider.provider}
                  onClick={() => onConnect(provider.provider)}
                  className={`w-full ${provider.color} text-white`}
                  size="lg"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  Continue with {provider.name}
                </Button>
              );
            })}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By connecting, you agree to our Terms of Service and Privacy Policy. 
              Your wallet will be created and secured automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
