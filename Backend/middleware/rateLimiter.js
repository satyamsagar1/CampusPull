import rateLimit from "express-rate-limit";

 export const generalrateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes   
  limit: 1000, 
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs:  60 * 1000,
  limit: 100, // 5 login attempts
  message: "Too many login attempts, try again in 15 minutes.",
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const signupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  limit: 10,                 // 10 signups per IP per hour
  message: "Too many signup attempts, please try again later",
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
