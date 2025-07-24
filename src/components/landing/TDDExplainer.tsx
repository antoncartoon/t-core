
import React from 'react';
import { ArrowRight, Coins, TrendingUp, Shield, CircleDollarSign, Layers } from 'lucide-react';
import { TCORE_STATS, formatCurrency } from '@/data/tcoreData';

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

        {/* TDD Supply Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Total TDD Minted</h4>
            <p className="text-2xl font-bold text-primary mb-1">
              {TCORE_STATS.totalTDDIssued.toLocaleString()} TDD
            </p>
            <p className="text-sm text-muted-foreground">
              1:1 backed by stablecoins
            </p>
          </div>

          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CircleDollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Market Cap</h4>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(TCORE_STATS.totalTDDIssued)}
            </p>
            <p className="text-sm text-muted-foreground">
              USD value of TDD supply
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-xl sm:text-2xl font-light text-foreground mb-4">
            How It Works
          </h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Start investing in four simple steps. No complex strategies, just transparent yield.
          </p>
        </div>

        {/* Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-foreground mb-2">4. Trade NFT</h3>
            <p className="text-sm text-muted-foreground">
              Use your NFT on secondary DeFi markets for greater flexibility
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Risk Position Constructor</h4>
            <p className="text-sm text-muted-foreground">
              Build your custom risk portfolio according to expected returns
            </p>
          </div>

          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Overcollateralized &gt;105%</h4>
            <p className="text-sm text-muted-foreground">
              Real yield sources: T-Bills, AAVE, JLP, LP farming
            </p>
          </div>

          <div className="text-center p-6 bg-background rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Performance Fee 20%</h4>
            <p className="text-sm text-muted-foreground">
              Distributed across: bonus yields, buyback mechanisms, hero tier buffer
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Ready to start earning stable yield?
          </p>
          <a href="/app" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
            Launch App
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TDDExplainer;
