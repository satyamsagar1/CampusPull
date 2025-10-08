import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageSquare,
  X,
  Eye,
  PlusCircle,
  Send,
  Megaphone,
  LogOut,
} from "lucide-react";

const CommunityPage = () => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const [generalMessages, setGeneralMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    desc: "",
    category: "",
  });

  const [joinedCommunities, setJoinedCommunities] = useState([]);

  const [announcements, setAnnouncements] = useState([
    {
      title: "Internal CT Notice",
      content:
        "Mid-semester Class Test (CT) will be held from 14th Oct. Prepare accordingly.",
      postedBy: "Dr. Meena Sharma (HOD-CSE)",
      date: "2025-10-07",
    },
    {
      title: "Holiday Notice",
      content:
        "Campus will remain closed on 10th Oct due to festival celebration.",
      postedBy: "College Administration",
      date: "2025-10-06",
    },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    postedBy: "",
  });

  const [communities, setCommunities] = useState([
    {
      name: "Coding Ninjas ABESIT",
      desc: "A community for coding enthusiasts to solve problems, share knowledge, and grow together.",
      members: 1200,
      category: "Tech & Development",
      posts: [
        { user: "Aarav Singh", text: "Anyone up for a LeetCode challenge today?" },
        { user: "Shristi Dabas", text: "We’re organizing a hackathon next week!" },
      ],
    },
    {
      name: "Design Hive",
      desc: "A creative space for UI/UX designers to collaborate, showcase designs, and learn design thinking.",
      members: 780,
      category: "Design & Creativity",
      posts: [
        { user: "Ananya Verma", text: "New Figma tricks workshop coming soon!" },
        { user: "Karan Mehta", text: "Let’s share feedback on our latest mockups." },
      ],
    },
    {
      name: "Entrepreneurship Cell",
      desc: "Connecting innovative students, mentors, and investors to promote startup culture in campus.",
      members: 540,
      category: "Innovation & Startups",
      posts: [
        { user: "Priya Sharma", text: "Pitch deck review session at 6 PM today!" },
        { user: "Rohit Gupta", text: "Looking for a co-founder for my idea — DM me!" },
      ],
    },
  ]);

  // --- Functions ---
  const handleCreateCommunity = (e) => {
    e.preventDefault();
    if (!newCommunity.name || !newCommunity.desc) return;
    setCommunities([...communities, { ...newCommunity, members: 1, posts: [] }]);
    setNewCommunity({ name: "", desc: "", category: "" });
    setShowCreateModal(false);
    alert("🎉 New community created successfully!");
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setGeneralMessages([...generalMessages, { user: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.postedBy)
      return;
    const today = new Date().toISOString().split("T")[0];
    setAnnouncements([{ ...newAnnouncement, date: today }, ...announcements]);
    setNewAnnouncement({ title: "", content: "", postedBy: "" });
    setShowAnnouncementModal(false);
    alert("📢 Announcement posted successfully!");
  };

  const handleJoin = (community) => {
    if (!joinedCommunities.some((c) => c.name === community.name)) {
      setJoinedCommunities([...joinedCommunities, community]);
      alert(`✅ Joined ${community.name}!`);
    }
  };

  const handleLeave = (communityName) => {
    setJoinedCommunities(
      joinedCommunities.filter((c) => c.name !== communityName)
    );
    if (selectedCommunity?.name === communityName) setSelectedCommunity(null);
    alert(`🚪 Left ${communityName}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16 px-6 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold mb-3">💬 CampusPull Community</h1>
        <p className="text-sky-100 text-lg">
          Connect, Collaborate, and Stay Updated with your campus peers and faculty.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-center mb-12">
        <input
          type="text"
          placeholder="🔍 Search communities..."
          className="w-full max-w-lg px-5 py-3 rounded-full text-slate-800 focus:outline-none shadow-md"
        />
      </div>

      {/* Community Grid */}
      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {communities.map((community, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:bg-white/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-pink-300" size={28} />
              <h2 className="text-2xl font-semibold text-purple-300">{community.name}</h2>
            </div>
            <p className="text-sky-50 mb-4 text-sm">{community.desc}</p>
            <div className="flex justify-between items-center text-sky-100 text-sm mb-4">
              <span className="inline-block bg-purple-300/30 text-purple-100 text-xs px-3 py-1 rounded-full">
                {community.category}
              </span>
              <span>{community.members} Members</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedCommunity(community)}
                className="flex-1 py-2 bg-gradient-to-r from-sky-400 to-purple-400 text-slate-900 font-semibold rounded-full hover:from-sky-300 hover:to-purple-300 transition-all flex items-center justify-center gap-1"
              >
                <Eye size={18} /> View
              </button>
              <button
                onClick={() => handleJoin(community)}
                className="flex-1 py-2 border border-purple-300 text-purple-100 rounded-full hover:bg-white/10 transition-all"
              >
                Join
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My Joined Communities */}
      {joinedCommunities.length > 0 && (
        <div className="max-w-6xl mx-auto mt-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-purple-300">
            🌟 My Joined Communities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {joinedCommunities.map((community, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 rounded-xl p-5 border border-white/10 hover:bg-white/20 transition-all"
              >
                <h3 className="text-xl font-bold text-pink-200 mb-2">
                  {community.name}
                </h3>
                <p className="text-sky-100 text-sm mb-3">{community.desc}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCommunity(community)}
                    className="flex-1 py-2 bg-gradient-to-r from-sky-400 to-purple-400 text-slate-900 font-semibold rounded-full hover:from-sky-300 hover:to-purple-300 transition-all flex items-center justify-center gap-1"
                  >
                    <Eye size={18} /> Open
                  </button>
                  <button
                    onClick={() => handleLeave(community.name)}
                    className="flex-1 py-2 border border-red-400 text-red-200 rounded-full hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
                  >
                    <LogOut size={18} /> Leave
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements */}
      <div className="max-w-5xl mx-auto mt-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold text-purple-300 flex items-center gap-2">
            <Megaphone size={24} /> Official Announcements
          </h2>
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-sky-400 to-purple-400 text-slate-900 font-semibold rounded-full hover:from-sky-300 hover:to-purple-300 transition-all flex items-center gap-1"
          >
            <PlusCircle size={18} /> Post
          </button>
        </div>
        {announcements.length === 0 ? (
          <p className="text-sky-200 text-sm text-center">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all"
              >
                <h3 className="text-lg font-bold text-pink-200">{a.title}</h3>
                <p className="text-sky-100 text-sm mt-1">{a.content}</p>
                <div className="text-xs text-sky-200 mt-2">
                  Posted by <strong>{a.postedBy}</strong> • {a.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* General Chat */}
      <div className="max-w-4xl mx-auto mt-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
          <MessageSquare size={22} /> General Campus Chat
        </h2>
        <div className="h-60 overflow-y-auto bg-white/10 rounded-xl p-4 mb-4 space-y-2">
          {generalMessages.length === 0 ? (
            <p className="text-sky-200 text-sm text-center">
              No messages yet. Be the first to share your thoughts!
            </p>
          ) : (
            generalMessages.map((msg, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-lg p-2 text-sm text-sky-50"
              >
                <strong className="text-purple-200">{msg.user}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Share your thoughts..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2 rounded-full text-slate-900 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-2 bg-gradient-to-r from-sky-400 to-purple-400 text-slate-900 font-semibold rounded-full hover:from-sky-300 hover:to-purple-300 transition-all flex items-center gap-1"
          >
            <Send size={18} /> Send
          </button>
        </div>
      </div>

      {/* Floating Create Button */}
      <motion.button
        onClick={() => setShowCreateModal(true)}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-400 to-sky-400 text-slate-900 font-semibold rounded-full shadow-xl px-6 py-3 flex items-center gap-2 hover:from-purple-300 hover:to-sky-300"
      >
        <PlusCircle size={22} /> Create Community
      </motion.button>

      {/* Announcement Modal */}
      <AnimatePresence>
        {showAnnouncementModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full text-white shadow-2xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="absolute top-4 right-4 text-sky-200 hover:text-sky-100"
              >
                <X size={22} />
              </button>

              <h2 className="text-3xl font-bold mb-6 text-purple-300 text-center">
                📢 Post New Announcement
              </h2>

              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg text-slate-900 focus:outline-none"
                />
                <textarea
                  placeholder="Announcement Details"
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg text-slate-900 focus:outline-none"
                  rows="3"
                />
                <input
                  type="text"
                  placeholder="Posted By (e.g. Dr. Meena Sharma - HOD CSE)"
                  value={newAnnouncement.postedBy}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, postedBy: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg text-slate-900 focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-sky-400 to-purple-400 text-slate-900 font-semibold rounded-full hover:from-sky-300 hover:to-purple-300 transition-all"
                >
                  Post
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community View Modal */}
      <AnimatePresence>
        {selectedCommunity && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-lg w-full text-white relative shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setSelectedCommunity(null)}
                className="absolute top-4 right-4 text-sky-200 hover:text-sky-100"
              >
                <X size={22} />
              </button>

              <h2 className="text-3xl font-bold mb-3 text-purple-300">
                {selectedCommunity.name}
              </h2>
              <p className="text-sky-100 text-sm mb-4">{selectedCommunity.desc}</p>

              <div className="space-y-2 max-h-60 overflow-y-auto bg-white/10 rounded-xl p-4 mb-4">
                {selectedCommunity.posts.map((post, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 rounded-lg p-2 text-sm text-sky-50"
                  >
                    <strong className="text-purple-200">{post.user}:</strong>{" "}
                    {post.text}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleLeave(selectedCommunity.name)}
                className="w-full py-2 border border-red-400 text-red-200 rounded-full hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
              >
                <LogOut size={18} /> Leave Community
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;
