import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, PlusCircle, X, Send } from "lucide-react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    desc: "",
    category: "",
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.desc) return;
    setEvents([...events, { ...newEvent, attendees: 0 }]);
    setNewEvent({ title: "", date: "", desc: "", category: "" });
    setShowCreateModal(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setChatMessages([...chatMessages, { user: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 text-white py-16 px-6 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold mb-3">🎉 CampusPull Events</h1>
        <p className="text-sky-100 text-lg">
          Discover, Join & Create amazing events with Alumni & Students.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full max-w-lg px-5 py-3 rounded-full text-slate-800 focus:outline-none shadow-md"
        />
      </div>

      {/* Event Cards */}
      {events.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xl text-sky-100"
        >
          🚀 No events yet. Be the first to create one!
        </motion.p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {events.map((event, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-pink-300" size={26} />
                <h2 className="text-2xl font-semibold text-purple-300">
                  {event.title}
                </h2>
              </div>
              <p className="text-sky-50 mb-3 text-sm">{event.desc}</p>
              <div className="text-sm text-sky-100 space-y-1 mb-4">
                <p className="flex items-center gap-2">
                  <Clock size={16} /> {event.date}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={16} /> {event.attendees} Attendees
                </p>
                {event.category && <p>📁 {event.category}</p>}
              </div>
              <button className="w-full py-2 bg-gradient-to-r from-sky-400 to-purple-400 text-slate-900 font-semibold rounded-full hover:from-sky-300 hover:to-purple-300 transition-all">
                Join Event
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Event Chat Box */}
      <div className="max-w-4xl mx-auto mt-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
          💬 Event Discussion Lounge
        </h2>
        <div className="h-60 overflow-y-auto bg-white/10 rounded-xl p-4 mb-4 space-y-2">
          {chatMessages.length === 0 ? (
            <p className="text-sky-200 text-sm text-center">
              No messages yet. Start a conversation about upcoming events!
            </p>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} className="bg-white/10 rounded-lg p-2 text-sm text-sky-50">
                <strong className="text-purple-200">{msg.user}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Share your event ideas..."
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
      

      {/* Floating Create Event Button */}
      <motion.button
        onClick={() => setShowCreateModal(true)}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-400 to-sky-400 text-slate-900 font-semibold rounded-full shadow-xl px-6 py-3 flex items-center gap-2 hover:from-purple-300 hover:to-sky-300"
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
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full text-white shadow-2xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-sky-200 hover:text-sky-100"
              >
                <X size={22} />
              </button>

              <h2 className="text-3xl font-bold mb-6 text-purple-300 text-center">
                Create New Event
              </h2>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg text-slate-900 focus:outline-none"
                />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg text-slate-900 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Hackathon, Seminar)"
                  value={newEvent.category}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg text-slate-900 focus:outline-none"
                />
                <textarea
                  placeholder="Event Description"
                  value={newEvent.desc}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, desc: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg text-slate-900 focus:outline-none"
                  rows="3"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-sky-400 to-purple-400 text-slate-900 font-semibold rounded-full hover:from-sky-300 hover:to-purple-300 transition-all"
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
