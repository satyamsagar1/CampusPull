// routes/resource.routes.js
import express from "express";
import {
  getNotes,
  getRoadmaps,
  getPYQs,
  uploadNotes,
  uploadRoadmap,
  uploadPYQ,
  incrementViews,
  incrementDownloads,
  toggleBookmark,
  updateRoadmap,
  updateNote,   
  updatePYQ,
} from "../controllers/resourceController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import { cloudinaryParser } from "../middleware/upload.js";


const router = express.Router();
const feedParser = cloudinaryParser("linkmate_resources");

const canManageNotesPYQs = ['admin', 'teacher', 'alumni'];
const canManageRoadmaps = ['admin'];

// Fetch
router.get("/notes",authMiddleware, getNotes);
router.get("/roadmaps",authMiddleware, getRoadmaps);
router.get("/pyqs",authMiddleware, getPYQs);

// Upload (protected)
router.post("/notes/upload",authMiddleware,requireRole(canManageNotesPYQs), feedParser.single("thumbnail"), uploadNotes);
router.post("/roadmaps/upload", authMiddleware, requireRole(canManageNotesPYQs), feedParser.single("thumbnail"), uploadRoadmap);
router.post("/pyqs/upload", authMiddleware, requireRole(canManageNotesPYQs), feedParser.single("thumbnail"), uploadPYQ);

router.put("/roadmaps/:id", authMiddleware, requireRole(canManageRoadmaps), feedParser.single("thumbnail"), updateRoadmap);
router.put("/notes/:id", authMiddleware, requireRole(canManageNotesPYQs), feedParser.single("thumbnail"), updateNote);
router.put("/pyqs/:id", authMiddleware, requireRole(canManageNotesPYQs), feedParser.single("thumbnail"), updatePYQ);

// Interactions
router.patch("/:type/:id/view", incrementViews);
router.patch("/:type/:id/download", incrementDownloads);
router.patch("/:type/:id/bookmark", authMiddleware, toggleBookmark);

export default router;
