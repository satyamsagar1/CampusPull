import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "./AuthContext";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch Events ----------------
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/event", {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Create Event ----------------
  const createEvent = async ({ title, description, date, bannerFile }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      if (bannerFile) formData.append("banner", bannerFile);

      const res = await api.post("/event/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEvents(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // ---------------- Update Event ----------------
  const updateEvent = async (id, { title, description, date, bannerFile }) => {
    try {
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      if (date) formData.append("date", date);
      if (bannerFile) formData.append("banner", bannerFile);

      const res = await api.put(`/event/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEvents(prev => prev.map(e => (e._id === id ? res.data : e)));
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  // ---------------- Delete Event ----------------
  const deleteEvent = async (id) => {
    try {
      await api.delete(`/event/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const contextValue = useMemo(() => ({
    events,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  }), [events, loading]);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};
