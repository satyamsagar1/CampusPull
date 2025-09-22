import Event from "../models/event.js";
import cloudinary from "../config/cloudinary.js";

// ------------------- GET EVENTS -------------------
export const getEvent = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .lean();

    const feed = events.map((e) => ({ type: "event", ...e }));
    feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- CREATE EVENT -------------------
export const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "alumni") {
      return res.status(403).json({ error: "Only alumni or admin can create this" });
    }

    const { title, description, date } = req.body;

    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return res.status(400).json({ error: "Event title is required" });
    if (trimmedTitle.length > 100) return res.status(400).json({ error: "Title too long (max 100 characters)" });

    const trimmedDesc = description?.trim() || "";
    if (trimmedDesc.length > 1000) return res.status(400).json({ error: "Description too long (max 1000 characters)" });

    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: "Valid event date is required" });
    }

    const event = await Event.create({
      title: trimmedTitle,
      description: trimmedDesc,
      date: new Date(date),
      createdBy: req.user.id,
      media: req.file?.path || null, // multer already uploaded
      mediaPublicId: req.file.filename || null,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------- UPDATE EVENT -------------------
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Authorization
    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Validation helpers
    const isEmptyUpdate = !title?.trim() && !description?.trim() && !date && !req.file;
    if (isEmptyUpdate) return res.status(400).json({ error: "Title, description, date or media required to update" });

    const validateLength = (field, max, fieldName) => {
      if (field && field.length > max) return `${fieldName} too long (max ${max} characters)`;
      return null;
    };

    const trimmedTitle = title?.trim();
    const trimmedDesc = description?.trim();

    let errorMsg = validateLength(trimmedTitle, 100, "Title") || validateLength(trimmedDesc, 1000, "Description");
    if (errorMsg) return res.status(400).json({ error: errorMsg });

    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Update fields
    if (trimmedTitle) event.title = trimmedTitle;
    if (trimmedDesc) event.description = trimmedDesc;
    if (date) event.date = new Date(date);
    
    if (req.file?.path) {
      // Delete old media from Cloudinary if exists
      if (event.mediaPublicId) {
        try {
          await cloudinary.uploader.destroy(event.mediaPublicId);
        } catch (err) {
          console.warn("[updateEvent] Failed to delete old media:", err.message);
        }
      }

      event.media = req.file.path;           // new URL
      event.mediaPublicId = req.file.filename // new public_id
    }

    await event.save();
    res.json(event);
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// ------------------- DELETE EVENT -------------------
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    
    // Delete media from Cloudinary
    if (event.mediaPublicId) {
      try {
        await cloudinary.uploader.destroy(event.mediaPublicId);
      } catch (err) {
        console.warn("[deleteEvent] Failed to delete media:", err.message);
      }
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ error: err.message });
  }
};
