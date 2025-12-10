import User from "../models/user.js";

// =================================================================
// ✅ EXISTING CONTROLLERS (DO NOT TOUCH)
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

    // Destructure ONLY the fields we allow users to update
    const {
      name, bio, phone,
      college, degree, graduationYear,
      linkedin, github,
      profileImage,
      skills,
      projects,
      experience,
      education,
      certifications
    } = req.body;

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

// 4. Upload Profile Picture Controller
export const uploadProfileImage = async(req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = req.file.path;
    const userId = req.user.id;

    await User.findByIdAndUpdate(
      userId,
      { $set: { profileImage: imageUrl } },
      { new: true }
    );

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



const ALLOWED_SECTIONS = ['projects', 'experience', 'education', 'certifications'];

// 1. DELETE PROFILE PHOTO ONLY
// Route: DELETE /api/profile/photo
export const deleteProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    // We use $unset to completely remove the field
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

// 2. SKILLS: ADD/APPEND
// Route: POST /api/profile/skills
export const updateSkills = async (req, res) => {
  const { skills } = req.body; // Expecting { skills: ["Java", "React"] }
  const userId = req.user.id;

  try {
    // Uses $addToSet to add new skills without duplicates
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

// 3. SKILLS: DELETE SINGLE SKILL
// Route: DELETE /api/profile/skills/:skillName
export const deleteSkill = async (req, res) => {
  const { skillName } = req.params;
  const userId = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { skills: skillName } }, // Removes the specific string
      { new: true }
    ).select("skills");

    res.json(updatedUser.skills);
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 4. GENERIC: ADD ITEM (Project, Exp, etc.)
// Route: POST /api/profile/:section
export const addArrayItem = async (req, res) => {
  const { section } = req.params;
  const userId = req.user.id;

  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ message: `Invalid section. Allowed: ${ALLOWED_SECTIONS.join(', ')}` });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { [section]: req.body } }, // Pushes new object to array
      { new: true, runValidators: true }
    ).select(section);

    res.json(updatedUser[section]);
  } catch (error) {
    console.error(`Error adding to ${section}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

// 5. GENERIC: EDIT ITEM
// Route: PUT /api/profile/:section/:itemId
export const updateArrayItem = async (req, res) => {
  const { section, itemId } = req.params;
  const userId = req.user.id;

  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ message: `Invalid section. Allowed: ${ALLOWED_SECTIONS.join(', ')}` });
  }

  // Convert req.body to dot notation (e.g. "projects.$.title")
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

// 6. GENERIC: DELETE ITEM
// Route: DELETE /api/profile/:section/:itemId
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