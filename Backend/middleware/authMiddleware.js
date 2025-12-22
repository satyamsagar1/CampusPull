import jwt from "jsonwebtoken";

// Auth middleware
export const authMiddleware = (req, res, next) => {
  // 🚀 PRO LOGIC: Check Header first, then Cookie
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies) {
    token = req.cookies.linkmate_at;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.log("JWT Error:", err.name);
    // If it's expired, we send 401 so the frontend interceptor can catch it and refresh
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

export const refreshAuthMiddleware = (req, res, next) => {
  const token = req.cookies.linkmate_rft;
  if (!token) return res.status(401).json({ message: "Unauthorized. No refresh token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    console.log('[authMiddleware] Authentication successful for user:', req.user?.id);
    next();
  } catch (err) {
    console.log("JWT verification error:", err);
    console.error('[authMiddleware] Error:', err.message);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Require role middleware
export const requireRole = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden. Insufficient role." });
  }

  next();
};

export const authAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};
