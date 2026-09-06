import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      routerPush={() => {}}
      routerReplace={() => {}}
      appearance={{
        /* Global fallback theme: some Clerk-rendered surfaces (e.g. the
           profile modal after cancelling an OAuth connect redirect) remount
           outside the per-component appearance props set in App.jsx/Landing.jsx
           and fall back to Clerk's default light theme without this. */
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
        },
        elements: {
          card: {
            background: '#151515',
            border: '1px solid #8a641c',
            boxShadow: 'none',
          },
          navbar: {
            background: '#111111',
          },
          headerTitle: {
            color: '#e6e0d2',
          },
          headerSubtitle: {
            color: '#999999',
          },
          profileSectionTitle: {
            color: '#e6e0d2',
          },
          profileSectionContent: {
            color: '#e6e0d2',
          },
          socialButtonsBlockButton: {
            background: '#1c1c1c',
            color: '#e6e0d2',
            border: '1px solid #444444',
          },
          socialButtonsBlockButtonText: {
            color: '#e6e0d2',
          },
          menuButtonEllipsis: {
            color: '#999999 !important',

            '&:hover': {
              color: '#e6e0d2 !important',
            },
          },
          menuList: {
            background: '#1c1c1c',
            border: '1px solid #444444',
          },
          menuItem: {
            color: '#e6e0d2 !important',

            '&:hover': {
              color: '#e6e0d2 !important',
              background: '#2a2418',
            },
          },
          menuItem__connectedAccounts: {
            color: '#e6e0d2 !important',

            '&:hover': {
              color: '#e6e0d2 !important',
              background: '#2a2418',
            },
          },
          /* "Primary" badge color is handled globally in App.css
             (.cl-badge[data-color='primary']) instead of here — this
             appearance prop didn't reliably reach every modal instance
             (e.g. after an OAuth-cancel redirect). */
          formFieldLabel: {
            color: '#e6e0d2',
          },
          formFieldInput: {
            background: '#1c1c1c',
            color: '#e6e0d2',
            border: '1px solid #444444',
          },
          formButtonPrimary: {
            background: '#c58a22',
            color: '#111111',
          },
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);