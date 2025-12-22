import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // 1. Make text fields OPTIONAL (remove 'required: true')
  content: { type: String }, 
  iv: { type: String },
  tag: { type: String },

  // 2. Add the FILE field
  file: { type: String, default: null },

  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);