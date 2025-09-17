import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import NotFound from "./pages/NotFound.jsx";
import AboutLinkMate from "./pages/about-link-mate";
import ResourcesHub from "./pages/resources-hub";
import Homepage from "./pages/homepage";
import Profile from "./pages/profile/Profile.jsx"; 
import Community from "./pages/community/community.jsx"; 
import Events from "./pages/events/events.jsx";   
import Explore from "./pages/explore/Explore.jsx";
import Feed from "./pages/feed/Feed.jsx";  
import Header from "./components/ui/Header.jsx";
import Auth from "./pages/Auth/AuthPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CommunityProvider } from "./context/communityContext.jsx";
import { EventProvider } from "./context/eventContext.jsx"; // ✅ Import EventProvider
import ProtectedRoute from "./components/ProtectedRoute.jsx";   // ✅ Import
import { ExploreProvider } from "./context/exploreContext.jsx";
import { ProfileProvider } from "./context/profileContext.jsx";


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
                    <ProfileProvider>
                    <Profile />
                    </ProfileProvider>
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
                    <ExploreProvider>
                    <Explore />
                    </ExploreProvider>
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
