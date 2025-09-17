import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import Icon from "../AppIcon";

const ChatWindow = ({ recipientId }) => {
  const { user } = useAuth();
  const { messages, loadMessages, sendMessage, chatList, onlineUsers, markAsRead } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);

  // Load messages when recipient changes
  useEffect(() => {
    if (recipientId) {
      loadMessages(recipientId);
      markAsRead(recipientId); 

      // Mark all received messages as read
      const receivedMessages = messages[recipientId]?.filter(
        (msg) => msg.recipient === user._id && !msg.read
      );
      receivedMessages?.forEach((msg) => markAsRead(msg._id));
    }
  }, [recipientId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[recipientId]?.length]);

  // Get recipient info
  const recipient = chatList.find(c => c.chatWith?._id === recipientId)?.chatWith;

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipientId) return;
    sendMessage(recipientId, newMessage.trim());
    setNewMessage("");
  };

  const isOnline = onlineUsers.includes(recipientId);

  if (!recipientId || !recipient) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white">
        <div className="relative flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-white font-bold">{recipient.name?.charAt(0) || "?"}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">{recipient.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {isOnline && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
        {messages[recipientId]?.length ? (
          messages[recipientId].map((msg, idx) => {
            const isSender = msg.sender === user._id;
            const isLast = idx === messages[recipientId].length - 1;

            return (
              <div
                key={msg._id || idx}
                ref={isLast ? scrollRef : null}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs md:max-w-md px-3 py-2 rounded-lg ${isSender ? "bg-academic-blue text-white" : "bg-white border"}`}>
                  {msg.content}
                  <div className="flex items-center justify-end text-xs text-gray-400 mt-1 gap-1">
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {isSender && (
                      <span className="text-blue-500">
                        {msg.read ? "✔✔" : "✔"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm text-center mt-4">No messages yet</p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center px-4 py-3 border-t border-gray-200 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-academic-blue"
        />
        <button type="submit" className="ml-2 bg-academic-blue text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition">
          <Icon name="Send" size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
