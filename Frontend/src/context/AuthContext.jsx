import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  // Helper: Set Auth Header
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // --- LOGIN ---
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials, { withCredentials: true });
      const { user, accessToken: newToken } = res.data;
      
      setAccessToken(newToken);
      setAuthHeader(newToken);
      setUser(user);
      
      navigate("/homepage", { replace: true });
    } catch (err) {
      throw err; // Let the UI handle the toast
    }
  };

  // --- SIGNUP ---
  const signup = async (data) => {
    try {
      const res = await api.post("/auth/signup", data, { withCredentials: true });
      const { user, accessToken: newToken } = res.data;

      setAccessToken(newToken);
      setAuthHeader(newToken);
      setUser(user);
      
      navigate("/homepage", { replace: true });
    } catch (err) {
      throw err;
    }
  };

  // --- LOGOUT ---
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAccessToken("");
      setAuthHeader(null);
      setUser(null);
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  // --- SILENT REFRESH LOGIC ---
  const refreshAuth = useCallback(async () => {
    try {
      const res = await api.post("/auth/refresh", {}, { withCredentials: true });
      const { accessToken: newToken } = res.data;
      
      setAccessToken(newToken);
      setAuthHeader(newToken);
      
      // After refreshing token, get user data if not already present
      const userRes = await api.get("/auth/me");
      setUser(userRes.data.user);
      return true;
    } catch (err) {
      setAuthHeader(null);
      return false;
    }
  }, []);

  // 1. Initial Load: Check if user is logged in
  useEffect(() => {
    const initAuth = async () => {
      await refreshAuth();
      setLoading(false);
    };
    initAuth();
  }, [refreshAuth]);

  // 2. Scheduled Refresh (Every 14 mins)
  useEffect(() => {
    if (!accessToken) return;
    
    const interval = setInterval(() => {
      refreshAuth();
    }, 14 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [accessToken, refreshAuth]);

  const partialUpdateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const contextValue = useMemo(() => ({
    user,
    loading,
    accessToken,
    login,
    signup,
    logout,
    partialUpdateUser
  }), [user, loading, accessToken, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);