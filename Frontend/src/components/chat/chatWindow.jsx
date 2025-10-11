import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = ({ recipientId, recipientName }) => {
  const { messages, sendMessage, loadMessages, markAsRead } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (recipientId) loadMessages(recipientId);
  }, [recipientId, loadMessages]);

  useEffect(() => {
    if (messages[recipientId] && user?._id) {
      const unreadMessages = messages[recipientId].filter(
        (msg) => (msg.recipient?._id || msg.recipient) === user._id && !msg.read
      );
      if (unreadMessages.length > 0) markAsRead(unreadMessages);
    }
  }, [messages[recipientId], recipientId, user?._id, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[recipientId]]);

  const handleSend = async () => {
    if (!newMessage.trim() && !file) return;

    // Send text or file
    await sendMessage(recipientId, newMessage, file);
    setNewMessage("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handlePin = (msg) => {
    if (pinnedMessages.includes(msg)) return;
    setPinnedMessages((prev) => [msg, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 via-white to-blue-50 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="px-4 py-3 bg-white/50 backdrop-blur-md border-b border-white/40 shadow-sm flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Chat with {recipientName || "User"}</h2>
        <div className="flex gap-2">
          {pinnedMessages.length > 0 && (
            <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">📌 {pinnedMessages.length} Pinned</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Pinned Messages</h3>
            {pinnedMessages.map((msg, idx) => (
              <div key={`pin-${idx}`} className="p-2 rounded-lg bg-yellow-100 text-gray-800 text-sm mb-1">
                {msg.content || msg.file?.name || "Attachment"}
              </div>
            ))}
          </div>
        )}

        {/* All messages */}
        {messages?.[recipientId]?.map((msg, index) => {
          const isSender = (msg.sender?._id || msg.sender) === user?._id;
          const messageTime = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "";
          return (
            <div key={msg._id || index} className={`flex ${isSender ? "justify-end" : "justify-start"} group`}>
              <div className={`p-3 rounded-2xl max-w-md shadow-md transition transform hover:scale-102 relative ${
                isSender
                  ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white"
                  : "bg-white/50 backdrop-blur-md text-gray-800"
              }`}>
                {msg.file && (
                  <div className="mb-1">
                    <a
                      href={URL.createObjectURL(msg.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-sm"
                    >
                      {msg.file.name}
                    </a>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
                <div className={`text-xs mt-1 flex items-center gap-1.5 ${isSender ? "justify-end text-white/80" : "justify-start text-gray-500"}`}>
                  <span>{messageTime}</span>
                  {isSender && <span className={msg.read ? "text-white" : "text-white/70"}>{msg.read ? "✔✔" : "✔"}</span>}
                </div>

                {/* Pin button */}
                <button
                  onClick={() => handlePin(msg)}
                  className="absolute top-1 right-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-yellow-500 transition"
                  title="Pin Message"
                >
                  📌
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/30 bg-white/50 backdrop-blur-md flex items-center gap-2 shadow-inner">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/70 backdrop-blur-md"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <label className="cursor-pointer px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 text-sm">
          📎
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full hover:from-pink-600 hover:to-blue-600 transition shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
