import { Router } from 'express';
import User from '../models/user.js';
import { signupSchema, loginSchema } from '../validators/authValidators.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/generateTokens.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const isProd = process.env.NODE_ENV === "production";

// Unified Cookie Configuration
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
    req.body.college = "ABESIT"; // Enforcement
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors, // Cleaner error format for frontend
      });
    }

    const { email, password, ...rest } = parsed.data;

    // Check existence early
    const exists = await User.findOne({ email }).select('_id');
    if (exists) return res.status(409).json({ message: 'This email is already registered, buddy.' });

    const passwordHash = await User.hashPassword(password);

    const userDoc = await User.create({
      ...rest,
      email,
      passwordHash,
    });

    const user = userDoc.toObject();
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id, user.tokenVersion);

    res.cookie('linkmate_rft', refreshToken, refreshCookieOpts);
    res.cookie('linkmate_at', accessToken, accessCookieOpts);

    // Remove sensitive data before sending
    const { passwordHash: _, tokenVersion: __, ...userResponse } = user;

    return res.status(201).json({
      message: "Account created successfully!",
      user: userResponse,
      accessToken,
    });
  } catch (err) {
    console.error('❌ Signup Error:', err.message);
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate data detected.' });
    return res.status(500).json({ message: 'Internal server error. Try again later.' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Invalid input data.' });

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });

    // Professional Tip: Use generic messages for login failures to prevent user enumeration
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, user.tokenVersion);

    res.cookie('linkmate_rft', refreshToken, refreshCookieOpts);
    res.cookie('linkmate_at', accessToken, accessCookieOpts);

    return res.json({
      message: `Welcome back, ${user.name.split(' ')[0]}!`,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// --- REFRESH ---
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.linkmate_rft;
    if (!token) return res.status(401).json({ message: 'Session expired. Please login again.' });

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);

    if (!user || payload.tv !== user.tokenVersion) {
      // If token version doesn't match, someone might be trying a replay attack
      return res.status(401).json({ message: 'Security alert: Refresh token revoked.' });
    }

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user, user.tokenVersion);

    res.cookie('linkmate_rft', newRefresh, refreshCookieOpts);
    res.cookie("linkmate_at", newAccess, accessCookieOpts);

    return res.json({ accessToken: newAccess });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid session.' });
  }
});

// --- LOGOUT ---
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.linkmate_rft;
    if (token) {
      const payload = verifyRefreshToken(token);
      if (payload?.id) {
        // Increment token version to invalidate all current refresh tokens (Security Best Practice)
        await User.findByIdAndUpdate(payload.id, { $inc: { tokenVersion: 1 } });
      }
    }
  } catch (err) {
    // Fail silently on logout token errors
  } finally {
    res.clearCookie("linkmate_rft", refreshCookieOpts);
    res.clearCookie("linkmate_at", accessCookieOpts);
    return res.json({ message: "Successfully logged out. See you soon, buddy!" });
  }
});

export default router;