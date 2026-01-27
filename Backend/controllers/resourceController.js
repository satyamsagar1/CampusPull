import { Notes, Roadmap, InterviewPYQ } from "../models/resources.js";

const contributorFields = "_id name avatar verified role";

// ===== Helper: difficulty + formatting =====
const mapDifficulty = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "beginner";
    case "Medium":
      return "intermediate";
    case "Hard":
      return "advanced";
    default:
      return "beginner";
  }
};

const formatResource = (resource, userId) => {
  const resourceObject = resource.toObject();
  const userIdStr = userId ? userId.toString() : null;
  
  const isBookmarked = userIdStr
    ? (resourceObject.bookmarks || []).some((b) => {
        if (!b) return false;
        const bId = typeof b === "object" ? b._id?.toString() : b?.toString();
        return bId === userIdStr;
      })
    : false;

  return {
    ...resourceObject,
    type: resource.category,
    isBookmarked,
    difficulty:
      resource.category === "Interview PYQ"
        ? mapDifficulty(resource.difficulty)
        : undefined,
  };
};

// ===== Permission Helper =====
const canModifyResource = (Model) => async (req, res, next) => {
  try {
    const resource = await Model.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    if (
      req.user.role !== "admin" &&
      resource.uploadedBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ error: "User not authorized" });
    }

    req.resource = resource;
    next();
  } catch (err) {
    res.status(500).json({ error: "Database error during permission check" });
  }
};

// ===== Fetch (Hard Delete: No filter needed) =====
export const getNotes = async (req, res) => {
  try {
    const notes = await Notes.find()
      .populate("uploadedBy", contributorFields)
      .populate("bookmarks", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(notes.map((n) => formatResource(n, req.user?.id)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find()
      .populate("uploadedBy", contributorFields)
      .populate("bookmarks", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(roadmaps.map((r) => formatResource(r, req.user?.id)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPYQs = async (req, res) => {
  try {
    const pyqs = await InterviewPYQ.find()
      .populate("uploadedBy", contributorFields)
      .populate("bookmarks", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(pyqs.map((p) => formatResource(p, req.user?.id)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== Uploads (Logic remains same) =====
export const uploadNotes = async (req, res) => {
  try {
    const { link, title, description, tags, branch, semester } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    if (!title || !link) {
      return res.status(400).json({ error: "Title and link are required." });
    }

    const newNote = await Notes.create({
      title, link, description, tags,
      category: "Notes", branch, semester, thumbnail,
      uploadedBy: req.user.id,
    });

    await newNote.populate("uploadedBy", contributorFields);
    res.status(201).json(formatResource(newNote, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const uploadRoadmap = async (req, res) => {
  try {
    const { title, description, tags, modules } = req.body;
    const thumbnail = req.file ? req.file.path : null;
    let parsedModules = JSON.parse(modules);

    const newRoadmap = await Roadmap.create({
      title, description, tags, modules: parsedModules,
      category: "Roadmap", thumbnail,
      uploadedBy: req.user.id,
    });

    await newRoadmap.populate("uploadedBy", contributorFields);
    res.status(201).json(formatResource(newRoadmap, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const uploadPYQ = async (req, res) => {
  try {
    const { link, difficulty, company, year, description, tags } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    const newPYQ = await InterviewPYQ.create({
      link, company, year, description, tags,
      difficulty: difficulty || "Easy",
      category: "Interview PYQ", thumbnail,
      uploadedBy: req.user.id,
    });

    await newPYQ.populate("uploadedBy", contributorFields);
    res.status(201).json(formatResource(newPYQ, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ===== UPDATE (Logic remains same) =====
export const updateRoadmap = [
  canModifyResource(Roadmap),
  async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    const { title, description, tags, modules } = req.body;
    const roadmap = req.resource;

    if (modules) roadmap.modules = JSON.parse(modules);
    roadmap.title = title || roadmap.title;
    roadmap.description = description || roadmap.description;
    if (req.file) roadmap.thumbnail = req.file.path;

    const updated = await roadmap.save();
    await updated.populate("uploadedBy", contributorFields);
    res.status(200).json(formatResource(updated, req.user.id));
  },
];

export const updateNote = [
  canModifyResource(Notes),
  async (req, res) => {
    const note = req.resource;
    const { title, description, tags, link, branch, semester } = req.body;

    note.title = title || note.title;
    note.description = description || note.description;
    note.link = link || note.link;
    if (req.file) note.thumbnail = req.file.path;

    const updated = await note.save();
    await updated.populate("uploadedBy", contributorFields);
    res.status(200).json(formatResource(updated, req.user.id));
  },
];

export const updatePYQ = [
  canModifyResource(InterviewPYQ),
  async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    const pyq = req.resource;
    const { company, description, difficulty } = req.body;

    pyq.company = company || pyq.company;
    pyq.description = description || pyq.description;
    pyq.difficulty = difficulty || pyq.difficulty;
    if (req.file) pyq.thumbnail = req.file.path;

    const updated = await pyq.save();
    await updated.populate("uploadedBy", contributorFields);
    res.status(200).json(formatResource(updated, req.user.id));
  },
];

// ===== DELETE (HARD DELETE: Erases from DB) =====
export const deleteNote = [
  canModifyResource(Notes),
  async (req, res) => {
    await Notes.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted from database" });
  },
];

export const deleteRoadmap = [
  canModifyResource(Roadmap),
  async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    await Roadmap.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Roadmap deleted from database" });
  },
];

export const deletePYQ = [
  canModifyResource(InterviewPYQ),
  async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    await InterviewPYQ.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "PYQ deleted from database" });
  },
];

// ===== Interactions (Removed isDeleted checks) =====
export const incrementViews = async (req, res) => {
  const { id, type } = req.params;
  const Model = type === "roadmap" ? Roadmap : type === "pyq" ? InterviewPYQ : Notes;
  const resource = await Model.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  if (!resource) return res.status(404).json({ error: "Not found" });
  await resource.populate("uploadedBy", contributorFields);
  res.status(200).json(formatResource(resource, req.user?._id));
};

export const incrementDownloads = async (req, res) => {
  const { id, type } = req.params;
  const Model = type === "roadmap" ? Roadmap : type === "pyq" ? InterviewPYQ : Notes;
  const resource = await Model.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true });
  if (!resource) return res.status(404).json({ error: "Not found" });
  await resource.populate("uploadedBy", contributorFields);
  res.status(200).json(formatResource(resource, req.user?._id));
};

export const toggleBookmark = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.user.id;
    const Model = type === "roadmap" ? Roadmap : type === "pyq" ? InterviewPYQ : Notes;

    const resource = await Model.findById(id);
    if (!resource) return res.status(404).json({ error: "Not found" });

    const index = resource.bookmarks.indexOf(userId);
    if (index === -1) resource.bookmarks.push(userId);
    else resource.bookmarks.splice(index, 1);

    await resource.save();
    res.status(200).json({ _id: resource._id, isBookmarked: resource.bookmarks.includes(userId) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookmarkedResources = async (req, res) => {
  try {
    const userId = req.user.id;
    const [notes, roadmaps, pyqs] = await Promise.all([
      Notes.find({ bookmarks: userId }).populate("uploadedBy", contributorFields),
      Roadmap.find({ bookmarks: userId }).populate("uploadedBy", contributorFields),
      InterviewPYQ.find({ bookmarks: userId }).populate("uploadedBy", contributorFields)
    ]);
    const all = [...notes, ...roadmaps, ...pyqs].map((r) => formatResource(r, userId));
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};