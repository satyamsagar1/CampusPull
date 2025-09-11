import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL + "/community/questions";
  const ANSWERS_API_BASE = import.meta.env.VITE_API_BASE_URL + "/community/answers";

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE, { withCredentials: true });
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new post
  const createPost = async (body) => {
    try {
      const res = await axios.post(API_BASE, { body }, { withCredentials: true });
      setPosts([res.data, ...posts]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Update post
  const updatePost = async (id, body) => {
    try {
      const res = await axios.put(`${API_BASE}/${id}`, { body }, { withCredentials: true });
      setPosts(posts.map((post) => (post._id === id ? res.data : post)));
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // Delete post
  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Upvote post
  const likePost = async (id) => {
    try {
      const res = await axios.post(`${API_BASE}/${id}/upvote`, {}, { withCredentials: true });
      setPosts(posts.map((post) =>
        post._id === id ? { ...post, likes: res.data.upvotes } : post
      ));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Answer a post
  const answerPost = async (questionId, body) => {
    try {
      const res = await axios.post(`${API_BASE}/${questionId}/answers`, { body }, { withCredentials: true });
      setPosts(posts.map((post) =>
        post._id === questionId
          ? { ...post, answers: [...(post.answers || []), res.data] }
          : post
      ));
    } catch (error) {
      console.error("Error answering post:", error);
    }
  };

  // Update answer
  const updateAnswer = async (id, body) => {
    try {
      const res = await axios.put(`${ANSWERS_API_BASE}/${id}`, { body }, { withCredentials: true });
      setPosts(posts.map(post => ({
        ...post,
        answers: post.answers?.map(ans => ans._id === id ? res.data : ans)
      })));
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  // Delete answer
  const deleteAnswer = async (id) => {
    try {
      await axios.delete(`${ANSWERS_API_BASE}/${id}`, { withCredentials: true });
      setPosts(posts.map(post => ({
        ...post,
        answers: post.answers?.filter(ans => ans._id !== id)
      })));
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  // Upvote answer
  const likeAnswer = async (id) => {
    try {
      const res = await axios.post(`${ANSWERS_API_BASE}/${id}/upvote`, {}, { withCredentials: true });
      setPosts(posts.map(post => ({
        ...post,
        answers: post.answers?.map(ans => ans._id === id ? { ...ans, likes: res.data.upvotes } : ans)
      })));
    } catch (error) {
      console.error("Error liking answer:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const contextValue = useMemo(() => ({
    posts,
    loading,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    answerPost,
    updateAnswer,
    deleteAnswer,
    likeAnswer
  }), [posts, loading]);

  return (
    <CommunityContext.Provider value={contextValue}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => useContext(CommunityContext);
