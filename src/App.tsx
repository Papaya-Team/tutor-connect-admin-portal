
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/Students";
import NotFound from "./pages/NotFound";

// Layout
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentsPage />} />
              
              {/* These pages will be implemented later */}
              <Route path="/tutors" element={<div className="p-4">Tutors page coming soon</div>} />
              <Route path="/schools" element={<div className="p-4">Schools page coming soon</div>} />
              <Route path="/clients" element={<div className="p-4">Clients page coming soon</div>} />
              <Route path="/subjects" element={<div className="p-4">Subjects page coming soon</div>} />
              <Route path="/schedule" element={<div className="p-4">Schedule page coming soon</div>} />
              <Route path="/settings" element={<div className="p-4">Settings page coming soon</div>} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
