import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");

  const partialUpdateUser = (updates) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updates
    }));
  };

  // --- LOGIN ---
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials, { withCredentials: true });
      
      // --- FIX: Set header immediately after login ---
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
      setUser(res.data.user);

      setAccessToken(res.data.accessToken);
      navigate("/homepage", { replace: true });
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // --- SIGNUP ---
  const signup = async (data) => {
    try {
      const res = await api.post("/auth/signup", data, { withCredentials: true });

      // --- FIX: Set header immediately after signup ---
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;

      setUser(res.data.user);
      setAccessToken(res.data.accessToken);
      navigate("/homepage", { replace: true });
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // --- FIX: Clear header immediately on logout ---
      delete api.defaults.headers.common["Authorization"];

      setUser(null);
      setAccessToken("");
      navigate("/auth", { replace: true }); 
    }
  };

  // Your useEffect hooks are well-written and can remain as they are.
  // They provide a great fallback and handle the refresh logic perfectly.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const refreshRes = await api.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = refreshRes.data.accessToken;
        setAccessToken(newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        const userRes = await api.get("/auth/me", { withCredentials: true });
        setUser(userRes.data.user);
      } catch (err) {
        console.error("Failed to fetch user or refresh token:", err);
        setUser(null);
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const timer = setTimeout(async () => {
      try {
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data.accessToken;
        setAccessToken(newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      } catch (err) {
        console.error("Scheduled refresh failed:", err);
      }
    }, 14 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [accessToken]);
  
  // This effect is now a helpful backup, but our immediate sets in login/logout do the main work.
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  const contextValue = useMemo(
    () => ({ user, loading, accessToken, login, signup, logout, partialUpdateUser }),
    [user, accessToken, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);