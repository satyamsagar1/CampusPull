import Post from "../models/post.js";
import Event from "../models/event.js";
import Announcement from "../models/announcement.js";

// ------------------- FEED -------------------
export const getFeed = async (req, res) => {
  try {
     const posts = await Post.find()
      .populate("author", "name role")
      .sort({ createdAt: -1 })
      .lean();

    const events = await Event.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .lean();

    const announcements = await Announcement.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .lean();
    const feed = [
      ...posts.map(p => ({ type: "post", ...p })),
      ...events.map(e => ({ type: "event", ...e })),
      ...announcements.map(a => ({ type: "announcement", ...a })),
    ];

    feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- POSTS -------------------
export const createPost = async (req, res) => {
  
  try {
    const { content, media } = req.body;

   const trimmedContent = content.trim();
    if (!trimmedContent) return res.status(400).json({ error: "Content required" });
    if (trimmedContent.length > 500) return res.status(400).json({ error: "Content too long" });

    if (media && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|mp4)$/i.test(media)) {
    return res.status(400).json({ error: "Invalid media format" });
    }

    const post = await Post.create({
      author: req.user.id,
      content: trimmedContent,
      media,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, media } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Only owner or admin can update
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const trimmedContent = content?.trim();
    
    if (!trimmedContent) {
    return res.status(400).json({ error: "Content cannot be empty" });
    }

    if (trimmedContent && trimmedContent.length > 500) {
    return res.status(400).json({ error: "Content too long" });
    }

    if (media && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|mp4)$/i.test(media)) {
      return res.status(400).json({ error: "Invalid media format" });
    }

    if (trimmedContent) post.content = trimmedContent;
    if (media) post.media = media;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
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

// ------------------- ANNOUNCEMENTS -------------------
export const createAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "alumni") {
      return res.status(403).json({ error: "Only alumni or admin can create this" });
    }

    const { message } = req.body;
    const trimmedMsg = message?.trim();

    if (!trimmedMsg) {
      return res.status(400).json({ error: "Message required" });
    }

    if (trimmedMsg.length > 1000) {
      return res.status(400).json({ error: "Message too long (max 1000 chars)" });
    }

    const ann = await Announcement.create({
      message: trimmedMsg,
      createdBy: req.user.id,
    });

    res.status(201).json(ann);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ error: "Announcement not found" });

    // Only creator or admin can update
    if (ann.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const trimmedMsg = message?.trim();
    if (!trimmedMsg) {
      return res.status(400).json({ error: "Message required to update" });
    }

    if (trimmedMsg.length > 1000) {
      return res.status(400).json({ error: "Message too long (max 1000 chars)" });
    }

    ann.message = trimmedMsg;
    await ann.save();

    res.json(ann);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ error: "Announcement not found" });

    if (ann.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await ann.deleteOne();
    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
