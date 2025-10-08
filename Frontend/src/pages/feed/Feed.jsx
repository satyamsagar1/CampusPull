import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Video,
  ThumbsUp,
  MessageCircle,
  Share2,
  BarChart2,
  Flame,
  Hash,
} from "lucide-react";

const FeedPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Ananya Sharma",
      content: "Excited for the Tech Fest 2025! 🚀 #Innovation #CampusVibes",
      media: "/images/techfest.jpg",
      mediaType: "image",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      user: "Rohan Verma",
      content: "Should we have a coding marathon this weekend? 💻🔥 #Hackathon",
      likes: 8,
      comments: 5,
      isPoll: true,
      pollOptions: ["Yes, let's do it!", "Maybe next week", "Not interested"],
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [newMedia, setNewMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const type = file.type.startsWith("video") ? "video" : "image";
    if (type === "video" && file.size > 120 * 1024 * 1024) {
      alert("Please upload a video under 2 minutes (max ~120MB).");
      return;
    }

    setMediaType(type);
    setNewMedia(URL.createObjectURL(file));
  };

  const handlePost = () => {
    if (newPost.trim() === "" && !newMedia) return;
    const newEntry = {
      id: Date.now(),
      user: "You",
      content: newPost,
      media: newMedia,
      mediaType,
      likes: 0,
      comments: 0,
    };
    setPosts([newEntry, ...posts]);
    setNewPost("");
    setNewMedia(null);
    setMediaType(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row px-4 md:px-12 py-8 gap-8">
      {/* Feed Section */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Campus Feed
        </h1>

        {/* Create Post */}
        <motion.div
          className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 mb-6"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
              Y
            </div>
            <textarea
              placeholder="Start a post..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 resize-none border-b border-gray-200 focus:border-blue-400 pb-2"
              rows="2"
            />
          </div>

          {/* Media Preview */}
          {newMedia && (
            <div className="mb-3 rounded-xl overflow-hidden">
              {mediaType === "video" ? (
                <video
                  src={newMedia}
                  controls
                  className="w-full rounded-xl max-h-80"
                />
              ) : (
                <img
                  src={newMedia}
                  alt="Preview"
                  className="rounded-xl max-h-80 object-cover"
                />
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-4 text-gray-500 text-sm">
              {/* Photo Upload */}
              <label className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                <ImageIcon size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
                Photo
              </label>

              {/* Video Upload */}
              <label className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                <Video size={18} />
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
                Video
              </label>

              <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                <Hash size={18} /> Hashtag
              </span>
            </div>

            <button
              onClick={handlePost}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-medium transition"
            >
              Post
            </button>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-5">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {post.user.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{post.user}</p>
                  <p className="text-xs text-gray-400">2h ago</p>
                </div>
              </div>

              <p className="text-gray-800 mb-3 leading-relaxed">
                {post.content}
              </p>

              {/* Media */}
              {post.media && (
                <div className="mb-3 rounded-xl overflow-hidden">
                  {post.mediaType === "video" ? (
                    <video
                      src={post.media}
                      controls
                      className="w-full rounded-xl max-h-96"
                    />
                  ) : (
                    <img
                      src={post.media}
                      alt="Post media"
                      className="w-full rounded-xl"
                    />
                  )}
                </div>
              )}

              {/* Poll */}
              {post.isPoll && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3">
                  {post.pollOptions.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-700"
                    >
                      <BarChart2 size={16} /> {opt}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between text-gray-500 mt-2 text-sm">
                <span className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                  <ThumbsUp size={18} /> {post.likes}
                </span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                  <MessageCircle size={18} /> {post.comments}
                </span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                  <Share2 size={18} /> Share
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trending Sidebar */}
      <motion.div
        className="w-full md:w-1/3 bg-white rounded-2xl p-5 shadow-md border border-gray-200 h-fit"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <Flame className="text-orange-500" size={18} /> Trending Topics
        </h2>

        <ul className="space-y-2">
          {[
            "#ReactJS",
            "#TechFest2025",
            "#Hackathon",
            "#CampusVibes",
            "#AIInnovation",
          ].map((topic, i) => (
            <li
              key={i}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              {topic}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            🚀 Trending Communities
          </h2>
          <div className="space-y-2 text-sm">
            {[
              { name: "React Devs", members: 120 },
              { name: "Design Squad", members: 95 },
              { name: "AI Enthusiasts", members: 80 },
            ].map((c, i) => (
              <div
                key={i}
                className="flex justify-between text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
              >
                <span>{c.name}</span>
                <span className="text-gray-400">{c.members} members</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedPage;
