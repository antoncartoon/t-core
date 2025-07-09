
import React from 'react';
import { Wallet, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  walletAddress?: string;
}

const Header = ({ isConnected, onConnect, walletAddress }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Tolkachyield Finance</h1>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Deposit</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Stake</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Portfolio</a>
        </nav>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <Wallet className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
              </span>
            </div>
          ) : (
            <Button onClick={onConnect} className="bg-blue-600 hover:bg-blue-700">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
