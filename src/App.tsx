import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route} from "react-router-dom";
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

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster/>
            <Sonner/>
            <BrowserRouter>
                <PetsProvider>
                    <Routes>
                        <Route path="/" element={<Landing/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/animal/:id" element={<AnimalProfile/>}/>
                        <Route path="/health-records" element={<HealthRecords/>}/>
                        <Route path="/feeding" element={<FeedingSchedule/>}/>
                        <Route path="/analytics" element={<Analytics/>}/>
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                    {/*<ChatbotWidget />*/}
                    <ChatbotWidget mock />
                </PetsProvider>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
