import mongoose from "mongoose";
import Message from "../models/message.js";
import Connection from "../models/connectionModel.js";
import { encryptText, decryptText  } from "../utils/encrypt.js";
import { onlineUsers } from "../socketStore.js";

// --- Send a new message ---
export const sendMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    
    // ✅ FIX 1: Access the file uploaded by Multer
    const file = req.file; 

    // ✅ FIX 2: Allow message if either Content OR File exists
    if (!sender || !recipient || (!content?.trim() && !file)) {
      return res.status(400).json({ message: "Sender, recipient, and content OR file are required." });
    }

    let encryptedContent = null;
    let iv = null;
    let tag = null;

    // ✅ FIX 3: Only encrypt if there is actual text
    if (content && content.trim() !== "") {
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
      // ✅ FIX 4: Save the file path to the database
      file: file ? file.path : null, 
    });

    const fullMessage = await message.populate("sender recipient", "name profileImage");

    // Create a consistent payload with decrypted content for all clients
    const payload = {
      ...fullMessage._doc,
      content: content ? content.trim() : "", // Send empty string if no text
      file: file ? file.path : null,         // Send file path back to frontend
    };

    const io = req.app.get("io");

    // Emit the event to both the recipient and the sender
    const recipientSocket = onlineUsers.get(recipient.toString());
    if (recipientSocket) {
      io.to(recipientSocket).emit("newMessage", payload);
    }

    const senderSocket = onlineUsers.get(sender.toString());
    if (senderSocket) {
      io.to(senderSocket).emit("newMessage", payload);
    }

    // Update the global list of online users
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    res.status(201).json(payload);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- Get all messages in a conversation ---
export const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    if (!userId1 || !userId2) {
      return res.status(400).json({ message: "Both user IDs are required." });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    }).sort({ createdAt: 1 });

    const decryptedMessages = messages.map((msg) => ({
      ...msg._doc,
      // ✅ FIX 5: Only try to decrypt if content exists (prevents crash on file-only messages)
      content: msg.content 
        ? decryptText({ content: msg.content, iv: msg.iv, tag: msg.tag })
        : "", 
    }));

    res.json(decryptedMessages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- Mark a message as read ---
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    
    if (!message) {
      console.log("[DEBUG] Message not found in database.");
      return res.status(404).json({ error: "Message not found." });
    }

    const io = req.app.get("io");
    const senderId = message.sender.toString();

    const senderSocket = onlineUsers.get(senderId);
    
    if (senderSocket) {
      io.to(senderSocket).emit("messageRead", message._id);
    } else {
      console.log("[DEBUG] Sender is offline, cannot emit read receipt.");
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("CRITICAL ERROR in markAsRead:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- Get the user's list of chats ---
export const getChatList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    }).populate("requester recipient", "_id name email profileImage");

    const validConnections = connections.filter((c) => c.requester && c.recipient);

    if (validConnections.length === 0) {
      return res.status(200).json([]);
    }

    const connectedUserIds = validConnections.map((c) =>
      c.requester._id.equals(userId) ? c.recipient._id : c.requester._id
    );

    const lastMessages = await Message.aggregate([
      { $match: { $or: [{ sender: userId, recipient: { $in: connectedUserIds } }, { recipient: userId, sender: { $in: connectedUserIds } }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: { $cond: [{ $eq: ["$sender", userId] }, "$recipient", "$sender"] }, lastMessageDoc: { $first: "$$ROOT" } } },
    ]);

    const messageMap = new Map();
    lastMessages.forEach((m) => messageMap.set(m._id.toString(), m.lastMessageDoc));

    const chatList = validConnections.map((c) => {
      const chatPartner = c.requester._id.equals(userId) ? c.recipient : c.requester;
      const lastMessageData = messageMap.get(chatPartner._id.toString());
      let decryptedLastMessage = null;

      if (lastMessageData) {
         // ✅ FIX 6: Handle decryption for file-only messages in sidebar
        if (lastMessageData.file && !lastMessageData.content) {
            decryptedLastMessage = "📎 Attachment";
        } else {
            try {
              decryptedLastMessage = decryptText({
                content: lastMessageData.content,
                iv: lastMessageData.iv,
                tag: lastMessageData.tag,
              });
            } catch (decryptionError) {
              console.error(`Failed to decrypt message for chat with ${chatPartner.name}:`, decryptionError);
              decryptedLastMessage = "Error decrypting message";
            }
        }
      }

      return {
        chatWith: { _id: chatPartner._id, name: chatPartner.name, profileImage: chatPartner.profileImage },
        email: chatPartner.email,
        lastMessage: decryptedLastMessage,
        lastMessageTime: lastMessageData?.createdAt || null,
      };
    });

    chatList.sort((a, b) => {
      const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
      return timeB - timeA;
    });
    
    res.status(200).json(chatList);
  } catch (error) {
    console.error("Error in getChatList:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};