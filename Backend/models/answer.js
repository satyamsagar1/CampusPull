import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
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
        ref: "User", // track which users upvoted
      },
    ],
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
   { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for number of upvotes
AnswerSchema.virtual("upvoteCount").get(function () {
  return this.upvotes.length;
});

export default mongoose.model("Answer", AnswerSchema);
