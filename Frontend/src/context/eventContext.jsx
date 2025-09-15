import React, { createContext, useState, useEffect, useMemo } from "react";
import api from "../utils/api"; // 👈 use the configured axios instance

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/event"); 
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const res = await api.post("/event", eventData);
      setEvents([res.data, ...events]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const res = await api.put(`/event/${id}`, eventData);
      setEvents(events.map((e) => (e._id === id ? res.data : e)));
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/event/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const contextValue = useMemo(
    () => ({
      events,
      loading,
      fetchEvents,
      createEvent,
      updateEvent,
      deleteEvent,
    }),
    [events, loading]
  );

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};
