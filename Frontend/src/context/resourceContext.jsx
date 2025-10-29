// context/ResourceContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import api from "../utils/api"; // axios instance with baseURL + token interceptor
import { AuthContext } from "./authContext";

export const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const { accessToken, user, partialUpdateUser } = useContext(AuthContext);

  const [resources, setResources] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== Helper: Attach token =====
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // ===== NEW LESSON PROGRESS FUNCTION =====
  const toggleLessonProgress = async (lessonId) => {
    if (!lessonId) return;

    try {
      // 1. Call the new backend endpoint
      const res = await api.patch(
        "/profile/progress/toggle", 
        { lessonId }, 
        getAuthHeaders()
      );

      // 2. Update the global user state via AuthContext
      // res.data contains the new 'completedLessons' array from the controller
      partialUpdateUser({ completedLessons: res.data });

    } catch (err) {
      console.error("Lesson progress toggle error:", err.response?.data || err.message);
      // We don't revert here, but you could add error handling
      throw err; // Re-throw for the component to handle
    }
  };

  // ===== Fetch functions =====
  const fetchResources = useCallback(async () => {
    try {
      const res = await api.get("/resources/notes", getAuthHeaders());
      setResources(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken]);

  const fetchRoadmaps = useCallback(async () => {
    try {
      const res = await api.get("/resources/roadmaps", getAuthHeaders());
      setRoadmaps(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken]);

  const fetchPYQs = useCallback(async () => {
    try {
      const res = await api.get("/resources/pyqs", getAuthHeaders());
      setPyqs(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken]);

  // ===== UPLOAD FUNCTIONS =====
const uploadNotes = async (formData) => {
  try {
    const res = await api.post("/resources/notes/upload", formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    setResources((prev) => [res.data, ...prev]);
    return res.data;
  } catch (err) {
    setError(err.response?.data?.error || err.message);
    throw err;
  }
};

const uploadRoadmap = async (formData) => {
  try {
    const res = await api.post("/resources/roadmaps/upload", formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    setRoadmaps((prev) => [res.data, ...prev]);
    return res.data;
  } catch (err) {
    setError(err.response?.data?.error || err.message);
    throw err;
  }
};

const uploadPYQ = async (formData) => {
  try {
    const res = await api.post("/resources/pyqs/upload", formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    setPyqs((prev) => [res.data, ...prev]);
    return res.data;
  } catch (err) {
    setError(err.response?.data?.error || err.message);
    throw err;
  }
};

// ===== UPDATE FUNCTIONS =====
const updateRoadmap = async (roadmapId, formData) => {
  try {
    const res = await api.put(`/resources/roadmaps/${roadmapId}`, formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    
    // Find and replace the old roadmap in the state
    setRoadmaps((prev) =>
      prev.map((r) => (r._id === roadmapId ? res.data : r))
    );
    return res.data;
  } catch (err) {
    setError(err.response?.data?.error || err.message);
    throw err;
  }
};


const updateNote = async (noteId, formData) => {
  try {
    const res = await api.put(`/resources/notes/${noteId}`, formData, {
      ...getAuthHeaders(),
      headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
    });
    setResources((prev) =>
      prev.map((r) => (r._id === noteId ? res.data : r))
    );
    return res.data;
  } catch (err) {
    setError(err.response?.data?.error || err.message);
    throw err;
  }
};

const updatePYQ = async (pyqId, formData) => {
  try {
    const res = await api.put(`/resources/pyqs/${pyqId}`, formData, {
      ...getAuthHeaders(),
      headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
    });
    setPyqs((prev) =>
      prev.map((r) => (r._id === pyqId ? res.data : r))
    );
    return res.data;
  } catch (err) {
    setError(err.response?.data?.error || err.message);
    throw err;
  }
};


  // ===== Load all data =====
  useEffect(() => {
    if (!accessToken) return;
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchResources(), fetchRoadmaps(), fetchPYQs()]);
      setLoading(false);
    };
    loadData();
  }, [accessToken, fetchResources, fetchRoadmaps, fetchPYQs]);

  // ===== Interaction functions =====
  const incrementView = async (id, type) => {
    try {
      const res = await api.patch(`/resources/${type}/${id}/view`);
      updateState(type, res.data);
    } catch (err) {
      console.error("View increment error:", err);
    }
  };

  const incrementDownload = async (id, type) => {
    try {
      const res = await api.patch(`/resources/${type}/${id}/download`);
      updateState(type, res.data);
    } catch (err) {
      console.error("Download increment error:", err);
    }
  };

  const toggleBookmark = async (id, type) => {
    try {
      const res = await api.patch(`/resources/${type}/${id}/bookmark`, {}, getAuthHeaders());
      updateState(type, res.data);
    } catch (err) {
      console.error("Bookmark toggle error:", err.response?.data || err.message);
    }
  };

  // ===== Helper to update local state =====
  const updateState = (type, updatedItem) => {
    if (type === "notes")
      setResources((prev) => prev.map((r) => (r._id === updatedItem._id ? updatedItem : r)));
    if (type === "pyqs")
      setPyqs((prev) => prev.map((r) => (r._id === updatedItem._id ? updatedItem : r)));
    if (type === "roadmaps")
      setRoadmaps((prev) => prev.map((r) => (r._id === updatedItem._id ? updatedItem : r)));
  };

  // ===== Context value =====
  const value = useMemo(
    () => ({
      resources,
      roadmaps,
      pyqs,
      loading,
      error,
      refreshResources: fetchResources,
      refreshRoadmaps: fetchRoadmaps,
      refreshPYQs: fetchPYQs,
      incrementView,
      incrementDownload,
      toggleBookmark,
      uploadNotes,
      uploadRoadmap,
      uploadPYQ,
      toggleLessonProgress,
      updateRoadmap,
      updateNote,
      updatePYQ,
      user,
    }),
    [resources, roadmaps, pyqs, loading, error, user]
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};
