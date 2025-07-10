
import React, { useState } from 'react';
import { Wallet, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import WalletDropdown from './WalletDropdown';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  walletAddress?: string;
}

const Header = ({ isConnected, onConnect, walletAddress }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
                <NavLink 
                  to="/transparency" 
                  className={({ isActive }) => 
                    `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`
                  }
                >
                  Transparency
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

          <div className="flex items-center space-x-2">
            {isConnected && walletAddress ? (
              <WalletDropdown walletAddress={walletAddress} />
            ) : (
              <Button onClick={onConnect} size="sm" className="hidden sm:flex">
                <Wallet className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isConnected={isConnected}
      />
    </>
  );
};

export default Header;
