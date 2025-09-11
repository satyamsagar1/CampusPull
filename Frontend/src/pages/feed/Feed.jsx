import React, { useState } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";

export default function Feed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Sanskriti Singh",
      avatar: "https://i.pravatar.cc/40?img=1",
      content: "Excited to launch my final year project LinkMate 🚀",
      likes: 10,
      comments: ["Looks great!", "All the best 🙌"],
    },
    {
      id: 2,
      user: "Rahul Sharma",
      avatar: "https://i.pravatar.cc/40?img=2",
      content: "Anyone has DBMS notes? Please share 📚",
      likes: 5,
      comments: ["I’ll upload soon!", "Check the Resources Hub!"],
    },
  ]);

  const [newPost, setNewPost] = useState("");

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: posts.length + 1,
      user: "You",
      avatar: "https://i.pravatar.cc/40?img=3",
      content: newPost,
      likes: 0,
      comments: [],
    };
    setPosts([post, ...posts]);
    setNewPost("");
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
            <h3 className="font-semibold">{post.user}</h3>
          </div>
          <p className="text-gray-800 mb-3">{post.content}</p>

          {/* Actions */}
          <div className="flex space-x-6 text-gray-500">
            <button className="flex items-center space-x-1 hover:text-indigo-600">
              <FaThumbsUp /> <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-indigo-600">
              <FaComment /> <span>{post.comments.length}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-indigo-600">
              <FaShare /> <span>Share</span>
            </button>
          </div>

          {/* Comments */}
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            {post.comments.map((c, i) => (
              <p key={i}>💬 {c}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
