import { useState, useEffect } from 'react';
import { getAllProfiles } from '../api/profiles';
import { createChat } from '../api/chats';
import Avatar from './Avatar';


export default function SearchUsers({ currentUserId, onChatCreated }) {
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllProfiles().then(setAllUsers).catch((err) => console.error('Failed to load users:', err));
  }, []);

  const filteredUsers = query
    ? allUsers
        .filter((u) => u.id !== currentUserId)
        .filter((u) => u.username.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
    : [];

  const handleMessageClick = async (targetUserId) => {
    try {
      const chat = await createChat({ profileIds: [targetUserId] });
      setQuery('');
      onChatCreated(chat);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full px-3 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:border-rose-500 transition-colors"
      />

      {query && filteredUsers.length > 0 && (
        <ul className="absolute z-10 w-full bg-slate-900 border border-slate-700 rounded-lg mt-1 overflow-hidden">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-slate-800"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Avatar profile={user} size="w-8 h-8" />
                <span className="text-slate-200 truncate">{user.username}</span>
              </div>
              <button
                onClick={() => handleMessageClick(user.id)}
                className="px-3 py-1 rounded-md bg-rose-500 hover:bg-rose-600 text-white text-sm transition-colors flex-shrink-0"
              >
                Message
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}