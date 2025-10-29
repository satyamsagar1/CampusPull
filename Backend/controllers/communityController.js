// controllers/communityController.js
import Question from "../models/questions.js";
import Answer from "../models/answer.js";
import mongoose from "mongoose";

const allowedRoles = new Set(['student', 'alumni']);

const isAuthorized = (req) => {
    // Admins are always authorized for full CRUD, otherwise check allowedRoles set
    return req.user.role === 'admin' || allowedRoles.has(req.user.role);
};
/* ------------------------ QUESTIONS ------------------------ */

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      // Populate question author
      .populate("author", "name email avatar verified") // Added avatar/verified
      // Populate answers
      .populate({
        path: "answers",
        options: { sort: { createdAt: -1 } }, // Optional: Sort answers, e.g., newest first
        // --- Populate within answers ---
        populate: [
            // Populate answer author
            { path: "author", select: "name email avatar verified" },
            // Populate the author for each reply within the replies array
            { path: "replies.author", select: "name email avatar verified" } // <-- THIS IS THE FIX
        ]
        // --- End populate within answers ---
      })
      .sort({ createdAt: -1 }); // Sort questions newest first

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
};
// Create Question
export const createQuestion = async (req, res) => {

  try {
    const { body, tags } = req.body;

    if (!isAuthorized(req)) {
            return res.status(403).json({ message: "Forbidden: Only Students or Alumni can post questions." });
        }

    if ( !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }
    if (body.length > 1000) {
      return res.status(400).json({ message: "Body cannot exceed 1000 characters" });
    }

    const question = await Question.create({
      author: req.user.id,
      body,
      tags: tags ? tags.map(tag => tag.trim().toLowerCase()) : [],
    });
    await question.populate('author', 'name email avatar verified');
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Questions

// Update Question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {  body } = req.body;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this question" });
    }

    if (body) {
      if (body.length > 1000) {
        return res.status(400).json({ message: "Body cannot exceed 1000 characters" });
      }
      question.body = body;
    }

    await question.save();
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this question" });
    }

    await Answer.deleteMany({ question: question.id }); // delete all answers too
    await question.deleteOne();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------ ANSWERS ------------------------ */

// Create Answer
export const createAnswer = async (req, res) => {
  try {
    if (!isAuthorized(req)) {
            return res.status(403).json({ message: "Forbidden: Only Students or Alumni can post answers." });
        }

    const { body } = req.body;
    const { questionId } = req.params;

    if (!body) return res.status(400).json({ message: "Answer cannot be empty" });
    if (body.length > 1000) {
      return res.status(400).json({ message: "Answer cannot exceed 1000 characters" });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = await Answer.create({
      author: req.user.id,
      question: question.id,
      body,
    });

    question.answers.push(answer.id);
    await question.save();
    await answer.populate('author', 'name email avatar verified');

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Answer
export const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    const answer = await Answer.findById(id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this answer" });
    }

    if (!body) return res.status(400).json({ message: "Answer body cannot be empty" });
    if (body.length > 1000) {
      return res.status(400).json({ message: "Answer cannot exceed 1000 characters" });
    }

    answer.body = body;
    await answer.save();

    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Answer
export const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);

    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this answer" });
    }

    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer.id },
    });

    await answer.deleteOne();

    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upvote a Question
export const toggleQuestionUpvote = async (req, res) => {
  try {
    const { id } = req.params; // question id
    const userId = req.user.id;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const updateOperation = question.upvotes.includes(userId)
            ? { $pull: { upvotes: userId } }
            : { $addToSet: { upvotes: userId } };
        
    const updatedQuestion = await Question.findByIdAndUpdate(id, updateOperation, { new: true }).lean();
        
    if (!updatedQuestion) return res.status(500).json({ message: "Failed to update upvote status." });
    res.status(200).json({ upvotes: question.upvotes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upvote an Answer
export const toggleAnswerUpvote = async (req, res) => {
  try {
    const { id } = req.params; // answer id
    const userId = req.user.id;

    const answer = await Answer.findById(id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const updateOperation = answer.upvotes.includes(userId)
            ? { $pull: { upvotes: userId } }
            : { $addToSet: { upvotes: userId } };
        
    const updatedAnswer = await Answer.findByIdAndUpdate(id, updateOperation, { new: true }).lean();
        
    if (!updatedAnswer) return res.status(500).json({ message: "Failed to update upvote status." });
    res.status(200).json({ upvotes: answer.upvotes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { answerId } = req.params; // Get the ID of the parent answer
    const { body } = req.body;       // Get the reply text
    const userId = req.user.id;      // Get the author's ID from authentication

    // 1. Validation
    if (!body?.trim()) {
      return res.status(400).json({ message: "Reply body cannot be empty." });
    }
    if (body.length > 500) { // Max length from ReplySchema
        return res.status(400).json({ message: "Reply cannot exceed 500 characters." });
    }
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(400).json({ message: "Invalid answer ID format." });
    }

    // 2. Create the reply object matching the sub-schema
    const replyData = {
        body: body.trim(),
        author: userId
        // createdAt is handled by default in the schema
    };

    // 3. Find the parent answer and push the new reply atomically
    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId, // ID of the document to update
      {
        $push: {
          replies: replyData // Push the created reply object into the 'replies' array
        }
      },
      { new: true } // Return the updated answer document after the push
    )
    // Populate the author details for all replies in the updated answer
    // Focus on populating the newly added reply's author if possible for efficiency,
    // but populating all is simpler for now.
    .populate('replies.author', '_id name avatar verified'); // Populate author fields within the replies array

    // 4. Check if the answer was found and updated
    if (!updatedAnswer) {
      return res.status(404).json({ message: "Parent answer not found." });
    }

    // 5. Respond with the full updated answer document (including the new reply)
    res.status(201).json(updatedAnswer);

  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ message: error.message || 'Server error creating reply.' });
  }
};
