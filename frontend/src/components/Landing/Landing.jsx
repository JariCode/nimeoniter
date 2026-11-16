import { useCallback, useEffect, useRef, useState } from 'react';
import './Landing.css';
import { SignIn } from '@clerk/react';

// Landing page: hooded survivor image fading into darkness,
// title + punchline below, and a themed start button.

// Clerk's hash router keeps the current sign-in step in the address
// ("#/factor-one", "#/client-trust"). If iOS closes the installed app while
// the player fetches the email code from Mail, the app reopens on the same
// address and Clerk continues from the code step instead of starting over.
const hasSignInStep = () => window.location.hash.startsWith('#/');

function Landing() {
  const [signInOpen, setSignInOpen] = useState(hasSignInStep);
  const startRef = useRef(null);
  const dialogRef = useRef(null);

  const handleStart = useCallback(() => setSignInOpen(true), []);

  // Focus returns to "Light the fire" only after a keyboard close: Safari
  // treats a scripted focus() as keyboard focus and would draw a focus ring
  // after a mouse or touch close too (same rule as the companion).
  const closeSignIn = useCallback((withKeyboard = false) => {
    setSignInOpen(false);
    history.replaceState(null, '', import.meta.env.BASE_URL);
    if (withKeyboard) startRef.current?.focus();
  }, []);

  // Clerk's own layout doesn't respond to short landscape viewports, so
  // shrink its spacing/font scale directly for that case (spacing and
  // fontSize are Clerk's official theme variables — they control the
  // --clerk-spacing / --clerk-font-size custom properties used
  // throughout every element's padding, gaps, and text size).
  const isCompactLandscape = window.matchMedia(
    '(orientation: landscape) and (max-height: 500px)'
  ).matches;

  const signInAppearance = {
    variables: {
      colorBackground: '#151515',
      colorForeground: '#e6e0d2',
      colorMutedForeground: '#999999',
      colorPrimary: '#c58a22',
      colorPrimaryForeground: '#111111',
      colorInput: '#1c1c1c',
      colorInputForeground: '#e6e0d2',
      colorBorder: '#444444',
      borderRadius: '4px',
      // Big enough to tap on a phone; the sign-in window scrolls if a
      // step is taller than the short screen (Landing.css)
      ...(isCompactLandscape && {
        spacing: '0.65rem',
        fontSize: '0.9rem',
      }),
    },
    elements: {
      card: {
        background: '#151515',
        border: '1px solid #8a641c',
        boxShadow: 'none',
      },

      headerTitle: {
        color: '#e6e0d2',
      },

      headerSubtitle: {
        color: '#999999',
      },

      formFieldLabel: {
        color: '#e6e0d2',
      },

      formFieldInput: {
        background: '#1c1c1c',
        color: '#e6e0d2',
        border: '1px solid #444444',
      },

      socialButtonsBlockButton: {
        background: '#1c1c1c',
        color: '#e6e0d2',
        border: '1px solid #444444',
      },

      formButtonPrimary: {
        background: '#c58a22',
        color: '#111111',
      },

      footerActionText: {
        color: '#999999',
      },

      footerActionLink: {
        color: '#c58a22',
      },

      formFieldAction: {
        color: '#c58a22',
      },

      identityPreviewText: {
        color: '#e6e0d2',
      },

      alternativeMethodsBlockButton: {
        background: '#1c1c1c',
        color: '#e6e0d2',
        border: '1px solid #444444',
      },

      alternativeMethodsBlockButtonText: {
        color: '#e6e0d2',
      },

      alternativeMethodsBlockButtonIcon: {
        color: '#c58a22',
      },

      dividerText: {
        color: '#999999',
      },

      dividerLine: {
        background: '#333333',
      },
    },
  };

  // ?sign-in is appended by main.jsx's routerReplace when Clerk sends the
  // user back here from the sign-up page's "Already have an account?"
  // link — strip it and open the sign-in window.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('sign-in')) {
      history.replaceState(null, '', import.meta.env.BASE_URL);
      handleStart();
    }
  }, [handleStart]);

  // Keyboard handling, as Clerk's own modal had it. Escape closes the
  // window; the handler is on the window's own element, so Escape inside the
  // legal document modal (rendered outside it) closes only that document.
  // Tab and Shift+Tab stay inside the window instead of moving to the
  // landing page behind it.
  const handleSignInKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeSignIn(true);
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
    )].filter((el) => el.offsetParent !== null);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Move focus into the window when it opens, so Escape and Tab work from
  // the start (Clerk then moves it on to the first field when it renders).
  useEffect(() => {
    if (signInOpen && dialogRef.current && !dialogRef.current.contains(document.activeElement)) {
      dialogRef.current.focus();
    }
  }, [signInOpen]);

  // Once the player is signed in this page unmounts: clear the leftover
  // sign-in step from the address so the next sign-out starts clean.
  useEffect(() => () => {
    if (hasSignInStep()) history.replaceState(null, '', import.meta.env.BASE_URL);
  }, []);

  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="landing-image-wrap">
          <img
            src={`${import.meta.env.BASE_URL}img/Nimeoniter-Langing-Page.webp`}
            alt="A lone survivor by a campfire in the dark"
            className="landing-image"
            width="1536"
            height="1024"
          />
        </div>

        <h1 className="landing-title">NIMEONITER</h1>
        <p className="landing-punchline">
          Do your tasks. Survive. Build your world.
        </p>

        <button ref={startRef} className="landing-start" onClick={handleStart}>
          Light the fire
        </button>

        <div className="landing-legal-links">
          <a href={`${import.meta.env.BASE_URL}terms`}>Terms of Service</a>
          <a href={`${import.meta.env.BASE_URL}privacy`}>Privacy Policy</a>
        </div>
      </div>

      {signInOpen && (
        <div
          className="landing-signin-overlay"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeSignIn(); }}
          onKeyDown={handleSignInKeyDown}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="landing-signin"
            role="dialog"
            aria-modal="true"
            aria-label="Sign in"
          >
            {/* Clerk's own modal had a close button; the embedded form has none */}
            <button
              type="button"
              className="landing-signin-close"
              aria-label="Close sign-in"
              // e.detail is 0 when the button was pressed with Enter or Space
              onClick={(e) => closeSignIn(e.detail === 0)}
            >
              ×
            </button>
            <SignIn routing="hash" appearance={signInAppearance} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;