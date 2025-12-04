import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { cloudinaryParser } from "../middleware/upload.js"; // ✅ Import your existing Cloudinary middleware

// Import the controller functions (including the new uploadProfileImage)
import { 
  getProfile, 
  updateProfile, 
  toggleLessonProgress,
  uploadProfileImage // ✅ Import the upload controller
} from "../controllers/profileController.js";

const router = express.Router();

// 1. Configure Cloudinary Middleware for this route
// Images will be stored in a folder named 'campuspull_profiles' on Cloudinary
const profileUpload = cloudinaryParser("campuspull_profiles");

// ---------------- ROUTES ----------------

// GET /api/profile
router.get("/", authMiddleware, getProfile);

// PUT /api/profile (Updates text fields like bio, skills, etc.)
router.put("/", authMiddleware, updateProfile);

// PATCH /api/profile/progress/toggle (For lessons)
router.patch("/progress/toggle", authMiddleware, toggleLessonProgress);

// ✅ POST /api/profile/upload-photo (For Profile Picture)
// Matches your Frontend fetch: "/api/profile/upload-photo"
router.post("/upload-photo", authMiddleware, profileUpload.single("photo"), uploadProfileImage);

export default router;