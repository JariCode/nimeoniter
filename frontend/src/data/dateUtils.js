// Date helpers for day navigation.

// Turn a Date into a plain key like "2026-09-04" (local date, no time).
export function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Today's key.
export function todayKey() {
  return dateKey(new Date());
}

// Add (or subtract) days to a date key, returning a new key.
export function addDays(key, delta) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d + delta);
  return dateKey(date);
}

// A label for the day relative to today: "TODAY", "TOMORROW", "YESTERDAY",
// or null if it's further away.
export function relativeLabel(key) {
  const today = todayKey();
  if (key === today) return 'TODAY';
  if (key === addDays(today, 1)) return 'TOMORROW';
  if (key === addDays(today, -1)) return 'YESTERDAY';
  return null;
}

// A readable date like "Thu, Sep 4".
export function readableDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}