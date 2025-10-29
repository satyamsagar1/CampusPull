// controllers/announcement.controller.js
import Announcement from '../models/announcement.js';
import mongoose from 'mongoose';

// --- Create Announcement ---
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, important } = req.body;
    const userId = req.user.id; // From authMiddleware
    const attachmentFile = req.file;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newAnnouncement = await Announcement.create({
      title,
      content,
      important: important || false,
      createdBy: userId,
      attachmentUrl: attachmentFile ? attachmentFile.path : null,
    });

    // Populate createdBy field before sending back
    await newAnnouncement.populate('createdBy', '_id name avatar verified');

    res.status(201).json(newAnnouncement);

  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: 'Server error creating announcement.' });
  }
};

// --- Get All Announcements ---
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', '_id name avatar verified') // Populate user details
      .sort({ important: -1, createdAt: -1 }); // Show important ones first, then newest

    res.status(200).json(announcements);

  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: 'Server error fetching announcements.' });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, important } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const attachmentFile = req.file; // Check for new attachment

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid announcement ID format.' });
    }

    // Basic input validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    // Authorization check: Must be admin or the original creator
    if (userRole !== 'admin' && announcement.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to edit this announcement.' });
    }

    // Update fields
    announcement.title = title;
    announcement.content = content;
    announcement.important = important !== undefined ? important : announcement.important; // Handle boolean update
    if (attachmentFile) {
      announcement.attachmentUrl = attachmentFile.path;
    }

    const updatedAnnouncement = await announcement.save();
    // Populate createdBy for the response
    await updatedAnnouncement.populate('createdBy', '_id name avatar verified');

    res.status(200).json(updatedAnnouncement);

  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: 'Server error updating announcement.' });
  }
};

// --- Delete Announcement ---
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid announcement ID format.' });
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    // Authorization check: Must be admin or the original creator
    if (userRole !== 'admin' && announcement.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to delete this announcement.' });
    }

    // TODO: Optionally delete the attachment file from Cloudinary

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({ message: 'Announcement deleted successfully.' });

  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: 'Server error deleting announcement.' });
  }
};