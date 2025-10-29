import mongoose from "mongoose";

// BaseFields *without* title
const baseFields = {
  description: String,
  category: { type: String, enum: ["Notes", "Interview PYQ", "Roadmap"], required: true },
  tags: [String],
  thumbnail: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verified: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" ,default: [] }]
};

// Notes / PDFs (Title added back)
const notes = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ...baseFields,
    branch: String,
    semester: Number,
    link: { type: String, required: true }, // GCS / Drive link
    downloads: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    // Note: Bookmarks are already in baseFields, removed duplicate
  },
  { timestamps: true }
);

// Career Roadmaps (Title added back)
const roadmap = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ...baseFields,
    rating: { type: Number, default: 0 },
    // Note: Bookmarks are already in baseFields, removed duplicate
    modules: [
      {
        moduleTitle: { type: String, required: true }, // Module name
        moduleDescription: String,
        resources: [
          {
            title: { type: String, required: true }, // Lesson / video title
            link: { type: String, required: true },  // YouTube link
            description: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Interview PYQs (No title)
const pyq = new mongoose.Schema(
  {
    ...baseFields,
    company: { type: String, required: true }, // Company is now required
    year: Number,
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    link: String, // Optional GCS / Drive link
    downloads: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    // Note: Bookmarks are already in baseFields, removed duplicate
  },
  { timestamps: true }
);

export const Notes = mongoose.model("Notes", notes);
export const Roadmap = mongoose.model("Roadmap", roadmap);
export const InterviewPYQ = mongoose.model("InterviewPYQ", pyq);