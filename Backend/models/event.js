// models/event.model.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  media: { type: String, default: null },
  mediaPublicId: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  registrationLink: { // Link to the external form
    type: String,
    trim: true,
    default: null,
  },
  isCompulsory: { // Flag for mandatory attendance
    type: Boolean,
    default: false,
  },
  interestCount: { // Separate count field
    type: Number,
    default: 0,
    min: 0
  },
  interestedUsers: [{ // Separate array field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [] // Add default empty array
  }],
},
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);