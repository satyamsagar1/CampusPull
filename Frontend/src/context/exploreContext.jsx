import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import api from "../utils/api";

export const ExploreContext = createContext();

export const ExploreProvider = ({ children }) => {
  const { accessToken, loading: authLoading } = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ New state for pending requests
  const [requests, setRequests] = useState([]);

  const fetchSuggestions = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const { data } = await api.get("/connection/suggestions", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ✅ Send connection request
  const sendRequest = useCallback(async (recipientId) => {
    if (!accessToken) return;
    try {
      const { data } = await api.post(
        "/connection/request",
        { recipientId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Backend response ka user object ho sakta hai, 
      // agar nahi hai to tum suggestions se nikal lo
      const requestedUser =
        suggestions.find((u) => u._id === recipientId) || { _id: recipientId };

      // ✅ frontend state update
      setRequests((prev) => [...prev, requestedUser]);
      setSuggestions((prev) => prev.filter((user) => user._id !== recipientId));
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  }, [accessToken, suggestions]);

  // ✅ Optional: fetch already pending requests from backend
  const fetchRequests = useCallback(async () => {
    if (!accessToken) return;
    try {
      const { data } = await api.get("/connection/pending", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  }, [accessToken]);

  const filteredSuggestions = suggestions.filter((user) => {
    if (!user) return false;

    const name = user?.name?.toLowerCase() || "";
    const college = user?.college?.toLowerCase() || "";
    const degree = user?.degree?.toLowerCase() || "";
    const skills = (user?.skills || []).map((s) => (s || "").toLowerCase());

    const query = search.toLowerCase();

    return (
      name.includes(query) ||
      college.includes(query) ||
      degree.includes(query) ||
      skills.some((skill) => skill.includes(query))
    );
  });

  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchSuggestions();
      fetchRequests(); // ✅ also load pending requests
    }
  }, [accessToken, fetchSuggestions, fetchRequests, authLoading]);

  const contextValue = useMemo(
    () => ({
      suggestions: filteredSuggestions,
      search,
      setSearch,
      loading,
      error,
      sendRequest,
      requests, // ✅ expose requests to UI
    }),
    [filteredSuggestions, search, loading, error, sendRequest, requests]
  );

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
};
