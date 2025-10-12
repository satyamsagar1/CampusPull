import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  PlusCircle,
  X,
  Send,
  Bookmark,
  Sparkles,
} from "lucide-react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    desc: "",
    category: "",
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const savedJoined = JSON.parse(localStorage.getItem("joinedEvents")) || [];
    setJoinedEvents(savedJoined);
  }, []);

  useEffect(() => {
    localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
  }, [joinedEvents]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.desc) return;
    setEvents([...events, { ...newEvent, attendees: 0, joined: false }]);
    setNewEvent({ title: "", date: "", desc: "", category: "" });
    setShowCreateModal(false);
  };

  const handleJoinEvent = (index) => {
    const updatedEvents = [...events];
    if (!updatedEvents[index].joined) {
      updatedEvents[index].attendees += 1;
      updatedEvents[index].joined = true;
      setJoinedEvents([...joinedEvents, updatedEvents[index]]);
    }
    setEvents(updatedEvents);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setChatMessages([...chatMessages, { user: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F4FD] via-white to-[#E0E7FF] py-16 px-6 text-[#1E293B]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl font-extrabold text-[#3B82F6] mb-3">
          🎓 CampusPull Events & Meetups
        </h1>
        <p className="text-[#475569] text-lg max-w-2xl mx-auto">
          Discover, join, and host academic or fun campus activities. Build
          connections beyond the classroom!
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-center mb-12">
        <input
          type="text"
          placeholder="🔍 Search campus events..."
          className="w-full max-w-lg px-6 py-3 rounded-full border border-[#CBD5E1] shadow-sm focus:ring-2 focus:ring-[#6366F1] focus:outline-none bg-white"
        />
      </div>

      {/* Event Cards */}
      {events.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[#64748B] text-lg"
        >
          🚀 No events yet. Be the first to create one!
        </motion.p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-[#E0E7FF] hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-[#3B82F6]" size={26} />
                <h2 className="text-2xl font-semibold text-[#1E293B]">
                  {event.title}
                </h2>
              </div>
              <p className="text-[#475569] text-sm mb-3">{event.desc}</p>
              <div className="text-sm text-[#64748B] space-y-1 mb-4">
                <p className="flex items-center gap-2">
                  <Clock size={16} /> {event.date}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={16} /> {event.attendees} Attendees
                </p>
                {event.category && (
                  <span className="inline-block bg-[#E0E7FF] text-[#3B82F6] text-xs px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleJoinEvent(i)}
                disabled={event.joined}
                className={`w-full py-2 rounded-full font-semibold transition-all ${
                  event.joined
                    ? "bg-[#C7D2FE] text-[#3730A3] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:opacity-90"
                }`}
              >
                {event.joined ? "✅ Joined" : "Join Event"}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* My Joined Events */}
      {joinedEvents.length > 0 && (
        <div className="max-w-6xl mx-auto mt-20 bg-white rounded-2xl p-8 shadow-lg border border-[#E0E7FF]">
          <h2 className="text-3xl font-semibold mb-6 text-[#3B82F6] flex items-center gap-2">
            <Bookmark /> My Joined Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {joinedEvents.map((evt, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="bg-[#F3F4FD] p-4 rounded-xl border border-[#C7D2FE]"
              >
                <h3 className="text-xl font-semibold text-[#1E293B]">
                  {evt.title}
                </h3>
                <p className="text-[#475569] text-sm mt-1">{evt.date}</p>
                <p className="text-[#64748B] text-xs mt-2">{evt.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Discussion Lounge */}
      <div className="max-w-4xl mx-auto mt-20 bg-white rounded-2xl p-6 shadow-lg border border-[#E0E7FF]">
        <h2 className="text-2xl font-semibold mb-4 text-[#3B82F6] flex items-center gap-2">
          💬 Event Discussion Lounge
        </h2>
        <div className="h-60 overflow-y-auto bg-[#F3F4FD] rounded-xl p-4 mb-4 space-y-2 border border-[#C7D2FE]">
          {chatMessages.length === 0 ? (
            <p className="text-[#64748B] text-sm text-center">
              No messages yet. Start a conversation about upcoming events!
            </p>
          ) : (
            chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#C7D2FE] rounded-lg p-2 text-sm text-[#1E293B]"
              >
                <strong className="text-[#3B82F6]">{msg.user}:</strong>{" "}
                {msg.text}
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
            className="flex-1 px-4 py-2 rounded-full border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-semibold rounded-full hover:opacity-90 flex items-center gap-1"
          >
            <Send size={18} /> Send
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <motion.button
        onClick={() => setShowCreateModal(true)}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-semibold rounded-full shadow-lg px-6 py-3 flex items-center gap-2 hover:opacity-90"
      >
        <PlusCircle size={22} /> Create Event
      </motion.button>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[#E0E7FF] relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#1E293B]"
              >
                <X size={22} />
              </button>
              <h2 className="text-3xl font-bold mb-6 text-[#3B82F6] text-center">
                <Sparkles className="inline mr-2" /> Create New Event
              </h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-[#CBD5E1] focus:outline-none"
                />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-[#CBD5E1] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Seminar, Hackathon)"
                  value={newEvent.category}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-[#CBD5E1] focus:outline-none"
                />
                <textarea
                  placeholder="Event Description"
                  value={newEvent.desc}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, desc: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-[#CBD5E1] focus:outline-none"
                  rows="3"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-semibold rounded-full hover:opacity-90"
                >
                  Create
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;
