import express from 'express';
import { submitFeedback, getFeedbackList } from '../controllers/feedbackController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/submit', submitFeedback);

router.get('/all', getFeedbackList);

export default router;