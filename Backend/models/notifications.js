// backend/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    type: {
      type: String,
      enum: [
        "connection_request",   // New connection request    
        "connection_accepted", // Connection request accepted
        "message",            // New message from a connection   
        "new_post",          // New post from connected user
        "post_like",         // Someone liked your post
        "comment_reply",     // Someone replied to your comment/contribution
        "new_event",         // Admin created an event
        "new_resource",      // New resource uploaded
        "announcement"       // System announcement
      ],
      required: true,
    },
    message: { type: String, required: true }, 
    
    // The "Chameleon" Field: It changes meaning based on 'type'
    relatedId: { 
      type: mongoose.Schema.Types.ObjectId, 
      // No 'ref' here because it can be a Post, Event, or Resource
    },
    
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.model("Notification", notificationSchema);

