import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { cloudinaryParser } from "../middleware/upload.js";
import {
  getFeed,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  replyToComment,
  likeComment,
  sharePost
} from "../controllers/feedController.js";

const router = express.Router();
const feedParser = cloudinaryParser("linkmate_posts");

// ---------------- FEED ----------------
router.get("/", authMiddleware, getFeed);

// ---------------- POSTS ----------------
router.post("/post", authMiddleware, feedParser.single("media"), createPost);
router.put("/post/:id", authMiddleware, feedParser.single("media"), updatePost);
router.delete("/post/:id", authMiddleware, deletePost);
router.put("/like/:id", authMiddleware, likePost);
router.post("/comment/:id", authMiddleware, commentPost);

// ---------------- COMMENT FEATURES ----------------
router.post("/comment/:postId/reply/:commentId", authMiddleware, replyToComment);
router.put("/comment/:postId/like/:commentId", authMiddleware, likeComment);
router.put("/comment/:postId/like/:commentId/:replyId", authMiddleware, likeComment);

// ---------------- SHARE ----------------
router.post("/share/:id", authMiddleware, sharePost);

export default router;
