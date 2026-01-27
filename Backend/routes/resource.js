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
  deleteNote,
  deleteRoadmap,
  deletePYQ,
  getBookmarkedResources,
} from "../controllers/resourceController.js";

import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import { cloudinaryParser } from "../middleware/upload.js";

const router = express.Router();
const feedParser = cloudinaryParser("linkmate_resources");

const noteUploadRoles = ['admin', 'teacher', 'alumni'];
const adminOnly = ['admin'];

// ===== Fetch =====
router.get("/notes", authMiddleware, getNotes);
router.get("/roadmaps", authMiddleware, getRoadmaps);
router.get("/pyqs", authMiddleware, getPYQs);

// ===== Upload =====
// Notes: admin + teacher + alumni
router.post(
  "/notes/upload",
  authMiddleware,
  requireRole(noteUploadRoles),
  feedParser.single("thumbnail"),
  uploadNotes
);

// Roadmaps: admin only
router.post(
  "/roadmaps/upload",
  authMiddleware,
  requireRole(adminOnly),
  feedParser.single("thumbnail"),
  uploadRoadmap
);

// PYQs: admin only
router.post(
  "/pyqs/upload",
  authMiddleware,
  requireRole(adminOnly),
  feedParser.single("thumbnail"),
  uploadPYQ
);

// ===== UPDATE =====
// Notes: owner OR admin (controller checks ownership)
router.put(
  "/notes/:id",
  authMiddleware,
  feedParser.single("thumbnail"),
  updateNote
);

// Roadmaps: admin only
router.put(
  "/roadmaps/:id",
  authMiddleware,
  requireRole(adminOnly),
  feedParser.single("thumbnail"),
  updateRoadmap
);

// PYQs: admin only
router.put(
  "/pyqs/:id",
  authMiddleware,
  requireRole(adminOnly),
  feedParser.single("thumbnail"),
  updatePYQ
);

// ===== DELETE =====
// Notes: owner OR admin
router.delete(
  "/notes/:id",
  authMiddleware,
  deleteNote
);

// Roadmaps: admin only

router.delete(
  "/roadmaps/:id",
  authMiddleware,
  requireRole(adminOnly),
  deleteRoadmap
);

// PYQs: admin only
router.delete(
  "/pyqs/:id",
  authMiddleware,
  requireRole(adminOnly),
  deletePYQ
);

// ===== Interactions =====
router.patch("/:type/:id/view", incrementViews);
router.patch("/:type/:id/download", incrementDownloads);
router.patch("/:type/:id/bookmark", authMiddleware, toggleBookmark);

router.get("/bookmarks", authMiddleware, getBookmarkedResources);

export default router;
