import { useState, useMemo } from "react";
import { useChat } from "../../context/chatContext";

const ChatSidebar = () => {
  // Get everything from the context for consistency
  const { chatList, onlineUsers, loadMessages, activeChat, setActiveChat, unreadCounts, clearUnreadCount } = useChat();
  const [search, setSearch] = useState("");

  const filteredChats = useMemo(() => {
    if (!chatList) return [];
    return chatList.filter(chat =>
      chat?.chatWith?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [chatList, search]);

  return (
    // This structure is correct: a flex column with a scrolling middle section
    <div className="w-80 border-r border-gray-200 flex flex-col h-full bg-white">
      
      {/* 1. Search Bar (Stays Fixed) */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text" placeholder="Search chats..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring"
        />
      </div>

      {/* 2. Chat List (Scrolls) */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => {
          const chatUser = chat.chatWith;
          if (!chatUser?._id) return null;
          const isOnline = onlineUsers.includes(chatUser._id);
          const unreadCount = unreadCounts?.[chatUser._id] || 0;
          const isActive = activeChat === chatUser._id;

          return (
            <button
              key={chatUser._id}
              onClick={() => {
                setActiveChat(chatUser._id);
                loadMessages(chatUser._id);
                clearUnreadCount?.(chatUser._id);
              }}
              className={`flex items-center p-3 w-full text-left transition-colors duration-200 ${
                isActive ? "bg-sky-100 border-r-4 border-sky-500" : "hover:bg-gray-100"
              }`}
              type="button"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                  {chatUser.name?.charAt(0).toUpperCase() || "U"}
                </div>
                {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <h4 className="font-medium text-gray-800 truncate">{chatUser.name || "Unknown"}</h4>
                <p className={`text-xs truncate ${unreadCount > 0 ? 'font-bold text-gray-700' : 'text-gray-500'}`}>{chat.lastMessage || "No messages yet"}</p>
              </div>
              {unreadCount > 0 && (
                <div className="ml-auto text-xs bg-sky-500 text-white rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {unreadCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;