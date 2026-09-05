// Small helper for authenticated calls to the backend.
// The Clerk session token is passed as a Bearer header on every request,
// because the frontend and backend are on different origins.

const API_URL = import.meta.env.VITE_API_URL;

// Fetch the current user's game state
export async function fetchState(token) {
  const res = await fetch(`${API_URL}/api/state`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load state');
  return res.json();
}

// Save the whole game state for the current user
export async function saveState(token, state) {
  const res = await fetch(`${API_URL}/api/state`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error('Failed to save state');
  return res.json();
}