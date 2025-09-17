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
import { Server } from "socket.io";
import http from "http";
import Message from "./models/message.js"; // import Message model

const app = express();
const server = http.createServer(app);

// -------------------- MIDDLEWARES --------------------
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  next();
});
app.use(cookieParser());
app.use(generalrateLimiter);

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

// -------------------- SOCKET.IO --------------------
const io = new Server(server, {
  cors: {
    origin: "*", // replace with frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Store connected users
let onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers.set(userId, socket.id);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  }

  // Receive and forward messages
  socket.on("sendMessage", (msg) => {
    const recipientSocket = onlineUsers.get(msg.recipient);
    if (recipientSocket) {
      io.to(recipientSocket).emit("newMessage", msg);
    }
  });

  // Message read event
  socket.on("messageRead", async (messageId) => {
    try {
      const message = await Message.findById(messageId);
      if (message) {
        const senderSocket = onlineUsers.get(message.sender.toString());
        if (senderSocket) {
          io.to(senderSocket).emit("messageRead", messageId);
        }
      }
    } catch (err) {
      console.error("Error in messageRead socket:", err.message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;

conectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
