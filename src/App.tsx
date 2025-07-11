import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import Landing from "./pages/Landing";
import App from "./pages/App";
import Portfolio from "./pages/Portfolio";
import DeFi from "./pages/DeFi";
import FAQ from "./pages/FAQ";
import Transparency from "./pages/Transparency";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import { RiskRangeProvider } from "@/contexts/RiskRangeContext";

const queryClient = new QueryClient();

const AppRouter = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <RiskRangeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<App />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/defi" element={<DeFi />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RiskRangeProvider>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppRouter;
