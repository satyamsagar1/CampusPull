import Message from "../models/message.js";
import mongoose from "mongoose";
import Connection from "../models/connectionModel.js"; // import your connection model

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    if (!sender || !recipient || !content?.trim()) {
      return res
        .status(400)
        .json({ message: "Sender, recipient, and non-empty content are required" });
    }

    const message = await Message.create({
      sender,
      recipient,
      content: content.trim(),
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    if (!userId1 || !userId2) {
      return res.status(400).json({ message: "Both user IDs are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat list (last message with each connected user)
export const getChatList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get accepted connections
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    });

    const connectedUserIds = connections.map((c) =>
      c.requester._id.equals(userId) ? c.recipient._id : c.requester._id
    );

    if (!connectedUserIds.length) return res.json([]);

    const chatList = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId, recipient: { $in: connectedUserIds } },
            { sender: { $in: connectedUserIds }, recipient: userId },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ["$sender", userId] }, "$recipient", "$sender"] },
          lastMessage: { $first: "$content" },
          lastMessageTime: { $first: "$createdAt" },
          lastMessageId: { $first: "$_id" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          chatWith: { _id: "$user._id", name: "$user.name" },
          email: "$user.email",
          lastMessage: 1,
          lastMessageTime: 1,
          lastMessageId: 1,
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    res.status(200).json(chatList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

