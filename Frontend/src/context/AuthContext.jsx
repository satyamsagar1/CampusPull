// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading while checking auth
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");

  // --- LOGIN ---
  const login = async (credentials) => {
    try {
      const res = await api.post(
        "/auth/login",
        credentials,
        { withCredentials: true } // important to receive refresh cookie
      );
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
      const res = await api.post(
        "/auth/signup",
        data,
        { withCredentials: true }
      );
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
      await api.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setAccessToken("");
      navigate("/auth", { replace: true }); 
      
    }
  };

  // --- FETCH USER ON PAGE LOAD (refresh token flow) ---
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
      console.error("Auth check failed:", err.response?.data || err.message);
      setUser(null);
      setAccessToken("");
      // navigate("/login"); // optional
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []); // only run once on mount

useEffect(() => {
  if (!accessToken) return;

  // refresh 1 minute before expiry (14 min mark)
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

useEffect(() => {
  if (accessToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}, [accessToken]);



  const contextValue = useMemo(
    () => ({
      user,
      loading,
      accessToken,
      setAccessToken,
      login,
      signup,
      logout,
    }),
    [user, accessToken,loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


