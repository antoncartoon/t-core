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
            TDD (T-Core Distribution Dollar) is a stablecoin backed by T-Bills and DeFi strategies. 
            Earn risk-tranched yields through staking with centralized management and multisig security, 
            transitioning to full DAO governance in Q1 2027.
          </p>
        </div>

        {/* Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-foreground mb-2">1. Deposit Stablecoins</h3>
            <p className="text-sm text-muted-foreground">
              Mint your TDD by depositing USDC, USDT, DAI or other stablecoins
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-2">2. Choose Risk Tier</h3>
            <p className="text-sm text-muted-foreground">
              Select your preferred risk/reward level from safe to hero and get NFT for staked TDD positions
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-medium text-foreground mb-2">3. Earn Yields</h3>
            <p className="text-sm text-muted-foreground">
              Receive transparent, sustainable returns with performance fees
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Fixed Guarantee (Tier 1)</h4>
            <p className="text-sm text-muted-foreground">
              6% APY = T-Bills*1.2 with zero loss protection
            </p>
          </div>

          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Overcollateralized &gt;105%</h4>
            <p className="text-sm text-muted-foreground">
              Real yield sources: AAVE, JLP, LP farming (60% fixed, 40% bonus)
            </p>
          </div>

          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Performance Fee 20%</h4>
            <p className="text-sm text-muted-foreground">
              25% bonus, 25% buyback, 25% protocol, 25% insurance buffer
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TDDExplainer;