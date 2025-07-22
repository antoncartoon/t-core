
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import TransparencyDashboard from '@/components/TransparencyDashboard';
import WaterfallDashboardEnhanced from '@/components/waterfall/WaterfallDashboardEnhanced';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Transparency = () => {
  return (
    <div className="min-h-screen bg-background">
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
            <span className="font-medium">Transparency</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <NavLink to="/app">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </NavLink>
            <NavLink to="/staking">
              <Button variant="outline" size="sm">
                Staking
              </Button>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Protocol Transparency</h1>
          <p className="text-muted-foreground">
            Complete transparency into T-Core's operations, fee allocation, and risk management
          </p>
        </div>

        {/* Main Transparency Dashboard */}
        <TransparencyDashboard />

        <Separator className="my-8" />

        {/* Waterfall Distribution Model - Moved from Staking */}
        <WaterfallDashboardEnhanced />
      </div>
    </div>
  );
};

export default Transparency;
