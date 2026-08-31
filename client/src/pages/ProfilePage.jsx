import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProfileById } from "../api/profiles";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { isOnline } from "../utils/isOnline";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setProfile(null);
    setError("");
    getProfileById(id)
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [id]);

  const isOwnProfile = user?.id === id;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-rose-400">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                profile.imageUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`
              }
              alt={profile.username}
              className="w-24 h-24 rounded-full object-cover border-2 border-slate-700"
            />
            <h1 className="text-xl font-bold text-slate-100">{profile.name}</h1>
            <p className="text-slate-400">@{profile.username}</p>
            <p
              className={`text-xs mt-1 ${isOnline(profile.lastSeenAt) ? "text-emerald-400" : "text-slate-600"}`}
            >
              {isOnline(profile.lastSeenAt) ? "● Online" : "Offline"}
            </p>
          </div>

          {profile.bio && (
            <p className="text-slate-300 mt-6 text-center">
              <strong>Biography:</strong> {profile.bio}
            </p>
          )}

          {profile.edu && (
            <p className="text-slate-500 text-sm mt-2 text-center">
              <strong>Education:</strong> {profile.edu}
            </p>
          )}

          {isOwnProfile && (
            <Link
              to="/profile/edit"
              className="block text-center mt-6 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors"
            >
              Edit profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
