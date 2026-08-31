const API_URL = "http://localhost:5000/api";

export async function registerUser({username, email, password, name}) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({username, email, password, name})
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Error in register')
    return data
}

export async function loginUser({username, password}) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({username, password})
    })
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Error in login')
    return data
}

export async function logoutUser() {
    const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    })
    if(!res.ok) throw new Error('Error in logout')
}

export async function getCurrentUser() {
    const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include'
    })
    if(!res.ok) return null
    return res.json()
}