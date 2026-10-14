import { SignUp } from '@clerk/react';
import './SignUpPage.css';

// Dedicated page for Clerk's sign-up flow, mounted at BASE_URL + "sign-up"
// (see main.jsx and data/signUpPath.js). Clerk sends the browser here with
// a real page load — not an SPA route — whenever an OAuth sign-up needs a
// step the sign-in modal can't show inline, most importantly the legal
// consent screen from the dashboard's "Require express consent to legal
// documents" setting. That only happens once ClerkProvider's signUpUrl
// points here; without it, Clerk falls back to its own Account Portal.
//
// routing="hash" lets this one mounted component manage every step —
// including that consent/continue step on return from Google — through the
// URL hash, with no app router involved. The dark theme comes from
// ClerkProvider's own appearance prop (main.jsx's "global fallback theme"),
// so nothing extra is passed here.
function SignUpPage() {
  return (
    <div className="sign-up-page">
      <SignUp routing="hash" fallbackRedirectUrl={import.meta.env.BASE_URL} />
    </div>
  );
}

export default SignUpPage;
