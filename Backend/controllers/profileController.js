import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary"; // ✅ Crucial for deleting old images

// =================================================================
// 🛠️ HELPER: Extract Public ID from Cloudinary URL
// =================================================================
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    // Splits URL to find the part after the last slash and removes extension
    // Example: "https://.../campuspull_profiles/abc.jpg" -> "campuspull_profiles/abc"
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1]; 
    const fileName = lastPart.split(".")[0];
    const regex = /\/v\d+\/(.+)\.[a-z]+$/;
    const match = url.match(regex);
    return match ? match[1] : fileName;
  } catch (error) {
    console.error("Error extracting Public ID:", error);
    return null;
  }
};

// =================================================================
// ✅ MAIN CONTROLLERS
// =================================================================

// 1. Get logged-in user profile
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

// 2. Update logged-in user profile (Bulk Update)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Destructure ALL allowed fields
    const {
      name, bio, phone,
      department, section, year, // ✅ Added Academic Fields
      college, degree, graduationYear,
      linkedin, github, twitter, portfolio, // ✅ Added Socials
      profileImage,
      skills,
      projects,
      experience,
      education,
      certifications,
      designation, // For Teachers
      currentCompany // For Alumni
    } = req.body;

    const updateData = {
      name, bio, phone,
      department, section, year,
      college, degree, graduationYear,
      linkedin, github, twitter, portfolio,
      profileImage,
      skills,
      projects,
      experience,
      education,
      certifications,
      designation,
      currentCompany
    };

    // Clean up: Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

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

// 3. Toggle lesson completion status
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

// =================================================================
// 📸 UPLOAD PROFILE PHOTO (With Auto-Delete Old One)
// =================================================================
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const userId = req.user.id;
    const newImageUrl = req.file.path; // New Cloudinary URL

    // 1. Find the user to get the OLD image URL
    const user = await User.findById(userId);

    // 2. If an old image exists, DELETE it from Cloudinary
    if (user && user.profileImage) {
      const publicId = getPublicIdFromUrl(user.profileImage);
      if (publicId) {
        // We don't await this to speed up the response (Fire & Forget), 
        // or await it if you want strict safety.
        cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary delete error:", err));
      }
    }

    // 3. Save the NEW image URL to DB
    await User.findByIdAndUpdate(
      userId,
      { $set: { profileImage: newImageUrl } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Upload successful",
      url: newImageUrl,
      photoUrl: newImageUrl
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};

// =================================================================
// 🗑️ DELETE PROFILE PHOTO (Remove from Cloudinary + DB)
// =================================================================
export const deleteProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find User to get the URL
    const user = await User.findById(userId);
    
    if (!user || !user.profileImage) {
        return res.status(404).json({ message: "No profile image found" });
    }

    // 2. Delete from Cloudinary
    const publicId = getPublicIdFromUrl(user.profileImage);
    if (publicId) {
       await cloudinary.uploader.destroy(publicId);
    }

    // 3. Remove from MongoDB ($unset)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { profileImage: "" } },
      { new: true }
    ).select("profileImage");

    res.json({ message: "Profile photo deleted", user: updatedUser });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =================================================================
// 🚀 ARRAY CONTROLLERS (Skills, Projects, etc.)
// =================================================================

const ALLOWED_SECTIONS = ['projects', 'experience', 'education', 'certifications'];

// 1. SKILLS: ADD/APPEND
export const updateSkills = async (req, res) => {
  const { skills } = req.body;
  const userId = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { skills: { $each: skills } } },
      { new: true }
    ).select("skills");

    res.json(updatedUser.skills);
  } catch (error) {
    console.error("Error updating skills:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. SKILLS: DELETE SINGLE SKILL
export const deleteSkill = async (req, res) => {
  const { skillName } = req.params;
  const userId = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { skills: skillName } },
      { new: true }
    ).select("skills");

    res.json(updatedUser.skills);
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. GENERIC: ADD ITEM
export const addArrayItem = async (req, res) => {
  const { section } = req.params;
  const userId = req.user.id;

  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ message: `Invalid section. Allowed: ${ALLOWED_SECTIONS.join(', ')}` });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { [section]: req.body } },
      { new: true, runValidators: true }
    ).select(section);

    res.json(updatedUser[section]);
  } catch (error) {
    console.error(`Error adding to ${section}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

// 4. GENERIC: EDIT ITEM
export const updateArrayItem = async (req, res) => {
  const { section, itemId } = req.params;
  const userId = req.user.id;

  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ message: `Invalid section. Allowed: ${ALLOWED_SECTIONS.join(', ')}` });
  }

  const updateFields = {};
  for (const [key, value] of Object.entries(req.body)) {
    updateFields[`${section}.$.${key}`] = value;
  }

  try {
    const result = await User.findOneAndUpdate(
      { _id: userId, [`${section}._id`]: itemId },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select(section);

    if (!result) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item updated", data: result[section] });
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

// 5. GENERIC: DELETE ITEM
export const deleteArrayItem = async (req, res) => {
  const { section, itemId } = req.params;
  const userId = req.user.id;

  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ message: `Invalid section. Allowed: ${ALLOWED_SECTIONS.join(', ')}` });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { [section]: { _id: itemId } } },
      { new: true }
    ).select(section);

    res.json({ message: "Item deleted", data: updatedUser[section] });
  } catch (error) {
    console.error(`Error deleting from ${section}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};