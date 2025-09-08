// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading while checking auth
  const navigate = useNavigate();

  // --- LOGIN ---
  const login = async (credentials) => {
    try {
      const res = await api.post(
        "/auth/login",
        credentials,
        { withCredentials: true } // important to receive refresh cookie
      );
      setUser(res.data.user);
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
      navigate("/auth", { replace: true });
    }
  };

  // --- FETCH USER ON PAGE LOAD (refresh token flow) ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1. Call refresh route to get new access token
        const refreshRes = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true } // send cookie
        );

        const accessToken = refreshRes.data.accessToken;

        // 2. Fetch current user using access token
        const userRes = await api.get(
          "/auth/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );

        setUser(userRes.data.user);
      } catch (err) {
        console.error("Auth check failed:", err.response?.data || err.message);
        setUser(null); // not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
