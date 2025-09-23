import Post from "../models/post.js";
import cloudinary from "../config/cloudinary.js";

// ------------------- GET FEED -------------------
export const getFeed = async (req, res) => {
  try {
    // Fetch posts, populate authors, comments, replies, and original posts if shared
    const posts = await Post.find()
      .populate("author", "name role")
      .populate({
        path: "comments.user",
        select: "name role"
      })
      .populate({
        path: "comments.replies.user",
        select: "name role"
      })
      .populate({
        path: "originalPost",
        populate: { path: "author", select: "name role" }
      })
      .sort({ createdAt: -1 })
      .lean();

    // Format posts with likesCount, commentsCount, sharedCount, comment/reply likesCount
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const sharedCount = await Post.countDocuments({ originalPost: post._id });

        // Format comments and replies with likesCount
        const formattedComments = post.comments.map((c) => ({
          ...c,
          likesCount: c.likes?.length || 0,
          replies: c.replies?.map((r) => ({
            ...r,
            likesCount: r.likes?.length || 0
          })) || []
        }));

        return {
          ...post,
          likesCount: post.likes?.length || 0,
          commentsCount: post.comments?.length || 0,
          sharedCount,
          comments: formattedComments
        };
      })
    );

    res.json(formattedPosts);
  } catch (err) {
    console.error("[FeedController] Get Feed Error:", err);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};


// ------------------- CREATE POST -------------------
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const trimmedContent = content?.trim();

    // Require either content or media
    if (!trimmedContent && !req.file)
      return res.status(400).json({ error: "Content or media required" });

    if (trimmedContent?.length > 500)
      return res.status(400).json({ error: "Content too long" });

    const post = await Post.create({
      author: req.user.id,
      content: trimmedContent || "",
      media: req.file?.path || null, // MulterStorage uploads automatically
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("[FeedController] Create Post Error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// ------------------- UPDATE POST -------------------
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const trimmedContent = content?.trim();
    if (!trimmedContent && !req.file)
      return res.status(400).json({ error: "Content or media required" });

    if (trimmedContent?.length > 500)
      return res.status(400).json({ error: "Content too long" });

    // Update content
    if (trimmedContent) post.content = trimmedContent;

    // Update media
   if (req.file) {
  // Delete old media if exists
    if (post.media?.includes("linkmate_posts")) {
      try {
      const publicId = post.media?.split("/").pop()?.split(".")[0];
      await cloudinary.uploader.destroy(`linkmate_posts/${publicId}`);
      } catch (err) {
      console.warn("[FeedController] Failed to delete old media:", err.message);
      }
    }

      post.media = req.file.path;
    }


    await post.save();
    res.json(post);
  } catch (err) {
    console.error("[FeedController] Update Post Error:", err);
    res.status(500).json({ error: "Failed to update post" });
  }
};

// ------------------- DELETE POST -------------------
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete media if exists
    if (post.media?.includes("linkmate_posts")) {
      try {
        const publicId = post.media.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`linkmate_posts/${publicId}`);
      } catch (err) {
        console.warn("[FeedController] Failed to delete media:", err.message);
      }
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("[FeedController] Delete Post Error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// ------------------- LIKE POST -------------------
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.likes?.includes(userId)) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter(u => u.toString() !== userId);
    }

    await post.save();
    res.json({ likesCount: post.likes.length });
  } catch (err) {
    console.error("[FeedController] Like Post Error:", err);
    res.status(500).json({ error: "Failed to like/unlike post" });
  }
};

// ------------------- COMMENT POST -------------------
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text?.trim())
      return res.status(400).json({ error: "Comment required" });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const populatedPost = await post.populate("comments.user", "name role");
    res.json(populatedPost.comments);
  } catch (err) {
    console.error("[FeedController] Comment Post Error:", err);
    res.status(500).json({ error: "Failed to comment on post" });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (replyId) {
      const reply = post.comments.id(commentId).replies.id(replyId);
      if (!reply) return res.status(404).json({ error: "Reply not found" });

      if (!reply.likes.includes(userId)) reply.likes.push(userId);
      else reply.likes = reply.likes.filter(u => u.toString() !== userId);
    } else {
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ error: "Comment not found" });

      if (!comment.likes.includes(userId)) comment.likes.push(userId);
      else comment.likes = comment.likes.filter(u => u.toString() !== userId);
    }

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error("[FeedController] Like Comment Error:", err);
    res.status(500).json({ error: "Failed to like comment" });
  }
};


export const replyToComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "Reply required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const parentComment = post.comments.id(commentId);
    if (!parentComment) return res.status(404).json({ error: "Comment not found" });

    parentComment.replies.push({ user: req.user.id, text });
    await post.save();

    const populated = await post.populate("comments.user comments.replies.user");
    res.json(populated.comments);
  } catch (err) {
    console.error("[FeedController] Reply Error:", err);
    res.status(500).json({ error: "Failed to reply to comment" });
  }
};


export const sharePost = async (req, res) => {
  try {
    const { id } = req.params; // original post id
    const { sharedContent } = req.body;

    const original = await Post.findById(id);
    if (!original) return res.status(404).json({ error: "Original post not found" });

    const sharedPost = await Post.create({
      author: req.user.id,
      sharedBy: req.user.id,
      originalPost: original._id,
      sharedContent: sharedContent || "",
    });

    res.status(201).json(sharedPost);
  } catch (err) {
    console.error("[FeedController] Share Post Error:", err);
    res.status(500).json({ error: "Failed to share post" });
  }
};

