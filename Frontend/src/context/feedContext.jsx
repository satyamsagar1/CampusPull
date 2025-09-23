// src/context/FeedContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { AuthContext } from "./AuthContext";
import api from "../utils/api";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const { accessToken, loading: authLoading } = useContext(AuthContext);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- FETCH FEED ---
  const fetchFeed = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const { data } = await api.get("/feed", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      setFeed(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // --- CREATE POST ---
  const createPost = useCallback(
    async (content, file = null) => {
      if (!accessToken) return;
      if (!content?.trim() && !file) {
        setError("Content or media required");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("content", content?.trim() || "");
        if (file) formData.append("media", file);

        const { data } = await api.post("/feed/post", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        setFeed((prev) => [data, ...prev]);
      } catch (err) {
        console.error(err);
        setError("Failed to create post");
      }
    },
    [accessToken]
  );

  // --- UPDATE POST ---
  const updatePost = useCallback(
    async (postId, content, file = null) => {
      if (!accessToken) return;
      if (!content?.trim() && !file) {
        setError("Content or media required");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("content", content?.trim() || "");
        if (file) formData.append("media", file);

        const { data } = await api.put(`/feed/post/${postId}`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        setFeed((prev) => prev.map((p) => (p._id === postId ? data : p)));
      } catch (err) {
        console.error(err);
        setError("Failed to update post");
      }
    },
    [accessToken]
  );

  // --- DELETE POST ---
  const deletePost = useCallback(
    async (postId) => {
      if (!accessToken) return;
      try {
        await api.delete(`/feed/post/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setFeed((prev) => prev.filter((p) => p._id !== postId));
      } catch (err) {
        console.error(err);
        setError("Failed to delete post");
      }
    },
    [accessToken]
  );

  // --- LIKE POST ---
  const likePost = useCallback(
    async (postId) => {
      if (!accessToken) return;
      try {
        const { data } = await api.put(`/feed/like/${postId}`, {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setFeed((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, likesCount: data.likesCount } : p))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to like/unlike post");
      }
    },
    [accessToken]
  );

  // --- COMMENT POST ---
  const commentPost = useCallback(
    async (postId, text) => {
      if (!accessToken) return;
      try {
        const { data } = await api.post(
          `/feed/comment/${postId}`,
          { text },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setFeed((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, comments: data, commentsCount: data.length } : p))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to comment on post");
      }
    },
    [accessToken]
  );

  // --- REPLY TO COMMENT ---
  const replyToComment = useCallback(
    async (postId, commentId, text) => {
      if (!accessToken) return;
      try {
        const { data } = await api.post(
          `/feed/comment/${postId}/reply/${commentId}`,
          { text },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setFeed((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, comments: data } : p))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to reply to comment");
      }
    },
    [accessToken]
  );

  // --- LIKE COMMENT / REPLY ---
  const likeComment = useCallback(
    async (postId, commentId, replyId = null) => {
      if (!accessToken) return;
      try {
        const url = replyId
          ? `/feed/comment/${postId}/like/${commentId}/${replyId}`
          : `/feed/comment/${postId}/like/${commentId}`;

        const { data } = await api.put(url, {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setFeed((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, comments: data } : p))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to like comment/reply");
      }
    },
    [accessToken]
  );

  // --- SHARE POST ---
  const sharePost = useCallback(
    async (postId, sharedContent = "") => {
      if (!accessToken) return;
      try {
        const { data } = await api.post(
          `/feed/share/${postId}`,
          { sharedContent },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setFeed((prev) => [data, ...prev]);
      } catch (err) {
        console.error(err);
        setError("Failed to share post");
      }
    },
    [accessToken]
  );

  // --- Fetch feed when auth is ready ---
  useEffect(() => {
    if (!authLoading && accessToken) fetchFeed();
  }, [authLoading, accessToken, fetchFeed]);

  const contextValue = useMemo(
    () => ({
      feed,
      loading,
      error,
      fetchFeed,
      createPost,
      updatePost,
      deletePost,
      likePost,
      commentPost,
      replyToComment,
      likeComment,
      sharePost,
    }),
    [feed, loading, error, fetchFeed, createPost, updatePost, deletePost, likePost, commentPost, replyToComment, likeComment, sharePost]
  );

  return <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>;
};

export const useFeed = () => useContext(FeedContext);
