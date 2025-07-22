
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import MobileStatsOverview from '@/components/MobileStatsOverview';
import { useIsMobile } from '@/hooks/use-mobile';
import ComprehensiveStakingDashboard from '@/components/ComprehensiveStakingDashboard';
import { TCoreProvider } from '@/contexts/TCoreContext';
import { useWallet } from '@/contexts/WalletContext';

const App = () => {
  const isMobile = useIsMobile();
  const [isConnected, setIsConnected] = useState(true); // Default to connected for demo
  const [walletAddress, setWalletAddress] = useState("0x1234...5678"); // Demo wallet address

  const handleConnect = () => {
    setIsConnected(true);
    setWalletAddress("0x1234...5678");
  };

  return (
    <>
      <Helmet>
        <title>T-Core Finance App</title>
      </Helmet>
      
      <Header 
        isConnected={isConnected} 
        onConnect={handleConnect} 
        walletAddress={walletAddress} 
      />
      
      <main className="container py-6 max-w-[1400px] mx-auto px-4">
        <div className="space-y-8">
          {isMobile ? <MobileStatsOverview /> : <StatsOverview />}
          
          <TCoreProvider>
            <ComprehensiveStakingDashboard />
          </TCoreProvider>
        </div>
      </main>
    </>
  );
};

export default App;
