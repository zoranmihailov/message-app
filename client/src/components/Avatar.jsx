import { isOnline } from '../utils/isOnline';

export default function Avatar({ profile, size = 'w-11 h-11', showStatus = true }) {
  return (
    <div className="relative flex-shrink-0">
      <img
        src={profile.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`}
        alt={profile.username}
        className={`${size} rounded-full object-cover`}
      />
      {showStatus && isOnline(profile.lastSeenAt) && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
      )}
    </div>
  );
}