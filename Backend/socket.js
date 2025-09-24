import "dotenv/config";
import { Server } from "socket.io";

// Map to track online users: userId -> socketId
export const onlineUsers = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) return;

    // Add user to online map
    onlineUsers.set(userId, socket.id);

    // Notify all clients about online users
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    // Handle marking message as read
    socket.on("messageRead", ({ messageId, senderId }) => {
      if (!messageId || !senderId) return;
      const senderSocket = onlineUsers.get(senderId.toString());
      if (senderSocket) {
      io.to(senderSocket).emit("messageRead", messageId);
    } else {
      console.log(`4. [SERVER] Sender ${senderId} is not online. Cannot forward event.`);
    }
  });

    // Handle disconnect
    socket.on("disconnect", () => {
      onlineUsers.forEach((sockId, uid) => {
        if (sockId === socket.id) onlineUsers.delete(uid);
      });
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};
