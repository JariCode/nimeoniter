// Authenticated calls to the backend. The Clerk session token is passed as a
// Bearer header on every request (frontend and backend are different origins).

const API_URL = import.meta.env.VITE_API_URL;

async function request(path, token, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed');
  }
  return res.json();
}

// Public game rules (task catalog, build stages) — no auth needed
export async function fetchConfig() {
  const res = await fetch(`${API_URL}/api/config`);
  if (!res.ok) throw new Error('Failed to load config');
  return res.json();
}

// The user's current game state
export function fetchState(token) {
  return request('/api/state', token);
}

// Add a task to a day (server assigns rewards from the catalog)
export function addTaskApi(token, key, date) {
  return request('/api/state/tasks', token, {
    method: 'POST',
    body: JSON.stringify({ key, date }),
  });
}

// Complete a task (server grants XP + resources)
export function completeTaskApi(token, id) {
  return request(`/api/state/tasks/${id}/complete`, token, { method: 'POST' });
}

// Remove a task
export function removeTaskApi(token, id) {
  return request(`/api/state/tasks/${id}`, token, { method: 'DELETE' });
}

// Build the next stage (server checks level + resources)
export function buildApi(token) {
  return request('/api/state/build', token, { method: 'POST' });
}