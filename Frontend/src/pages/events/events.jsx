import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

// ✅ Date format helper
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    banner: "",
    date: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ File upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPreviewImage(imgUrl);
      setNewEvent({ ...newEvent, banner: imgUrl });
    }
  };

  // ✅ Event add
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date) return;

    const eventToAdd = {
      ...newEvent,
      id: Date.now(),
    };

    setEvents([eventToAdd, ...events]); // list me push karega

    // reset form
    setNewEvent({ title: "", description: "", banner: "", date: "" });
    setPreviewImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
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
        <textarea
          placeholder="Event Description"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
          className="w-full mb-2 p-2 border rounded-lg"
        />
        <input
          type="datetime-local"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          className="w-full mb-2 p-2 border rounded-lg"
        />

        {/* File upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full mb-2"
        />

        {/* Preview */}
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg mb-2"
          />
        )}

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
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            {event.banner && (
              <img
                src={event.banner}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{event.title}</h3>
              <p className="text-gray-600 mb-1">{formatDateTime(event.date)}</p>
              <p className="text-gray-700">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPage;
