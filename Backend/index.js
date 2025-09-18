import "dotenv/config";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import { generalrateLimiter, loginLimiter, signupRateLimiter } from "./middleware/rateLimiter.js";
import cookieParser from "cookie-parser";
import { conectDB } from "./config/db.js";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import feedRoutes from "./routes/feed.js";
import communityRoutes from "./routes/community.js";
import eventRoutes from "./routes/event.js";
import connectionRoutes from "./routes/connection.js";
import messageRoutes from "./routes/message.js";
import profileRoutes from "./routes/profile.js";
import http from "http";
import {initSocket}  from "./socket.js";


const app = express();
const server = http.createServer(app);

// -------------------- MIDDLEWARES --------------------
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  next();
});
app.use(cookieParser());
// app.use(generalrateLimiter);

const io=initSocket(server);
app.set("io", io); // make io accessible in routes/controllers via req.app.get("io")

app.get("/health", (_, res) => res.json({ ok: true, ts: Date.now() }));

// Authentication routes
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/signup", signupRateLimiter);
app.use("/api/auth", authRoutes);

// Other routes
app.use("/api/feed", feedRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/profile", profileRoutes);

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;

conectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    // Handle port already in use
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Please stop the other process or change PORT in .env`);
        process.exit(1);
      } else {
        console.error("❌ Server error:", err);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to the database", err);
  });
