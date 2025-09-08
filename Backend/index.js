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



const app = express();

// middlewares for security, CORS, JSON parsing, and cookie parsing
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  // skip req.query
  next();
});
app.use(cookieParser());
app.use(generalrateLimiter);

app.get("/health",(_,res)=>res.json({ok:true,ts:Date.now()}));

//authemtication routes
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/signup", signupRateLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/community", communityRoutes);

const PORT = process.env.PORT || 4000;
conectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to the database", err);
});

