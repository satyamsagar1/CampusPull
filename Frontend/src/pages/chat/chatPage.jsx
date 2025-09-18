import { useState } from "react";
import ChatSidebar from "../../components/chat/chatSidebar";
import ChatWindow from "../../components/chat/chatWindow";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ChatSidebar setActiveChat={setActiveChat} />

      {/* Chat Window */}
      <div className="flex-1">
        {activeChat ? (
          <ChatWindow recipientId={activeChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
