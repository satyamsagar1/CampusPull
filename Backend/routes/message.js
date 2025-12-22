import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendMessage, getMessages, markAsRead, getChatList } from '../controllers/messageController.js';
import { cloudinaryParser } from "../middleware/upload.js";

const router = express.Router();

const upload = cloudinaryParser('linkmate_messages');

router.post('/', authMiddleware, upload.single('file'), sendMessage);

router.patch('/read/:id', authMiddleware, markAsRead);
router.get('/chatlist/:userId', authMiddleware, getChatList);
router.get('/:userId1/:userId2', authMiddleware, getMessages);

export default router;