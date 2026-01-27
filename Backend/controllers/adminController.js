// controllers/adminController.js
import User from "../models/user.js";

// 1. Get Dashboard Stats (Cards)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const newUsersLastWeek = await User.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    res.status(200).json({
      totalUsers,
      newUsersLastWeek,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// 2. Get All Users with Optional Year Filter
// controllers/adminController.js

export const getAllUsers = async (req, res) => {
  try {
    const { year, graduationYear } = req.query;
    let query = {};

    // Check that it exists, isn't 'all', and isn't the literal string 'undefined'
    if (year && year !== 'all' && year !== 'undefined') {
      const yearNum = Number(year);
      if (!isNaN(yearNum)) {
        query.year = yearNum;
      }
    }

    if (graduationYear && graduationYear !== 'all' && graduationYear !== 'undefined') {
      const gradYearNum = Number(graduationYear);
      if (!isNaN(gradYearNum)) {
        query.graduationYear = gradYearNum;
      }
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};
// 3. Delete a User
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};