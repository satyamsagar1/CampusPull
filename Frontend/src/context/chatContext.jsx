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

  // ----------------- SOCKET CONNECTION -----------------
  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(api.defaults.baseURL.replace("/api", ""), {
      query: { userId: user._id },
    });
    setSocket(newSocket);

    // Online users
    newSocket.on("getOnlineUsers", setOnlineUsers);

    // ----------------- HELPERS -----------------
    const markMessageAsReadInState = (prev, messageId) => {
      const updated = { ...prev };
      Object.keys(updated).forEach(chatId => {
        updated[chatId] = updated[chatId].map(m =>
          m._id === messageId ? { ...m, read: true } : m
        );
      });
      return updated;
    };

    // ----------------- SOCKET EVENTS -----------------
    newSocket.on("newMessage", message => {
      if (!message?.sender || !message?.recipient) return;

      // Determine chatId and chatName
      const chatId = message.sender._id === user._id ? message.recipient._id : message.sender._id;
      const chatName = message.sender._id === user._id ? message.recipient.name : message.sender.name;

      // Update messages state
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId] ? [...prev[chatId], message] : [message],
      }));

      // Update chat list dynamically
      setChatList(prev => {
        const existing = prev.find(c => c.chatWith._id === chatId);
        if (existing) {
          return prev.map(c =>
            c.chatWith._id === chatId
              ? { ...c, lastMessage: message.content, lastMessageTime: message.createdAt }
              : c
          );
        } else {
          return [
            { chatWith: { _id: chatId, name: chatName || "Unknown" }, lastMessage: message.content, lastMessageTime: message.createdAt },
            ...prev,
          ];
        }
      });
    });

    newSocket.on("messageRead", messageId => {
      setMessages(prev => markMessageAsReadInState(prev, messageId));
    });

    return () => {
      newSocket.off("getOnlineUsers");
      newSocket.off("newMessage");
      newSocket.off("messageRead");
      newSocket.disconnect();
    };
  }, [user?._id]);

  // ----------------- FETCH CHAT LIST -----------------
  useEffect(() => {
    if (!user?._id) return;
    let isMounted = true;

    const fetchChats = async () => {
      try {
        const res = await api.get(`/message/chatlist/${user._id}`);
        if (isMounted) setChatList(res.data || []);
      } catch (err) {
        console.error("Error fetching chat list:", err);
      }
    };

    fetchChats();
    return () => { isMounted = false; };
  }, [user?._id]);

  // ----------------- LOAD MESSAGES -----------------
  const loadMessages = async recipientId => {
    if (!user?._id || !recipientId) return;
    try {
      const res = await api.get(`/message/${user._id}/${recipientId}`);
      setMessages(prev => ({
        ...prev,
        [recipientId]: res.data || [],
      }));
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  // ----------------- SEND MESSAGE -----------------
  const sendMessage = async (recipientId, text) => {
    if (!user?._id || !recipientId || !text?.trim()) return;

    const newMsg = { sender: user._id, recipient: recipientId, content: text.trim() };
    try {
      const res = await api.post("/message", newMsg);

      // Update messages state
      setMessages(prev => ({
        ...prev,
        [recipientId]: prev[recipientId] ? [...prev[recipientId], res.data] : [res.data],
      }));

      // Update chatList
      setChatList(prev => {
        const existing = prev.find(c => c.chatWith._id === recipientId);
        const name = existing?.chatWith?.name || res.data.recipient.name || "Unknown";
        if (existing) {
          return prev.map(c =>
            c.chatWith._id === recipientId
              ? { ...c, lastMessage: res.data.content, lastMessageTime: res.data.createdAt }
              : c
          );
        } else {
          return [
            { chatWith: { _id: recipientId, name }, lastMessage: res.data.content, lastMessageTime: res.data.createdAt },
            ...prev,
          ];
        }
      });

      // Emit to socket
      socket?.emit("sendMessage", res.data);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ----------------- MARK AS READ -----------------
  const markAsRead = async recipientId => {
    if (!user?._id || !messages[recipientId]) return;

    const unread = messages[recipientId].filter(m => m.recipient === user._id && !m.read);

    for (const msg of unread) {
      try {
        await api.patch(`/message/read/${msg._id}`);
        setMessages(prev => ({
          ...prev,
          [recipientId]: prev[recipientId].map(m => (m._id === msg._id ? { ...m, read: true } : m)),
        }));
        socket?.emit("messageRead", msg._id, msg.sender._id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const contextValue = useMemo(() => ({
    socket,
    onlineUsers,
    messages,
    activeChat,
    setActiveChat,
    chatList,
    loadMessages,
    sendMessage,
    markAsRead,
  }), [socket, onlineUsers, messages, activeChat, chatList]);

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
