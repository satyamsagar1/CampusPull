import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [chatList, setChatList] = useState([]);

  // Connect socket
  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(api.defaults.baseURL.replace("/api", ""), {
      query: { userId: user._id },
    });
    setSocket(newSocket);

    // Online users
    const handleOnlineUsers = (users) => setOnlineUsers(users);

    // Incoming messages
    const handleNewMessage = (message) => {
      if (!message?.sender || !message?.recipient) return;
      const chatId = message.sender === user._id ? message.recipient : message.sender;

      setMessages((prev) => ({
        ...prev,
        [chatId]: prev[chatId] ? [...prev[chatId], message] : [message],
      }));
    };

    // Message read event
    const handleMessageRead = (messageId) => {
      setMessages((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((chatId) => {
          updated[chatId] = updated[chatId].map((m) =>
            m._id === messageId ? { ...m, read: true } : m
          );
        });
        return updated;
      });
    };

    newSocket.on("getOnlineUsers", handleOnlineUsers);
    newSocket.on("newMessage", handleNewMessage);
    newSocket.on("messageRead", handleMessageRead);

    return () => {
      newSocket.off("getOnlineUsers", handleOnlineUsers);
      newSocket.off("newMessage", handleNewMessage);
      newSocket.off("messageRead", handleMessageRead);
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch chat list
  useEffect(() => {
    if (!user?._id) return;

    api
      .get(`/message/chatlist/${user._id}`)
      .then((res) => setChatList(res.data))
      .catch((err) => console.error("Error fetching chat list:", err));
  }, [user]);

  // Load messages for a user
  const loadMessages = async (recipientId) => {
    if (!user?._id || !recipientId) return;
    try {
      const res = await api.get(`/message/${user._id}/${recipientId}`);
      setMessages((prev) => ({
        ...prev,
        [recipientId]: res.data || [],
      }));

      // Mark unread messages as read
      markMessagesAsRead(recipientId);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  // Send a message
  const sendMessage = async (recipientId, text) => {
    if (!user?._id || !recipientId || !text?.trim()) return;

    const newMsg = {
      sender: user._id,
      recipient: recipientId,
      content: text.trim(),
    };

    try {
      const res = await api.post("/message", newMsg);

      if (socket) socket.emit("sendMessage", res.data);

      setMessages((prev) => ({
        ...prev,
        [recipientId]: prev[recipientId]
          ? [...prev[recipientId], res.data]
          : [res.data],
      }));
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Mark all unread messages from recipient as read
  const markAsRead = async (recipientId) => {
    if (!user?._id || !messages[recipientId]) return;

    const unreadMessages = messages[recipientId].filter(
      (msg) => msg.recipient === user._id && !msg.read
    );

    for (const msg of unreadMessages) {
      try {
        await api.patch(`/message/${msg._id}/read`);
        // Update local state
        setMessages((prev) => ({
          ...prev,
          [recipientId]: prev[recipientId].map((m) =>
            m._id === msg._id ? { ...m, read: true } : m
          ),
        }));
        // Notify sender via socket
        socket?.emit("messageRead", msg._id);
      } catch (err) {
        console.error("Error marking message as read:", err);
      }
    }
  };

  const contextValue = useMemo(
    () => ({
      socket,
      onlineUsers,
      messages,
      activeChat,
      setActiveChat,
      sendMessage,
      chatList,
      loadMessages,
      markAsRead,
    }),
    [socket, onlineUsers, messages, activeChat, chatList]
  );

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
