import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { cloudinaryParser } from "../middleware/upload.js"; 

// Import ALL controller functions (Existing + New)
import { 
  getProfile, 
  updateProfile, 
  toggleLessonProgress,
  uploadProfileImage,
  // New Controllers 👇
  deleteProfilePhoto,
  updateSkills,
  deleteSkill,
  addArrayItem,
  updateArrayItem,
  deleteArrayItem
} from "../controllers/profileController.js";

import { passwordChange, verifyOtpAndChangePassword } from "../controllers/passwordChange.js";

const router = express.Router();

// Configure Cloudinary Middleware
const profileUpload = cloudinaryParser("campuspull_profiles");

// ---------------- EXISTING ROUTES ----------------

// GET /api/profile
router.get("/", authMiddleware, getProfile);

// PUT /api/profile (Updates text fields like bio, links, etc.)
router.put("/", authMiddleware, updateProfile);

// PATCH /api/profile/progress/toggle (For lessons)
router.patch("/progress/toggle", authMiddleware, toggleLessonProgress);

// POST /api/profile/upload-photo (For Profile Picture Upload)
router.post("/upload-photo", authMiddleware, profileUpload.single("photo"), uploadProfileImage);

router.post('/change-password-otp', authMiddleware, passwordChange);
router.put('/change-password-verify', authMiddleware, verifyOtpAndChangePassword);


// 1. DELETE Profile Photo
router.delete("/photo", authMiddleware, deleteProfilePhoto);

// 2. SKILLS Routes
router.post("/skills", authMiddleware, updateSkills);

// Route: DELETE /api/profile/skills/:skillName (Remove specific skill)
router.delete("/skills/:skillName", authMiddleware, deleteSkill);

// 3. GENERIC Array Item Routes (Projects, Experience, Education, Certifications)
router.post("/:section", authMiddleware, addArrayItem);

// Route: PUT /api/profile/experience/65a1b2...
router.put("/:section/:itemId", authMiddleware, updateArrayItem);

// Route: DELETE /api/profile/certifications/65a1b2...
router.delete("/:section/:itemId", authMiddleware, deleteArrayItem);


export default router;