import jwt from "jsonwebtoken";

// Auth middleware
export const authMiddleware = (req, res, next) => {
  

  const token = req.cookies.linkmate_at;
 

  if (!token) return res.status(401).json({ message: "Unauthorized. No token." });

  

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // attach user info
    
    next();
  } catch (err) {
    console.log("JWT verification error:", err.name, err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
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
