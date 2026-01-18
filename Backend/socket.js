import "dotenv/config";
import { Server } from "socket.io";
import { onlineUsers } from "./socketStore.js"; // Singleton Map
import Notification from "./models/notifications.js"; // ✅ Import your Model

let io; // ✅ Module-level variable to store the instance

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // 1. Get User ID from Handshake
    const userId = socket.handshake.query.userId;
    if (!userId) return;

    // 2. Update Singleton Map
    onlineUsers.set(userId, socket.id);
    //console.log(`>> [Socket] 🟢 User Online: ${userId} (Total: ${onlineUsers.size})`);

    // 3. Broadcast Online Users
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    // 4. Chat Logic
    socket.on("messageRead", ({ messageId, senderId }) => {
      if (!senderId) return;
      const senderSocket = onlineUsers.get(senderId.toString());
      if (senderSocket) io.to(senderSocket).emit("messageRead", messageId);
    });

    // 5. Disconnect Logic
    socket.on("disconnect", () => {
      // Efficient lookup to remove user
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(uid);
          //console.log(`>> [Socket] 🔴 User Offline: ${uid} (Total: ${onlineUsers.size})`);
          break; // Stop loop once found
        }
      }
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

// ✅ EXPORTED FUNCTION FOR CONTROLLERS
// Use this in your API routes to trigger notifications
export const sendNotificationToUser = async ({ recipientId, senderId, type, message }) => {
  try {
    // A. Persistence: Always save to DB
    const newNotification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
    });

    // B. Real-time: Check if user is online
    const recipientSocketId = onlineUsers.get(recipientId.toString());

    // C. Delivery
    if (recipientSocketId && io) {
      io.to(recipientSocketId).emit("receive_notification", newNotification);
      // console.log(`>> [Socket] 🔔 Notification sent live to ${recipientId}`);
    } else {
      // console.log(`>> [Socket] 💤 User ${recipientId} is offline. Saved to DB.`);
    }
  } catch (error) {
    console.error(">> [Socket] ❌ Notification Error:", error);
  }
};

export default sendNotificationToUser;