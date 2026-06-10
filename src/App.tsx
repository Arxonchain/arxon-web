// ═══════════════════════════════════════════════════════════════
//  PREVIEW BUILD — All routes under /preview/*
//  Drop this file alongside the redesigned pages/components.
//  The live site remains untouched until you're ready to promote.
// ═══════════════════════════════════════════════════════════════

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Preview pages (new design) ──
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
import AmbassadorApply from "./pages/AmbassadorApply";
import AmbassadorPortal from "./pages/AmbassadorPortal";

// ── Keep original admin/form pages unchanged ──
import WaitlistAdmin from "@/pages/WaitlistAdmin";
import InvestorForm from "@/pages/InvestorForm";
import InvestorAdmin from "@/pages/InvestorAdmin";
import AmbassadorAdmin from "@/pages/AmbassadorAdmin";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ── PREVIEW routes — all prefixed /preview ── */}
          <Route path="/preview" element={<Index />} />
          <Route path="/preview/learn-more" element={<LearnMore />} />
          <Route path="/preview/partners" element={<Partners />} />
          <Route path="/preview/global-mining" element={<GlobalMining />} />
          <Route path="/preview/litepaper" element={<Litepaper />} />
          <Route path="/preview/mining-choice" element={<MiningChoice />} />
          <Route path="/preview/faq" element={<FAQ />} />
          <Route path="/preview/auth" element={<Auth />} />
          <Route path="/preview/profile" element={<Profile />} />
          <Route path="/preview/settings" element={<Settings />} />
          <Route path="/preview/waitlist" element={<Waitlist />} />
          <Route path="/preview/ambassadors" element={<Ambassadors />} />
          <Route path="/preview/ambassador-apply" element={<AmbassadorApply />} />
          <Route path="/preview/ambassador-portal" element={<AmbassadorPortal />} />

          {/* ── Original admin/utility routes (unchanged) ── */}
          <Route path="/waitlist-admin" element={<WaitlistAdmin />} />
          <Route path="/investor-form" element={<InvestorForm />} />
          <Route path="/investor-admin" element={<InvestorAdmin />} />
          <Route path="/ambassador-admin" element={<AmbassadorAdmin />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* ── Production routes (original pages — untouched) ── */}
          <Route path="/" element={<Navigate to="/preview" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
