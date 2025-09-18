import Message from "../models/message.js";
import mongoose from "mongoose";
import Connection from "../models/connectionModel.js";
import User from "../models/user.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    if (!sender || !recipient || !content?.trim()) {
      return res.status(400).json({ message: "Sender, recipient, and non-empty content are required" });
    }

    const message = await Message.create({
      sender,
      recipient,
      content: content.trim(),
    });

    const fullMessage = await message
  .populate("sender", "name")
  .populate("recipient", "name");

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers"); // store onlineUsers map globally in server

    // Emit to recipient if online
    const recipientSocket = onlineUsers.get(recipient.toString());
    if (recipientSocket) io.to(recipientSocket).emit("newMessage", fullMessage);

    // Emit to sender for instant update
    const senderSocket = onlineUsers.get(sender.toString());
    if (senderSocket) io.to(senderSocket).emit("newMessage", fullMessage);

    // Update online users globally
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    res.status(201).json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    if (!userId1 || !userId2) return res.status(400).json({ message: "Both user IDs are required" });

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
    if (!message) return res.status(404).json({ error: "Message not found" });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const senderSocket = onlineUsers.get(message.sender.toString());
    if (senderSocket) io.to(senderSocket).emit("messageRead", message._id);

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat list (all connected users with last message if exists)
export const getChatList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id.toString());

    // Get accepted connections
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    });

    const connectedUserIds = connections.map((c) =>
      c.requester._id.equals(userId) ? c.recipient._id : c.requester._id
    );

    // Fetch last message per connected user
    const messages = await Message.aggregate([
      { $match: { $or: [ { sender: userId, recipient: { $in: connectedUserIds } }, { sender: { $in: connectedUserIds }, recipient: userId } ] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: { $cond: [ { $eq: ["$sender", userId] }, "$recipient", "$sender" ] }, lastMessage: { $first: "$content" }, lastMessageTime: { $first: "$createdAt" }, lastMessageId: { $first: "$_id" } } },
    ]);

    // Map messages by userId
    const msgMap = new Map();
    messages.forEach(m => msgMap.set(m._id.toString(), m));

    // Prepare chat list with all connected users
    const users = await User.find({ _id: { $in: connectedUserIds } }).select("_id name email");
    const chatList = users.map(u => {
      const m = msgMap.get(u._id.toString());
      return {
        chatWith: { _id: u._id, name: u.name },
        email: u.email,
        lastMessage: m?.lastMessage || null,
        lastMessageTime: m?.lastMessageTime || null,
        lastMessageId: m?.lastMessageId || null,
      };
    }).sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));

    res.status(200).json(chatList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
