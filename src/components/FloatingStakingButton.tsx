
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';
import { Calculator, Sparkles, X } from 'lucide-react';

const FloatingStakingButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  // Dismiss after 30 seconds if not interacted with
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
        <NavLink to="/staking">
          <Button 
            size="lg" 
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Calculator className="h-6 w-6 relative z-10" />
            
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            
            {/* Sparkle effect */}
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            </div>
          </Button>
        </NavLink>
        
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -left-2 h-6 w-6 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 mb-2 bg-background border border-border rounded-lg p-3 shadow-lg min-w-48 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              NEW
            </Badge>
            <span className="font-semibold text-sm">T-Core Staking</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Advanced waterfall distribution, bonus yield optimization, and stress testing now available!
          </p>
          
          {/* Arrow pointing to button */}
          <div className="absolute -bottom-1 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
        </div>
      </div>
    </div>
  );
};

export default FloatingStakingButton;
