import Avatar from './Avatar';

export default function ChatListItem({ chat, currentUserId, isActive, onClick }) {
  const lastMessage = chat.messages?.[0];
  const otherProfile = chat.isGroup ? null : chat.profiles.find((p) => p.id !== currentUserId);
  const displayName = chat.isGroup ? chat.name : otherProfile?.name;
  const isOwnLastMessage = lastMessage?.senderId === currentUserId;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
        isActive ? 'bg-rose-500/10 border border-rose-500/30' : 'hover:bg-slate-800 border border-transparent'
      }`}
    >
      {chat.isGroup ? (
        <img
          src={chat.chatImg || `https://api.dicebear.com/7.x/initials/svg?seed=${chat.name}`}
          alt={displayName}
          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <Avatar profile={otherProfile} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-slate-100 font-medium truncate">{displayName}</p>
        <p className="text-slate-500 text-sm truncate">
          {lastMessage ? `${isOwnLastMessage ? 'You: ' : ''}${lastMessage.content || '📷 Photo'}` : 'No messages yet'}
        </p>
      </div>
    </button>
  );
}