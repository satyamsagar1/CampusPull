import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react"; 
import { useAuth } from "./AuthContext"; 
import api from "../utils/api";
import { debounce } from 'lodash'; 

export const ExploreContext = createContext();

export const ExploreProvider = ({ children }) => {
  const { accessToken, user, loading: authLoading } = useAuth(); 
  const [suggestions, setSuggestions] = useState([]); 
  const [originalSuggestions, setOriginalSuggestions] = useState([]); 
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [incomingRequests, setIncomingRequests] = useState([]); 
  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set()); 
  const [acceptedConnectionIds, setAcceptedConnectionIds] = useState(new Set());
  const [connections, setConnections] = useState([]);

  // ✅ 1. NEW: Centralized Image Helper (Exposed to all components)
  const getImageUrl = useCallback((path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path; // Already a full URL (Cloudinary/Google)
    
    // Dynamic Base URL logic (Safe for localhost & production)
    let baseUrl = api.defaults.baseURL || "";
    baseUrl = baseUrl.replace(/\/api\/?$/, ""); // Strip /api suffix
    
    // Ensure path starts with /
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    return `${baseUrl}${cleanPath}`;
  }, []);

  // --- Fetch Initial Suggestions ---
  const fetchSuggestions = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(""); 
    try {
      const { data } = await api.get("/connection/suggestions", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSuggestions(data);
      setOriginalSuggestions(data); 
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
      
      const incoming = data.filter(req => req.recipient._id === user._id);
      const outgoingIds = new Set(data
          .filter(req => req.requester._id === user._id)
          .map(req => req.recipient._id) 
      ); 

      setIncomingRequests(incoming);
      setOutgoingRequestIds(outgoingIds);

    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  }, [accessToken, user?._id]);

  // --- Fetch Accepted Connections ---
  const fetchConnections = useCallback(async () => {
    if (!accessToken || !user?._id) return;
    try {
      const { data: connectedUsers } = await api.get("/connection/connections", { 
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const validConnections = connectedUsers.filter(u => u !== null && u !== undefined);
      setConnections(validConnections);
      
      // ✅ 2. BUG FIX: Changed 'val.map' to 'validConnections.map'
      const ids = new Set(validConnections.map(u => u._id));
      setAcceptedConnectionIds(ids);
    } catch (err) {
      console.error("Failed to fetch connections", err);
      setConnections([]); 
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
      setOutgoingRequestIds(prev => new Set(prev).add(recipientId)); 
    } catch (err) {
      console.error("Send Request Error:", err);
      alert(err.response?.data?.message || "Failed to send request");
    }
  }, [accessToken]);

  // --- Accept Request ---
  const acceptRequest = useCallback(async (requestId) => {
    if (!accessToken) return;
    try {
      await api.post(
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
        "/connection/respond", 
        { requestId, action: 'reject' }, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Ignore Request Error:", err);
      alert(err.response?.data?.message || "Failed to ignore request");
    }
  }, [accessToken, fetchRequests]);

  // --- API Search Function ---
  const performSearch = useCallback(async (query) => {
      if (!accessToken) return;
      if (!query.trim()) {
          setSuggestions(originalSuggestions); 
          setLoading(false);
          return;
      }
      setLoading(true);
      setError("");
      try {
          const { data } = await api.get(`/connection/search?q=${encodeURIComponent(query)}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
          });
          setSuggestions(data); 
      } catch (err) {
          console.error("Search Error:", err);
          setError("Failed to perform search");
          setSuggestions([]); 
      } finally {
          setLoading(false);
      }
  }, [accessToken, originalSuggestions]);

  // Debounced search
  const debouncedSearch = useMemo(() => debounce(performSearch, 300), [performSearch]);

  useEffect(() => {
    debouncedSearch(search);
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
  }, [accessToken, fetchSuggestions, fetchRequests, fetchConnections, authLoading]);

  // --- Context Value ---
  const contextValue = useMemo(() => ({
    suggestions, 
    search,
    setSearch,
    loading,
    error,
    sendRequest,
    incomingRequests, 
    outgoingRequestIds, 
    acceptedConnectionIds,
    connections,
    connectionCount : connections.length,
    acceptRequest,
    ignoreRequest,
    getImageUrl, // ✅ Exported here!
  }), [suggestions, search, loading, error, sendRequest, incomingRequests, outgoingRequestIds, acceptedConnectionIds, connections, acceptRequest, ignoreRequest, getImageUrl]);

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
};

export const useExplore = () => useContext(ExploreContext);