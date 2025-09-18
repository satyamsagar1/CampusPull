import React, { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = ({ recipientId, recipientName }) => {
  const { messages, sendMessage, loadMessages, markAsRead } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

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
  }, [recipientId, user?._id, messages]);

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
  {(!messages || !messages[recipientId]) ? (
    <p className="text-gray-400 text-sm text-center mt-4">Loading messages...</p>
  ) : messages[recipientId].length === 0 ? (
    <p className="text-gray-400 text-sm text-center mt-4">No messages yet</p>
  ) : (
    messages[recipientId].map((msg, index) => {
      const isSender = msg.sender === user?._id;
      const messageTime = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

      return (
        <div key={msg._id || index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
          <div className={`p-3 rounded-lg max-w-xs shadow ${isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
            <p>{msg.content || ""}</p>
            {isSender && (
              <div className="text-xs text-right mt-1 flex items-center justify-end gap-1">
                <span>{messageTime}</span>
                <span>{msg.read ? "✔✔" : "✔"}</span>
              </div>
            )}
          </div>
        </div>
      );
    })
  )}
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
        <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
