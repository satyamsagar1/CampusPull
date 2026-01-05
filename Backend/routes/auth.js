import { Router } from 'express';
import crypto from 'crypto'; // 🆕 Needed for token generation
import User from '../models/user.js';
import { signupSchema, loginSchema } from '../validators/authValidators.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/generateTokens.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js'; // 🆕 Import the utility

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

// --- 1. SIGNUP (Updated for Verification) ---
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

    const { email, password, ...rest } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    // 1. Generate Verification Token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const passwordHash = await User.hashPassword(password);

    // 2. Create User (NOT Verified yet)
    const userDoc = await User.create({
      ...rest,
      email,
      passwordHash,
      emailVerificationToken: verificationTokenHash,
      emailVerificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours
      isEmailVerified: false
    });

    // 3. Send Verification Email
    const verifyUrl = `${process.env.CLIENT_ORIGIN}/verify-email/${verificationToken}`;
    const message = `
      <h1>Welcome to CampusPull!</h1>
      <p>Please click the button below to verify your email address.</p>
      <a href="${verifyUrl}" clicktracking=off>Verify Email</a>
    `;

    try {
      await sendEmail({
        email: userDoc.email,
        subject: 'CampusPull - Verify your email',
        message, // Use HTML message
      });

      return res.status(201).json({
        message: "Registration successful! Please check your email to verify your account.",
      });

    } catch {
      // Rollback: Delete user if email fails
      await User.findByIdAndDelete(userDoc._id);
      return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
    }

  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --- 2. VERIFY EMAIL (New Route) ---
router.put('/verify-email/:token', async (req, res) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpire = undefined;
    await user.save();

   const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user, user.tokenVersion);

    res.cookie('linkmate_rft', refreshToken, refreshCookieOpts);
    res.cookie('linkmate_at', accessToken, accessCookieOpts);

    return res.status(200).json({ 
      success: true, 
      message: 'Email verified! Redirecting to homepage...',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken 
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// --- 3. LOGIN (Updated with Check) ---
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
    
    // Generic error message for security
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // 🆕 Check if verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Please verify your email to login.' });
    }

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

// --- 4. FORGOT PASSWORD (New Route) ---
router.post('/forgot-password', async (req, res) => { // Keep your limiter
  console.log("1. Forgot Password Route Hit!"); // 👈 LOG 1
  
  const { email } = req.body;
  console.log("2. Searching for email:", email); // 👈 LOG 2

  const user = await User.findOne({ email });

  if (user) {
    console.log("3. User FOUND:", user._id); // 👈 LOG 3

    // Generate Token
    const resetToken = user.getResetPasswordToken(); 
    await user.save({ validateBeforeSave: false });

    // Debug the URL being generated
    const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;
    console.log("4. Reset Link Generated:", resetUrl); // 👈 LOG 4

    const message = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    `;

    try {
      console.log("5. Attempting to send email via Nodemailer..."); // 👈 LOG 5
      await sendEmail({
        email: user.email,
        subject: "CampusPull Password Recovery",
        message,
      });
      console.log("6. Email sent successfully!"); // 👈 LOG 6
    } catch (err) {
      console.error("❌ EMAIL FAILED TO SEND:", err); // 👈 ERROR LOG
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } else {
    console.log("❌ User NOT FOUND in Database. Skipping email."); // 👈 LOG: MISSING USER
  }

  // Poker Face Response
  res.status(200).json({ success: true, message: "If an account exists, email sent." });
});

// --- 5. RESET PASSWORD (New Route) ---
router.put('/reset-password/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    if(req.body.password) {
        user.passwordHash = await User.hashPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(200).json({ success: true, message: "Password updated! Please login." });
    } else {
        return res.status(400).json({ message: "Password is required" });
    }

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// --- 6. REFRESH (Cleaned up - only ONE version) ---
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

// --- 7. ME & LOGOUT (Standard) ---
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
    res.clearCookie("linkmate_rft", refreshCookieOpts);
    res.clearCookie("linkmate_at", accessCookieOpts);
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error('Logout error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});



export default router;
