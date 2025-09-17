
import User from "../models/user.js";

// ✅ Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch full user data from database
    const user = await User.findById(userId).lean(); // lean() returns a plain JS object

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user); 
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update logged-in user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;
      user.college = req.body.college || user.college;
      user.skills = req.body.skills || user.skills;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
