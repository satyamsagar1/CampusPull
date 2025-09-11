import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";

const EventPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "AI in Rural Development",
      speaker: "Dr. Meera Nair",
      banner: "https://source.unsplash.com/800x400/?technology,ai",
      uniqueness: "Exploring how AI can empower rural workers",
    },
    {
      id: 2,
      title: "Sustainable Energy Workshop",
      speaker: "Prof. Arjun Rao",
      banner: "https://source.unsplash.com/800x400/?energy,green",
      uniqueness: "Hands-on session on affordable renewable energy solutions",
    },
    {
      id: 3,
      title: "Future of Digital Payments",
      speaker: "Ms. Ananya Gupta",
      banner: "https://source.unsplash.com/800x400/?finance,technology",
      uniqueness: "Understanding UPI 3.0 and secure digital payments",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    speaker: "",
    uniqueness: "",
    banner: "",
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.speaker || !newEvent.uniqueness || !newEvent.banner) return;
    setEvents([{ id: events.length + 1, ...newEvent }, ...events]);
    setNewEvent({ title: "", speaker: "", uniqueness: "", banner: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/homepage")}
          className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-white">LinkMate Events</h1>
      </div>

      {/* New Event Form */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">📌 Post a New Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="w-full mb-2 p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Speaker Name"
          value={newEvent.speaker}
          onChange={(e) => setNewEvent({ ...newEvent, speaker: e.target.value })}
          className="w-full mb-2 p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Uniqueness (What makes it special?)"
          value={newEvent.uniqueness}
          onChange={(e) => setNewEvent({ ...newEvent, uniqueness: e.target.value })}
          className="w-full mb-2 p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Banner Image URL"
          value={newEvent.banner}
          onChange={(e) => setNewEvent({ ...newEvent, banner: e.target.value })}
          className="w-full mb-2 p-2 border rounded-lg"
        />
        <button
          onClick={handleAddEvent}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post Event</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img src={event.banner} alt={event.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{event.title}</h3>
              <p className="text-gray-600 mb-1">🎤 Speaker: {event.speaker}</p>
              <p className="text-gray-700 italic">✨ {event.uniqueness}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPage;
