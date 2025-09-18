import { useState, useMemo, useEffect } from "react";
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const ChatSidebar = ({ setActiveChat }) => {
  const { chatList, onlineUsers, loadMessages } = useChat();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [allConnections, setAllConnections] = useState([]);

  // Fetch all connected users for first-time chat
  useEffect(() => {
    if (!user?._id) return;
    const fetchConnections = async () => {
      try {
        const res = await api.get(`/connection/connections`);
        setAllConnections(res.data || []);
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };
    fetchConnections();
  }, [user?._id]);

  // Combine chatList + allConnections for first-time chats
  const combinedChats = useMemo(() => {
    if (!chatList || !user) return [];
    const chatMap = new Map(chatList.map(c => [c.chatWith._id, c]));
    return allConnections
      .filter(c => c._id !== user._id)
      .map(c => chatMap.get(c._id) || { chatWith: c, lastMessage: "No messages yet", lastMessageTime: null });
  }, [chatList, allConnections, user]);

  const filteredChats = useMemo(() => {
    return combinedChats
      .filter(chat =>
        chat?.chatWith?.name?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0));
  }, [combinedChats, search]);

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">No chats found</p>
        ) : (
          filteredChats.map(chat => {
            const chatUser = chat.chatWith;
            const isOnline = onlineUsers.map(String).includes(chatUser._id?.toString());

            return (
              <button
                key={chatUser._id}
                onClick={() => {
                  setActiveChat(chatUser._id);
                  loadMessages(chatUser._id);
                }}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-100 w-full text-left focus:outline-none"
                type="button"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {chatUser.name?.charAt(0) || "U"}
                  </div>
                  {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-800">{chatUser.name || "Unknown"}</h4>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage || "No messages yet"}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
