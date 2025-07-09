
import React from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  walletAddress?: string;
}

const Header = ({ isConnected, onConnect, walletAddress }: HeaderProps) => {
  return (
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
            <span className="text-background font-bold text-sm">T</span>
          </div>
          <h1 className="text-lg font-medium">Tolkachyield</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Deposit</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stake</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</a>
        </nav>

        <div className="flex items-center">
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
              </span>
            </div>
          ) : (
            <Button onClick={onConnect} size="sm">
              <Wallet className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
