import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react"; 
import { useAuth } from "./AuthContext"; // Use the hook
import api from "../utils/api";
import { debounce } from 'lodash'; // Import debounce (install: npm install lodash)

export const ExploreContext = createContext();

export const ExploreProvider = ({ children }) => {
  const { accessToken, user, loading: authLoading } = useAuth(); // Get user too
  const [suggestions, setSuggestions] = useState([]); // Holds initial suggestions or search results
  const [originalSuggestions, setOriginalSuggestions] = useState([]); // Holds the initial list
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Separate states for incoming and outgoing requests
  const [incomingRequests, setIncomingRequests] = useState([]); 
  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set()); // Store only IDs for quick lookup
  const [acceptedConnectionIds, setAcceptedConnectionIds] = useState(new Set());
  const [connections, setConnections] = useState([]);

  // --- Fetch Initial Suggestions ---
  const fetchSuggestions = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const { data } = await api.get("/connection/suggestions", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSuggestions(data);
      setOriginalSuggestions(data); // Store the initial list
    } catch (err) {
      console.error("Fetch Suggestions Error:", err);
      setError("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // --- Fetch Pending Requests ---
  const fetchRequests = useCallback(async () => {
    if (!accessToken || !user?._id) return;
    try {
      const { data } = await api.get("/connection/requests/pending", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      // Separate incoming and outgoing based on recipient/requester
      const incoming = data.filter(req => req.recipient._id === user._id);
      const outgoingIds = new Set(data
          .filter(req => req.requester._id === user._id)
          .map(req => req.recipient._id) // Store only the ID of the person requested
      ); 

      setIncomingRequests(incoming);
      setOutgoingRequestIds(outgoingIds);

    } catch (err) {
      console.error("Failed to fetch requests", err);
      // Don't set a general error here, maybe just log
    }
  }, [accessToken, user?._id]);

  // --- NEW: Fetch Accepted Connections ---
  const fetchConnections = useCallback(async () => {
    if (!accessToken || !user?._id) return;
    try {
      // Use the /connection/connections route which returns user objects
      const { data: connectedUsers } = await api.get("/connection/connections", { 
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setConnections(connectedUsers);
      const ids = new Set(connectedUsers.map(u => u._id));
      setAcceptedConnectionIds(ids);
    } catch (err) {
      console.error("Failed to fetch connections", err);
      setConnections([]); // Clear on error
      setAcceptedConnectionIds(new Set());
    }
  }, [accessToken, user?._id]);

  // --- Send Connection Request ---
  const sendRequest = useCallback(async (recipientId) => {
    if (!accessToken) return;
    try {
      await api.post(
        "/connection/request",
        { recipientId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // Optimistically update outgoing requests
      setOutgoingRequestIds(prev => new Set(prev).add(recipientId)); 
      // Optionally remove from current suggestions if you want immediate feedback
      // setSuggestions(prev => prev.filter(u => u._id !== recipientId));
    } catch (err) {
      console.error("Send Request Error:", err);
      alert(err.response?.data?.message || "Failed to send request");
    }
  }, [accessToken]);


  // --- Accept Request ---
  const acceptRequest = useCallback(async (requestId) => {
    if (!accessToken) return;
    try {
      const response = await api.post(
        "/connection/respond", 
        { requestId, action: 'accept' }, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchRequests();
      fetchConnections();
    } catch (err) {
      console.error("Accept Request Error:", err);
      alert(err.response?.data?.message || "Failed to accept request");
    }
  }, [accessToken, fetchRequests, fetchConnections]);


  // --- Ignore/Reject Request ---
  const ignoreRequest = useCallback(async (requestId) => {
    if (!accessToken) return;
    try {
      await api.post(
        "/connection/respond", // Use the correct route
        { requestId, action: 'reject' }, // Send correct payload
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Ignore Request Error:", err);
      alert(err.response?.data?.message || "Failed to ignore request");
    }
  }, [accessToken,fetchRequests]);


  // --- API Search Function ---
  const performSearch = useCallback(async (query) => {
      if (!accessToken) return;
      if (!query.trim()) {
          setSuggestions(originalSuggestions); // Show initial suggestions if search is cleared
          setLoading(false);
          return;
      }
      setLoading(true);
      setError("");
      try {
          const { data } = await api.get(`/connection/search?q=${encodeURIComponent(query)}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
          });
          setSuggestions(data); // Update suggestions with search results
      } catch (err) {
          console.error("Search Error:", err);
          setError("Failed to perform search");
          setSuggestions([]); // Clear suggestions on error
      } finally {
          setLoading(false);
      }
  }, [accessToken, originalSuggestions]); // Include originalSuggestions here

  // Debounced search call
  const debouncedSearch = useMemo(() => debounce(performSearch, 300), [performSearch]);

  // Effect to trigger search when `search` state changes
  useEffect(() => {
    debouncedSearch(search);
    // Cleanup function to cancel debounced call if component unmounts or search changes quickly
    return () => {
      debouncedSearch.cancel();
    };
  }, [search, debouncedSearch]);


  // --- Initial Data Fetch ---
  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchSuggestions();
      fetchRequests();
      fetchConnections();
    }
  }, [accessToken, fetchSuggestions, fetchRequests,fetchConnections, authLoading]);


  // --- Context Value ---
  const contextValue = useMemo(() => ({
    suggestions, // This now contains search results or initial suggestions
    search,
    setSearch,
    loading,
    error,
    sendRequest,
    incomingRequests, // Pass incoming requests separately
    outgoingRequestIds, // Pass outgoing request IDs separately
    acceptedConnectionIds,
    connections,
    connectionCount : connections.length,
    acceptRequest,
    ignoreRequest
  }), [suggestions, search, loading, error, sendRequest, incomingRequests, outgoingRequestIds,acceptedConnectionIds, connections, acceptRequest, ignoreRequest]);

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
};

export const useExplore = () => useContext(ExploreContext); // Optional: create a custom hook