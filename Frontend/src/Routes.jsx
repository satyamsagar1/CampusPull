// src/Routes.jsx
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
import Announcement from "./pages/Announcement/announcement.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CommunityProvider } from "./context/communityContext.jsx";
import { EventProvider } from "./context/eventContext.jsx"; 
import ProtectedRoute from "./components/ProtectedRoute.jsx";   
import { ExploreProvider } from "./context/exploreContext.jsx";
import { ProfileProvider } from "./context/profileContext.jsx";
import { ChatProvider } from "./context/chatContext.jsx";
import ChatPage from "./pages/chat/chatPage.jsx";  
import Header from "./components/ui/Header.jsx";  
import { FeedProvider } from "./context/feedContext.jsx";
import { ResourceProvider } from "./context/resourceContext.jsx"; 
import { AnnouncementProvider } from "./context/announcementContext.jsx"; 

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="pt-16">{children}</div>
    </>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 🚀 All providers moved here, ensuring EventProvider is wrapped by AuthProvider */}
        <EventProvider> 
        <CommunityProvider>
        <ExploreProvider>
        <ProfileProvider>
        <FeedProvider>
        <ResourceProvider>
        <AnnouncementProvider>
        <ChatProvider>
          <ErrorBoundary>
            <ScrollToTop />

            <RouterRoutes>
              {/* Protected Routes - All nested providers removed from here */}
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
                      <Profile />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Community />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Announcement />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Events />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Explore />
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
        </AnnouncementProvider>
        </ResourceProvider>
        </FeedProvider>
        </ProfileProvider>
        </ExploreProvider>
        </CommunityProvider>
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;