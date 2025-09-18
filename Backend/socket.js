import "dotenv/config";
import { Server } from "socket.io";

// Map to track online users (userId -> socketId)
export const onlineUsers = new Map(); // export so controllers can access

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN, // Frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) return;

    // Add user to online map
    onlineUsers.set(userId, socket.id);

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    // Handle sending message
    socket.on("sendMessage", (msg) => {
      if (!msg?.sender || !msg?.recipient) return;

      // Emit to recipient if online
      const recipientSocket = onlineUsers.get(msg.recipient);
      if (recipientSocket) io.to(recipientSocket).emit("newMessage", msg);

      // Emit to sender so their chat updates instantly
      const senderSocket = onlineUsers.get(msg.sender);
      if (senderSocket && senderSocket !== socket.id) io.to(senderSocket).emit("newMessage", msg);
    });

    // Handle marking message as read
    socket.on("messageRead", ({ messageId, senderId }) => {
      if (!messageId || !senderId) return;
      const senderSocket = onlineUsers.get(senderId);
      if (senderSocket) io.to(senderSocket).emit("messageRead", messageId);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      // Remove the disconnected socket from onlineUsers
      onlineUsers.forEach((sockId, uid) => {
        if (sockId === socket.id) onlineUsers.delete(uid);
      });

      // Update all clients about online users
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};
