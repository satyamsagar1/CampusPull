import User from "../models/user.js";

// ✅ Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findById(userId)
      .select('-passwordHash -tokenVersion') 
      .lean();

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
    const userId = req.user.id;

    // 1. Destructure ONLY the fields we allow users to update
    const {
      name, bio, phone,
      college, degree, graduationYear,
      linkedin, github, 
      profileImage, 
      skills,
      projects,
      experience,
      education,
      certifications // This array now contains objects with { name, provider, link }
    } = req.body;

    // 2. Build the update object
    const updateData = {
      name, bio, phone,
      college, degree, graduationYear,
      linkedin, github,
      profileImage,
      skills,
      projects,
      experience,
      education,
      certifications
    };

    // 3. Clean up: Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // 4. Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData }, 
      { new: true, runValidators: true }
    ).select('-passwordHash -tokenVersion');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);

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
    const user = await User.findById(userId).select('completedLessons').lean(); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCompleted = (user.completedLessons || []).some(
      (id) => id.toString() === lessonId.toString()
    );

    let updatedUser;
    
    if (isCompleted) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { completedLessons: lessonId } },
        { new: true }
      ).lean();
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { completedLessons: lessonId } },
        { new: true }
      ).lean();
    }

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user progress." });
    }
    
    res.status(200).json(updatedUser.completedLessons || []);

  } catch (error) {
    console.error("Error in toggleLessonProgress:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ✅ Upload Profile Picture Controller (ADDED THIS)
// This works with the route: router.post("/upload-photo", ...)
export const uploadProfileImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // The middleware (cloudinaryParser) puts the url in req.file.path
    const imageUrl = req.file.path; 

    res.json({ 
      success: true,
      message: "Upload successful", 
      url: imageUrl,     
      photoUrl: imageUrl 
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};