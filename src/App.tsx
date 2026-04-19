import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FuelProvider } from "@/state/fuel";
import { AppLayout } from "@/components/AppLayout";
import Home from "./pages/Home";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FuelProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="/install" element={<Install />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FuelProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
