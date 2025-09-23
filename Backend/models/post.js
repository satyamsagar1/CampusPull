import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  media: { type: String }, // Cloudinary URL
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      replies: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          text: String,
          likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
          createdAt: { type: Date, default: Date.now }
        }
      ],
      createdAt: { type: Date, default: Date.now }
    }
  ],
sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
sharedContent: String, // optional comment while sharing
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
