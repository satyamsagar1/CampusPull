import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// --- 1. Define Sub-Schemas for the Profile Lists ---
// These match the fields your Frontend is sending.

const ProjectSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  link: { type: String, trim: true } // Optional: for GitHub/Live links
});

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, trim: true },
  company: { type: String, trim: true }, // Good to have, even if UI doesn't ask yet
  description: { type: String, trim: true },
  year: { type: String, trim: true }
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String, trim: true },
  institution: { type: String, trim: true },
  year: { type: String, trim: true }
});

const CertificationSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  provider: { type: String, trim: true },
  date: { type: String, trim: true },
   link: { type: String, trim: true }
});

// --- 2. Main User Schema ---

const userSchema = new mongoose.Schema({
  // Identity & Auth
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin', 'teacher'], default: 'student', required: true },
  
  // Basic Academic Info (From Signup)
  college: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  graduationYear: { type: Number, required: true },

  // Profile Details
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' }, // Added for your Github icon
  bio: { type: String, default: '' },
  profileImage: { type: String, default: '' }, 

  // New Arrays (The new features)
  skills: { type: [String], default: [] },
  projects: { type: [ProjectSchema], default: [] },
  experience: { type: [ExperienceSchema], default: [] },
  education: { type: [EducationSchema], default: [] }, // Detailed history
  certifications: { type: [CertificationSchema], default: [] },

  // Gamification & System
  streakCount: { type: Number, default: 0 },
  completedLessons: { type: [{ type: mongoose.Schema.Types.ObjectId }], default: [] },
  tokenVersion: { type: Number, default: 0 }, 
}, { timestamps: true });

// --- Methods ---

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export default mongoose.model('User', userSchema);