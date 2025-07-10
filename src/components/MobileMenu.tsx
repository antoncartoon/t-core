
import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
}

const MobileMenu = ({ isOpen, onClose, isConnected }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-foreground rounded flex items-center justify-center">
              <span className="text-background font-bold text-xs">T</span>
            </div>
            <span className="text-base font-medium">Tolkachyield</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-4">
          <NavLink 
            to="/" 
            onClick={onClose}
            className={({ isActive }) => 
              `block py-3 px-4 rounded-lg text-base transition-colors touch-manipulation ${
                isActive ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`
            }
          >
            Home
          </NavLink>
          {isConnected && (
            <>
              <NavLink 
                to="/portfolio" 
                onClick={onClose}
                className={({ isActive }) => 
                  `block py-3 px-4 rounded-lg text-base transition-colors touch-manipulation ${
                    isActive ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`
                }
              >
                Portfolio
              </NavLink>
              <NavLink 
                to="/defi" 
                onClick={onClose}
                className={({ isActive }) => 
                  `block py-3 px-4 rounded-lg text-base transition-colors touch-manipulation ${
                    isActive ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`
                }
              >
                DeFi
              </NavLink>
              <NavLink 
                to="/transparency" 
                onClick={onClose}
                className={({ isActive }) => 
                  `block py-3 px-4 rounded-lg text-base transition-colors touch-manipulation ${
                    isActive ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`
                }
              >
                Transparency
              </NavLink>
            </>
          )}
          <NavLink 
            to="/faq" 
            onClick={onClose}
            className={({ isActive }) => 
              `block py-3 px-4 rounded-lg text-base transition-colors touch-manipulation ${
                isActive ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`
            }
          >
            FAQ
          </NavLink>
        </nav>

        {!isConnected && (
          <div className="p-4 border-t">
            <Button className="w-full h-12 touch-manipulation">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
