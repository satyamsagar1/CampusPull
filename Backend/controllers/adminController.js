// controllers/adminController.js
import User from "../models/user.js";

// 1. Get Dashboard Stats (Cards)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Calculate date for 7 days ago
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const newUsersLastWeek = await User.countDocuments({
      createdAt: { $gte: lastWeek } // Users created after this date
    });

    res.status(200).json({
      totalUsers,
      newUsersLastWeek,
      // Add more metrics here later (e.g., totalPosts if you have a Post model)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// 2. Get All Users for Data Grid (Excel View)
export const getAllUsers = async (req, res) => {
  try {
    // .select('-password') excludes the password field for security
    // .sort({ createdAt: -1 }) shows newest users first
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// 3. Delete a User (Admin Action)
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};