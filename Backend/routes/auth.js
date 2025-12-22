import { Router } from 'express';
import User from '../models/user.js';
import { signupSchema, loginSchema } from '../validators/authValidators.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/generateTokens.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const isProd = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
};

const refreshCookieOpts = { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 };
const accessCookieOpts = { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 };

// --- SIGNUP ---
router.post('/signup', async (req, res) => {
  try {
    req.body.college = "ABESIT";
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    // 🚀 Professional Pattern: Destructure password out, use ...rest for the 20+ other fields
    const { email, password, ...rest } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await User.hashPassword(password);

    const userDoc = await User.create({
      ...rest,
      email,
      passwordHash,
    });

    const accessToken = signAccessToken(userDoc);
    const refreshToken = signRefreshToken(userDoc, userDoc.tokenVersion);

    res.cookie('linkmate_rft', refreshToken, refreshCookieOpts);
    res.cookie('linkmate_at', accessToken, accessCookieOpts);

    // Filter out sensitive data
    const { passwordHash: _, tokenVersion: __, ...userResponse } = userDoc.toObject();

    return res.status(201).json({
      message: "Join CampusPull journey started! 🚀",
      user: userResponse,
      accessToken,
    });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --- REFRESH ---
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.linkmate_rft;
    if (!token) return res.status(401).json({ message: 'Missing refresh token' });

    const payload = verifyRefreshToken(token); 
    const user = await User.findById(payload.id);

    if (!user || payload.tv !== user.tokenVersion) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user, user.tokenVersion);

    res.cookie('linkmate_rft', newRefresh, refreshCookieOpts);
    res.cookie("linkmate_at", newAccess, accessCookieOpts);

    return res.json({ accessToken: newAccess });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
});

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
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, completedLessons: user.completedLessons },
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

    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        if (payload?.id) {
          await User.findByIdAndUpdate(payload.id, { $inc: { tokenVersion: 1 } });
        }
      } catch {}
    }

    // use EXACT cookie opts used during creation
    res.clearCookie("linkmate_rft", refreshCookieOpts);
    res.clearCookie("linkmate_at", accessCookieOpts);

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");

    return res.json({ message: "Logged out" });

  } catch (err) {
    console.error('Logout error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


export default router;
