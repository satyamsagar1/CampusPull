import Message from '../models/message.js';
import mongoose from 'mongoose';

// Send a message

export const sendMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    if (!sender || !recipient || !content || !content.trim()) {
      return res.status(400).json({ message: 'Sender, recipient, and non-empty content are required' });
    }
    const message = await Message.create({ sender, recipient, content: content.trim() });
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
      return res.status(400).json({ message: 'Both user IDs are required' });
    }
    const Messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },    
        { sender: userId2, recipient: userId1 }
      ]
    }).sort({ createdAt: 1 });
    res.json(Messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(Message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get chat list (last message with each user)
export const getChatList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const chatList = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { createdAt: -1 }, // sort newest first
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$recipient",
              "$sender",
            ],
          },
          lastMessage: { $first: "$content" },
          lastMessageId: { $first: "$_id" },
          lastMessageTime: { $first: "$createdAt" },
          sender: { $first: "$sender" },
          recipient: { $first: "$recipient" },
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
          chatWith: "$user._id",
          name: "$user.name",
          email: "$user.email",
          lastMessage: 1,
          lastMessageTime: 1,
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    res.status(200).json(chatList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

