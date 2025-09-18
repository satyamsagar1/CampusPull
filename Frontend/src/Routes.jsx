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
import Auth from "./pages/Auth/AuthPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CommunityProvider } from "./context/communityContext.jsx";
import { EventProvider } from "./context/eventContext.jsx"; 
import ProtectedRoute from "./components/ProtectedRoute.jsx";   
import { ExploreProvider } from "./context/exploreContext.jsx";
import { ProfileProvider } from "./context/profileContext.jsx";
import { ChatProvider } from "./context/chatContext.jsx";
import ChatPage from "./pages/chat/chatPage.jsx";  
import Header from "./components/ui/Header.jsx";   // ✅ Header import

// ✅ Wrapper to always show Header with protected pages
const ProtectedLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="pt-16">{children}</div> {/* ✅ header ke niche gap */}
    </>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <ErrorBoundary>
            <ScrollToTop />

            <RouterRoutes>
              {/* Protected Pages with Header */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Homepage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/homepage"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Homepage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatPage"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ChatPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about-link-mate"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <AboutLinkMate />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources-hub"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ResourcesHub />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ProfileProvider>
                        <Profile />
                      </ProfileProvider>
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <CommunityProvider>
                        <Community />
                      </CommunityProvider>
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <EventProvider>
                        <Events />
                      </EventProvider>
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ExploreProvider>
                        <Explore />
                      </ExploreProvider>
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Feed />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />

              {/* Public Auth Page (no header) */}
              <Route path="/auth" element={<Auth />} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>

          </ErrorBoundary>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
