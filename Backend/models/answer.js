import mongoose from "mongoose";

// --- Sub-schema for Replies ---
// Defines the structure of each reply object within the 'replies' array.
const ReplySchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500 // Replies are often shorter
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { // Use default timestamp for replies
    type: Date,
    default: Date.now
  },
  // Optional: Add upvotes for replies later if needed
  // upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});
// --- End Sub-schema ---


// --- Main Answer Schema ---
const AnswerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      maxlength: 1000 // Keep original max length for answers
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isAccepted: {
      type: Boolean,
      default: false,
    },
    // --- ADDED REPLIES ARRAY ---
    // This field will hold an array of reply documents based on ReplySchema
    replies: {
        type: [ReplySchema], // Use the defined sub-schema
        default: [] // Default to an empty array
    }
    // --- END ADDED REPLIES ---
  },
  {
    timestamps: true, // Adds createdAt and updatedAt for the main Answer
    toJSON: { virtuals: true }, // Keep virtuals if needed
    toObject: { virtuals: true }
  }
);

// Virtual field for number of upvotes on the main Answer
AnswerSchema.virtual("upvoteCount").get(function () {
  return this.upvotes.length;
});

export default mongoose.model("Answer", AnswerSchema);
