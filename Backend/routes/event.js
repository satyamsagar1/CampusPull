import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getEvent,createEvent, updateEvent, deleteEvent,
    } from "../controllers/eventController.js";

const router = express.Router();

// FEED
router.get("/", authMiddleware, getEvent);

// EVENTS (only alumni + admin can create/update/delete)
router.post("/", authMiddleware, createEvent);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);


export default router;
