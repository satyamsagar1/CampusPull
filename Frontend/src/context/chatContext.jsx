import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
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

  // --- SOCKET CONNECTION & LISTENERS ---

useEffect(() => {
  if (!user?._id) return;

  {
    const newSocket = io(api.defaults.baseURL.replace("/api", ""), {
      query: { userId: user._id },
    });
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", setOnlineUsers);

    newSocket.on("newMessage", (message) => {
      const chatId = message.sender._id === user._id ? message.recipient._id : message.sender._id;

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));

      setChatList((prev) => {
        const existingIndex = prev.findIndex((c) => c.chatWith._id === chatId);
        const chatPartnerName = message.sender._id === user._id ? message.recipient.name : message.sender.name;
        const updatedChatItem = {
          ...(prev[existingIndex] || {}),
          chatWith: { _id: chatId, name: chatPartnerName },
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
        };
        let updatedList = [...prev];
        if (existingIndex > -1) {
          updatedList.splice(existingIndex, 1);
        }
        return [updatedChatItem, ...updatedList];
      });
    });

    // --- THIS IS THE CORRECTED LISTENER ---
    newSocket.on("messageRead", (payload) => {
      const messageIdToUpdate = typeof payload === 'object' && payload._id ? payload._id : payload;

      setMessages((prevMessages) => {
        // Create a deep copy to guarantee React sees a change
        const newMessagesState = JSON.parse(JSON.stringify(prevMessages));
        
        // Find the specific message and update its 'read' status
        for (const chatId in newMessagesState) {
          const messageIndex = newMessagesState[chatId].findIndex(m => m._id === messageIdToUpdate);
          if (messageIndex !== -1) {
            newMessagesState[chatId][messageIndex].read = true;
            break; // Stop searching once the message is found and updated
          }
        }
        return newMessagesState;
      });
    });

    // Cleanup function
    return () => {
      newSocket.off("getOnlineUsers");
      newSocket.off("newMessage");
      newSocket.off("messageRead");
      newSocket.disconnect();
    };
  }
}, [user]); // Rerun this effect if the user object changes (e.g., on login/logout)

  // --- FETCH INITIAL CHAT LIST ---
  useEffect(() => {
    if (!user?._id) return;
    const fetchChats = async () => {
      try {
        const res = await api.get(`/message/chatlist/${user._id}`);
        setChatList(res.data || []);
      } catch (err) {
        console.error("Error fetching chat list:", err);
      }
    };
    fetchChats();
  }, [user?._id]);

  // --- LOAD MESSAGES FOR A SPECIFIC CHAT ---
  const loadMessages = useCallback(async (recipientId) => {
    if (!user?._id || !recipientId) return;
    try {
      const res = await api.get(`/message/${user._id}/${recipientId}`);
      setMessages((prev) => ({
        ...prev,
        [recipientId]: res.data || [],
      }));
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  }, [user?._id]);

  // --- SEND A NEW MESSAGE ---
  const sendMessage = useCallback(async (recipientId, text) => {
    if (!user?._id || !recipientId || !text?.trim()) return;

    try {
      // The backend will save this and emit a "newMessage" event via socket.
      // Our own client will receive that event in the listener above,
      // which will then update the state for a consistent real-time experience.
      await api.post("/message", {
        sender: user._id,
        recipient: recipientId,
        content: text.trim(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      // You can add logic here to show an error to the user
    }
  }, [user, socket]);

  // --- MARK MESSAGES AS READ ---
 const markAsRead = useCallback(async (messagesToMarkAsRead) => {
  // This function now receives the exact messages to process.
  if (!user?._id || messagesToMarkAsRead.length === 0) return;

  for (const msg of messagesToMarkAsRead) {
    // We get the recipient ID from the first message in the list
    const recipientId = msg.sender._id === user._id ? msg.recipient._id : msg.sender._id;
    try {
      await api.patch(`/message/read/${msg._id}`);

      setMessages((prev) => ({
        ...prev,
        [recipientId]: prev[recipientId]?.map((m) =>
          m._id === msg._id ? { ...m, read: true } : m
        ),
      }));
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  }
}, [user?._id, socket]); 

  // --- MEMOIZED CONTEXT VALUE ---
  const contextValue = useMemo(
    () => ({
      socket,
      onlineUsers,
      messages,
      activeChat,
      setActiveChat,
      chatList,
      loadMessages,
      sendMessage,
      markAsRead,
    }),
    [socket, onlineUsers, messages, activeChat, chatList, loadMessages, sendMessage, markAsRead]
  );

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);