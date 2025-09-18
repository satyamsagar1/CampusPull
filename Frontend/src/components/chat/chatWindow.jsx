import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = ({ recipientId, recipientName }) => {
  const { messages, sendMessage, loadMessages, markAsRead } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Load messages + mark unread as read
  useEffect(() => {
    if (!recipientId || !user?._id) return;

    const fetchMessages = async () => {
      await loadMessages(recipientId);

      const unread = messages[recipientId]?.filter(
        msg => msg.recipient === user._id && !msg.read
      );

      if (unread?.length > 0) {
        await markAsRead(recipientId);
      }
    };

    fetchMessages();
  }, [recipientId, user?._id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages[recipientId]?.length]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(recipientId, newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 bg-blue-600 text-white font-semibold">
        Chat with {recipientName || "User"}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {(() => {
          if (!messages || !messages[recipientId]) {
            return (
              <p className="text-gray-400 text-sm text-center mt-4">
                Loading messages...
              </p>
            );
          }
          if (messages[recipientId].length === 0) {
            return (
              <p className="text-gray-400 text-sm text-center mt-4">
                No messages yet
              </p>
            );
          }
          return messages[recipientId].map((msg, index) => {
            const isSender = msg.sender === user?._id || msg.sender?._id === user?._id;
            const messageTime = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={msg._id || index}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs shadow ${
                    isSender
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{msg.content || ""}</p>
                  <div
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{messageTime}</span>
                    {isSender && <span>{msg.read ? "✔✔" : "✔"}</span>}
                  </div>
                </div>
              </div>
            );
          });
        })()}
        {/* Dummy div to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
