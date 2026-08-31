const API_URL = 'http://localhost:5000/api';

export async function getAllProfiles() {
  const res = await fetch(`${API_URL}/profiles`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load profiles');
  return res.json();
}

export async function getProfileById(id) {
  const res = await fetch(`${API_URL}/profiles/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Profile not found');
  return res.json();
}

export async function updateProfile(id, fields) {
  const res = await fetch(`${API_URL}/profiles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  return data;
}