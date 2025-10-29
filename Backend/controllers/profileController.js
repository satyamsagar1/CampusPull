
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
// ✅ Toggle lesson completion status
export const toggleLessonProgress = async (req, res) => {
  const { lessonId } = req.body;
  const userId = req.user.id;

  if (!lessonId) {
    return res.status(400).json({ message: "lessonId is required" });
  }

  try {
    // 1. Find the user to check the current state
    // We select completedLessons and use lean() for faster read access
    const user = await User.findById(userId).select('completedLessons').lean(); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if the lesson is already completed (comparing ObjectId strings)
    const isCompleted = (user.completedLessons || []).some(
      (id) => id.toString() === lessonId.toString()
    );

    let updatedUser;
    
    // 3. Perform atomic update based on current state
    if (isCompleted) {
      // --- ACTION: REMOVE (PULL) ---
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { completedLessons: lessonId } }, // Atomically remove the ID
        { new: true } // Return the document AFTER update
      ).lean();

    } else {
      // --- ACTION: ADD (ADDTOSET) ---
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { completedLessons: lessonId } }, // Atomically add the ID uniquely
        { new: true }
      ).lean();
    }

    if (!updatedUser) {
        // This is a safety check for unexpected Mongoose failure
        return res.status(500).json({ message: "Failed to update user progress." });
    }
    
    // 4. Return the new array state for frontend context update
    res.status(200).json(updatedUser.completedLessons || []);

  } catch (error) {
    console.error("Error in toggleLessonProgress:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};