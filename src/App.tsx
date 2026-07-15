import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Redesigned pages
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Waitlist from "./pages/Waitlist";
import LearnMore from "./pages/LearnMore";
import Partners from "./pages/Partners";
import NotFound from "./pages/NotFound";
import GlobalMining from "./pages/GlobalMining";
import Litepaper from "./pages/Litepaper";
import MiningChoice from "./pages/MiningChoice";
import Ambassadors from "./pages/Ambassadors";
import AmbassadorPortal from "./pages/AmbassadorPortal";

// Admin/utility pages
import WaitlistAdmin from "./pages/WaitlistAdmin";
import InvestorForm from "./pages/InvestorForm";
import InvestorAdmin from "./pages/InvestorAdmin";
import AmbassadorAdmin from "./pages/AmbassadorAdmin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/global-mining" element={<GlobalMining />} />
          <Route path="/litepaper" element={<Litepaper />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/mining-choice" element={<MiningChoice />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/waitlist-admin" element={<WaitlistAdmin />} />
          <Route path="/investor-form" element={<InvestorForm />} />
          <Route path="/investor-admin" element={<InvestorAdmin />} />
          <Route path="/ambassadors" element={<Ambassadors />} />
          <Route path="/ambassador-apply" element={<Navigate to="/ambassador-portal" replace />} />
          <Route path="/ambassador-portal" element={<AmbassadorPortal />} />
          <Route path="/ambassador-admin" element={<AmbassadorAdmin />} />
          {/* Global admin dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
