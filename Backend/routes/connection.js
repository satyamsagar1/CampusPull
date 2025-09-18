import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { getSuggestedUsers, searchUsers, sendConnectionRequest, respondToConnectionRequest, getConnections, getConnectionCount,getPendingRequests } from '../controllers/connectionController.js';

const router = express.Router();

router.get('/suggestions', authMiddleware, getSuggestedUsers);
router.get('/search', authMiddleware, searchUsers);

router.post('/request', authMiddleware, sendConnectionRequest);
router.post('/respond', authMiddleware, respondToConnectionRequest);    
router.get('/connections', authMiddleware, getConnections);
router.get('/count', authMiddleware, getConnectionCount);
router.get("/requests/pending", authMiddleware, getPendingRequests);


export default router;


