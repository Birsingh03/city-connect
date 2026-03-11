import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComplaintProvider } from "@/contexts/ComplaintContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import ReportIssue from "@/pages/ReportIssue";
import ComplaintList from "@/pages/ComplaintList";
import ComplaintDetails from "@/pages/ComplaintDetails";
import MapView from "@/pages/MapView";
import MyComplaints from "@/pages/MyComplaints";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ComplaintProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/report" element={<ReportIssue />} />
                <Route path="/complaints" element={<ComplaintList />} />
                <Route path="/complaints/:id" element={<ComplaintDetails />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/my-complaints" element={<MyComplaints />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ComplaintProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
