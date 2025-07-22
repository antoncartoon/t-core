
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import ComprehensiveStakingDashboard from '@/components/ComprehensiveStakingDashboard';
import { TCoreProvider } from '@/contexts/TCoreContext';

const Staking = () => {
  const { isConnected } = useAuth();

  // This component is now wrapped in ProtectedRoute, so isConnected should always be true
  return (
    <TCoreProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Breadcrumb Navigation */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <NavLink to="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </NavLink>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">T-Core Staking</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <NavLink to="/app">
                <Button variant="outline" size="sm" className="text-sm">
                  App Dashboard
                </Button>
              </NavLink>
              <NavLink to="/portfolio">
                <Button variant="outline" size="sm" className="text-sm">
                  Portfolio
                </Button>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Main Staking Interface */}
        <ComprehensiveStakingDashboard />
      </div>
    </TCoreProvider>
  );
};

export default Staking;
