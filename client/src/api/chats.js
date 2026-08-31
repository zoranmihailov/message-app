const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function getAllChats() {
  const res = await fetch(`${API_URL}/chats`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load chats');
  return res.json();
}

export async function getChatById(chatId) {
  const res = await fetch(`${API_URL}/chats/${chatId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load chat');
  return res.json();
}

export async function createChat({ profileIds, name }) {
  const res = await fetch(`${API_URL}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ profileIds, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create chat');
  return data;
}

export async function sendMessage(chatId, { content, imageUrl }) {
  const res = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ content, imageUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}