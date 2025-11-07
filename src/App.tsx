import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import TodayHub from "./pages/TodayHub";
import Inbox from "./pages/Inbox";
import KnowledgeHub from "./pages/KnowledgeHub";
import Library from "./pages/Library";
import BizzyFarmer from "./pages/BizzyFarmer";
import TheForge from "./pages/TheForge";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TodayHub />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="knowledge" element={<KnowledgeHub />} />
            <Route path="library" element={<Library />} />
            <Route path="farmer" element={<BizzyFarmer />} />
            <Route path="notes" element={<Notes />} />
            <Route path="forge" element={<TheForge />} />
            <Route path="settings" element={<Settings />} />
            <Route path="trader" element={<div className="p-6">BizzyTrader - Coming Soon</div>} />
            <Route path="accounting" element={<div className="p-6">Accounting - Coming Soon</div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
