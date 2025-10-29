import { Router } from 'express';
import User from '../models/user.js';
import { signupSchema, loginSchema } from '../validators/authValidators.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/generateTokens.js';
import {authMiddleware, requireRole} from '../middleware/authMiddleware.js';

const router = Router();

// Cookie options for refresh token
const isProd = process.env.NODE_ENV === "production";

const refreshCookieOpts = {
  httpOnly: true,
  secure: isProd,               // ✅ true in production, false in localhost
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const accessCookieOpts = {
  httpOnly: true,
  secure: isProd,               // ✅ true in production
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

// --- SIGNUP ROUTE (updated) ---
router.post('/signup', async (req, res) => {
 
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: parsed.error?.errors, // <--- updated for cleaner errors
      });
    }

    const { name, email, password, role, college, degree, graduationYear, phone, linkedin, bio, skills } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await User.hashPassword(password);

    // <--- added all new fields here
    const userDoc = await User.create({
      name, email, passwordHash, role, college, degree, graduationYear,
       phone, linkedin, bio, skills
    });

    const user = userDoc.toObject(); // <--- convert Mongoose doc to plain object

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id, user.tokenVersion);

    res.cookie('linkmate_rft', refreshToken, refreshCookieOpts);
    res.cookie('linkmate_at', accessToken, accessCookieOpts);

    return res.status(201).json({
      user: {
        id: user._id.toString(), // <--- fixed missing ()
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        phone: user.phone,
        linkedin: user.linkedin,
        bio: user.bio,
        skills: user.skills,
      },
      accessToken,
    });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --- LOGIN, REFRESH, LOGOUT remain the same ---
router.post('/login', async (req, res) => {
  try { 
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        message: 'Invalid input', 
        errors: parsed.error?.errors,
      });
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, user.tokenVersion);

    res.cookie('linkmate_rft', refreshToken, refreshCookieOpts);
    res.cookie('linkmate_at', accessToken, accessCookieOpts);
    

    return res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, completedLessons: user.completedLessons },
      accessToken,
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.linkmate_rft;
     if (!token) {
      return res.status(401).json({ message: 'Missing refresh token' });
    }
    const payload = verifyRefreshToken(token); // throws on invalid
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Refresh token rotation guard
    if (payload.tv !== user.tokenVersion) return res.status(401).json({ message: 'Refresh token revoked' });

    const userDoc = await User.findById(payload.id)
    const newAccess = signAccessToken(userDoc);
    const newRefresh = signRefreshToken(userDoc, user.tokenVersion);
    res.cookie('linkmate_rft', newRefresh, refreshCookieOpts);
    res.cookie("linkmate_at", newAccess, accessCookieOpts);

    return res.json({ accessToken: newAccess });
  } catch (err) {
    console.error('Refresh error', err);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -tokenVersion');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ user });
  } catch (err) {
    console.error('Me endpoint error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.linkmate_rft;

    // Invalidate tokenVersion if token exists
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        if (payload?.sub) await User.findByIdAndUpdate(payload.sub, { $inc: { tokenVersion: 1 } });
      } catch {
        // invalid token, ignore
      }
    }

     // Clear cookies explicitly for localhost and production
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    };

    res.clearCookie("linkmate_rft", cookieOptions);
    res.clearCookie("linkmate_at", cookieOptions);

    // Prevent caching
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
