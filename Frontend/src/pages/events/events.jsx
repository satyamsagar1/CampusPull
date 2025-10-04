import React, { useState, useContext, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Check, Calendar } from "lucide-react";
import { EventContext } from "../../context/eventContext";
import { AuthContext } from "../../context/AuthContext";

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
  const { user } = useContext(AuthContext);
  const { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent } =
    useContext(EventContext);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    banner: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    date: "",
    banner: null,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isEdit) setEditData({ ...editData, banner: file });
    else {
      setPreviewImage(URL.createObjectURL(file));
      setNewEvent({ ...newEvent, banner: file });
    }
  };

  const handleSaveNewEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date) return;
    await createEvent({
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      bannerFile: newEvent.banner,
    });
    setNewEvent({ title: "", description: "", date: "", banner: null });
    setPreviewImage(null);
  };

  const handleStartEdit = (event) => {
    setEditingId(event._id);
    setEditData({
      title: event.title || "",
      description: event.description || "",
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      banner: null,
    });
  };

  const handleSaveEdit = async (id) => {
    await updateEvent(id, {
      title: editData.title,
      description: editData.description,
      date: editData.date,
      bannerFile: editData.banner,
    });
    setEditingId(null);
    setEditData({ title: "", description: "", date: "", banner: null });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ title: "", description: "", date: "", banner: null });
  };

  const fallbackImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", // students networking
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80", // classroom
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", // laptop + teamwork
  ];

  // ---------- Render Event Content ----------
  let eventContent;
  if (loading)
    eventContent = <p className="text-center text-white">Loading events...</p>;
  else if (events.length === 0)
    eventContent = (
      <p className="text-center text-white">🚀 No events yet. Be the first!</p>
    );
  else {
    eventContent = events.map((event, idx) => {
      const userId = user?._id || user?.id;
      const isCreator = userId && event.createdBy?._id === userId;
      const isEditing = editingId === event._id;

      return (
        <div
          key={event._id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all overflow-hidden"
        >
          {isEditing ? (
            <div className="p-4 space-y-2">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="datetime-local"
                value={editData.date}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="w-full"
              />
              {editData.banner && (
                <img
                  src={URL.createObjectURL(editData.banner)}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              {!editData.banner && event.media && (
                <img
                  src={event.media}
                  alt="Current"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleSaveEdit(event._id)}
                  className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-400 text-white px-4 py-1 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <img
                src={event.media || fallbackImages[idx % fallbackImages.length]}
                alt={event.title ?? ""}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {event.title ?? "Untitled Event"}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(event.date ?? "")}</span>
                </div>
                <p className="text-gray-700 mb-3">{event.description ?? ""}</p>
                {user && isCreator && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStartEdit(event)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      );
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🎉 CampusPull Events</h1>
        <p className="text-white text-sm opacity-90">
          Discover, Join & Create events with Alumni & Students
        </p>
      </div>

      {/* Create Event Form (visible for admin/alumni) */}
      {(user?.role === "admin" || user?.role === "alumni") && (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold mb-4">📌 Create New Event</h2>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
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
            onChange={(e) =>
              setNewEvent({ ...newEvent, date: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded-lg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mb-2"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
          )}
          <div className="flex justify-end">
            <button
              onClick={handleSaveNewEvent}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post Event</span>
            </button>
          </div>
        </div>
      )}

      {/* Event List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{eventContent}</div>
    </div>
  );
};

export default EventPage;
