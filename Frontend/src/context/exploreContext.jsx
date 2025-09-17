import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import { AuthContext } from "./authContext";
import api from "../utils/api";

export const ExploreContext = createContext();

export const ExploreProvider = ({ children }) => {
  const { accessToken, loading: authLoading} = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const sendRequest = useCallback(async (recipientId) => {
    if (!accessToken) return;
    try {
      await api.post("/connection/request", { recipientId }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSuggestions(prev => prev.filter(user => user._id !== recipientId));
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  }, [accessToken]);

  const filteredSuggestions = suggestions.filter((user) => {
  if (!user) return false;

  const name = user?.name?.toLowerCase() || "";
  const college = user?.college?.toLowerCase() || "";
  const degree = user?.degree?.toLowerCase() || "";
  const skills = (user?.skills || []).map((s) =>
    (s || "").toLowerCase()
  );

  const query = search.toLowerCase();

  return (
    name.includes(query) ||
    college.includes(query) ||
    degree.includes(query) ||
    skills.some((skill) => skill.includes(query))
  );
});

  useEffect(() => {
    if (!authLoading && accessToken)
    fetchSuggestions();
  }, [accessToken, fetchSuggestions]);

  const contextValue = useMemo(() => ({
    suggestions: filteredSuggestions,
    search,
    setSearch,
    loading,
    error,
    sendRequest
  }), [filteredSuggestions, search, loading, error, sendRequest]);

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
};
