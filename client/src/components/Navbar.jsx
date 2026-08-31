import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-slate-100 font-semibold hover:text-rose-400 transition-colors">
        ← Back to chats
      </Link>

      <div className="flex items-center gap-3">
        <Link to={`/profile/${user.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src={user.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-slate-100 text-sm">{user.name}</span>
        </Link>
        <button onClick={logout} className="text-slate-500 text-sm hover:text-rose-400 transition-colors">
          Log out
        </button>
      </div>
    </div>
  );
}