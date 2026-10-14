import { useEffect, useRef } from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import './LegalModal.css';

// Terms of Service / Privacy Policy as a modal over whatever is currently
// showing (landing, game, or a Clerk form) — see LegalModalHost for how it
// gets opened and closed.
function LegalModal({ page, onClose }) {
  const isTerms = page === 'terms';
  const title = isTerms ? 'Terms of Service' : 'Privacy Policy';
  const panelRef = useRef(null);

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

  // Close on Escape from anywhere in the modal.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="legal-modal-overlay" onClick={onClose}>
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
    </div>
  );
}

export default LegalModal;
