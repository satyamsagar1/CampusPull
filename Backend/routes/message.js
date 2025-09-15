import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { sendMessage, getMessages, markAsRead, getChatList } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.patch('/:id/read', authMiddleware, markAsRead);
router.get('/chatlist/:userId', authMiddleware, getChatList);
router.get('/:userId1/:userId2', authMiddleware, getMessages);

export default router;