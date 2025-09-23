// src/components/Feed/Feed.jsx
import React, { useState, useRef } from "react";
import { useFeed } from "../../context/FeedContext";

export default function Feed() {
  const { feed, createPost, likePost, commentPost, replyToComment, likeComment, sharePost, loading } = useFeed();
  const [newPost, setNewPost] = useState("");
  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddPost = () => {
    if (!newPost.trim() && !newFile) return;

    createPost(newPost, newFile);
    setNewPost("");
    setNewFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            onReply={(commentId, text) => replyToComment(post._id, commentId, text)}
            onLikeComment={(commentId, replyId) => likeComment(post._id, commentId, replyId)}
            onShare={(sharedContent) => sharePost(post._id, sharedContent)}
          />
        ))
      )}
    </div>
  );
}

function PostCard({ post, onLike, onComment, onReply, onLikeComment, onShare }) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [shareText, setShareText] = useState("");

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
    <div className="bg-white shadow-md p-4 rounded-2xl border">
      {/* Author */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center">
          {post.author?.name?.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold">{post.author?.name}</h3>
          <p className="text-xs text-gray-500">{post.author?.role}</p>
          <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Shared Post */}
      {post.originalPost && (
        <div className="border-l-4 border-gray-300 pl-2 mb-2">
          <p className="text-gray-600 italic">Shared Post:</p>
          <p className="text-gray-800">{post.originalPost.content}</p>
          {post.originalPost.media && (
            post.originalPost.media.endsWith(".mp4") ? (
              <video src={post.originalPost.media} controls className="rounded-lg w-full my-2" />
            ) : (
              <img src={post.originalPost.media} alt="original" className="rounded-lg w-full my-2" />
            )
          )}
        </div>
      )}

      {/* Post Content */}
      <p className="text-gray-800 mb-3">{post.content}</p>
      {post.media && (
        post.media.endsWith(".mp4") ? (
          <video src={post.media} controls className="rounded-lg w-full mb-3" />
        ) : (
          <img src={post.media} alt="uploaded" className="rounded-lg w-full mb-3" />
        )
      )}

      {/* Actions */}
      <div className="flex space-x-6 text-gray-500 mb-2">
        <button onClick={onLike}>👍 {post.likesCount || 0}</button>
        <button>💬 {post.commentsCount || 0}</button>
        <button onClick={handleShare}>🔗 Share</button>
      </div>

      {/* Add Comment */}
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border rounded-lg px-2 py-1 text-sm"
        />
        <button onClick={handleComment} className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm">
          Comment
        </button>
      </div>

      {/* Comments & Replies */}
      <div className="mt-2 space-y-2 text-sm text-gray-600">
        {post.comments?.map((c) => (
          <div key={c._id} className="border-t pt-2">
            <p>
              <strong>{c.user?.name}:</strong> {c.text}{" "}
              <button className="ml-2 text-xs text-blue-500" onClick={() => onLikeComment(c._id)}>
                👍 {c.likes?.length || 0}
              </button>
            </p>

            {/* Replies */}
            {c.replies?.map((r) => (
              <div key={r._id} className="ml-4 mt-1">
                <p>
                  <strong>{r.user?.name}:</strong> {r.text}{" "}
                  <button className="ml-1 text-xs text-blue-500" onClick={() => onLikeComment(c._id, r._id)}>
                    👍 {r.likes?.length || 0}
                  </button>
                </p>
              </div>
            ))}

            {/* Add Reply */}
            <div className="flex items-center ml-4 mt-1 space-x-2">
              <input
                type="text"
                placeholder="Reply..."
                value={replyText[c._id] || ""}
                onChange={(e) => setReplyText((prev) => ({ ...prev, [c._id]: e.target.value }))}
                className="flex-1 border rounded-lg px-2 py-1 text-sm"
              />
              <button
                onClick={() => handleReply(c._id)}
                className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Input */}
      <div className="flex items-center mt-2 space-x-2">
        <input
          type="text"
          placeholder="Add something before sharing..."
          value={shareText}
          onChange={(e) => setShareText(e.target.value)}
          className="flex-1 border rounded-lg px-2 py-1 text-sm"
        />
        <button
          onClick={handleShare}
          className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
        >
          Share
        </button>
      </div>
    </div>
  );
}
