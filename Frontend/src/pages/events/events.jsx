import React, { useState, useContext, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Check } from "lucide-react";
import { EventContext } from "../../context/EventContext";
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
  const { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent } = useContext(EventContext);

  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", banner: null });
  const [previewImage, setPreviewImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "", date: "", banner: null });

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
      bannerFile: newEvent.banner
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
      banner: null
    });
  };

  const handleSaveEdit = async (id) => {
    await updateEvent(id, {
      title: editData.title,
      description: editData.description,
      date: editData.date,
      bannerFile: editData.banner
    });
    setEditingId(null);
    setEditData({ title: "", description: "", date: "", banner: null });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ title: "", description: "", date: "", banner: null });
  };

  // ---------- Render Event Content ----------
  let eventContent;
  if (loading) eventContent = <p className="text-center text-white">Loading events...</p>;
  else if (events.length === 0) eventContent = <p className="text-center text-white">No events yet.</p>;
  else {
    eventContent = events.map((event) => {
      const userId = user?._id || user?.id;
      const isCreator = userId && event.createdBy?._id === userId;
      const isEditing = editingId === event._id;

      return (
        <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden">
          {isEditing ? (
            <div className="p-4 space-y-2">
              <input type="text" value={editData.title} onChange={e => setEditData(prev => ({ ...prev, title: e.target.value }))} className="w-full p-2 border rounded-lg" />
              <textarea value={editData.description} onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))} className="w-full p-2 border rounded-lg" />
              <input type="datetime-local" value={editData.date} onChange={e => setEditData(prev => ({ ...prev, date: e.target.value }))} className="w-full p-2 border rounded-lg" />
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} className="w-full" />
              {editData.banner && <img src={URL.createObjectURL(editData.banner)} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
              {!editData.banner && event.media && <img src={event.media} alt="Current" className="w-full h-40 object-cover rounded-lg" />}
              <div className="flex space-x-2 mt-2">
                <button onClick={() => handleSaveEdit(event._id)} className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 flex items-center space-x-1"><Check className="w-4 h-4" /><span>Save</span></button>
                <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-4 py-1 rounded-lg hover:bg-gray-500">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {event.media && <img src={event.media} alt={event.title ?? ""} className="w-full h-48 object-cover" />}
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1">{event.title ?? "Untitled Event"}</h3>
                  <p className="text-gray-600 mb-1">{formatDateTime(event.date ?? "")}</p>
                  <p className="text-gray-700">{event.description ?? ""}</p>
                </div>
                {user && isCreator && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleStartEdit(event)} className="text-blue-600 hover:text-blue-800"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => deleteEvent(event._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-white">LinkMate Events</h1>
      </div>

      {/* Role-based Create Event */}
      {(user?.role === "admin" || user?.role === "alumni") && (
        <div className="bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">📌 Post a New Event</h2>
          <input type="text" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full mb-2 p-2 border rounded-lg" />
          <textarea placeholder="Event Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full mb-2 p-2 border rounded-lg" />
          <input type="datetime-local" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full mb-2 p-2 border rounded-lg" />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full mb-2" />
          {previewImage && <img src={previewImage} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2" />}
          <button onClick={handleSaveNewEvent} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <PlusCircle className="w-5 h-5" />
            <span>Post Event</span>
          </button>
        </div>
      )}

      {/* Event List */}
      <div className="space-y-6">
        {eventContent}
      </div>
    </div>
  );
};

export default EventPage;
