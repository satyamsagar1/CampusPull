import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getEvent,createEvent, updateEvent, deleteEvent,toggleInterest
    } from "../controllers/eventController.js";
import {cloudinaryParser} from "../middleware/upload.js";

const router = express.Router();

const eventParser=cloudinaryParser("linkmate_events");


// FEED
router.get("/", authMiddleware, getEvent);

// EVENTS (only alumni + admin can create/update/delete)
router.post("/", authMiddleware,eventParser.single("banner"), createEvent);
router.put("/:id",authMiddleware,eventParser.single("banner"), updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);
router.patch("/:id/interest", authMiddleware,toggleInterest);


export default router;
