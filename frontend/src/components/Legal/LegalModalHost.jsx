import { useCallback, useEffect, useRef, useState } from 'react';
import LegalModal from './LegalModal';
import { legalPageFor } from '../../data/legalPath';

// Owns the Terms/Privacy modal regardless of what else is on screen. There
// is no router, so several separate things can open it:
//  - the landing page's footer links
//  - Clerk's sign-up consent checkbox links (rendered into this same page,
//    not an iframe, so the capturing document listener below reaches them)
//  - a direct /terms or /privacy URL on first load
//  - the UserButton menu's Terms of Service / Privacy Policy items (App.jsx),
//    which dispatch a "nimeoniter:open-legal" window event since they're
//    rendered inside Clerk's own menu, not as plain <a> elements
// A capturing click listener on the document intercepts any <a> whose
// resolved path matches, so the underlying page (including an open Clerk
// form) never navigates away and stays exactly as the player left it.
function LegalModalHost() {
  const [openPage, setOpenPage] = useState(() => legalPageFor(window.location.pathname));
  const openerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      const anchor = e.target instanceof Element ? e.target.closest('a') : null;
      if (!anchor) return;
      const page = legalPageFor(anchor.pathname);
      if (!page) return;
      e.preventDefault();
      e.stopPropagation();
      openerRef.current = anchor;
      setOpenPage(page);
    }
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  useEffect(() => {
    function handleOpenLegal(e) {
      if (e.detail !== 'terms' && e.detail !== 'privacy') return;
      openerRef.current = document.activeElement;
      setOpenPage(e.detail);
    }
    window.addEventListener('nimeoniter:open-legal', handleOpenLegal);
    return () => window.removeEventListener('nimeoniter:open-legal', handleOpenLegal);
  }, []);

  const close = useCallback(() => {
    setOpenPage(null);
    // Only a direct /terms or /privacy load left the URL pointing here —
    // link clicks above are prevented before the URL ever changes.
    if (legalPageFor(window.location.pathname)) {
      history.replaceState(null, '', import.meta.env.BASE_URL);
    }
    openerRef.current?.focus();
    openerRef.current = null;
  }, []);

  if (!openPage) return null;

  return <LegalModal page={openPage} onClose={close} />;
}

export default LegalModalHost;
