import React from "react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AnimalProfile from "./pages/AnimalProfile";
import HealthRecords from "./pages/HealthRecords";
import FeedingSchedule from "./pages/FeedingSchedule";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import {PetsProvider} from "@/providers/pets-provider.tsx";
import ChatbotWidget from "@/components/chat/chatbot-widget.tsx";

const queryClient = new QueryClient();


const ProtectedRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/animal/:id" element={<AnimalProfile />} />
    <Route path="/health-records" element={<HealthRecords />} />
    <Route path="/feeding" element={<FeedingSchedule />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// HomeRoute component for router-level redirect
const HomeRoute = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isSignedIn, navigate]);
  if (isSignedIn) return null;
  return <Landing />;
};

const App = () => {
  // Get JWT for backend API calls
  const { getToken } = useAuth();

  // Example: Attach JWT to fetch requests
  // const token = await getToken();
  // fetch('/api/protected', { headers: { Authorization: `Bearer ${token}` } });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PetsProvider>
          {/*<ChatbotWidget />*/}
          <ChatbotWidget mock />
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route
              path="/sign-in"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <SignIn path="/sign-in" routing="path" />
                </div>
              }
            />
            <Route
              path="/sign-up"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <SignUp path="/sign-up" routing="path" />
                </div>
              }
            />
            <Route
              path="/*"
              element={
                <SignedIn>
                  <ProtectedRoutes />
                </SignedIn>
              }
            />
          </Routes>
          </PetsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
