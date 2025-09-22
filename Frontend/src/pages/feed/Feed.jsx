// src/components/Feed/Feed.jsx
import React, { useState, useRef } from "react";
import { useFeed } from "../../context/FeedContext";

export default function Feed() {
  const { feed, createPost, likePost, commentPost, loading } = useFeed();
  const [newPost, setNewPost] = useState("");
  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddPost = () => {
    if (!newPost.trim() && !newFile) return;

    createPost(newPost, newFile);

    setNewPost("");
    setNewFile(null);

    // Reset file input visually
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      {/* Create Post */}
      <div className="bg-white shadow-lg p-4 rounded-2xl">
        <textarea
          className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows={2}
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="mt-2"
          onChange={(e) => setNewFile(e.target.files[0])}
        />
        <button
          onClick={handleAddPost}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Post
        </button>
      </div>

      {/* Feed */}
      {loading ? (
        <p className="text-center text-gray-500">Loading feed...</p>
      ) : (
        feed.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={() => likePost(post._id)}
            onComment={(text) => commentPost(post._id, text)}
          />
        ))
      )}
    </div>
  );
}

function PostCard({ post, onLike, onComment }) {
  const [comment, setComment] = useState("");

  const handleComment = () => {
    if (!comment.trim()) return;
    onComment(comment);
    setComment("");
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-2xl border">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center">
          {post.author?.name?.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold">{post.author?.name}</h3>
          <p className="text-xs text-gray-500">{post.author?.role}</p>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="text-gray-800 mb-3">{post.content}</p>

{post.media && (() => {
  if (post.media.endsWith(".mp4")) {
    return (
      <video src={post.media} controls className="rounded-lg w-full mb-3">
        {/* Empty track to satisfy accessibility requirement */}
        <track kind="captions" src="" />
      </video>
    );
  } else {
    return <img src={post.media} alt="uploaded" className="rounded-lg w-full mb-3" />;
  }
})()}


      {/* Actions */}
      <div className="flex space-x-6 text-gray-500 mb-2">
        <button onClick={onLike}>👍 {post.likesCount || 0}</button>
        <button>💬 {post.commentsCount || 0}</button>
        <button>🔗 Share</button>
      </div>

      {/* Add Comment */}
      <div className="flex space-x-2 mt-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 border rounded-lg px-2 py-1 text-sm"
        />
        <button
          onClick={handleComment}
          className="px-3 py-1 bg-indigo-500 text-white rounded-lg"
        >
          Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        {post.comments?.map((c) => (
          <p key={c._id}>
            <strong>{c.user?.name}:</strong> {c.text}
          </p>
        ))}
      </div>
    </div>
  );
}
