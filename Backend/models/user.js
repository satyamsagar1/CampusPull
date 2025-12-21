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
  // --- 1. Identity & Auth ---
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  role: { 
    type: String, 
    enum: ['student', 'alumni', 'admin', 'teacher'], 
    default: 'student', 
    required: true 
  },
  isVerified: { type: Boolean, default: false }, // 🆕 Crucial for Alumni/Teachers

  // --- 2. Academic Info (CONDITIONAL) ---
  college: { type: String, required: true, trim: true }, // Everyone needs this
  department: { type: String, required: true, trim: true }, // Everyone needs this (e.g. CSE)
  
  // Only for Students & Alumni
  degree: { 
    type: String, 
    trim: true,
    required: function() { return this.role === 'student' || this.role === 'alumni'; } 
  },

  // Only for Students
  section: { 
    type: String, // Changed to lowercase 'section' for consistency
    trim: true,
    required: function() { return this.role === 'student'; }
  },
  year: { 
    type: Number, // Current Year (1, 2, 3, 4)
    required: function() { return this.role === 'student'; }
  },

  // Only for Student (Expected) & Alumni (Actual)
  graduationYear: { 
    type: Number, 
    required: function() { return this.role === 'student' || this.role === 'alumni'; }
  },

  // 🆕 Only for Teachers
  designation: {
    type: String, // e.g. "Assistant Professor", "HOD", "Lab Assistant"
    trim: true,
    required: function() { return this.role === 'teacher'; }
  },
  employeeId: { // 🆕 For backend verification
    type: String,
    trim: true,
    select: false // Don't return this in API responses by default
  },

  // --- 3. Profile Details ---
  headline: { type: String, trim: true, default: '' }, // 🆕 "MERN Stack Developer | Final Year"
  bio: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  location: { type: String, default: '' }, // 🆕 e.g., "Noida, India"
  
  // Socials
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  twitter: { type: String, default: '' }, // 🆕 Good for tech community
  portfolio: { type: String, default: '' }, // 🆕 Personal Website URL

  // --- 4. Arrays (Your features) ---
  skills: { type: [String], default: [] },
  projects: { type: [ProjectSchema], default: [] },
  experience: { type: [ExperienceSchema], default: [] },
  education: { type: [EducationSchema], default: [] },
  certifications: { type: [CertificationSchema], default: [] },

  // --- 5. Gamification & System ---
  streakCount: { type: Number, default: 0 },
  completedLessons: { type: [{ type: mongoose.Schema.Types.ObjectId }], default: [] },
  savedPosts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], default: [] }, // 🆕 To save useful posts
  
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