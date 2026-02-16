import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SymptomChecker from "./pages/SymptomChecker";
import ReportSimplifier from "./pages/ReportSimplifier";
import MedicineGuide from "./pages/MedicineGuide";
import NutritionFitness from "./pages/NutritionFitness";
import MentalWellness from "./pages/MentalWellness";
import HealthTips from "./pages/HealthTips";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/report-simplifier" element={<ReportSimplifier />} />
          <Route path="/medicine-guide" element={<MedicineGuide />} />
          <Route path="/nutrition-fitness" element={<NutritionFitness />} />
          <Route path="/mental-wellness" element={<MentalWellness />} />
          <Route path="/health-tips" element={<HealthTips />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
