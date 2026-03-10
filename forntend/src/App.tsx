import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GeolocationProvider } from "@/contexts/GeolocationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import LogoLoader from "@/components/LogoLoader";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import Bookings from "./pages/Bookings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PlaceDetails from "./pages/PlaceDetails";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const alreadyShown = sessionStorage.getItem("loader_shown") === "1";
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setAppReady(true);
    sessionStorage.setItem("loader_shown", "1");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <GeolocationProvider>
            <TooltipProvider>
              {!alreadyShown && <LogoLoader ready={appReady} />}
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/place/:id" element={<PlaceDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </GeolocationProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
