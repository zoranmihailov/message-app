import { useState, useEffect } from 'react';
import { getAllProfiles } from '../api/profiles';
import { createChat } from '../api/chats';

export default function CreateGroupModal({ currentUserId, onClose, onChatCreated }) {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllProfiles().then((data) =>
      setAllUsers(data.filter((u) => u.id !== currentUserId))
    ).catch((err) => console.error('Failed to load users:', err));
  }, [currentUserId]);

  const toggleSelect = (userId) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    setError('');

    if (selectedIds.length < 2) {
      setError('Select at least 2 users for a group');
      return;
    }
    if (!groupName.trim()) {
      setError('Enter a group name');
      return;
    }

    setIsSubmitting(true);
    try {
      const chat = await createChat({ profileIds: selectedIds, name: groupName.trim() });
      onChatCreated(chat);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-slate-100 mb-4">New Group</h2>

        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          className="w-full px-3 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:border-rose-500 transition-colors mb-4"
        />

        <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
          {allUsers.map((user) => (
            <label
              key={user.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(user.id)}
                onChange={() => toggleSelect(user.id)}
              />
              <img
                src={user.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-slate-200">{user.username}</span>
            </label>
          ))}
        </div>

        {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}