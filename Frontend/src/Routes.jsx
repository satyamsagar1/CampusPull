import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AboutLinkMate from "./pages/about-link-mate";
import ResourcesHub from "./pages/resources-hub";
import Homepage from "./pages/homepage";
import Profile from "./pages/profile/Profile"; 
import Community from "./pages/community/Community"; 
import Events from "./pages/events/Events";   
import Explore from "./pages/explore/Explore";
import Feed from "./pages/feed/Feed";  
import Auth from "./pages/Auth/Authpage";
import { AuthProvider } from "./context/authContext";
import { CommunityProvider } from "./context/communityContext";
import ProtectedRoute from "./components/ProtectedRoute";   // ✅ Import

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <CommunityProvider>
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
                    <Community />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
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
          </CommunityProvider>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
