import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import api from "../utils/api"; // Adjust path if needed
import { AuthContext } from "./AuthContext"; // Adjust path if needed

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { accessToken, user, loading: authLoading } = useContext(AuthContext); 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper for auth headers
  const getAuthHeaders = useCallback((isFormData = false) => {
    const headers = { Authorization: `Bearer ${accessToken}` };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return { headers };
  }, [accessToken]);

  // Fetch Events (Final Logic Fix)
  const fetchEvents = useCallback(async () => {
    // 🎯 FINAL FIX: Check for the whole user object, which is stable now.
    if (!user || !accessToken) { 
//       console.log("[EventContext fetchEvents] Skipping fetch: User object or Token missing.");
      setEvents([]); 
      setLoading(false);
      return;
    }
    
//     console.log("[EventContext fetchEvents] Fetching events...");
    setLoading(true); 
    setError(null);
    try {
      const res = await api.get("/event", getAuthHeaders());
      setEvents(res.data || []);
    } catch (err) { 
      console.error("Error fetching events:", err);
      setError(err.response?.data?.error || 'Failed to fetch events.');
    }
    finally {
      setLoading(false); 
    }
  // 🎯 Dependency array MUST use 'user' not 'user?._id' for consistency with the check above
  }, [accessToken, user, getAuthHeaders]); 

  // Create Event
  const createEvent = useCallback(async (formData) => {
    if (!accessToken) throw new Error("Not authenticated");
    setError(null);
    try {
      const res = await api.post("/event", formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newEvent = { type: "event", ...res.data };
      setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      return newEvent;
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.response?.data?.error || 'Failed to create event.');
      throw err;
    }
  }, [accessToken]);

  // Update Event
  const updateEvent = useCallback(async (id, formData) => {
    if (!accessToken) throw new Error("Not authenticated");
    setError(null);
    try {
      const res = await api.put(`/event/${id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const updatedEvent = { type: "event", ...res.data };
      setEvents(prev => prev.map(e => (e._id === id ? updatedEvent : e)));
      return updatedEvent;
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err.response?.data?.error || 'Failed to update event.');
      throw err;
    }
  }, [accessToken]);

  // Delete Event
  const deleteEvent = useCallback(async (id) => {
    if (!accessToken) throw new Error("Not authenticated");
    setError(null);
    try {
      await api.delete(`/event/${id}`, getAuthHeaders());
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      setError(err.response?.data?.error || 'Failed to delete event.');
      throw err;
    }
  }, [accessToken, getAuthHeaders]);

  // ---  incrementInterest 
  const incrementInterest = useCallback(async (eventId) => {
    if (!accessToken) throw new Error("Not authenticated");
//     console.log("[EventContext] Attempting incrementInterest for eventId:", eventId);

    try {
      const res = await api.patch(`/event/${eventId}/interest`, {}, getAuthHeaders());
//       console.log("[EventContext incrementInterest] Backend Response:", res.data);

      const { _id: returnedEventId, interestCount: updatedInterestCount, interestedUsers: updatedInterestedUsers } = res.data;

      if (returnedEventId && typeof updatedInterestCount === 'number' && Array.isArray(updatedInterestedUsers)) {
        setEvents((prevEvents) => {
//           console.log(`[EventContext incrementInterest] Updating event ${returnedEventId} state. New count: ${updatedInterestCount}`);
          return prevEvents.map((event) => {
            if (event._id === returnedEventId) {
              return {
                ...event,
                interestCount: updatedInterestCount,
                interestedUsers: updatedInterestedUsers, 
              };
            }
            return event;
          });
        });
      } else {
         console.error("[EventContext incrementInterest] Invalid or incomplete response data received from backend:", res.data);
      }

      return res.data;

    } catch (err) {
      console.error("Increment Interest Error in Context:", err.response?.data?.message || err.message);
      throw err; 
    }
  }, [accessToken, getAuthHeaders]); 

  // --- Event Fetch useEffect (Ultimate Logic Fix) ---
  useEffect(() => {
    // Log the state
//     console.log(`[EventContext useEffect] SIMPLIFIED CHECK -> AuthLoading: ${authLoading}, AccessToken: ${!!accessToken}, User: ${!!user}`);
    // console.log(`[EventContext] User Object Check:`, user);
    // Condition: Auth is NOT loading AND we have an access token.
    if (!authLoading && accessToken) {
//       console.log("[EventContext useEffect] SIMPLIFIED CONDITIONS MET. Calling fetchEvents.");
      fetchEvents();
    } else if (!authLoading && !accessToken) {
      // Auth finished, no token means logged out.
//       console.log("[EventContext useEffect] Auth finished, NO token. Clearing events.");
      setEvents([]);
      setLoading(false);
      setError(null);
    } else {
      // Still loading (authLoading is true)
//       console.log("[EventContext useEffect] Waiting for AuthContext to finish initial load...");
      setLoading(true); // Keep loading
    }
  // 🎯 Dependency array uses accessToken and authLoading
  }, [authLoading, accessToken, fetchEvents, user]); 

  const contextValue = useMemo(() => ({
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    incrementInterest,
  }), [events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent, incrementInterest]);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook
export const useEvents = () => useContext(EventContext);