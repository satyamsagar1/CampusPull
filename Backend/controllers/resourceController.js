import { Notes, Roadmap, InterviewPYQ } from "../models/resources.js";
import util from 'util';
const contributorFields = "_id name avatar verified";

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
  // --- USE .toObject() ---
  const resourceObject = resource.toObject();
  // --- END ---

  const userIdStr = userId ? userId.toString() : null;
  const isBookmarked = userIdStr
    ? (resourceObject.bookmarks || []).some(b => {
        if (!b) return false;
        const bId = b && typeof b === 'object' ? b._id?.toString() : b?.toString();
        return bId === userIdStr;
      })
    : false;

  return {
    ...resourceObject,
    type: resource.category, // Use original category to determine type alias
    isBookmarked,
    difficulty:
      resource.category === "Interview PYQ" // Check original category
        ? mapDifficulty(resource.difficulty) // Use original difficulty for mapping
        : undefined,
  };
};

// ===== Fetch =====
export const getNotes = async (req, res) => {
  try {
    const notes = await Notes.find()
      .populate("uploadedBy", contributorFields)
      .populate("bookmarks", "name avatar")
      .sort({ createdAt: -1 });

    const formatted = notes.map(n =>
      formatResource(n, req.user?.id)
    );
    res.status(200).json(formatted);
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

    const formatted = roadmaps.map(r => formatResource(r, req.user?.id));
    res.status(200).json(formatted);
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

    const formatted = pyqs.map(p => formatResource(p, req.user?.id));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===== Uploads =====

// ---- Notes Upload ----
export const uploadNotes = async (req, res) => {
  try {
      const { link, title, description, tags, branch, semester, } = req.body;
      const thumbnail = req.file ? req.file.path : null;

    if (!title || !link) {
      return res
        .status(400)
        .json({ error: "Title and link are required for notes." });
    }

    const newNote = await Notes.create({
      title,
      link,
      description,
      tags,
      category: "Notes",
      branch,
      semester,
      thumbnail,
      uploadedBy: req.user.id,
    });
    await newNote.populate("uploadedBy", contributorFields);

    res.status(201).json(formatResource(newNote, req.user.id));
  } catch (err) {
    console.error("Error uploading notes:", err);
    res.status(400).json({ error: err.message });
  }
};

// ---- Roadmap Upload ----
export const uploadRoadmap = async (req, res) => {
  try {
    const { title, description, tags, modules } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    if (!title || !modules) {
      return res
        .status(400)
        .json({ error: "Title and Modules are required for a roadmap." });
    }

    let parsedModules;
    try {
      parsedModules = JSON.parse(modules); // Parse the modules string
      if (!Array.isArray(parsedModules) || parsedModules.length === 0) {
        throw new Error("Modules must be a non-empty array.");
      }
    } catch (parseError) {
      console.error("Invalid modules format:", parseError);
      return res
        .status(400)
        .json({ error: "Invalid modules format. Must be a JSON string array." });
    }

    const newRoadmap = await Roadmap.create({
      title,
      description,
      tags,
      modules: parsedModules, // Pass the parsed array to the database
      category: "Roadmap",
      thumbnail,
      uploadedBy: req.user.id,
    });
    await newRoadmap.populate("uploadedBy", contributorFields);

    res.status(201).json(formatResource(newRoadmap, req.user.id));
  } catch (err) {
    console.error("Error uploading roadmap:", err);
    res.status(400).json({ error: err.message });
  }
};

// ---- PYQ Upload ----
export const uploadPYQ = async (req, res) => {
  try {
    const { link, difficulty, company, year, description, tags } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    // Company and link are now the main requirements
    if (!company || !link) {
      return res
        .status(400)
        .json({ error: "Company and link are required for PYQ." });
    }

    const newPYQ = await InterviewPYQ.create({
      link,
      company,
      year,
      description,
      tags,
      difficulty: difficulty || "Easy",
      category: "Interview PYQ",
      thumbnail,
      uploadedBy: req.user.id,
    });
    await newPYQ.populate("uploadedBy", contributorFields);

    res.status(201).json(formatResource(newPYQ, req.user.id));
  } catch (err) {
    console.error("Error uploading PYQ:", err);
    res.status(400).json({ error: err.message });
  }
};

// ... after your uploadPYQ function

// ===== EDIT / UPDATE =====

// ---- Roadmap Update (Modular) ----
export const updateRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, modules } = req.body;
    const userId = req.user.id;

    // 1. Find the roadmap
    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    // 2. Security Check: Verify ownership
    if (req.user.role !== "admin" && roadmap.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: "User not authorized to edit this resource" });
    }

    // 3. Parse Modules (same as upload)
    let parsedModules;
    if (modules) { // Modules are optional, maybe they only update the title
      try {
        parsedModules = JSON.parse(modules);
        if (!Array.isArray(parsedModules)) {
          throw new Error("Modules must be an array.");
        }
        roadmap.modules = parsedModules; // Update modules
      } catch (parseError) {
        console.error("Invalid modules format:", parseError);
        return res.status(400).json({ error: "Invalid modules format." });
      }
    }

    // 4. Update other fields
    roadmap.title = title || roadmap.title;
    roadmap.description = description || roadmap.description;
    roadmap.tags = tags ? tags.split(',').map(tag => tag.trim()) : roadmap.tags;

    // 5. Update thumbnail if a new one is uploaded
    if (req.file) {
      roadmap.thumbnail = req.file.path;
    }

    // 6. Save and return
    const updatedRoadmap = await roadmap.save();
    
    // We need to populate the user data for the formatted response
    await updatedRoadmap.populate("uploadedBy", contributorFields);
    
    res.status(200).json(formatResource(updatedRoadmap, userId));

  } catch (err) {
    console.error("Error updating roadmap:", err);
    res.status(400).json({ error: err.message });
  }
};

// ... after updateRoadmap function

// ---- Note Update ----
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, link, branch, semester } = req.body;
    const userId = req.user.id;

    const note = await Notes.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (req.user.role !== "admin" && note.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: "User not authorized" });
    }

    note.title = title || note.title;
    note.description = description || note.description;
    note.tags = tags ? tags.split(',').map(tag => tag.trim()) : note.tags;
    note.link = link || note.link;
    note.branch = branch || note.branch;
    note.semester = semester || note.semester;

    if (req.file) {
      note.thumbnail = req.file.path;
    }

    const updatedNote = await note.save();
    await updatedNote.populate("uploadedBy", contributorFields);
    res.status(200).json(formatResource(updatedNote, userId));

  } catch (err) {
    console.error("Error updating note:", err);
    res.status(400).json({ error: err.message });
  }
};

// ---- PYQ Update ----
export const updatePYQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, description, tags, link, year, difficulty } = req.body;
    const userId = req.user.id;

    const pyq = await InterviewPYQ.findById(id);
    if (!pyq) {
      return res.status(404).json({ error: "PYQ not found" });
    }

    if (req.user.role !== "admin" && pyq.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: "User not authorized" });
    }

    pyq.company = company || pyq.company;
    pyq.description = description || pyq.description;
    pyq.tags = tags ? tags.split(',').map(tag => tag.trim()) : pyq.tags;
    pyq.link = link || pyq.link;
    pyq.year = year || pyq.year;
    pyq.difficulty = difficulty || pyq.difficulty;

    if (req.file) {
      pyq.thumbnail = req.file.path;
    }

    const updatedPYQ = await pyq.save();
    await updatedPYQ.populate("uploadedBy", contributorFields);
    res.status(200).json(formatResource(updatedPYQ, userId));

  } catch (err) {
    console.error("Error updating PYQ:", err);
    res.status(400).json({ error: err.message });
  }
};

// ===== Interactions =====
export const incrementViews = async (req, res) => {
  try {
    const { id, type } = req.params;
    const Model =
      type === "roadmap"
        ? Roadmap
        : type === "pyq"
        ? InterviewPYQ
        : Notes;
    const resource = await Model.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("uploadedBy", contributorFields);
    res.status(200).json(formatResource(resource, req.user?._id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const incrementDownloads = async (req, res) => {
  try {
    const { id, type } = req.params;
    const Model =
      type === "roadmap"
        ? Roadmap
        : type === "pyq"
        ? InterviewPYQ
        : Notes;
    const resource = await Model.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    ).populate("uploadedBy", contributorFields);
    res.status(200).json(formatResource(resource, req.user?._id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.user.id;

    const Model =
      type === "roadmap"
        ? Roadmap
        : type === "pyq"
        ? InterviewPYQ
        : Notes;

    const resource = await Model.findById(id);
    if (!resource)
      return res.status(404).json({ error: "Resource not found" });

    resource.bookmarks = Array.isArray(resource.bookmarks)
      ? resource.bookmarks.filter(Boolean)
      : [];

    const index = resource.bookmarks.findIndex(
      b => b.toString() === userId.toString()
    );

    if (index === -1) resource.bookmarks.push(userId);
    else resource.bookmarks.splice(index, 1);

    await resource.save();

    const isBookmarked = resource.bookmarks.some(
      b => b.toString() === userId.toString()
    );

    res.status(200).json({
      _id: resource._id,
      bookmarksCount: resource.bookmarks.length,
      isBookmarked,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
