
import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
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
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
              <span className="text-background font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-medium">Tolkachyield</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="flex-1 px-6 py-8 space-y-6">
          <NavLink 
            to="/" 
            onClick={onClose}
            className={({ isActive }) => 
              `block text-lg transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`
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
                  `block text-lg transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`
                }
              >
                Portfolio
              </NavLink>
              <NavLink 
                to="/defi" 
                onClick={onClose}
                className={({ isActive }) => 
                  `block text-lg transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`
                }
              >
                DeFi
              </NavLink>
              <NavLink 
                to="/transparency" 
                onClick={onClose}
                className={({ isActive }) => 
                  `block text-lg transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`
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
              `block text-lg transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`
            }
          >
            FAQ
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
