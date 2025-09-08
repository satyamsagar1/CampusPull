import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getFeed,
  createPost, updatePost, deletePost,
  createEvent, updateEvent, deleteEvent,
  createAnnouncement, updateAnnouncement, deleteAnnouncement
} from "../controllers/feedController.js";

const router = express.Router();

// FEED
router.get("/", authMiddleware, getFeed);

// POSTS
router.post("/post", authMiddleware, createPost);
router.put("/post/:id", authMiddleware, updatePost);
router.delete("/post/:id", authMiddleware, deletePost);

// EVENTS (only alumni + admin can create/update/delete)
router.post("/event", authMiddleware, createEvent);
router.put("/event/:id", authMiddleware, updateEvent);
router.delete("/event/:id", authMiddleware, deleteEvent);

// ANNOUNCEMENTS (only alumni + admin)
router.post("/announcement", authMiddleware, createAnnouncement);
router.put("/announcement/:id", authMiddleware, updateAnnouncement);
router.delete("/announcement/:id", authMiddleware, deleteAnnouncement);

export default router;
