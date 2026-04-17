import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/react";
import HomePage from "@/pages/Index";
import PortfolioPage from "@/pages/PortfolioPage";
import CommissionPage from "@/pages/CommissionPage";
import AboutPage from "@/pages/AboutPage";
import AiBuilderPage from "@/pages/AiBuilderPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/ai-builder" element={<AiBuilderPage />} />
          <Route path="/commission" element={<CommissionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
