
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// Temporarily disabled: import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { TCoreProvider } from "@/contexts/TCoreContext";
import { RedeemProvider } from "@/contexts/RedeemContext";
import { DistributionProvider } from "@/contexts/DistributionContext";
import { RiskRangeProvider } from "@/contexts/RiskRangeContext";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import ProtectedRoute from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import App from "./pages/App";
import Portfolio from "./pages/Portfolio";
import DeFi from "./pages/DeFi";
import FAQ from "./pages/FAQ";
import Transparency from "./pages/Transparency";
import Docs from "./pages/Docs";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Temporarily disabled QueryClient
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       staleTime: 5 * 60 * 1000,
//     },
//   },
// });

const AppRouter = () => {
  console.log('AppRouter rendering without QueryClient');
  
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <OfflineIndicator />
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            } />
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } />
            <Route path="/defi" element={
              <ProtectedRoute>
                <DeFi />
              </ProtectedRoute>
            } />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default AppRouter;
