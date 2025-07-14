
import React, { useState } from 'react';
import { Wallet, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import WalletDropdown from './WalletDropdown';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
  walletAddress?: string;
}

const Header = ({ isConnected, onConnect, walletAddress }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-foreground rounded flex items-center justify-center">
              <span className="text-background font-bold text-xs sm:text-sm">T</span>
            </div>
            <span className="text-base sm:text-lg font-medium">
              T-Core
            </span>
          </NavLink>
          
          <nav className="hidden md:flex items-center space-x-8">
            {isConnected ? (
              <NavLink 
                to="/app" 
                className={({ isActive }) => 
                  `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                Dashboard
              </NavLink>
            ) : (
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                Home
              </NavLink>
            )}
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
              to="/docs" 
              className={({ isActive }) => 
                `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`
              }
            >
              Docs
            </NavLink>
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
              <Button onClick={onConnect} size={isMobile ? "sm" : "sm"} className="hidden sm:flex text-xs sm:text-sm h-8 sm:h-9">
                <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Connect
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden h-8 w-8 p-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-4 h-4" />
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
