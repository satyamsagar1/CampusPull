import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

import "dotenv/config";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import helmet from "helmet";
import http from "node:http";
import cookieParser from "cookie-parser";

// --- CONFIG & UTILS ---
import { connectDB } from "./config/db.js";
import { loginLimiter, signupRateLimiter } from "./middleware/rateLimiter.js";
import { initSocket } from "./socket.js"; // ✅ CLEAN IMPORT

// --- ROUTES ---
import authRoutes from "./routes/auth.js";
import feedRoutes from "./routes/feed.js";
import communityRoutes from "./routes/community.js";
import eventRoutes from "./routes/event.js";
import connectionRoutes from "./routes/connection.js";
import messageRoutes from "./routes/message.js";
import profileRoutes from "./routes/profile.js";
import resourceRoutes from "./routes/resource.js";
import announcementRoutes from './routes/announcement.js';
import notificationRoutes from "./routes/notification.js";
import adminRoutes from './routes/admin.js';
import { passwordChange } from './controllers/passwordChange.js';

const app = express();
const server = http.createServer(app);

// -------------------- MIDDLEWARES --------------------
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Sanitize inputs
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  next();
});

// Health Check
app.get("/health", (_, res) => res.json({ ok: true, ts: Date.now() }));

// -------------------- INITIALIZE SOCKET --------------------
initSocket(server); 

// -------------------- API ROUTES --------------------
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/signup", signupRateLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resources", resourceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admin', adminRoutes);
app.post('/api/password-change', passwordChange);

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 4005; 

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to the database", err);
    process.exit(1);
  }
};

startServer();