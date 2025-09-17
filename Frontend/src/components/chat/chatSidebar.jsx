import { useState, useMemo } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

const ChatSidebar = ({ setActiveChat }) => {
  const { chatList, onlineUsers } = useChat();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // Filter chats for connected users + search
  const filteredChats = useMemo(() => {
    if (!chatList || !user) return [];
    return chatList
      .filter(
        (chat) =>
          chat?.chatWith?._id &&
          chat.chatWith._id !== user._id &&
          chat.chatWith.name?.toLowerCase().includes(search.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
      );
  }, [chatList, search, user]);

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => {
          const chatUser = chat.chatWith;
          const isOnline = onlineUsers.includes(chatUser._id?.toString());
          return (
            <button
              key={chatUser._id}
              onClick={() => setActiveChat(chatUser._id)}
              className="flex items-center p-3 cursor-pointer hover:bg-gray-100 w-full text-left focus:outline-none"
              type="button"
              tabIndex={0}
              aria-label={`Open chat with ${chatUser.name || "Unknown"}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {chatUser.name?.charAt(0)}
                </div>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                )}
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-800">{chatUser.name || "Unknown"}</h4>
                <p className="text-xs text-gray-500 truncate">
                  {chat.lastMessage || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
        {filteredChats.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">No chats found</p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
