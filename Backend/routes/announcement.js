// routes/announcement.routes.js
import express from 'express';
import { createAnnouncement, getAnnouncements,updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js'; // Import middleware
import { cloudinaryParser } from '../middleware/upload.js'; // <-- 1. Import cloudinaryParser

const router = express.Router();
const annParser = cloudinaryParser("linkmate_announcements");

// Define allowed roles for creating
const canCreateOrModify = ['admin', 'teacher'];

// GET /api/announcements - Fetch all (Requires login)
router.get('/', authMiddleware, getAnnouncements);

// POST /api/announcements - Create new (Requires Admin or Teacher role)
router.post('/', authMiddleware, requireRole(canCreateOrModify), annParser.single('attachment'),createAnnouncement);

router.put('/:id', authMiddleware, requireRole(canCreateOrModify), annParser.single('attachment'), updateAnnouncement);

router.delete('/:id', authMiddleware, requireRole(canCreateOrModify), deleteAnnouncement);


export default router;