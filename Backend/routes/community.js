// routes/communityRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  // Question controllers
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  // Answer controllers
  createAnswer,
  updateAnswer,
  deleteAnswer,
  //upvote controllers
  toggleQuestionUpvote,
  toggleAnswerUpvote,
} from "../controllers/communityController.js";

const router = express.Router();

/* -------------------- QUESTION ROUTES -------------------- */
router.get("/questions", authMiddleware, getQuestions);          // Get all questions
router.post("/questions", authMiddleware, createQuestion);       // Create question
router.put("/questions/:id", authMiddleware, updateQuestion);    // Update question
router.delete("/questions/:id", authMiddleware, deleteQuestion); // Delete question
router.post("/questions/:id/upvote", authMiddleware, toggleQuestionUpvote); // Toggle question upvote

/* -------------------- ANSWER ROUTES -------------------- */
router.post("/questions/:questionId/answers", authMiddleware, createAnswer); // Create answer
router.put("/answers/:id", authMiddleware, updateAnswer);                     // Update answer
router.delete("/answers/:id", authMiddleware, deleteAnswer);                  // Delete answer
router.post("/answers/:id/upvote", authMiddleware, toggleAnswerUpvote);       // Toggle answer upvote

export default router;
