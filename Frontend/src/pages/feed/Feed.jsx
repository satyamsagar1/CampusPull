import React, { useState, useRef } from "react";
import { useFeed } from "../../context/feedContext";
import { Heart, MessageCircle, Share2, Paperclip, Flame, TrendingUp, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Feed() {
  const {
    feed,
    createPost,
    likePost,
    commentPost,
    replyToComment,
    likeComment,
    sharePost,
    loading,
  } = useFeed();

  const [newPost, setNewPost] = useState("");
  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle post creation
  const handleAddPost = async () => {
    if (!newPost.trim() && !newFile) return;

    try {
      await createPost(newPost, newFile); // send File object to backend
      setNewPost("");
      setNewFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Post creation failed:", err);
    }
  };

  // Dummy trending posts
  const trendingPosts = [
    { id: 1, title: "Amazing React Tips & Tricks", author: "John Doe", likes: 45 },
    { id: 2, title: "UI/UX Best Practices 2024", author: "Jane Smith", likes: 38 },
    { id: 3, title: "Web Development Trends", author: "Mike Johnson", likes: 32 },
    { id: 4, title: "CSS Animation Magic", author: "Sarah Wilson", likes: 28 },
    { id: 5, title: "JavaScript ES2024 Features", author: "Alex Brown", likes: 25 },
  ];

  // Dummy trending communities
  const trendingCommunities = [
    { id: 1, name: "React Devs", members: 120 },
    { id: 2, name: "UI/UX Club", members: 85 },
    { id: 3, name: "Node.js Enthusiasts", members: 75 },
    { id: 4, name: "FullStack Learners", members: 60 },
    { id: 5, name: "Design Masters", members: 50 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-6">
      <div className="flex max-w-7xl mx-auto gap-6">
        {/* Feed Section */}
        <div className="flex-1 max-w-3xl space-y-6">
          {/* Create Post */}
          <motion.div
            className="bg-gradient-to-r from-red-400 to-red-600 p-6 rounded-3xl shadow-2xl text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.005 }}
          >
            <textarea
              rows={3}
              placeholder="Share your thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full bg-white bg-opacity-20 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none border border-white/20"
            />
            <div className="flex items-center mt-4 gap-3">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-lg p-2">
                <Paperclip size={18} /> Attach Media
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setNewFile(e.target.files[0])}
                  accept="image/*,video/*"
                />
              </label>
              <button
                onClick={handleAddPost}
                disabled={!newPost.trim() && !newFile}
                className="ml-auto px-6 py-2 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 disabled:opacity-50"
              >
                Post
              </button>
            </div>

            {/* Media Preview */}
            {newFile && (
              <div className="mt-4 rounded-2xl overflow-hidden shadow-lg">
                {newFile.type.startsWith("video") ? (
                  <video src={URL.createObjectURL(newFile)} controls className="w-full rounded-2xl" />
                ) : (
                  <img src={URL.createObjectURL(newFile)} alt="Preview" className="w-full rounded-2xl" />
                )}
              </div>
            )}
          </motion.div>

          {/* Feed */}
          {loading ? (
            <p className="text-center text-red-500">Loading posts...</p>
          ) : feed.length === 0 ? (
            <p className="text-center text-red-600">No posts yet.</p>
          ) : (
            <div className="space-y-6">
              {feed.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={() => likePost(post._id)}
                  onComment={(text) => commentPost(post._id, text)}
                  onReply={(commentId, text) => replyToComment(post._id, commentId, text)}
                  onLikeComment={(commentId, replyId) => likeComment(post._id, commentId, replyId)}
                  onShare={(text) => sharePost(post._id, text)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6 sticky top-6">
          {/* Trending Posts */}
          <TrendingBox title="🔥 Trending Posts" items={trendingPosts} redish={true} />

          {/* Trending Communities */}
          <TrendingBox title="🔥 Trending Communities" items={trendingCommunities} redish={true} community />
        </div>
      </div>
    </div>
  );
}

// PostCard Component
function PostCard({ post, onLike, onComment, onReply, onLikeComment, onShare }) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [shareText, setShareText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const isHotPost = post.likesCount > 10;

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText("");
  };

  const handleReply = (commentId) => {
    if (!replyText[commentId]?.trim()) return;
    onReply(commentId, replyText[commentId]);
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleShare = () => {
    if (!shareText.trim()) return;
    onShare(shareText);
    setShareText("");
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-red-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {isHotPost && (
        <motion.div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          <Flame size={16} /> Hot
        </motion.div>
      )}

      {/* Post Content */}
      <p className="text-gray-800 font-medium mb-4">{post.content}</p>

      {/* Media */}
      {post.media && (
        <motion.div className="mt-4 rounded-2xl overflow-hidden shadow-lg" whileHover={{ scale: 1.02 }}>
          {post.media.endsWith(".mp4") ? (
            <video src={post.media} controls className="w-full rounded-2xl" />
          ) : (
            <img src={post.media} alt="Post media" className="w-full rounded-2xl" />
          )}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-600 mt-4">
        <button className="flex items-center gap-1 hover:text-red-500 transition-colors" onClick={onLike}>
          <Heart size={20} />
          {post.likesCount || 0}
        </button>

        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors" onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={20} />
          {post.commentsCount || 0}
        </button>

        <button className="flex items-center gap-1 hover:text-green-500 transition-colors" onClick={handleShare}>
          <Share2 size={20} />
          Share
        </button>

        {/* Extra reactions */}
        <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
          <ThumbsUp size={20} />
          Clap
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleComment()}
            placeholder="Add a comment..."
            className="w-full px-4 py-2 rounded-full border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      )}
    </motion.div>
  );
}

// TrendingBox Component
function TrendingBox({ title, items, redish = false, community = false }) {
  return (
    <motion.div
      className={`${redish ? "bg-red-50 border-red-200" : "bg-white/70 border-blue-200"} backdrop-blur-sm rounded-3xl shadow-xl p-6`}
    >
      <h2 className={`font-bold mb-4 flex items-center gap-2 ${redish ? "text-red-600" : "text-blue-600"}`}>
        <TrendingUp className={redish ? "text-red-500" : "text-blue-500"} /> {title}
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${redish ? "border-red-100 bg-red-50" : "border-blue-100 bg-blue-50"} p-3 rounded-xl hover:shadow-lg cursor-pointer flex items-center justify-between`}
          >
            <p className="font-semibold">{community ? item.name : item.title}</p>
            <div className="flex items-center gap-1 text-red-500">
              <Flame size={16} />
              <span className="text-xs font-medium">{community ? `${item.members} members` : `${item.likes} likes`}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
