
import Event from "../models/event.js";


// ------------------- FEED -------------------
export const getEvent = async (req, res) => {
  try {

    const events = await Event.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .lean();
    const feed = [
      ...events.map(e => ({ type: "event", ...e }))
    ];

    feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- EVENTS -------------------
export const createEvent = async (req, res) => {

  try {
    if (req.user.role !== "admin" && req.user.role !== "alumni") {
    return res.status(403).json({ error: "Only alumni or admin can create this" });
    }
    const { title, description, date } = req.body;
     const trimmedTitle = title?.trim();
      if (!trimmedTitle) {
      return res.status(400).json({ error: "Event title is required" });
    }
    if (trimmedTitle.length > 100) {
      return res.status(400).json({ error: "Title too long (max 100 characters)" });
    }

    // Validate description
    const trimmedDesc = description?.trim() || "";
    if (trimmedDesc.length > 1000) {
      return res.status(400).json({ error: "Description too long (max 1000 characters)" });
    }

    // Validate date
    if (!date || isNaN(new Date(date).getTime())) {
    return res.status(400).json({ error: "Valid event date is required" });
    }

    const event = await Event.create({
      title: trimmedTitle,
      description: trimmedDesc,
      date: new Date(date),
      createdBy: req.user.id
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (!title?.trim() && !description?.trim() && !date) {
      return res.status(400).json({ error: "Title, description or date required to update" });
    }

     const trimmedTitle = title?.trim();
    if (trimmedTitle && trimmedTitle.length > 100) {
      return res.status(400).json({ error: "Title too long (max 100 characters)" });
    }

    const trimmedDesc = description?.trim();
    if (trimmedDesc && trimmedDesc.length > 1000) {
      return res.status(400).json({ error: "Description too long (max 1000 characters)" });
    }

    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (trimmedTitle) event.title = trimmedTitle;
    if (trimmedDesc) event.description = trimmedDesc;
    if (date) event.date = new Date(date);

    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


