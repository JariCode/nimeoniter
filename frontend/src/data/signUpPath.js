// Detects a /sign-up URL the same way legalPath.js detects /terms and
// /privacy — there is no router, so this is read directly off
// window.location.pathname once at the top of main.jsx.
export function isSignUpPath(pathname) {
  const base = import.meta.env.BASE_URL;
  if (!pathname.startsWith(base)) return false;
  const rest = pathname.slice(base.length).replace(/\/$/, '');
  return rest === 'sign-up';
}
