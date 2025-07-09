
import React from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import WalletDropdown from './WalletDropdown';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  walletAddress?: string;
}

const Header = ({ isConnected, onConnect, walletAddress }: HeaderProps) => {
  return (
    <header className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
            <span className="text-background font-bold text-sm">T</span>
          </div>
          <NavLink to="/" className="text-lg font-medium hover:text-primary transition-colors">
            Tolkachyield
          </NavLink>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`
            }
          >
            Home
          </NavLink>
          {isConnected && (
            <>
              <NavLink 
                to="/portfolio" 
                className={({ isActive }) => 
                  `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                Portfolio
              </NavLink>
              <NavLink 
                to="/defi" 
                className={({ isActive }) => 
                  `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                DeFi
              </NavLink>
            </>
          )}
          <NavLink 
            to="/faq" 
            className={({ isActive }) => 
              `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`
            }
          >
            FAQ
          </NavLink>
        </nav>

        <div className="flex items-center">
          {isConnected && walletAddress ? (
            <WalletDropdown walletAddress={walletAddress} />
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
