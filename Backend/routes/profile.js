// routes/profileRoutes.js
import express from "express";
// Import the new function
import { getProfile, updateProfile, toggleLessonProgress } from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);      // GET /api/profile
router.put("/", authMiddleware, updateProfile);      // PUT /api/profile

// --- NEW ROUTE FOR PROGRESS ---
router.patch("/progress/toggle", authMiddleware, toggleLessonProgress); // PATCH /api/profile/progress/toggle

export default router;