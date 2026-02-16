import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import SymptomAnalyzer from "./pages/SymptomAnalyzer";
import MedicineInfo from "./pages/MedicineInfo";
import EmergencySOS from "./pages/EmergencySOS";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/symptoms" element={<SymptomAnalyzer />} />
            <Route path="/medicine" element={<MedicineInfo />} />
            <Route path="/emergency" element={<EmergencySOS />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
