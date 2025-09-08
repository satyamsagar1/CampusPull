// controllers/communityController.js
import Question from "../models/questions.js";
import Answer from "../models/answer.js";

/* ------------------------ QUESTIONS ------------------------ */

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "name email")
      .populate({
        path: "answers",
        populate: { path: "author", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Create Question
export const createQuestion = async (req, res) => {
    console.log("REQ USER:", req.user); // 👈 debug

  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }
    if (title.length > 150) {
      return res.status(400).json({ message: "Title cannot exceed 150 characters" });
    }
    if (body.length > 1000) {
      return res.status(400).json({ message: "Body cannot exceed 1000 characters" });
    }

    const question = await Question.create({
      author: req.user.id,
      title,
      body,
      
    });

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
    const { title, body } = req.body;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this question" });
    }

    if (title) {
      if (title.length > 150) {
        return res.status(400).json({ message: "Title cannot exceed 150 characters" });
      }
      question.title = title;
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

    const alreadyUpvoted = question.upvotes.includes(userId);

    if (alreadyUpvoted) {
      // remove upvote
      question.upvotes.pull(userId);
    } else {
      // add upvote
      question.upvotes.push(userId);
    }

    await question.save();
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

    const alreadyUpvoted = answer.upvotes.includes(userId);

    if (alreadyUpvoted) {
      answer.upvotes.pull(userId);
    } else {
      answer.upvotes.push(userId);
    }

    await answer.save();
    res.status(200).json({ upvotes: answer.upvotes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

