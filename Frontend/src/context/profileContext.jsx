import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!accessToken) return;
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.get("/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(data);
    } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
        setLoading(false);
    }
}, [accessToken]);

const updateProfile = useCallback(async (updates) => {
    if (!accessToken) return;
    setError(null);
    setLoading(true);
    try {
        const { data } = await api.put("/profile", updates, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProfile(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const contextValue = useMemo(
    () => ({ profile, loading, error, fetchProfile, updateProfile }),
    [profile, loading, error, fetchProfile, updateProfile]
  );

  return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>;
};

