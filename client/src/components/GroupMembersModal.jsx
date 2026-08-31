import { Link } from 'react-router-dom';
import Avatar from './Avatar';

export default function GroupMembersModal({ chat, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100">{chat.name}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">✕</button>
        </div>

        <p className="text-slate-500 text-sm mb-3">{chat.profiles.length} members</p>

        <div className="max-h-72 overflow-y-auto flex flex-col gap-1">
          {chat.profiles.map((member) => (
            <Link
              key={member.id}
              to={`/profile/${member.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Avatar profile={member} size="w-10 h-10" />
              <div>
                <p className="text-slate-100 text-sm font-medium">{member.name}</p>
                <p className="text-slate-500 text-xs">@{member.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}