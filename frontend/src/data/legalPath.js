// Used by LegalModalHost to recognize a /terms or /privacy URL — both the
// initial page load and any clicked <a> whose resolved path matches.
export function legalPageFor(pathname) {
  const base = import.meta.env.BASE_URL;
  if (!pathname.startsWith(base)) return null;
  const rest = pathname.slice(base.length).replace(/\/$/, '');
  if (rest === 'terms') return 'terms';
  if (rest === 'privacy') return 'privacy';
  return null;
}
