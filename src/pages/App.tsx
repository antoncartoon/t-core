
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import MobileStatsOverview from '@/components/MobileStatsOverview';
import DepositCard from '@/components/DepositCard';
import MobileDepositCard from '@/components/MobileDepositCard';
import StakingCard from '@/components/StakingCard';
import MobileStakingCard from '@/components/MobileStakingCard';
import WalletConnect from '@/components/WalletConnect';
import { RedeemCard } from '@/components/RedeemCard';
import { DistributionTimer } from '@/components/DistributionTimer';
import BuybackBurnDashboard from '@/components/BuybackBurnDashboard';
import SurplusPoolDashboard from '@/components/SurplusPoolDashboard';
import LiquidityIncentives from '@/components/LiquidityIncentives';
import ModeSelector from '@/components/ModeSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RedeemProvider } from '@/contexts/RedeemContext';
import { DistributionProvider } from '@/contexts/DistributionContext';
import AIPortfolioOptimizer from '@/components/AIPortfolioOptimizer';
import CopyTradingPlatform from '@/components/CopyTradingPlatform';
import SecurityDashboard from '@/components/SecurityDashboard';
import MobileGestureHandler from '@/components/MobileGestureHandler';
import InteractiveTutorial from '@/components/InteractiveTutorial';
import { useTutorial } from '@/hooks/useTutorial';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isProMode, setIsProMode] = useState(false);
  const [activeTab, setActiveTab] = useState("earn");
  const isMobile = useIsMobile();
  const { isVisible, completeTutorial, skipTutorial } = useTutorial();

  const handleConnect = (provider?: string) => {
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b8D4542DfC3d4e18ef');
    }, 1500);
  };

  if (!isConnected) {
    return <WalletConnect onConnect={handleConnect} />;
  }

  const handleSwipeLeft = () => {
    const tabs = ["earn", "trade", "portfolio", "ai", "social", "security"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleSwipeRight = () => {
    const tabs = ["earn", "trade", "portfolio", "ai", "social", "security"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <RedeemProvider>
      <DistributionProvider>
        <MobileGestureHandler 
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          className="min-h-screen bg-background"
        >
          <Header 
            isConnected={isConnected} 
            onConnect={handleConnect}
            walletAddress={walletAddress}
          />
          
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-8 sm:mb-16 text-center">
          <h1 className="text-2xl sm:text-4xl font-light text-foreground mb-3 sm:mb-4 tracking-tight">
            T-Core Protocol
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
            Stake your stablecoins, mint TDD, and earn yield through optimized DeFi strategies
          </p>
        </div>

        {isMobile ? <MobileStatsOverview /> : <StatsOverview />}

        {/* Distribution Timer */}
        <div className="mb-6">
          <DistributionTimer />
        </div>

        {/* Mode Selector */}
        <ModeSelector isProMode={isProMode} onModeChange={setIsProMode} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-12">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 max-w-4xl mx-auto bg-muted/50 h-10 sm:h-auto">
            <TabsTrigger value="earn" className="text-xs sm:text-sm h-8 sm:h-auto">Earn</TabsTrigger>
            <TabsTrigger value="trade" className="text-xs sm:text-sm h-8 sm:h-auto">Trade</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs sm:text-sm h-8 sm:h-auto">Portfolio</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm h-8 sm:h-auto">AI</TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm h-8 sm:h-auto">Social</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm h-8 sm:h-auto">Security</TabsTrigger>
          </TabsList>
          
          {/* Earn Tab - Deposit & Stake */}
          <TabsContent value="earn" className="space-y-6 sm:space-y-12">
            <Tabs defaultValue="deposit" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-muted/30 h-9">
                <TabsTrigger value="deposit" className="text-xs sm:text-sm h-7 sm:h-auto">Deposit</TabsTrigger>
                <TabsTrigger value="stake" className="text-xs sm:text-sm h-7 sm:h-auto">Stake</TabsTrigger>
              </TabsList>
              
              <TabsContent value="deposit" className="space-y-6 sm:space-y-12">
                {isMobile ? (
                  <div className="space-y-6">
                    <MobileDepositCard />
                    <div className="px-4 space-y-4">
                      <h3 className="text-lg font-medium text-center">Deposit & Redeem</h3>
                      <div className="space-y-4">
                        {[
                          {
                            step: 1,
                            title: "Mint TDD",
                            description: "Deposit USDC and receive TDD tokens 1:1"
                          },
                          {
                            step: 2,
                            title: "Instant Redeem",
                            description: "Convert TDD back to USDC instantly from protocol buffer"
                          },
                          {
                            step: 3,
                            title: "Queue Redeem",
                            description: "Large amounts can use the redemption queue with lower fees"
                          },
                          {
                            step: 4,
                            title: "Uniswap Route",
                            description: "Trade smaller amounts via DEX for immediate settlement"
                          }
                        ].map((item) => (
                          <div key={item.step} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                              {item.step}
                            </div>
                            <div>
                              <h4 className="font-medium mb-1 text-sm">{item.title}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="flex justify-center">
                      <DepositCard />
                    </div>
                    <div className="flex justify-center">
                      <RedeemCard />
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium">Deposit & Redeem</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                            1
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Mint TDD</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Convert USDC to TDD tokens at 1:1 ratio
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                            2
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Instant Redeem</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Get USDC back instantly from protocol buffer
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                            3
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Queue System</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Large redemptions use queue for better rates
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-1 flex-shrink-0">
                            4
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">DEX Routing</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Small amounts route through Uniswap automatically
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="stake" className="space-y-6 sm:space-y-12">
                {isMobile ? (
                  <div className="space-y-6">
                    <MobileStakingCard />
                    <div className="px-4 space-y-4">
                      <h3 className="text-lg font-medium text-center">Yield Earning</h3>
                      <div className="space-y-3">
                        {[
                          {
                            name: "Daily Accrual",
                            description: "Yield accrues daily based on protocol performance",
                            info: "Real-time tracking",
                            color: "text-green-600"
                          },
                          {
                            name: "48H Distribution",
                            description: "Accumulated yield distributed every 48 hours",
                            info: "Predictable schedule",
                            color: "text-blue-600"
                          },
                          {
                            name: "Instant Unstake",
                            description: "Exit positions immediately without lock periods",
                            info: "No penalties",
                            color: "text-purple-600"
                          }
                        ].map((strategy) => (
                          <div key={strategy.name} className="p-4 border border-border rounded-lg">
                            <h4 className={`font-medium ${strategy.color} mb-2`}>{strategy.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                              {strategy.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {strategy.info}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <StakingCard />
                    </div>
                    
                    <div className="space-y-6 sm:space-y-8">
                      <h3 className="text-xl font-medium text-center sm:text-left">Yield Mechanics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="p-4 sm:p-6 border border-border rounded-lg">
                          <h4 className="font-medium text-green-600 mb-2">Daily Accrual</h4>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            Yield accrues daily based on protocol performance and your position risk level
                          </p>
                          <p className="text-xs text-muted-foreground">Real-time tracking</p>
                        </div>
                        <div className="p-4 sm:p-6 border border-border rounded-lg">
                          <h4 className="font-medium text-blue-600 mb-2">48H Distribution</h4>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            Accumulated yield is distributed every 48 hours to all eligible positions
                          </p>
                          <p className="text-xs text-muted-foreground">Predictable schedule</p>
                        </div>
                        <div className="p-4 sm:p-6 border border-border rounded-lg sm:col-span-2 lg:col-span-1">
                          <h4 className="font-medium text-purple-600 mb-2">Instant Unstake</h4>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            Exit positions immediately without lock periods. Unclaimed yield stays in pool.
                          </p>
                          <p className="text-xs text-muted-foreground">No penalties</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          {/* Trade Tab - TDD Deflationary Engine & Bonus Rewards */}
          <TabsContent value="trade" className="space-y-6 sm:space-y-12">
            <Tabs defaultValue="deflationary" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-muted/30 h-9">
                <TabsTrigger value="deflationary" className="text-xs sm:text-sm h-7 sm:h-auto">
                  <span className="hidden sm:inline">TDD Deflationary Engine</span>
                  <span className="sm:hidden">Deflationary</span>
                </TabsTrigger>
                <TabsTrigger value="bonus" className="text-xs sm:text-sm h-7 sm:h-auto">
                  <span className="hidden sm:inline">Bonus Rewards</span>
                  <span className="sm:hidden">Rewards</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deflationary" className="space-y-6 sm:space-y-12">
                <BuybackBurnDashboard />
              </TabsContent>
              
              <TabsContent value="bonus" className="space-y-6 sm:space-y-12">
                <SurplusPoolDashboard />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          {/* Portfolio Tab - Liquidity & Analytics */}
          <TabsContent value="portfolio" className="space-y-6 sm:space-y-12">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-2">Portfolio Management</h2>
                <p className="text-muted-foreground">
                  Manage your liquidity positions and track performance
                </p>
              </div>
              
              <LiquidityIncentives />
              
              {isProMode && (
                <div className="mt-8 p-6 border border-border rounded-lg bg-muted/20">
                  <h3 className="text-lg font-medium mb-4">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access detailed analytics and risk metrics in the{' '}
                    <a href="/transparency" className="text-primary hover:underline">
                      Transparency Dashboard
                    </a>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Risk Metrics</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive risk analysis and stress testing
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Protocol Insights</h4>
                      <p className="text-sm text-muted-foreground">
                        Deep dive into protocol mechanics and performance
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* AI Tab - Portfolio Optimization */}
          <TabsContent value="ai" className="space-y-6 sm:space-y-12">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-2">AI Portfolio Optimization</h2>
                <p className="text-muted-foreground">
                  Leverage machine learning to optimize your DeFi portfolio
                </p>
              </div>
              
              <AIPortfolioOptimizer />
            </div>
          </TabsContent>
          
          {/* Social Tab - Copy Trading */}
          <TabsContent value="social" className="space-y-6 sm:space-y-12">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-2">Social Trading</h2>
                <p className="text-muted-foreground">
                  Follow top traders and copy their strategies
                </p>
              </div>
              
              <CopyTradingPlatform />
            </div>
          </TabsContent>
          
          {/* Security Tab - Advanced Security */}
          <TabsContent value="security" className="space-y-6 sm:space-y-12">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-light mb-2">Security Dashboard</h2>
                <p className="text-muted-foreground">
                  Monitor and manage your protocol security
                </p>
              </div>
              
              <SecurityDashboard />
            </div>
          </TabsContent>
        </Tabs>
          </main>
          
          {/* Interactive Tutorial */}
          <InteractiveTutorial
            isVisible={isVisible}
            onComplete={completeTutorial}
            onSkip={skipTutorial}
          />
        </MobileGestureHandler>
      </DistributionProvider>
    </RedeemProvider>
  );
};

export default App;
