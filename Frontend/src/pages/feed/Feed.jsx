import React, { useState } from "react";
import { FaThumbsUp, FaComment, FaHandsHelping, FaHeart } from "react-icons/fa";

export default function Feed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Sanskriti Singh",
      avatar: "https://i.pravatar.cc/40?img=1",
      content: "Excited to launch my final year project LinkMate 🚀",
      likes: 10,
      reactions: { clap: 2, heart: 3 },
      comments: ["Looks great!", "All the best 🙌"],
      createdAt: new Date(),
      file: null,
    },
    {
      id: 2,
      user: "Rahul Sharma",
      avatar: "https://i.pravatar.cc/40?img=2",
      content: "Anyone has DBMS notes? Please share 📚",
      likes: 5,
      reactions: { clap: 1, heart: 0 },
      comments: ["I’ll upload soon!", "Check the Resources Hub!"],
      createdAt: new Date(),
      file: null,
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [newFile, setNewFile] = useState(null);

  const handleAddPost = () => {
    if (!newPost.trim() && !newFile) return;

    const post = {
      id: posts.length + 1,
      user: "You",
      avatar: "https://i.pravatar.cc/40?img=3",
      content: newPost,
      likes: 0,
      reactions: { clap: 0, heart: 0 },
      comments: [],
      createdAt: new Date(),
      file: newFile ? URL.createObjectURL(newFile) : null,
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setNewFile(null);
  };

  const handleReaction = (id, type) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: type === "like" ? post.likes + 1 : post.likes,
              reactions: {
                ...post.reactions,
                [type]: (post.reactions[type] || 0) + 1,
              },
            }
          : post
      )
    );
  };

  const handleAddComment = (id, comment) => {
    if (!comment.trim()) return;
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      {/* Create Post */}
      <div className="bg-white shadow-lg p-4 rounded-2xl">
        <textarea
          className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows="2"
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <input
          type="file"
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

      {/* Posts Feed */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow-md p-4 rounded-2xl border"
        >
          <div className="flex items-center space-x-3 mb-3">
            <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-semibold">{post.user}</h3>
              <p className="text-xs text-gray-500">
                {post.createdAt.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-gray-800 mb-3">{post.content}</p>
          {post.file && (
            <div className="mb-3">
              {post.file.endsWith(".mp4") ? (
                <video src={post.file} controls className="rounded-lg w-full" />
              ) : (
                <img src={post.file} alt="uploaded" className="rounded-lg w-full" />
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-6 text-gray-500 mb-2">
            <button
              onClick={() => handleReaction(post.id, "like")}
              className="flex items-center space-x-1 hover:text-indigo-600"
            >
              <FaThumbsUp /> <span>{post.likes}</span>
            </button>
            <button
              onClick={() => handleReaction(post.id, "clap")}
              className="flex items-center space-x-1 hover:text-yellow-600"
            >
              <FaHandsHelping /> <span>{post.reactions.clap}</span>
            </button>
            <button
              onClick={() => handleReaction(post.id, "heart")}
              className="flex items-center space-x-1 hover:text-red-500"
            >
              <FaHeart /> <span>{post.reactions.heart}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-indigo-600">
              <FaComment /> <span>{post.comments.length}</span>
            </button>
          </div>

          {/* Comments */}
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            {post.comments.map((c, i) => (
              <p key={i}>💬 {c}</p>
            ))}
            {/* Add Reply */}
            <AddReply postId={post.id} onAdd={handleAddComment} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AddReply({ postId, onAdd }) {
  const [reply, setReply] = useState("");

  const handleSubmit = () => {
    if (reply.trim()) {
      onAdd(postId, reply);
      setReply("");
    }
  };

  return (
    <div className="flex mt-2 space-x-2">
      <input
        type="text"
        placeholder="Write a reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
      >
        Reply
      </button>
    </div>
  );
}
