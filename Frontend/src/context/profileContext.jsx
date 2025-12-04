import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!accessToken);
  const [error, setError] = useState(null);

  // --- 1. Fetch Profile ---
  const fetchProfile = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.get("/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(data);
    } catch (err) {
      console.error("Fetch Profile Error:", err);
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // --- 2. Generic Update ---
  const updateProfile = useCallback(async (updates) => {
    if (!accessToken) return;
    setError(null);
    // Don't set global loading here to avoid full UI freeze, handle locally if needed
    try {
      const { data } = await api.put("/profile", updates, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(data); 
      return data;
    } catch (err) {
      console.error("Update Profile Error:", err);
      throw err; 
    }
  }, [accessToken]);

  // --- 3. Helper: Add Item to Array (Skills, Projects, etc.) ---
  const addItemToProfile = useCallback(async (key, newItem) => {
    if (!profile) return;
    const currentArray = profile[key] || [];
    const updatedArray = [...currentArray, newItem];
    await updateProfile({ [key]: updatedArray });
  }, [profile, updateProfile]);

  // --- 4. Helper: Upload Image Logic ---
  const uploadPhoto = useCallback(async (file) => {
    if (!accessToken) return;
    
    // Create Form Data
    const formData = new FormData();
    formData.append("photo", file);

    try {
      // Axios returns the response object, we destruct 'data' from it directly
      const { data } = await api.post("/profile/upload-photo", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}` 
        },
      });

      // No need for 'res.json()' or checking 'res.ok' with Axios
      const photoUrl = data.photoUrl || data.url;

      // 2. Save URL to Profile
      await updateProfile({ profileImage: photoUrl });
      
      return photoUrl;
    } catch (err) {
      console.error("Upload Logic Error:", err);
      throw err;
    }
  }, [accessToken, updateProfile]);

  // Initial Load
  useEffect(() => {
    if (accessToken) fetchProfile();
    else {
        setProfile(null);
        setLoading(false);
    }
  }, [fetchProfile, accessToken]);

  const contextValue = useMemo(
    () => ({ 
        profile, 
        loading, 
        error, 
        fetchProfile, 
        updateProfile,
        addItemToProfile, // Exported Helper
        uploadPhoto       // Exported Helper
    }),
    [profile, loading, error, fetchProfile, updateProfile, addItemToProfile, uploadPhoto]
  );

  return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>;
};