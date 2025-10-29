// models/announcement.model.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  important: {
    type: Boolean,
    default: false,
  },
  attachmentUrl: {
    type: String, // Store the URL of the uploaded file (e.g., from Cloudinary)
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);