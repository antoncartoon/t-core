
import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { MobileStatsOverview } from '@/components/MobileStatsOverview';
import { useIsMobile } from '@/hooks/use-mobile';
import ComprehensiveStakingDashboard from '@/components/ComprehensiveStakingDashboard';
import { TCoreProvider } from '@/contexts/TCoreContext';

const App = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet>
        <title>T-Core Finance App</title>
      </Helmet>
      
      <Header />
      
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
