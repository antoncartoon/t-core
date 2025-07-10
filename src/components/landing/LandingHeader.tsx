
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const LandingHeader = () => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-foreground rounded flex items-center justify-center">
            <span className="text-background font-bold text-xs sm:text-sm">T</span>
          </div>
          <div className="text-base sm:text-lg font-medium">
            T-Core
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
          <a href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Security
          </a>
          <NavLink 
            to="/docs" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </NavLink>
          <NavLink 
            to="/faq" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </NavLink>
        </nav>

        <NavLink to="/app">
          <Button size={isMobile ? "sm" : "default"} className="text-xs sm:text-sm">
            Launch App
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </Button>
        </NavLink>
      </div>
    </header>
  );
};

export default LandingHeader;
