import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = ({ recipientId, recipientName }) => {
  const { messages, sendMessage, loadMessages, markAsRead } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (recipientId) {
      loadMessages(recipientId);
    }
  }, [recipientId, loadMessages]);

  useEffect(() => {
    if (messages[recipientId] && user?._id) {
      const unreadMessages = messages[recipientId].filter(
        (msg) => (msg.recipient?._id || msg.recipient) === user._id && !msg.read
      );
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages);
      }
    }
  }, [messages[recipientId], recipientId, user?._id, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[recipientId]]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(recipientId, newMessage);
    setNewMessage("");
  };

  return (
    // This structure is correct: a flex column with a scrolling middle section
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      
      {/* 1. Header (Stays Fixed) */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">
          Chat with {recipientName || "User"}
        </h2>
      </div>

      {/* 2. Messages (Scrolls) */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages?.[recipientId]?.map((msg, index) => {
          const isSender = (msg.sender?._id || msg.sender) === user?._id;
          const messageTime = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
          return (
            <div key={msg._id || index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-md shadow ${isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                <p className="text-sm">{msg.content || ""}</p>
                <div className={`text-xs mt-1 flex items-center gap-1.5 ${isSender ? "justify-end text-blue-200" : "justify-start text-gray-500"}`}>
                  <span>{messageTime}</span>
                  {isSender && <span className={msg.read ? 'text-white' : 'text-blue-200'}>{msg.read ? "✔✔" : "✔"}</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input (Stays Fixed) */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center gap-2">
        <input
          type="text" placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;