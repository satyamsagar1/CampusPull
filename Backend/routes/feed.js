import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getFeed,
  createPost, updatePost, deletePost,likePost,commentPost
  // createAnnouncement, updateAnnouncement, deleteAnnouncement
} from "../controllers/feedController.js";
import {cloudinaryParser} from "../middleware/upload.js";

const router = express.Router();

const feedParser=cloudinaryParser("linkmate_posts");

// FEED
router.get("/", authMiddleware, getFeed);

// POSTS
router.post("/post", feedParser.single("media"),authMiddleware, createPost);
router.put("/post/:id", feedParser.single("media"), authMiddleware, updatePost);
router.delete("/post/:id", authMiddleware, deletePost);
router.put("/like/:id", authMiddleware, likePost);
router.post("/comment/:id", authMiddleware, commentPost);

export default router;
