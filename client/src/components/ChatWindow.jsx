import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getChatById, sendMessage } from "../api/chats";
import GroupMembersModal from "./GroupMembersModal";
import Avatar from './Avatar';
import { isOnline } from '../utils/isOnline';

export default function ChatWindow({ chatId, currentUserId }) {
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    getChatById(chatId).then(setChat);
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    const interval = setInterval(() => {
      getChatById(chatId).then(setChat);
    }, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageUrl.trim()) return;
    if (isSending) return;

    setIsSending(true);
    try {
      await sendMessage(chatId, {
        content: newMessage.trim(),
        imageUrl: imageUrl.trim(),
      });
      setNewMessage("");
      setImageUrl("");
      setShowImageInput(false);
      const updated = await getChatById(chatId);
      setChat(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Select a conversation to start messaging
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  const otherProfile = chat.isGroup
    ? null
    : chat.profiles.find((p) => p.id !== currentUserId);

  const headerName = chat.isGroup ? chat.name : otherProfile?.name;
  const canSend = (newMessage.trim() || imageUrl.trim()) && !isSending;

  return (
    <>
      <div className="flex-1 flex flex-col bg-slate-950">
        <div className="px-6 py-4 border-b border-slate-800">
          {chat.isGroup ? (
            <button
              onClick={() => setShowMembers(true)}
              className="flex flex-col items-start hover:opacity-80 transition-opacity"
            >
              <h2 className="text-slate-100 font-semibold">{headerName}</h2>
              <span className="text-slate-500 text-xs">
                {chat.profiles.length} members
              </span>
            </button>
          ) : (
            <Link
              to={`/profile/${otherProfile.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar profile={otherProfile} size="w-9 h-9" />
              <div>
                <h2 className="text-slate-100 font-semibold">{headerName}</h2>
                <span className="text-slate-500 text-xs">
                  {isOnline(otherProfile.lastSeenAt) ? "Online" : "Offline"}
                </span>
              </div>
            </Link>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {chat.messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`max-w-xs flex flex-col gap-1 ${isOwn ? "self-end" : "self-start"}`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Shared"
                    className="rounded-2xl max-h-64 object-cover border border-slate-800"
                  />
                )}
                {msg.content && (
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwn
                        ? "bg-rose-500 text-white"
                        : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-slate-800">
          {showImageInput && (
            <div className="px-6 pt-3 flex gap-2">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL..."
                disabled={isSending}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:border-rose-500 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl("");
                }}
                className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="px-6 py-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowImageInput((prev) => !prev)}
              disabled={isSending}
              className={`px-3 rounded-lg border transition-colors ${
                showImageInput
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
              title="Attach image"
            >
              📷
            </button>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={isSending}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:border-rose-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {showMembers && (
        <GroupMembersModal chat={chat} onClose={() => setShowMembers(false)} />
      )}
    </>
  );
}
