import mongoose from "mongoose";
import Message from "../models/message.js";
import Connection from "../models/connectionModel.js";
import { encryptText, decryptText } from "../utils/encrypt.js";
import { onlineUsers } from "../socketStore.js";
import { getIO } from "../socket.js";

/* -------------------------------------------------------
   SEND MESSAGE
------------------------------------------------------- */
export const sendMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    const file = req.file;

    if (!sender || !recipient || (!content?.trim() && !file)) {
      return res.status(400).json({
        message: "Sender, recipient, and content or file are required",
      });
    }

    let encryptedContent = null;
    let iv = null;
    let tag = null;

    if (content && content.trim()) {
      const encrypted = encryptText(content.trim());
      encryptedContent = encrypted.content;
      iv = encrypted.iv;
      tag = encrypted.tag;
    }

    const message = await Message.create({
      sender,
      recipient,
      content: encryptedContent,
      iv,
      tag,
      file: file ? file.path : null,
    });

    const fullMessage = await message.populate(
      "sender recipient",
      "name profileImage"
    );

    const payload = {
      ...fullMessage._doc,
      content: content ? content.trim() : "",
      file: file ? file.path : null,
    };

    // 🔒 Socket-safe emission
    let io = null;
    try {
      io = getIO();
    } catch {
      io = null;
    }

    if (io) {
      const recipientSocket = onlineUsers.get(recipient.toString());
      if (recipientSocket) {
        io.to(recipientSocket).emit("newMessage", payload);
      }

      const senderSocket = onlineUsers.get(sender.toString());
      if (senderSocket) {
        io.to(senderSocket).emit("newMessage", payload);
      }

      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }

    res.status(201).json(payload);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/* -------------------------------------------------------
   GET MESSAGES BETWEEN TWO USERS
------------------------------------------------------- */
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

    const decryptedMessages = messages.map((msg) => ({
      ...msg._doc,
      content: msg.content
        ? decryptText({ content: msg.content, iv: msg.iv, tag: msg.tag })
        : "",
    }));

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/* -------------------------------------------------------
   MARK MESSAGE AS READ
------------------------------------------------------- */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    let io = null;
    try {
      io = getIO();
    } catch {
      io = null;
    }

    if (io && message.sender) {
      const senderId = message.sender.toString();
      const senderSocket = onlineUsers.get(senderId);
      if (senderSocket) {
        io.to(senderSocket).emit("messageRead", message._id);
      }
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in markAsRead:", error);
    res.status(500).json({ message: "Failed to mark message as read" });
  }
};

/* -------------------------------------------------------
   GET CHAT LIST
------------------------------------------------------- */
export const getChatList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    }).populate("requester recipient", "_id name email profileImage");

    const validConnections = connections.filter(
      (c) => c.requester && c.recipient
    );

    if (!validConnections.length) {
      return res.status(200).json([]);
    }

    const connectedUserIds = validConnections.map((c) =>
      c.requester._id.equals(userId) ? c.recipient._id : c.requester._id
    );

    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId, recipient: { $in: connectedUserIds } },
            { recipient: userId, sender: { $in: connectedUserIds } },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$recipient",
              "$sender",
            ],
          },
          lastMessageDoc: { $first: "$$ROOT" },
        },
      },
    ]);

    const messageMap = new Map();
    lastMessages.forEach((m) =>
      messageMap.set(m._id.toString(), m.lastMessageDoc)
    );

    const chatList = validConnections.map((c) => {
      const chatPartner = c.requester._id.equals(userId)
        ? c.recipient
        : c.requester;

      const lastMessageData = messageMap.get(chatPartner._id.toString());
      let lastMessage = null;

      if (lastMessageData) {
        if (lastMessageData.file && !lastMessageData.content) {
          lastMessage = "📎 Attachment";
        } else {
          try {
            lastMessage = decryptText({
              content: lastMessageData.content,
              iv: lastMessageData.iv,
              tag: lastMessageData.tag,
            });
          } catch {
            lastMessage = "Unable to decrypt message";
          }
        }
      }

      return {
        chatWith: {
          _id: chatPartner._id,
          name: chatPartner.name,
          profileImage: chatPartner.profileImage,
        },
        email: chatPartner.email,
        lastMessage,
        lastMessageTime: lastMessageData?.createdAt || null,
      };
    });

    chatList.sort(
      (a, b) =>
        new Date(b.lastMessageTime || 0) -
        new Date(a.lastMessageTime || 0)
    );

    res.status(200).json(chatList);
  } catch (error) {
    console.error("Error in getChatList:", error);
    res.status(500).json({ message: "Failed to fetch chat list" });
  }
};
