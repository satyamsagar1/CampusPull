import { useState } from "react";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import { useChat } from "../../context/ChatContext";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const { chatList } = useChat();

  const activeChatData = chatList.find(c => c.chatWith._id === activeChat);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ChatSidebar setActiveChat={setActiveChat} />

      {/* Chat Window */}
      <div className="flex-1">
        {activeChat ? (
          <ChatWindow recipientId={activeChat} recipientName={activeChatData?.chatWith?.name} />
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
