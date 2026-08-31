import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllChats } from "../api/chats";
import ChatListItem from "../components/ChatListItem";
import ChatWindow from "../components/ChatWindow";
import SearchUsers from "../components/SearchUsers";
import CreateGroupModal from "../components/CreateGroupModal";
import { Link } from "react-router-dom";
import Avatar from '../components/Avatar';

export default function ChatsPage() {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const loadChats = () => {
    getAllChats().then(setChats);
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    const interval = setInterval(loadChats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChatCreated = (chat) => {
    setActiveChatId(chat.id);
    loadChats();
  };

  return (
    <div className="h-screen flex bg-slate-950">
      {/* Лева колона */}
      <div className="w-80 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link
            to={`/profile/${user.id}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar profile={user} size="w-8 h-8" showStatus={false} />
            <span className="text-slate-100 font-semibold">{user.name}</span>
          </Link>
          <button
            onClick={logout}
            className="text-slate-500 text-sm hover:text-rose-400 transition-colors"
          >
            Log out
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 border-b border-slate-800">
          <SearchUsers
            currentUserId={user.id}
            onChatCreated={handleChatCreated}
          />
          <button
            onClick={() => setShowGroupModal(true)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
          >
            + New Group
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              currentUserId={user.id}
              isActive={chat.id === activeChatId}
              onClick={() => setActiveChatId(chat.id)}
            />
          ))}
        </div>
      </div>

      {/* Десна колона */}
      <ChatWindow chatId={activeChatId} currentUserId={user.id} />

      {showGroupModal && (
        <CreateGroupModal
          currentUserId={user.id}
          onClose={() => setShowGroupModal(false)}
          onChatCreated={handleChatCreated}
        />
      )}
    </div>
  );
}
