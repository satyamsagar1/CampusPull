import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageSquare,
  Megaphone,
  Eye,
  PlusCircle,
  X,
  Send,
  Bookmark,
} from "lucide-react";

// LocalStorage Keys
const LS_COMMUNITIES = "cp_communities_v1";
const LS_JOINED = "cp_joined_v1";
const LS_ANNOUNCEMENTS = "cp_announcements_v1";

// Default Communities
const defaultCommunities = [
  {
    name: "Coding Ninjas ABESIT",
    desc: "A community for coding enthusiasts to solve problems, share knowledge, and grow together.",
    members: 1200,
    category: "Tech & Development",
    posts: [
      { user: "Aarav Singh", text: "Anyone up for a LeetCode challenge today?", date: "2025-10-01" },
      { user: "Shristi Dabas", text: "Hackathon next week — register now!", date: "2025-09-28" },
    ],
  },
  {
    name: "Design Hive",
    desc: "A creative space for UI/UX designers to collaborate, showcase designs, and learn design thinking.",
    members: 780,
    category: "Design & Creativity",
    posts: [{ user: "Ananya Verma", text: "Figma workshop this Friday!", date: "2025-09-30" }],
  },
];

// Default Official Announcements
const defaultAnnouncements = [
  {
    title: "Mid-Semester CT Schedule",
    content:
      "Mid-semester class tests (CT) will be conducted between 14th Oct - 18th Oct. Check Moodle for subject-wise timings.",
    postedBy: "Dr. Meena Sharma (HOD - CSE)",
    date: "2025-10-07",
  },
  {
    title: "Holiday Notice",
    content: "Campus will remain closed on 10th Oct due to festival celebrations.",
    postedBy: "College Administration",
    date: "2025-10-01",
  },
];

const CommunityPage = () => {
  // 🌸 You can change this to 'student' or 'teacher' to test visibility
  const [role] = useState("teacher");

  const [communities, setCommunities] = useState([]);
  const [joined, setJoined] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", desc: "", category: "" });
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_COMMUNITIES);
      const rawJoined = localStorage.getItem(LS_JOINED);
      const rawAnn = localStorage.getItem(LS_ANNOUNCEMENTS);
      setCommunities(raw ? JSON.parse(raw) : defaultCommunities);
      setJoined(rawJoined ? JSON.parse(rawJoined) : []);
      setAnnouncements(rawAnn ? JSON.parse(rawAnn) : defaultAnnouncements);
    } catch {
      setCommunities(defaultCommunities);
      setJoined([]);
      setAnnouncements(defaultAnnouncements);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LS_COMMUNITIES, JSON.stringify(communities));
  }, [communities]);
  useEffect(() => {
    localStorage.setItem(LS_JOINED, JSON.stringify(joined));
  }, [joined]);
  useEffect(() => {
    localStorage.setItem(LS_ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  const isJoined = (name) => joined.includes(name);

  // Create new community
  const handleCreateCommunity = (e) => {
    e.preventDefault();
    if (!newCommunity.name.trim() || !newCommunity.desc.trim()) return alert("Enter all details!");
    const newCom = {
      ...newCommunity,
      members: 1,
      posts: [],
    };
    setCommunities([newCom, ...communities]);
    setJoined([newCom.name, ...joined]);
    setNewCommunity({ name: "", desc: "", category: "" });
    setShowCreateModal(false);
  };

  // Join community
  const handleJoin = (community) => {
    if (!isJoined(community.name)) {
      setJoined([community.name, ...joined]);
      setCommunities((prev) =>
        prev.map((c) => (c.name === community.name ? { ...c, members: c.members + 1 } : c))
      );
    }
  };

  // Add announcement (teacher only)
  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;
    const newAnn = {
      title: newAnnouncement.title.trim(),
      content: newAnnouncement.content.trim(),
      postedBy: "You (Teacher)",
      date: new Date().toLocaleDateString(),
    };
    setAnnouncements([newAnn, ...announcements]);
    setNewAnnouncement({ title: "", content: "" });
    setShowAnnouncementModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F4FD] text-[#1E293B] py-10 px-6">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#3B82F6]">🎓 CampusPull Community</h1>
        <p className="text-[#475569] mt-2 text-lg">
          Connect, collaborate, and stay informed with your campus network.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE: Communities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#3B82F6]">Communities</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md"
            >
              <PlusCircle size={18} /> Create
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {communities.map((c, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-5 shadow-md border border-slate-100"
              >
                <h3 className="text-lg font-semibold text-[#1E40AF] flex items-center gap-2">
                  <Users size={18} /> {c.name}
                </h3>
                <p className="text-sm text-slate-600 mt-2">{c.desc}</p>
                <div className="text-xs text-slate-500 mt-1">{c.category}</div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setSelectedCommunity(c)}
                    className={`flex-1 py-2 rounded-full font-semibold ${
                      isJoined(c.name)
                        ? "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white"
                        : "bg-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                    disabled={!isJoined(c.name)}
                  >
                    <Eye size={14} className="inline mr-1" /> View
                  </button>
                  {!isJoined(c.name) ? (
                    <button
                      onClick={() => handleJoin(c)}
                      className="flex-1 rounded-full py-2 border border-[#3B82F6] text-[#1E40AF] font-medium hover:bg-[#EFF6FF]"
                    >
                      Join
                    </button>
                  ) : (
                    <div className="flex-1 text-center text-sm text-[#2563EB] font-medium">
                      Joined
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* My Joined Communities Section */}
          {joined.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 mt-10">
              <h2 className="text-xl font-semibold text-[#3B82F6] flex items-center gap-2 mb-4">
                <Bookmark /> My Joined Communities
              </h2>
              <ul className="space-y-2 text-sm text-slate-700">
                {joined.map((name, idx) => (
                  <li key={idx} className="border-b pb-1">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Announcements */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="text-[#3B82F6]" size={18} />
                <h3 className="font-semibold text-[#1E293B]">Official Announcements</h3>
              </div>
              {role === "teacher" && (
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="text-sm text-[#3B82F6] hover:underline"
                >
                  + Add
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {announcements.map((a, i) => (
                <div key={i} className="border-b pb-3">
                  <h4 className="font-semibold text-[#1E3A8A]">{a.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{a.content}</p>
                  <div className="text-xs text-slate-500 mt-2">
                    Posted by <strong>{a.postedBy}</strong> • {a.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md border-t-4 border-[#3B82F6]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#3B82F6]">Create Community</h3>
                <button onClick={() => setShowCreateModal(false)}>
                  <X />
                </button>
              </div>
              <form onSubmit={handleCreateCommunity} className="space-y-3">
                <input
                  value={newCommunity.name}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, name: e.target.value })
                  }
                  placeholder="Community Name"
                  className="w-full px-3 py-2 border rounded-lg outline-none"
                />
                <input
                  value={newCommunity.category}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, category: e.target.value })
                  }
                  placeholder="Category (e.g., Tech, Design)"
                  className="w-full px-3 py-2 border rounded-lg outline-none"
                />
                <textarea
                  value={newCommunity.desc}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, desc: e.target.value })
                  }
                  placeholder="Short description"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white rounded-full"
                >
                  Create & Join
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Announcement Modal (Teacher Only) */}
      <AnimatePresence>
        {showAnnouncementModal && role === "teacher" && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md border-t-4 border-[#6366F1]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#6366F1]">Add Announcement</h3>
                <button onClick={() => setShowAnnouncementModal(false)}>
                  <X />
                </button>
              </div>
              <form onSubmit={handleAddAnnouncement} className="space-y-3">
                <input
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                  placeholder="Title"
                  className="w-full px-3 py-2 border rounded-lg outline-none"
                />
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                  placeholder="Announcement details"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white rounded-full"
                >
                  Post Announcement
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;
