import crypto from "crypto";
import User from "../models/user.js";
import sendEmail from "../utils/sendEmail.js";

// --- 1. Send OTP (Logged In User) ---
export const passwordChange = async (req, res) => {
  try {
    // req.user.id comes from your authMiddleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP and save to DB (Reusing the resetPasswordToken field is smart)
    user.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    
    // We only save the specific fields modified to avoid validation errors on other fields
    await user.save({ validateBeforeSave: false });

    // Send Email
    const message = `
      <h1>Password Change Request</h1>
      <p>Your OTP for changing your password is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    `;

    try {
        await sendEmail({
        email: user.email,
        subject: 'CampusPull - Password Change OTP',
        message // Ensure sendEmail uses HTML!
        });

        res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (emailError) {
        console.error("Email Error:", emailError);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: "Email could not be sent" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// --- 2. Verify OTP & Update Password ---
export const verifyOtpAndChangePassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    
    if (!otp || !newPassword) {
      return res.status(400).json({ message: "Please provide OTP and new password" });
    }

    // 1. Find the logged-in user
    // Note: We don't need to select '+passwordHash' unless you set it to select: false in schema.
    // If it's visible by default, just findById is enough.
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Hash incoming OTP to compare
    const otpString = otp.toString();
    const hashedOtp = crypto.createHash('sha256').update(otpString).digest('hex');

    // 3. STRICT CHECK: Token Match & Expiry
    if (user.resetPasswordToken !== hashedOtp) {
       return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetPasswordExpire < Date.now()) {
       return res.status(400).json({ message: "OTP has expired" });
    }

    // 4. Update Password using your Model's method
    user.passwordHash = await User.hashPassword(newPassword);
    
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