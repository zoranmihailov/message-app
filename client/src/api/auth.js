const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function saveToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
  return localStorage.getItem('token');
}

export async function registerUser({username, email, password, name}) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password, name})
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Error in register')
    if (data.token) saveToken(data.token);
    return data
}

export async function loginUser({username, password}) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Error in login')
    if (data.token) saveToken(data.token);
    return data
}

export async function logoutUser() {
    localStorage.removeItem('token');
}

export async function getCurrentUser() {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if(!res.ok) return null
    return res.json()
}