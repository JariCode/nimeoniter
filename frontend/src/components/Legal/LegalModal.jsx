import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import './LegalModal.css';

// Terms of Service / Privacy Policy as a modal over whatever is currently
// showing (landing, game, or a Clerk form) — see LegalModalHost for how it
// gets opened and closed.
//
// When a Clerk modal (sign-up/sign-in) is open, Clerk locks page scrolling
// and only allows scrolling inside its own modal. Rendering this modal into
// Clerk's backdrop keeps it inside that allowed area, so the text can be
// scrolled with the wheel and touch. Otherwise it goes to document.body.
function LegalModal({ page, onClose }) {
  const isTerms = page === 'terms';
  const title = isTerms ? 'Terms of Service' : 'Privacy Policy';
  const panelRef = useRef(null);
  const [container] = useState(
    () => document.querySelector('.cl-modalBackdrop') || document.body
  );

  // Swap the document title for as long as the modal is open, and move
  // focus into it so screen readers land on the dialog, not whatever was
  // behind it.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} – Nimeoniter`;
    panelRef.current?.focus();
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  // Close on Escape. Listen on window in the capture phase and stop the
  // event, so an open Clerk modal underneath doesn't close at the same time.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      e.preventDefault();
      onClose();
    }
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  // Clicks must not reach Clerk's backdrop, which would close the Clerk modal.
  function handleOverlayClick(e) {
    e.stopPropagation();
    onClose();
  }

  return createPortal(
    <div className="legal-modal-overlay" onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        className="legal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="legal-modal-header">
          <p id="legal-modal-title" className="legal-modal-title">{title}</p>
          <button
            className="legal-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="legal-modal-body">
          {isTerms ? <TermsOfService /> : <PrivacyPolicy />}
        </div>
      </div>
    </div>,
    container
  );
}

export default LegalModal;