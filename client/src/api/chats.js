const API_URL = "http://localhost:5000/api"

export async function getAllChats() {
    const res = await fetch(`${API_URL}/chats`,{credentials:'include'});
    if(!res.ok) throw new Error('Failed to load chats')
    return res.json();
}

export async function getChatById(chatId) {
    const res=await fetch(`${API_URL}/chats/${chatId}`, {credentials:'include'})
    if(!res.ok) throw new Error('Failed to load chat')
    return res.json();
}

export async function createChat({profileIds, name}) {
    const res = await fetch(`${API_URL}/chats`,{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        credentials:'include',
        body: JSON.stringify({profileIds, name})
    })
    const data=await res.json()
    if(!res.ok) throw new Error(data.error || 'Failed to create chat')
    return data;
}

export async function sendMessage(chatId, { content, imageUrl }) {
  const res = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content, imageUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}