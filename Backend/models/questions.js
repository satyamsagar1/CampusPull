import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    
    body: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Track users who upvoted
      },
    ],
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
  },
   { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
   }
);

// Virtual field for number of upvotes
QuestionSchema.virtual("upvoteCount").get(function () {
  return this.upvotes.length;
});

export default mongoose.model("Question", QuestionSchema);
