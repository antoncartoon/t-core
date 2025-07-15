import React from 'react';
import { ArrowRight, Coins, TrendingUp, Shield } from 'lucide-react';

const TDDExplainer = () => {
  return (
    <section className="py-16 sm:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4">
            What is <span className="text-primary font-medium">TDD</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TDD (T-Core Distribution Dollar) is your gateway to decentralized yield farming. 
            It's a simple, transparent way to earn returns on your USDC.
          </p>
        </div>

        {/* Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-foreground mb-2">1. Deposit USDC</h3>
            <p className="text-sm text-muted-foreground">
              Convert your USDC into TDD tokens
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">2. Choose Risk Tier</h3>
            <p className="text-sm text-muted-foreground">
              Select your preferred risk/reward level
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-medium text-foreground mb-2">3. Earn Yields</h3>
            <p className="text-sm text-muted-foreground">
              Receive transparent, sustainable returns
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Guaranteed Safe Tier</h4>
            <p className="text-sm text-muted-foreground">
              6% APY guaranteed with full capital protection
            </p>
          </div>

          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-foreground mb-2">1:1 USDC Backing</h4>
            <p className="text-sm text-muted-foreground">
              Every TDD token is backed by real USDC reserves
            </p>
          </div>

          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Scalable Returns</h4>
            <p className="text-sm text-muted-foreground">
              Higher risk tiers offer unlimited upside potential
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TDDExplainer;