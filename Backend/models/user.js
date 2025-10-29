import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin','teacher'], default: 'student', required: true },
  college: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  graduationYear: { type: Number, required: true },
  

  // Optional fields
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  profilePic: { type: String, default: '' }, // URL to profile picture

  

  completedLessons: {type: [{ type: mongoose.Schema.Types.ObjectId }],default: []},
  tokenVersion: { type: Number, default: 0 }, // for refresh token invalidation
}, { timestamps: true });

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export default mongoose.model('User', userSchema);
