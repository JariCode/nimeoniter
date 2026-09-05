import './Landing.css';
import { useClerk } from '@clerk/react';

// Landing page: hooded survivor image fading into darkness,
// title + punchline below, and a themed start button.
function Landing({ onStart }) {
  const clerk = useClerk();

  function handleStart() {
    // Clerk's own layout doesn't respond to short landscape viewports, so
    // shrink its spacing/font scale directly for that case (spacing and
    // fontSize are Clerk's official theme variables — they control the
    // --clerk-spacing / --clerk-font-size custom properties used
    // throughout every element's padding, gaps, and text size).
    const isCompactLandscape = window.matchMedia(
      '(orientation: landscape) and (max-height: 500px)'
    ).matches;

    clerk.openSignIn({
      appearance: {
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
          ...(isCompactLandscape && {
            spacing: '0.5rem',
            fontSize: '0.7rem',
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
      },
    });
  }

  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="landing-image-wrap">
          <img
            src="/img/Nimeoniter-Landing-Page.png"
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

        <button className="landing-start" onClick={handleStart}>
          Light the fire
        </button>
      </div>
    </div>
  );
}

export default Landing;