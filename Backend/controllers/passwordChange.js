import crypto from "crypto";
import bcrypt from "bcryptjs"; // Make sure you have this installed
import User from "../models/user.js"; // Adjust path to your User model
import sendEmail from "../utils/sendEmail.js";

// 1. Send OTP
export const passwordChange = async (req, res) => {
  try {
    // Since the user is logged in, we get ID from req.user
    const user = await User.findById(req.user._id || req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP and save to DB
    user.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    
    await user.save();

    // Send Email
    const message = `Your OTP for password change is: ${otp}`;
    await sendEmail({
      email: user.email,
      subject: 'CampusPull Password Change Verification',
      message
    });

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Verify OTP & Update
export const verifyOtpAndChangePassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    
    if (!otp || !newPassword) {
      return res.status(400).json({ message: "Please provide OTP and new password" });
    }

    // 1. Find the logged-in user
    const user = await User.findById(req.user._id || req.user.id).select('+password +resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Force OTP to string before hashing (Fixes Number vs String issue)
    const otpString = otp.toString();
    const hashedOtp = crypto.createHash('sha256').update(otpString).digest('hex');

    // 3. STRICT CHECK: Does DB hash match incoming hash? Is it expired?
    if (user.resetPasswordToken !== hashedOtp) {
       return res.status(400).json({ message: "Invalid OTP provided" });
    }

    if (user.resetPasswordExpire < Date.now()) {
       return res.status(400).json({ message: "OTP has expired" });
    }

    // 4. Update Password (Manually hash it to be safe)
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    
    // 5. Clear OTP fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: error.message });
  }
};