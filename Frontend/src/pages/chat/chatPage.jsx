import { useChat } from "../../context/chatContext";
import ChatSidebar from "../../components/chat/chatSidebar";
import ChatWindow from "../../components/chat/chatWindow";

const ChatPage = () => {
  const { chatList, activeChat } = useChat();
  const activeChatData = chatList.find(c => c.chatWith?._id === activeChat);

  return (
    // --- UI FIX ---
    // The height is now calculated to fill the space *below* your main header.
    // This prevents the entire window from scrolling.
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
      
      <ChatSidebar />

      {/* This container will hold the chat window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          // --- EDIT: Reduced padding from p-4 to p-2 ---
          <div className="p-2 h-full">
            <ChatWindow 
              recipientId={activeChat} 
              recipientName={activeChatData?.chatWith?.name} 
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

