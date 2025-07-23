
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Calculator } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LandingHeaderProps {
  onStartTutorial?: () => void;
}

const LandingHeader = ({ onStartTutorial }: LandingHeaderProps) => {
  const isMobile = useIsMobile();

  return (
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
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
          <NavLink 
            to="/app" 
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
          >
            <Calculator className="w-4 h-4" />
            Staking
          </NavLink>
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
          {onStartTutorial && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onStartTutorial}
              className="text-sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Interactive Tutorial
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {onStartTutorial && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onStartTutorial}
              className="md:hidden"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          <NavLink to="/app" className="md:hidden">
            <Button variant="outline" size="sm">
              <Calculator className="w-3 h-3" />
            </Button>
          </NavLink>
          <NavLink to="/app">
            <Button size={isMobile ? "sm" : "default"} className="text-xs sm:text-sm">
              Launch App
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
