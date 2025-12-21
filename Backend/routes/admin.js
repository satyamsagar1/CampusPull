// routes/adminRoutes.js
import express from 'express';
import { getAdminStats, getAllUsers, deleteUser } from '../controllers/adminController.js';
import { authMiddleware, authAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

// Apply protection to all routes in this file
// Now you need both a valid Token AND Admin Role to enter
router.use(authMiddleware, authAdmin);

// Routes
router.get('/stats', getAdminStats);        // URL: /api/admin/stats
router.get('/users', getAllUsers);          // URL: /api/admin/users
router.delete('/user/:id', deleteUser);     // URL: /api/admin/user/123

export default router;