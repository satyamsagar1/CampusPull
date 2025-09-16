import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AboutLinkMate from "./pages/about-link-mate";
import ResourcesHub from "./pages/resources-hub";
import Homepage from "./pages/homepage";
import Profile from "./pages/profile/Profile"; 
import Community from "./pages/community/community"; 
import Events from "./pages/events/events";   
import Explore from "./pages/explore/Explore";
import Feed from "./pages/feed/Feed";  
import Auth from "./pages/Auth/AuthPage";
import { AuthProvider } from "./context/AuthContext";
import { CommunityProvider } from "./context/communityContext";
import { EventProvider } from "./context/eventContext"; // ✅ Import EventProvider
import ProtectedRoute from "./components/ProtectedRoute";   // ✅ Import

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
            
            <RouterRoutes>
              {/* Protected Pages */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Homepage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/homepage"
                element={
                  <ProtectedRoute>
                    <Homepage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about-link-mate"
                element={
                  <ProtectedRoute>
                    <AboutLinkMate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources-hub"
                element={
                  <ProtectedRoute>
                    <ResourcesHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <CommunityProvider>
                    <Community />
                    </CommunityProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <EventProvider> 
                    <Events />
                     </EventProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <Explore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                }
              />

              {/* Public Auth Page */}
              <Route path="/auth" element={<Auth />} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
           
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
